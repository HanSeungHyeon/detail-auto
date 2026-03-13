"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

// 1. SDK 초기화 (표준 라이브러리 권장)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * [핵심] 나노 바나나 이미지 생성 함수
 * - 429 에러(결제 한도 초과) 발생 시 즉시 프로세스 종료
 * - 이미지 데이터가 없을 경우 예외 처리 강화
 */
async function generateNanoBananaImage(prompt: string, retryCount = 0): Promise<string> {
  const MAX_RETRIES = 2; // 비용 절감을 위해 재시도 횟수 하향 조정

  try {
    console.log(`🎨 [Nano Banana] 이미지 생성 시도 중... (${retryCount + 1}/${MAX_RETRIES + 1})`);

    // 모델명: gemini-3-flash-image (Nano Banana 2 정식 명칭 확인 필요)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-ignore: 최신 SDK에서 지원하는 이미지 전용 설정
        responseModalities: ["IMAGE"],
      },
    });

    const response = await result.response;
    const candidates = response.candidates;

    if (candidates && candidates[0]?.content?.parts) {
      const imagePart = candidates[0].content.parts.find((part) => part.inlineData);
      if (imagePart?.inlineData) {
        const { mimeType, data } = imagePart.inlineData;
        console.log(`✅ [Nano Banana] 생성 성공! (${mimeType})`);
        return `data:${mimeType};base64,${data}`;
      }
    }

    throw new Error("IMAGE_DATA_NOT_FOUND");

  } catch (err: any) {
    const errorMsg = err.message || "";
    const statusCode = err.status || 0;

    console.error(`❌ [Nano Banana Error]: ${errorMsg}`);

    // [치명적 에러 판별] 429(한도 초과), 401/403(인증 오류)는 재시도하지 않음
    const isQuotaExceeded = statusCode === 429 || errorMsg.includes("spending cap") || errorMsg.includes("quota");
    const isAuthError = statusCode === 401 || statusCode === 403;

    if (isQuotaExceeded) {
      console.error("🚨 [STOP] 구글 클라우드 결제 한도 초과! 즉시 중단합니다.");
      throw new Error("QUOTA_EXCEEDED_STOP"); // 상위 함수까지 전파하여 루프 방지
    }

    if (isAuthError) {
      throw new Error("API_KEY_INVALID");
    }

    // 일반적인 네트워크 오류 시에만 재시도
    if (retryCount < MAX_RETRIES) {
      const waitTime = Math.pow(2, retryCount + 1) * 2000;
      console.log(`⏳ ${waitTime / 1000}초 후 재시도...`);
      await sleep(waitTime);
      return generateNanoBananaImage(prompt, retryCount + 1);
    }

    throw new Error(`IMAGE_GEN_FAILED: ${errorMsg}`);
  }
}

/**
 * 상세페이지 생성 메인 로직
 */
export async function generateDetailPage(formData: FormData) {
  const supabase = await createClient();

  const productName = formData.get("productName") as string;
  const targetAudience = formData.get("targetAudience") as string;
  const features = formData.get("features") as string;
  const imageFile = formData.get("imageFile") as File;

  try {
    // 1. 원본 이미지 Storage 업로드
    console.log("📤 Step 1: Storage 업로드 시작");
    const fileName = `${Date.now()}_${imageFile.name.replace(/\s+/g, "_")}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("detail-pages")
      .upload(`originals/${fileName}`, imageFile);

    if (uploadError) throw new Error(`STORAGE_ERROR: ${uploadError.message}`);

    // 2. Nano Banana 이미지 생성 (비용이 발생하는 구간)
    console.log("🚀 Step 2: AI 이미지 생성 시작");
    const imagePrompt = `High-end professional e-commerce product photography for "${productName}". Target: ${targetAudience}. Features: ${features}. Style: Clean studio lighting, 8k resolution, photorealistic, 1200px wide.`;

    const aiImageUrl = await generateNanoBananaImage(imagePrompt);

    // 3. GPT-4o 카피라이팅 (Mock 또는 실제 호출)
    console.log("✍️ Step 3: 카피라이팅 생성 시작");
    const copywriting = await generateGpt4oCopy(productName, targetAudience, features);

    // 4. DB 저장
    console.log("💾 Step 4: DB 결과 저장");
    const { data, error: dbError } = await supabase
      .from("detail_pages")
      .insert({
        product_name: productName,
        target_audience: targetAudience,
        features,
        original_image_url: uploadData.path,
        ai_model_image_url: aiImageUrl,
        copywriting_data: copywriting.copy,
        layout_data: copywriting.layout,
        status: "completed",
      })
      .select()
      .single();

    if (dbError) throw new Error(`DB_INSERT_ERROR: ${dbError.message}`);

    return { success: true, data };

  } catch (error: any) {
    console.error("🚨 [Final Process Error]:", error.message);

    // 에러 타입에 따른 분기 처리
    if (error.message === "QUOTA_EXCEEDED_STOP") {
      return { success: false, error: "구글 클라우드 결제 한도 초과. 관리가 필요합니다." };
    }

    return { success: false, error: error.message || "알 수 없는 에러 발생" };
  }
}

/**
 * GPT-4o 카피라이팅 함수 (예시)
 */
async function generateGpt4oCopy(product: string, target: string, features: string) {
  // 실제 API 호출 로직 생략 (기존 구조 유지)
  return {
    copy: { headline: `${product} - 당신을 위한 최고의 선택`, sub: features },
    layout: { type: "premium", sections: ["hero", "benefits", "cta"] },
  };
}