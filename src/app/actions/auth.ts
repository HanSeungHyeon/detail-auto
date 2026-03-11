"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/utils/supabase/server"

export async function loginWithEmailAndPassword(formData: FormData) {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({ 
    email,
    password
  })
  
  if (error) {
    return { error: error.message }
  }

  return { success: true }
}

export async function signupWithEmailAndPassword(formData: FormData) {
  const email = formData.get("email")?.toString()
  const password = formData.get("password")?.toString()
  
  if (!email || !password) {
    return { error: "이메일과 비밀번호를 모두 입력해주세요." }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signUp({ 
    email,
    password
  })
  
  if (error) {
    return { error: error.message }
  }

  return { success: true, message: "회원가입이 완료되었습니다! 로그인해주세요." }
}

export async function verifySession() {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return { user: null, isAuthenticated: false }
  }

  // Fetch profiles table to get credits
  const { data: profile } = await supabase
    .from("profiles")
    .select("credits")
    .eq("id", user.id)
    .single()

  return { 
    user: { 
      id: user.id, 
      email: user.email, 
      credits: profile?.credits || 0 
    }, 
    isAuthenticated: true 
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return { success: true }
}
