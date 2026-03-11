-- 1. Storage 설정: project_images 버킷 생성 및 RLS 정책 설정
-- 버킷이 없는 경우 생성 (Supabase Storage API를 사용하거나 대시보드에서 생성 권장하지만 SQL로도 가능)
insert into storage.buckets (id, name, public)
values ('project_images', 'project_images', true)
on conflict (id) do nothing;

-- 1.2. Projects 테이블 확장: long_form 컬럼 추가
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS long_form jsonb;


-- Storage RLS 정책: 인증된 사용자가 본인 경로에 업로드 허용
CREATE POLICY "Allow Authenticated Users to Upload Images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'project_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Storage RLS 정책: 모든 사용자가 이미지 조회 허용 (Public Bucket이므로 SELECT는 기본적으로 가능할 수 있으나 명시적 설정)
CREATE POLICY "Allow Public Access to Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'project_images');

-- Storage RLS 정책: 인증된 사용자가 본인 이미지 삭제 허용
CREATE POLICY "Allow Users to Delete Own Images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'project_images' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Auth 회원가입 시 public.profiles 테이블 자동 생성을 위한 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, credits)
  VALUES (new.id, new.email, 10);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 트리거가 이미 존재할 수 있으므로 삭제 후 생성
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 기존에 가입했지만 profile이 없는 사용자들을 위한 보정 (필요시)
INSERT INTO public.profiles (id, email, credits)
SELECT id, email, 10 FROM auth.users
ON CONFLICT (id) DO NOTHING;
