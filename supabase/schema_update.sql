-- projects 테이블에 누락된 컬럼 추가
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS long_form jsonb,
ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- PostgREST 캐시 갱신을 위해 스키마 캐시 새로고침이 필요할 수 있습니다.
-- Supabase 대시보드의 SQL Editor에서 아래 명령어를 실행하세요.

-- 1. long_form 컬럼 확인 및 추가
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='long_form') THEN
        ALTER TABLE public.projects ADD COLUMN long_form jsonb;
    END IF;
END $$;

-- 2. thumbnail_url 컬럼 확인 및 추가
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='projects' AND column_name='thumbnail_url') THEN
        ALTER TABLE public.projects ADD COLUMN thumbnail_url text;
    END IF;
END $$;
