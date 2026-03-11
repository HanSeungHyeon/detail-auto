# Detail-Auto 프로젝트 Task 목록 (Phase 2: Standard Tier)

## 📌 현재 워크플로우 상태 (State Machine)
- [x] 1. Strategist (Standard 스펙 확정)
- [x] 2. PM (Data Model, Route Tree, Logic 명세 작성)
- [x] 3. Designer (Option F 핀테크 스타일 가이드 작성)
- [ ] **4. Developer (인증, 대시보드, 생성 페이지 프론트엔드/상태 로직 구현)** (<- 현재 단계)
- [ ] 5. QA (신규 기능 실동작 검증 및 통합 테스트)

## ✅ 완료된 작업 (Phase 1)
- [x] 메인 랜딩 페이지 Option F (토스 스타일) 적용 및 반응형 QA 완료
- [x] Supabase Profiles, Projects 테이블 스키마 작성 및 Types 생성
- [x] 전역 상태(Zustand) 스토어 보일러플레이트 작성 (Auth, Form, Project)

## 🚧 진행 중 / 다음 할 일 (Next Steps)
### 🔑 인증 및 진입점 구현 (Auth)
- [x] `app/login/page.tsx` 생성: 토스 스타일의 이메일 로그인 모달 UI 구현
- [x] 로그인 로직(Auth Store 연동 및 Server Action 모의 호출)

### 📊 사용자 대시보드 (Dashboard)
- [x] `app/dashboard/page.tsx` 생성: 잔여 크레딧 배너 및 프로젝트 갤러리 뷰 UI (Empty State 포함)

### ✍️ 상세페이지 제작 단계 (Create)
- [x] `app/create/page.tsx` 개편: Stepper(진행 상태바) 추가
- [x] 이미지 업로드 영역 (FileDropzone) UX 강화 및 Form 레이아웃 고도화
- [x] 생성 로딩 상태의 텍스트 타이핑 애니메이션 뷰 추가

### 🔍 백엔드 통신 & 에러 핸들링
- [x] Zustand 및 Server Actions 상태 바인딩, 하이드레이션 오류 없이 렌더링되도록 구성

## 🕒 업무 종료 시 (Handoff)
- [ ] `/handoff` 워크플로우를 통해 작업 요약 및 Git Push로 인수인계 준비