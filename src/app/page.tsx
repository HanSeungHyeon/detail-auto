"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles, Image as ImageIcon, LayoutTemplate } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuthStore } from "@/stores/use-auth-store";
import { verifySession } from "@/app/actions/auth";
import { sampleProducts } from "@/data/samples";

export default function Home() {
  const { isAuthenticated, user, setUser } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        const sessionResult = await verifySession();
        if (sessionResult.isAuthenticated && sessionResult.user) {
          setUser({ ...sessionResult.user, email: sessionResult.user.email || "" });
        }
      }
      setIsChecking(false);
    };
    checkAuth();
  }, [isAuthenticated, setUser]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/20 transition-colors duration-300">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm">DA</div>
            <span className="text-card-foreground font-bold text-xl tracking-wide">DA</span>
          </div>
          <nav className="flex items-center gap-3">
            <ThemeToggle />
            {!isChecking && (
              isAuthenticated ? (
                <Link href="/dashboard">
                  <Button className="bg-card-foreground text-card hover:bg-card-foreground/90 rounded-2xl px-6 font-semibold shadow-sm transition-transform active:scale-95">
                    대시보드로 이동
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="text-muted-foreground hover:bg-accent hover:text-card-foreground font-medium rounded-xl transition-colors">
                      로그인
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="bg-card-foreground text-card hover:bg-card-foreground/90 rounded-2xl px-6 font-semibold shadow-sm transition-transform active:scale-95">
                      시작하기
                    </Button>
                  </Link>
                </>
              )
            )}
          </nav>
        </div>
      </header>

      <main className="pt-40 pb-32 container mx-auto px-4">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto text-center space-y-10 mb-32 animate-in fade-in slide-in-from-bottom-12 duration-1000">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-50 text-blue-600 text-[15px] font-bold mb-4 shadow-sm border border-blue-100/50">
            <span className="flex h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse"></span>
            첫 상세페이지 무료 제작 이벤트
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 leading-[1.05]">
            이미지 한 장으로<br />
            <span className="text-blue-600">압도적 상세페이지</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-500 whitespace-pre-line leading-relaxed max-w-2xl mx-auto font-semibold tracking-tight">
            사진과 타겟 정보만 입력하세요.{"\n"}
            AI가 기획, 합성, 레이아웃까지 알아서 완성합니다.
          </p>
          <div className="pt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/create" className="w-full sm:w-auto">
              <Button size="lg" className="h-[64px] px-10 rounded-2xl text-[18px] w-full bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-500/30 transition-all hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] group font-black">
                <Sparkles className="mr-3 h-6 w-6" />
                지금 바로 시작하기
                <ArrowRight className="ml-3 h-6 w-6 opacity-70 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </section>

        {/* Toss Style Feature Cards */}
        <section className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-40">
          <FeatureCard
            icon={<ImageIcon className="w-10 h-10 text-blue-600" />}
            title="이미지 업로드"
            desc="원본 사진 한 장이면 충분합니다."
            delay="100"
          />
          <FeatureCard
            icon={<Sparkles className="w-10 h-10 text-blue-600" />}
            title="독보적 AI 엔진"
            desc="가상의 인물 모델을 자동 생성하여 자연스럽게 합성합니다."
            delay="200"
          />
          <FeatureCard
            icon={<LayoutTemplate className="w-10 h-10 text-blue-600" />}
            title="원페이지 템플릿"
            desc="가장 높은 전환율을 보장하는 디자인이 1분 만에 완성됩니다."
            delay="300"
          />
        </section>

        {/* Sample Templates Section */}
        <section id="sample-section" className="pt-32 border-t border-slate-100 max-w-6xl mx-auto scroll-mt-24">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 mb-6">
              성공하는 레퍼런스
            </h2>
            <p className="text-xl text-slate-500 font-semibold tracking-tight">
              카테고리별 최적의 롱폼 템플릿을 확인해보세요.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-10">
            {sampleProducts.map((sample) => (
              <Link key={sample.id} href={`/sample/${sample.id}`} className="group block">
                <div className="bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-[0_8px_40px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.1)] transition-all duration-500 hover:-translate-y-2 flex flex-col sm:flex-row h-full">
                  <div className="sm:w-1/2 aspect-[4/3] sm:aspect-auto relative overflow-hidden bg-slate-50 shrink-0">
                    <Image src={sample.thumbnailUrl} alt={sample.title} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-5 left-5 px-4 py-1.5 bg-white/95 backdrop-blur-md text-blue-600 text-[14px] font-black rounded-full shadow-lg border border-slate-100">
                      {sample.categoryId === 'beauty' ? 'BEAUTY' : 
                       sample.categoryId === 'fashion' ? 'FASHION' : 
                       sample.categoryId === 'living' ? 'LIVING' : 'TECH'}
                    </div>
                  </div>
                  <div className="p-10 flex-1 flex flex-col justify-center">
                    <h3 className="font-black text-[24px] text-slate-900 mb-4 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight tracking-tight">{sample.title}</h3>
                    <p className="text-[16px] font-semibold text-slate-500 line-clamp-3 leading-relaxed tracking-tight">{sample.subtitle}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }: { icon: React.ReactNode; title: string; desc: string; delay: string }) {
  return (
    <div 
      className="p-8 rounded-[24px] bg-card border-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] dark:shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-shadow duration-300 flex flex-col items-start text-left animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-[22px] font-bold mb-3 text-card-foreground">{title}</h3>
      <p className="text-muted-foreground font-medium leading-relaxed text-[17px]">{desc}</p>
    </div>
  );
}
