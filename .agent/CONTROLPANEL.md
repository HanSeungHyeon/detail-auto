# DA (Detail-Auto) Control Panel
> Last Updated: 2026-03-13 14:55 KST

## 📋 Current Session Summary (2026-03-13)

### ✅ Completed Tasks
1. **이미지 생성 로직 전면 개편**
   - `@google/genai` SDK 설치 및 적용
   - Nano Banana (`gemini-2.0-flash-exp`) 전용 이미지 생성으로 변경
   - 재시도 로직 (최대 4회, 지수 백오프) 구현
   - Pollinations/Unsplash/Picsum 폴백 로직 추가 후 제거 (사용자 요청)

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

5. **`generate.ts` Nano Banana 적용**
   - generate.ts도 Groq 연동 및 Nano Banana 이미지 생성으로 업데이트

## 🔧 Tech Stack
| 항목 | 기술 |
|------|------|
| 텍스트 생성 | Groq (`llama-3.3-70b-versatile`) |
| 이미지 생성 | Nano Banana (`gemini-2.0-flash-exp`) via `@google/genai` |
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Database | Supabase |
| State | Zustand |
| UI | Shadcn UI, Tailwind CSS |

## ⚠️ Known Issues / Blockers
- **Gemini API spending cap**: gemini-3-flash-preview, gemini-2.0-flash 등 모든 모델에서 429 에러 발생 중. Google AI Studio에서 spending cap 해제 필요.
- **gemini-2.0-flash-exp**: 이미지 생성 지원 여부 확인 필요 (실험 모델)

## 📝 Next Steps
1. Gemini API spending cap 해제 후 이미지 생성 테스트
2. 이미지 생성 정상 작동 확인 후 QA 재실행
3. 전체 플로우 E2E 테스트 (로그인 → 프로젝트 생성 → 결과 확인)
