"use server";

import { createClient } from "@/lib/supabase/server";

export async function verifyBootpayPayment(receiptId: string) {
  const supabase = await createClient();

  // 1. Bootpay API를 통해 영수증 검증
  // POST https://api.bootpay.co.kr/v2/receipt/${receiptId}
  // (실제 프로덕션에서는 Bootpay REST API 키를 사용해 토큰 발급 후 검증)
  
  const mockVerificationResult = {
    isValid: true,
    amount: 10000,
  };

  if (!mockVerificationResult.isValid) {
    throw new Error("결제 검증 실패");
  }

  // 2. DB 결제 내역 저장
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("권한 없음");

  await supabase.from("payments").insert({
    user_id: user.user.id,
    bootpay_receipt_id: receiptId,
    amount: mockVerificationResult.amount,
    credit_added: 10,
    status: "completed",
  });

  // 3. 크레딧 추가
  const { data: creditData } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", user.user.id)
    .single();

  const currentBalance = creditData ? creditData.balance : 0;

  await supabase
    .from("user_credits")
    .upsert({
      user_id: user.user.id,
      balance: currentBalance + 10,
    });

  return { success: true, addedCredits: 10 };
}
