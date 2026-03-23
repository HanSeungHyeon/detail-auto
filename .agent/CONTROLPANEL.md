# DA (Detail-Auto) Control Panel
> Last Updated: 2026-03-13 14:55 KST

## 📋 Current Session Summary (2026-03-13)

### ✅ Completed Tasks
1. **이미지 생성 로직 전면 개편 (Stability AI로 이전)**
   - Nano Banana (Gemini)에서 Stability AI (Stable Diffusion 3.5) API로 변경
   - `sd3.5-large-turbo` 모델 사용
   - `.env.local`에 `STABILITY_API_KEY` 필수 입력 안내

2. **텍스트 생성 모델 변경 (Gemini → Groq)**
   - `groq-sdk` 설치
   - `gemini.ts`에서 Groq SDK (`llama-3.3-70b-versatile`) 사용으로 전환
   - API 키: `GROP_API_KEY` (.env.local)

3. **DB 타임아웃 해결**
   - `createProject` 함수를 2단계 DB 호출로 분리
   - 1단계: 텍스트만 `processing` 상태로 INSERT
   - 2단계: 이미지 생성 후 `completed`로 UPDATE
   - status 값을 DB CHECK 제약조건에 맞게 수정 (`processing`, `completed`, `failed`)

4. **프로젝트 상세 페이지 안정화**
   - `project/[id]/page.tsx`에 status별 화면 분기 추가 (processing → 로딩, failed → 에러)
   - 모든 Image 컴포넌트에 빈 이미지 안전 처리 (그라데이션 플레이스홀더)

5. **`generate.ts` Stability AI 적용**
   - generate.ts도 이미지 생성을 Stability AI로 이관

## 🔧 Tech Stack
| 항목 | 기술 |
|------|------|
| 텍스트 생성 | Groq (`llama-3.3-70b-versatile`) |
| 이미지 생성 | Stability AI (`sd3.5-large-turbo`) |
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Database | Supabase |
| State | Zustand |
| UI | Shadcn UI, Tailwind CSS |

## ⚠️ Known Issues / Blockers
- **Stability API Key 누락**: 현재 `.env.local`에 `STABILITY_API_KEY` 값이 비어있습니다. 발급받아 입력해야 이미지 생성이 정상 동작합니다.

## 📝 Next Steps
1. Stability AI API 키 입력 후 이미지 생성 테스트
2. 이미지 생성 정상 작동 확인 후 QA 재실행
