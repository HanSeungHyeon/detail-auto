# Fullstack Development Skills (Next.js + Supabase + Zustand)

이 스킬 파일은 Next.js App Router, Supabase, shadcn/ui, Tailwind CSS, Lucide React, Zustand를 사용하는 프로젝트의 개발 표준을 정의합니다.

## 1. UI Component Generation (Frontend)
**Trigger:** "UI 컴포넌트 만들어줘", "페이지 추가해줘", "디자인 해줘", "레이아웃 잡아줘"
**Context:** Shadcn UI와 Tailwind CSS, Lucide 아이콘을 사용합니다.

**Instructions:**
1.  **Shadcn:** 필요한 컴포넌트는 `npx shadcn@latest add [component]`로 설치합니다.
2.  **Icons:** 아이콘은 반드시 `lucide-react`를 사용합니다. (예: `import { Menu, X } from "lucide-react"`)
3.  **Tailwind:** 색상은 하드코딩 대신 CSS 변수(`bg-primary`, `text-muted-foreground`)를 사용하고, 반응형 접두사(`md:`, `lg:`)를 적극 활용합니다.
4.  **Client/Server:** 상호작용(onClick, onChange)이 있는 컴포넌트 최상단에는 반드시 `'use client'`를 선언합니다.

## 2. Supabase Backend Workflow (Backend)
**Trigger:** "DB 테이블 생성", "API 연동", "데이터 모델링", "로그인 기능"
**Context:** Supabase를 BaaS로 사용하며, 타입 안전성(Type Safety)을 최우선으로 합니다.

**Instructions:**
1.  **SQL & RLS:** 테이블 생성 시 반드시 RLS(Row Level Security) 정책을 함께 제안합니다.
2.  **Type Gen:** 스키마 변경 시 `npx supabase gen types typescript --project-id [ID] > types/supabase.ts`를 실행하여 타입을 동기화합니다.
3.  **Data Fetching:**
    -   **Server Components:** `createClient` (Server)를 사용하여 직접 DB 쿼리.
    -   **Client Components:** 데이터 페칭보다는 상태 관리나 이벤트 핸들링에 집중.

## 3. Server Actions & Mutations
**Trigger:** "데이터 저장", "폼 제출", "삭제 기능"

**Instructions:**
1.  **Server Actions:** API Route 대신 `app/actions/` 폴더 내에 Server Action 함수를 만들어 사용합니다.
2.  **Validation:** `zod` 라이브러리를 사용하여 서버단 데이터 검증을 수행합니다.
3.  **Revalidation:** 데이터 변경 후 `revalidatePath`를 호출하여 UI를 갱신합니다.

## 4. State Management (Zustand)
**Trigger:** "전역 상태", "스토어 생성", "모달 제어", "사이드바 상태", "장바구니 기능"
**Context:** 클라이언트 사이드 전역 상태 관리에 사용합니다. (서버 데이터 캐싱 용도가 아님)

**Instructions:**
1.  **설치:** `npm install zustand` (필요시)
2.  **위치:** 모든 스토어 파일은 `src/stores/` (또는 `stores/`) 폴더에 `use-[feature]-store.ts` 형식으로 저장합니다.
3.  **패턴:**
    -   `create<State & Actions>((set) => ({ ... }))` 패턴을 사용합니다.
    -   타입(interface)을 명시적으로 정의합니다.
    -   **주의:** Next.js Hydration 에러 방지를 위해, 스토어 초기값 설정에 유의합니다.
4.  **사용:** 컴포넌트 내부에서 필요한 상태만 선택자(Selector)로 가져와 렌더링 최적화를 합니다.
    -   예: `const { isOpen, open } = useModalStore((state) => state)`