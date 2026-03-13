import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROP_API_KEY || "" });

export async function generateLongFormContent(productName: string, targetAudience: string, features?: string, price?: string, discountRate?: string) {
  console.log("Starting Groq LLM generation for:", productName);

  // 할인가 계산
  let discountedPrice = "";
  if (price && discountRate) {
    const numericPrice = parseInt(price.replace(/[^0-9]/g, ""));
    const rate = parseInt(discountRate);
    if (numericPrice && rate) {
      discountedPrice = Math.round(numericPrice * (1 - rate / 100)).toLocaleString() + "원";
    }
  }

  const prompt = `
당신은 대한민국 최고의 이커머스 상세페이지 기획자이자 카피라이터입니다. 
다음의 참조 가이드라인을 200% 활용하여, 구매 전환율이 폭발하는 프리미엄 '롱폼(Long-form)' 상세페이지를 기획해 주세요.

---

### 📖 [참조 가이드 1: 고전환 카피 패턴 (copy-patterns.md)]
1. **헤드라인 공식**: [결과 + 기간], [문제 해결], [타겟 + 혜택], [숫자 강조] 공식을 상황에 맞춰 적절히 섞어 사용하세요.
2. **번역투 배제**: "~의 비즈니스를 성장시키세요" 같은 기계적인 표현 금지. 대신 "~ 매출, 확 올려드릴게요", "사실 저도 그랬거든요" 같은 자연스러운 구어체와 공감대를 형성하는 한국어 표현을 사용하세요.
3. **구체적 상황 묘사**: "힘들다", "불편하다" 대신 "매일 밤 12시까지 엑셀과 씨름하며 한숨 쉬던 그 시간들" 처럼 고객이 자신의 일상을 투영할 수 있도록 구체적으로 묘사하세요.

### 🖼️ [참조 가이드 2: AI 이미지 프롬프트 패턴 (gemini-prompt-patterns.md)]
모든 이미지 프롬프트는 아래의 기술적 제약 사항을 반드시 포함하여 영문으로 작성해야 합니다.
1. **EXACT DIMENSIONS**: 1200x[HEIGHT] pixels (MUST be 1200px wide).
2. **FULL BLEED**: NO margins or borders.
3. **PHOTOGRAPHY STYLE**: REALISTIC PHOTOGRAPHY, Korean beauty advertising quality (Sulwhasoo, Innisfree vibe).

### 🍱 [참조 가이드 3: 13섹션 상세페이지 구조]
성공하는 상세페이지의 13개 필수 섹션을 모두 포함해야 합니다.

1. **Hero**: 주목 + 관심 (800px)
2. **Pain**: 공감 + "이거 내 얘기다" (600px)
3. **Problem**: 진짜 원인 파악 및 관점 전환 (500px)
4. **Story**: Before -> After 변화의 희망 (700px)
5. **Solution Intro**: 제품 정체성 명확화 (400px)
6. **How It Works**: 쉬워 보이는 3-4단계 프로세스 (600px)
7. **Social Proof**: 숫자와 후기로 증명 (800px)
8. **Authority**: 제작자의 전문성과 진정성 (500px)
9. **Benefits + Bonus**: 가치 극대화 (700px)
10. **Risk Removal**: 환불 보장 및 FAQ (500px)
11. **Final Comparison**: 제품이 있을 때와 없을 때의 극명한 대비 (400px)
12. **Target Filter**: 추천 고객 vs 비추천 고객 (400px)
13. **Final CTA**: 가격 혜택 및 즉각적 행동 유도 (600px)

---

**[상품 정보]**
- 상품명: ${productName}
- 핵심 타겟: ${targetAudience}
- 정가: ${price || "미입력 (AI가 적절한 가격 설정)"}
- 할인율: ${discountRate ? discountRate + "%" : "미입력 (AI가 적절한 할인율 설정)"}
- 할인가: ${discountedPrice || "AI가 자동으로 계산"}
- 제품 장점/소구점: ${features || "없음 (AI가 상품명과 타겟 기반으로 창의적으로 도출)"}

**[작성 제약 사항]**
1. **금지어**: "나노바나나", "Nano Banana" 사용 절대 금지. 대신 "독보적 AI", "프리미엄 솔루션", "스마트 엔진" 등으로 표현하세요.
2. **이미지 프롬프트**: 각 이미지에 대해 '매우 구체적이고 예술적인 영문 프롬프트'를 생성하세요. 1200px 조건을 프롬프트에 녹여야 합니다.
3. **가격 반영**: finalCTA 섹션의 price에는 "${price || "사용자가 설정할 정가"}"를, discountPrice에는 "${discountedPrice || "할인된 가격"}"을 반드시 사용하세요.
4. **소구점 전체 반영**: 사용자가 입력한 모든 소구점을 benefits 섹션의 items에 빠짐없이 포함하세요.

**[응답 JSON 형식]**
모든 섹션에는 해당 섹션의 분위기를 담은 정교한 'imagePrompt'가 포함되어야 합니다.
\`\`\`json
{
  "subtitle": "타겟의 심장을 찌르는 메인 슬로건",
  "sections": {
    "hero": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "pain": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "problem": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "story": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "solutionIntro": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "howItWorks": { 
      "title": "...", 
      "desc": "...", 
      "imagePrompt": "...",
      "steps": [{ "title": "...", "desc": "..." }]
    },
    "socialProof": { 
      "title": "...", 
      "desc": "...", 
      "imagePrompt": "...",
      "stats": [{ "label": "...", "value": "..." }],
      "reviews": [{ "author": "...", "rating": 5, "content": "..." }]
    },
    "authority": { "title": "...", "desc": "...", "imagePrompt": "..." },
    "benefits": { 
      "title": "...", 
      "desc": "...", 
      "imagePrompt": "...",
      "items": ["사용자가 입력한 모든 소구점을 빠짐없이 포함"],
      "bonuses": [{ "name": "...", "value": "..." }]
    },
    "riskRemoval": { "title": "...", "desc": "...", "imagePrompt": "...", "faqs": [{ "q": "...", "a": "..." }] },
    "finalComparison": { "title": "...", "desc": "...", "imagePrompt": "...", "with": ["..."], "without": ["..."] },
    "targetFilter": { "title": "...", "desc": "...", "imagePrompt": "...", "recommend": ["..."], "avoid": ["..."] },
    "finalCTA": { "title": "...", "desc": "...", "imagePrompt": "...", "price": "정가", "discountPrice": "할인가" }
  }
}
\`\`\`

오직 JSON만 출력하세요. 마크다운 기호 없이 순수한 JSON 텍스트만 출력하세요.
`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_completion_tokens: 8192,
  });

  const text = chatCompletion.choices[0]?.message?.content || "";
  console.log("Groq response received, parsing JSON...");

  try {
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI JSON Parsing Error:", text);
    throw new Error("AI 생성 데이터 형식이 올바르지 않습니다.");
  }
}
