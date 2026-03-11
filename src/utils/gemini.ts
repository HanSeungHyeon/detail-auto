import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function generateLongFormContent(productName: string, targetAudience: string, features?: string) {
  console.log("Starting Optimized Gemini generation for:", productName);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `
당신은 대한민국 최고의 이커머스 상세페이지 기획자이자 카피라이터입니다. 
다음의 참조 가이드라인을 200% 활용하여, 구매 전환율이 폭발하는 프리미엄 '롱폼(Long-form)' 상세페이지를 기획해 주세요.

---

### 📖 [참조 가이드 1: 고전환 카피 패턴 (copy-patterns.md)]
1. **헤드라인 공식**: [결과 + 기간], [문제 해결], [타겟 + 혜택], [숫자 강조] 공식을 상황에 맞춰 적절히 섞어 사용하세요.
2. **번역투 배제**: "~의 비즈니스를 성장시키세요" 같은 기계적인 표현 금지. 대신 "~ 매출, 확 올려드릴게요", "사실 저도 그랬거든요" 같은 자연스러운 구어체와 공감대를 형성하는 한국어 표현을 사용하세요.
3. **구체적 상황 묘사**: "힘들다", "불편하다" 대신 "매일 밤 12시까지 엑셀과 씨름하며 한숨 쉬던 그 시간들" 처럼 고객이 자신의 일상을 투영할 수 있도록 구체적으로 묘사하세요.

### 🖼️ [참조 가이드 2: AI 이미지 프롬프트 패턴 (gemini-prompt-patterns.md)]
모든 이미지 프롬프트는 아래의 '이미지 생성 제약 사항'을 포함하여 영문으로 작성해야 합니다.
1. **실사 사진 스타일 (Mandatory)**: 절대 일러스트나 카툰 스타일 금지. "Realistic Photography", "High-end Advertising Quality", "Natural Skin Texture", "Professional Lighting" 등의 키워드를 포함하세요.
2. **비주얼 무드**: 'Minimal' 또는 'Premium' 스타일을 유지하며, 설화수/이니스프리 광고 같은 고품격 조명감과 선명도를 반영하세요.
3. **너비 고정**: "1200px wide, full bleed, no margins" 등의 지시어를 프롬프트에 녹여내세요.

### 🍱 [참조 가이드 3: 13섹션 상세페이지 구조]
전체 여정: [주목] → [공감] → [이해] → [희망] → [신뢰] → [확신] → [행동]
이 구조에 맞춰 아래 JSON 항목을 채워주세요.

---

**[상품 정보]**
- 상품명: ${productName}
- 핵심 타겟: ${targetAudience}
- 강조하고 싶은 점: ${features || "없음"}

**[작성 제약 사항]**
1. **금지어**: "나노바나나", "Nano Banana" 사용 절대 금지. 대신 "독보적 AI", "프리미엄 솔루션", "스마트 엔진" 등으로 표현하세요.
2. **이미지 프롬프트**: 각 이미지에 대해 AI 이미지 생성기가 이해할 수 있는 '매우 구체적이고 예술적인 영문 프롬프트'를 생성하세요. 단순히 키워드 나열이 아닌, 구도와 조명이 포함된 문장형 프롬프트가 좋습니다.

**[응답 JSON 형식]**
\`\`\`json
{
  "subtitle": "타겟의 심장을 찌르는 메인 슬로건",
  "problem": {
    "title": "페인포인트 자극 헤드라인 (공감 유발)",
    "desc": "구체적인 문제 상황 묘사 및 공감 멘트",
    "imagePrompt": "Detailed English prompt for a realistic photo showing the problem/pain point situation"
  },
  "nanoBanana": {
    "title": "AI 기술로 해결하는 혁신적 방법 (이해/희망)",
    "desc": "기존 방식과는 다른 차별화된 기술력 설명",
    "imagePrompts": [
      "Prompt 1: Technology close-up / Premium vibe",
      "Prompt 2: Result of the technology / High-end",
      "Prompt 3: User experience / Minimal lifestyle",
      "Prompt 4: Abstract technology flow / Blue tones"
    ]
  },
  "solution": {
    "title": "궁극적인 솔루션과 변화된 일상 (확신)",
    "desc": "제품 사용 후 얻게 될 구체적 가치와 혜택",
    "stats": [
      { "label": "신뢰 지표 1", "value": "98%" },
      { "label": "신뢰 지표 2", "value": "+240%" },
      { "label": "신뢰 지표 3", "value": "TOP 1" }
    ],
    "details": [
      {
        "title": "디테일 가치 1",
        "desc": "본질적인 기능이나 디자인의 우수성 상세 설명",
        "imagePrompt": "Professional macro shot or product lifestyle photo prompt"
      },
      {
        "title": "디테일 가치 2",
        "desc": "사용자 편의성이나 내구성 등 상세 설명",
        "imagePrompt": "Professional macro shot or product lifestyle photo prompt"
      }
    ]
  },
  "socialProof": {
    "title": "수많은 사람들이 선택한 이유 (신뢰)",
    "reviews": [
      { "author": "김*지", "rating": 5, "content": "진정성 느껴지는 구어체 리뷰" },
      { "author": "박*준", "rating": 5, "content": "진정성 느껴지는 구어체 리뷰" },
      { "author": "최*우", "rating": 5, "content": "진정성 느껴지는 구어체 리뷰" }
    ]
  }
}
\`\`\`

오직 JSON만 출력하세요. 마크다운 기호 없이 순수한 JSON 텍스트만 출력하세요.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  try {
    const jsonStr = text.replace(/```json|```/g, "").trim();
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("AI JSON Parsing Error:", text);
    throw new Error("AI 생성 데이터 형식이 올바르지 않습니다.");
  }
}
