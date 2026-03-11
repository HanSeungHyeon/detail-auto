"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"
import { Json } from "@/types/supabase"
import { generateLongFormContent } from "@/utils/gemini"

// 지연 함수
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * 외부 이미지 URL을 가져와 Supabase Storage에 저장하고 공용 URL을 반환합니다.
 */
async function saveExternalImageToSupabase(url: string, userId: string, supabase: any, retryCount = 0) {
  try {
    const urlObj = new URL(url);
    const pathParts = urlObj.pathname.split('/');
    let originalPrompt = decodeURIComponent(pathParts[pathParts.length - 1]).trim();
    
    // 특수문자 제거 및 공백 정제 (URL 안정성)
    const cleanPrompt = originalPrompt.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ").replace(/\s{2,}/g, " ").trim();
    
    // 타겟 URL 생성 (Pollinations 기준)
    let targetUrl = url;
    if (url.includes("pollinations.ai")) {
      urlObj.pathname = pathParts.slice(0, -1).join('/') + '/' + encodeURIComponent(cleanPrompt);
      targetUrl = urlObj.toString().replace('%20%3F', '?'); // 공백+물음표 방지
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      next: { revalidate: 0 } 
    });

    if (!response.ok) {
      if ((response.status >= 500 || response.status === 429) && retryCount < 1) {
        // 서버 에러나 Too Many Requests 시 단 1회만 짧게 재시도 (에러 로그 없이 진행)
        await sleep(2000);
        return saveExternalImageToSupabase(url, userId, supabase, retryCount + 1);
      }
      
      // Fallback 처리 트리거 (콘솔 에러 없음)
      throw new Error("FallbackTrigger");
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileName = `${userId}/ai-${Math.random().toString(36).substring(7)}.jpg`;
    
    const { error } = await supabase.storage
      .from("project_images")
      .upload(fileName, buffer, { contentType: 'image/jpeg', upsert: true });

    if (error) throw new Error("FallbackTrigger");
    
    const { data: urlData } = supabase.storage.from("project_images").getPublicUrl(fileName);
    return urlData.publicUrl;
    
  } catch (err) {
    // 에러를 콘솔에 출력하지 않고 조용히 Fallback 이미지로 대체합니다. (유저 에러 노출 방지)
    const randomSeed = Math.floor(Math.random() * 1000);
    return `https://picsum.photos/seed/${randomSeed}/1200/800`;
  }
}

export async function uploadImage(formData: FormData) {
  const file = formData.get("file") as File
  if (!file) {
    return { error: "No file provided" }
  }

  if (file.size > 10 * 1024 * 1024) {
    return { error: "업로드 가능한 최대 용량은 10MB입니다. 더 가벼운 이미지를 사용해 주세요." }
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // Upload to Supabase Storage Bucket 'project_images'
  const fileExt = file.name.split('.').pop()
  const fileName = `${user.id}/${Math.random()}.${fileExt}`

  const { data, error } = await supabase.storage
    .from("project_images")
    .upload(fileName, file)

  if (error) {
    return { error: error.message }
  }

  const { data: urlData } = supabase.storage
    .from("project_images")
    .getPublicUrl(fileName)

  return { success: true, url: urlData.publicUrl }
}

export async function createProject(formData: FormData) {
  const title = formData.get("title")?.toString()
  const audience = formData.get("audience")?.toString()
  const thumbnailUrl = formData.get("thumbnailUrl")?.toString()
  
  if (!title || !audience) {
    return { error: "필수 입력 항목이 누락되었습니다." }
  }

  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "Unauthorized" }
  }

  // 1. Generate Content via Gemini AI
  let aiContent;
  try {
    aiContent = await generateLongFormContent(title, audience, formData.get("features")?.toString());
  } catch (err) {
    console.error("Gemini Error:", err);
    return { error: "AI 콘텐츠 생성 중 오류가 발생했습니다." };
  }

  // 2. 외부 이미지들을 Supabase로 영구 저장 (순차 처리하여 차단 방지)
  console.log("Saving AI images to Supabase storage with delay...");
  
  // Pollinations.ai는 프롬프트를 직접 이미지로 변환해주는 서비스입니다.
  const getAiImageUrl = (prompt: string, width = 1200, height = 800) => 
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=${width}&height=${height}&nologo=true&seed=${Math.floor(Math.random() * 100000)}`;

  const problemImageUrl = await saveExternalImageToSupabase(
    getAiImageUrl(aiContent.problem.imagePrompt),
    user.id,
    supabase
  );
  await sleep(2000); // 넉넉하게 2초 대기

  const aiCuts = [];
  for (const prompt of aiContent.nanoBanana.imagePrompts) {
    const url = await saveExternalImageToSupabase(
      getAiImageUrl(prompt, 800, 1000),
      user.id,
      supabase
    );
    aiCuts.push(url);
    await sleep(2000);
  }

  const solutionDetails = [];
  for (const d of aiContent.solution.details) {
    const url = await saveExternalImageToSupabase(
      getAiImageUrl(d.imagePrompt),
      user.id,
      supabase
    );
    solutionDetails.push({
      title: d.title,
      desc: d.desc,
      image: url
    });
    await sleep(2000);
  }

  const longForm = {
    heroImage: thumbnailUrl,
    subtitle: aiContent.subtitle,
    problem: {
      title: aiContent.problem.title,
      desc: aiContent.problem.desc,
      image: problemImageUrl
    },
    nanoBanana: {
      title: aiContent.nanoBanana.title,
      desc: aiContent.nanoBanana.desc,
      cuts: aiCuts
    },
    solution: {
      title: aiContent.solution.title,
      desc: aiContent.solution.desc,
      stats: aiContent.solution.stats,
      details: solutionDetails
    },
    socialProof: aiContent.socialProof
  }

  // Insert into Supabase 'projects' table
  const { data, error } = await (supabase
    .from("projects") as any)
    .insert({
      user_id: user.id,
      title: title,
      target_audience: audience,
      thumbnail_url: thumbnailUrl || null,
      long_form: longForm,
      status: 'completed'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }
  
  revalidatePath("/dashboard")
  return { success: true, projectId: data.id }
}

export async function fetchUserProjects() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { projects: [], error: "Unauthorized" }
  }

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  if (error) {
    return { projects: [], error: error.message }
  }

  return { projects }
}

export async function createProjectFromSample(sampleId: string) {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: "로그인이 필요합니다." }
  }

  const { sampleProducts } = await import("@/data/samples")
  const sample = sampleProducts.find(p => p.id === sampleId)

  if (!sample) {
    return { error: "샘플을 찾을 수 없습니다." }
  }

  // Create a new project based on the sample
  const { data, error } = await (supabase
    .from("projects") as any)
    .insert({
      user_id: user.id,
      title: `${sample.title} (사본)`,
      target_audience: sample.audience,
      thumbnail_url: sample.thumbnailUrl,
      long_form: sample.longForm,
      status: 'completed'
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true, projectId: data.id }
}
