"use server";

import { createClient } from "@/lib/supabase/server";

export async function generateDetailPage(formData: FormData) {
  const supabase = await createClient();
  
  const productName = formData.get("productName") as string;
  const targetAudience = formData.get("targetAudience") as string;
  const features = formData.get("features") as string;
  const imageFile = formData.get("imageFile") as File;

  // 1. Storage Upload
  const fileName = `${Date.now()}-${imageFile.name}`;
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("detail-pages")
    .upload(`originals/${fileName}`, imageFile);

  if (uploadError) throw new Error("이미지 업로드 실패");

  // 2. Nano Banana API Call (Mock)
  const aiImageUrl = await generateNanoBananaImage(uploadData.path);

  // 3. GPT-4o Copywriting & Layout (Mock)
  const { copy, layout } = await generateGpt4oCopy(productName, targetAudience, features);

  // 4. DB Save
  const { data, error } = await supabase.from("detail_pages").insert({
    product_name: productName,
    target_audience: targetAudience,
    features,
    original_image_url: uploadData.path,
    ai_model_image_url: aiImageUrl,
    copywriting_data: copy,
    layout_data: layout,
    status: "completed",
  }).select().single();

  if (error) throw new Error("DB 저장 실패");

  return data;
}

// --- Mocks ---
async function generateNanoBananaImage(originalPath: string) {
  // 실제 NanoBanana API 호출 로직이 들어갈 곳
  return `mocks/nano-banana-result-${Date.now()}.jpg`;
}

async function generateGpt4oCopy(product: string, target: string, features: string) {
  // 실제 GPT-4o API 호출 로직이 들어갈 곳
  return {
    copy: { headline: `${product} - 당신의 문제를 해결합니다!`, sub: features },
    layout: { type: "card", sections: ["hero", "features"] },
  };
}
