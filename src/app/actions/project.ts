"use server";

import { GoogleGenAI } from "@google/genai";
import { revalidatePath } from "next/cache";
import { createClient } from "@/utils/supabase/server";
import { generateLongFormContent } from "@/utils/gemini";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const NANO_BANANA_MODEL = "gemini-2.0-flash-exp";

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Nano Banana 이미지 생성
 * 최대 3회 재시도, 지수 백오프 적용
 */
async function generateNanoBananaImage(
  prompt: string,
  retryCount = 0
): Promise<string> {
  const MAX_RETRIES = 3;

  try {
    console.log(
      `🎨 [${retryCount + 1}/${MAX_RETRIES + 1}] Nano Banana 이미지 생성 중...`
    );

    const response = await ai.models.generateContent({
      model: NANO_BANANA_MODEL,
      contents: prompt,
      config: {
        responseModalities: ["IMAGE", "TEXT"],
      },
    });

    const parts = response?.candidates?.[0]?.content?.parts ?? [];
    for (const part of parts) {
      if (part?.inlineData?.data) {
        const mimeType = part.inlineData.mimeType || "image/png";
        console.log(`✅ 이미지 생성 성공 (${mimeType})`);
        return `data:${mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("응답에 이미지 데이터 없음");
  } catch (err: any) {
    const msg = err?.message || "Unknown error";
    console.error(`❌ Nano Banana 에러: ${msg}`);

    if (retryCount < MAX_RETRIES) {
      const backoffMs = Math.pow(2, retryCount + 1) * 2000;
      console.log(`⏳ ${backoffMs / 1000}초 후 재시도...`);
      await sleep(backoffMs);
      return generateNanoBananaImage(prompt, retryCount + 1);
    }

    throw new Error(`이미지 생성 실패 (${MAX_RETRIES + 1}회 시도): ${msg}`);
  }
}

/**
 * 모든 섹션 이미지를 Nano Banana로 순차 생성
 */
async function generateAllSectionImages(
  sections: Record<string, any>
): Promise<void> {
  const sectionKeys = Object.keys(sections);

  console.log(`🚀 ${sectionKeys.length}개 섹션 이미지 생성 시작...`);

  for (let i = 0; i < sectionKeys.length; i++) {
    const key = sectionKeys[i];
    const prompt = sections[key]?.imagePrompt;

    console.log(`\n[${i + 1}/${sectionKeys.length}] ${key}`);

    if (!prompt || typeof prompt !== "string") {
      console.warn(`⚠️ imagePrompt 없음: "${key}"`);
      sections[key].image = "";
      continue;
    }

    try {
      sections[key].image = await generateNanoBananaImage(prompt);
    } catch (err: any) {
      console.error(`⚠️ "${key}" 실패: ${err.message}`);
      sections[key].image = "";
    }

    // rate limit 방지 3초 대기
    if (i < sectionKeys.length - 1) {
      console.log("⏳ 3초 대기...");
      await sleep(3000);
    }
  }

  console.log(`\n✅ 이미지 생성 완료`);
}

export async function createProject(formData: FormData) {
  const title = formData.get("title")?.toString();
  const audience = formData.get("audience")?.toString();
  const price = formData.get("price")?.toString();
  const discountRate = formData.get("discountRate")?.toString();

  if (!title || !audience) {
    return { error: "필수 입력 항목이 누락되었습니다." };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "Unauthorized" };
  }

  // 1. 텍스트 생성 (Groq)
  let aiContent;
  try {
    aiContent = await generateLongFormContent(
      title,
      audience,
      formData.get("features")?.toString(),
      price,
      discountRate
    );
  } catch (err) {
    console.error("텍스트 생성 에러:", err);
    return { error: "AI 콘텐츠 생성 중 오류가 발생했습니다." };
  }

  // 2. 텍스트만 먼저 DB 저장
  const longFormWithoutImages = {
    subtitle: aiContent.subtitle,
    sections: Object.fromEntries(
      Object.entries(aiContent.sections).map(([key, val]: [string, any]) => [
        key,
        { ...val, image: "" },
      ])
    ),
  };

  const { data, error } = await (supabase.from("projects") as any)
    .insert({
      user_id: user.id,
      title,
      target_audience: audience,
      thumbnail_url: "",
      long_form: longFormWithoutImages,
      status: "processing",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  const projectId = data.id;

  // 3. Nano Banana 이미지 생성
  try {
    await generateAllSectionImages(aiContent.sections);
  } catch (err) {
    console.error("이미지 생성 치명적 에러:", err);
    await (supabase.from("projects") as any)
      .update({ status: "failed" })
      .eq("id", projectId);
    return { error: "이미지 생성 중 오류가 발생했습니다." };
  }

  // 4. 최종 데이터로 DB 업데이트
  const { error: updateError } = await (supabase.from("projects") as any)
    .update({
      thumbnail_url: aiContent.sections.hero?.image || "",
      long_form: {
        subtitle: aiContent.subtitle,
        sections: aiContent.sections,
      },
      status: "completed",
    })
    .eq("id", projectId);

  if (updateError) {
    return { error: updateError.message };
  }

  revalidatePath("/dashboard");
  return { success: true, projectId };
}

export async function fetchUserProjects() {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { projects: [], error: "Unauthorized" };
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return { projects: [], error: error.message };
  }

  return { projects };
}

export async function createProjectFromSample(sampleId: string) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { error: "로그인이 필요합니다." };
  }

  const { sampleProducts } = await import("@/data/samples");
  const sample = sampleProducts.find((p) => p.id === sampleId);

  if (!sample) {
    return { error: "샘플을 찾을 수 없습니다." };
  }

  const { data, error } = await (supabase.from("projects") as any)
    .insert({
      user_id: user.id,
      title: `${sample.title} (사본)`,
      target_audience: sample.audience,
      thumbnail_url: sample.thumbnailUrl,
      long_form: sample.longForm,
      status: "completed",
    })
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true, projectId: data.id };
}