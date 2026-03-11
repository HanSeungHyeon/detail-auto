-- 1. 사용자 프로필 테이블 (Profiles)
CREATE TABLE public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email text NOT NULL,
  credits integer DEFAULT 10,  -- 초기 무료 크레딧
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 활성화
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles 정책: 본인만 읽고 수정 가능
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. 상세페이지 프로젝트 테이블 (Projects)
CREATE TABLE public.projects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL, -- 상품명
  target_audience text, -- 타겟 고객
  selling_points jsonb, -- 소구점 3가지 (배열 형태)
  original_image_url text, -- 사용자가 업로드한 원본 상품 이미지
  generated_image_url text, -- AI가 생성/합성한 모델 컷 이미지
  template_html text, -- 최종 렌더링될 상세페이지 HTML 구조
  long_form jsonb, -- 고퀄리티 롱폼 서사 데이터 (13개 이미지 구조 등)
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS 활성화
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Projects 정책: 본인만 CRUD 가능
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- updated_at 갱신 트리거 생성
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_projects_modtime
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
