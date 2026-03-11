"use client";

import { useState, useRef, DragEvent, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/use-auth-store";
import { useProjectStore } from "@/stores/use-project-store";
import { ArrowLeft, CheckCircle2, Sparkles, CreditCard, ImagePlus } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { uploadImage, createProject } from "@/app/actions/project";
import { verifySession } from "@/app/actions/auth";

export default function CreateDetailAutoPage() {
  const { user, isAuthenticated } = useAuthStore();
  const { currentStep, setStep, isGenerating, setGenerating } = useProjectStore();
  const router = useRouter();

  // Form State
  const [productName, setProductName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [features, setFeatures] = useState("");
  
  // File Upload State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Loading Animation States
  const loadingTexts = [
    "AI 모델을 불러오는 중입니다...",
    "트렌디한 카피라이팅을 입히고 있습니다...",
    "제품과 완벽하게 합성된 이미지를 렌더링 중입니다...",
    "거의 다 되었습니다!"
  ];
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const sessionResult = await verifySession();
        if (sessionResult.isAuthenticated && sessionResult.user) {
          useAuthStore.getState().setUser({ ...sessionResult.user, email: sessionResult.user.email || "" });
        } else {
          router.push("/login");
        }
      }
      setIsVerifying(false);
    };
    checkAuth();
  }, [isAuthenticated, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingTextIndex((prev) => (prev + 1) % loadingTexts.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  if (isVerifying || !isAuthenticated) return null;

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleFile = (selectedFile: File) => {
    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleNextStep = () => {
    if (currentStep === "upload" && file) setStep("form");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setStep("processing");
    setGenerating(true);
    
    try {
      // 1. Upload Image
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);
      const uploadRes = await uploadImage(uploadFormData);
      
      let finalImageUrl = "";
      if (uploadRes.success && uploadRes.url) {
        finalImageUrl = uploadRes.url;
      } else {
        console.error("Upload failed", uploadRes.error);
        alert(`이미지 업로드 실패: ${uploadRes.error}`);
        setGenerating(false);
        return;
      }

      // 2. Create Project
      const projectFormData = new FormData();
      projectFormData.append("title", productName);
      projectFormData.append("audience", targetAudience);
      projectFormData.append("thumbnailUrl", finalImageUrl);
      
      const createRes = await createProject(projectFormData);
      
      if (createRes.success && createRes.projectId) {
        setGenerating(false);
        setStep("upload"); // reset
        setFile(null);
        setPreviewUrl(null);
        setProductName("");
        setTargetAudience("");
        setFeatures("");
        router.push(`/project/${createRes.projectId}`);
      } else {
        alert(`프로젝트 생성 실패: ${createRes.error}`);
        setGenerating(false);
      }
    } catch (err) {
      console.error(err);
      alert("생성 중 오류가 발생했습니다.");
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 transition-colors duration-300">
      <header className="sticky top-0 w-full border-b border-border bg-background/80 backdrop-blur-xl z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <Link href="/" className="font-bold text-lg flex items-center gap-2">
              <div className="w-7 h-7 rounded-[8px] bg-primary flex items-center justify-center text-white font-black text-xs shadow-sm">DA</div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[14px] font-medium text-muted-foreground flex items-center gap-2 bg-accent/50 px-3 py-1.5 rounded-full border border-border">
              <CreditCard className="w-4 h-4 text-primary" />
              잔여 크레딧: <span className="text-foreground font-bold">{user?.credits || 10}</span>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-12 max-w-2xl">
        {/* Stepper */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-card-foreground tracking-tight mb-6">새 템플릿 만들기</h1>
          <div className="flex items-center w-full gap-2">
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep === "upload" || currentStep === "form" || currentStep === "processing" ? "bg-primary" : "bg-accent"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep === "form" || currentStep === "processing" ? "bg-primary" : "bg-accent"}`} />
            <div className={`h-1.5 flex-1 rounded-full transition-colors ${currentStep === "processing" ? "bg-primary" : "bg-accent"}`} />
          </div>
          <div className="flex justify-between text-[13px] font-semibold text-muted-foreground mt-2 px-1">
            <span className={currentStep === "upload" ? "text-primary" : ""}>기본 이미지</span>
            <span className={currentStep === "form" ? "text-primary" : ""}>상세 정보</span>
            <span className={currentStep === "processing" ? "text-primary" : ""}>AI 생성</span>
          </div>
        </div>

        {/* Loading Overlay */}
        {currentStep === "processing" && (
          <div className="flex flex-col items-center justify-center py-32 bg-card rounded-[24px] border border-border shadow-sm text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="relative w-20 h-20 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-card-foreground tracking-tight mb-3">멋진 상세페이지를 만들고 있어요</h2>
            <p className="text-[#8B95A1] font-medium h-6 animate-pulse">
              {loadingTexts[loadingTextIndex]}
            </p>
          </div>
        )}

        {/* Step 1: Upload */}
        {currentStep === "upload" && (
          <section className="bg-card border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] p-8 animate-in slide-in-from-right-8 duration-300">
            <h2 className="text-xl font-bold text-card-foreground mb-6">어떤 상품을 판매하시나요?</h2>
            
            <div
               onDragOver={handleDragOver}
               onDragLeave={handleDragLeave}
               onDrop={handleDrop}
               onClick={() => fileInputRef.current?.click()}
               className={`w-full h-56 border-2 border-dashed rounded-[20px] flex flex-col items-center justify-center transition-all cursor-pointer group overflow-hidden relative ${
                 isDragOver ? "border-primary bg-primary/5 scale-[1.02]" : "border-[#E5E8EB] dark:border-border bg-[#F2F4F6]/50 dark:bg-card hover:bg-primary/5 hover:border-primary/50 text-muted-foreground"
               }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/jpeg, image/png"
                className="hidden"
              />
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain absolute inset-0 z-0 opacity-40 group-hover:opacity-20 transition-opacity" />
              ) : null}
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-14 h-14 rounded-full bg-white dark:bg-background shadow-sm flex items-center justify-center mb-4 group-hover:-translate-y-1 transition-transform duration-300">
                  <ImagePlus className="w-6 h-6 text-[#8B95A1] group-hover:text-primary transition-colors" />
                </div>
                <p className="font-bold text-[#333D4B] dark:text-foreground mb-1 text-[16px]">클릭하거나 파일을 이곳으로 드래그 하세요</p>
                <p className="text-[14px]">JPG, PNG (최대 10MB)</p>
              </div>
            </div>

            {file && (
              <div className="mt-6 p-4 rounded-[16px] bg-blue-50 dark:bg-primary/10 flex items-center gap-3 text-[15px] font-semibold text-primary border border-blue-100 dark:border-primary/20 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="truncate">{file.name}가 첨부되었습니다!</span>
              </div>
            )}

            <Button 
              onClick={handleNextStep}
              disabled={!file}
              className="w-full h-14 mt-8 bg-primary hover:bg-primary/95 text-white rounded-[16px] text-[16px] font-bold shadow-sm transition-transform active:scale-[0.98]"
            >
              다음으로
            </Button>
          </section>
        )}

        {/* Step 2: Form */}
        {currentStep === "form" && (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in slide-in-from-right-8 duration-300">
            <section className="bg-card border border-border shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-[24px] p-8">
              <h2 className="text-xl font-bold text-card-foreground mb-6">상세페이지에 들어갈 내용을 알려주세요</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-[15px] font-semibold mb-2 text-[#333D4B] dark:text-foreground">상품명</label>
                  <input
                    type="text"
                    required
                    placeholder="예) 마이크로 화이버 경추 베개"
                    className="w-full h-14 px-5 rounded-[16px] border-none bg-[#F2F4F6] dark:bg-background text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-card transition-all"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-[15px] font-semibold mb-2 text-[#333D4B] dark:text-foreground">핵심 타겟 고객</label>
                  <input
                    type="text"
                    required
                    placeholder="예) 거북목으로 고생하는 2030 직장인"
                    className="w-full h-14 px-5 rounded-[16px] border-none bg-[#F2F4F6] dark:bg-background text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-card transition-all"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-[15px] font-semibold text-[#333D4B] dark:text-foreground">가장 강조하고 싶은 소구점 3가지</label>
                    <span className="text-[12px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">선택사항</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder="1. 메모리폼 소재로 목을 탄탄하게 지지&#10;2. 통기성이 뛰어나 쾌적함&#10;3. 세탁이 간편한 분리형 커버"
                    className="w-full p-5 rounded-[16px] border-none bg-[#F2F4F6] dark:bg-background text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-card transition-all resize-none leading-relaxed"
                    value={features}
                    onChange={(e) => setFeatures(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <div className="flex gap-3">
              <Button 
                type="button"
                variant="outline"
                onClick={() => setStep("upload")}
                className="h-16 px-6 bg-card border-border hover:bg-accent text-card-foreground rounded-[16px] text-[16px] font-semibold transition-transform active:scale-[0.98]"
              >
                이전
              </Button>
              <Button 
                type="submit"
                disabled={!productName || !targetAudience}
                className="flex-1 h-16 bg-primary hover:bg-primary/95 text-white rounded-[16px] text-[17px] font-bold shadow-[0_4px_14px_0_rgba(49,130,246,0.39)] transition-transform active:scale-[0.98]"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                1 크레딧으로 템플릿 생성하기
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
