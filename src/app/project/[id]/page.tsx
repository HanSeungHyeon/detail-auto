import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Sparkles, Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project, error } = await (supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single() as any);

  if (error || !project) {
    notFound();
  }

  // If long_form is missing, it might still be processing
  if (!project.long_form) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h1 className="text-2xl font-bold mb-2">상세페이지를 생성하고 있습니다</h1>
        <p className="text-muted-foreground mb-8">잠시만 기다려 주세요. 13개의 고화질 이미지와 카피를 준비 중입니다.</p>
        <Link href="/dashboard">
          <Button variant="outline">대시보드로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  const { long_form: longForm } = project;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-24">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-2xl">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="font-bold text-lg truncate px-4">{project.title}</div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16 max-w-2xl mx-auto bg-card shadow-2xl min-h-screen relative overflow-hidden">
        {/* 1. Hero Section */}
        <section className="relative aspect-[4/5] w-full overflow-hidden">
          {longForm.heroImage ? (
             <Image src={longForm.heroImage} alt={project.title} fill className="object-cover" priority />
          ) : (
             <div className="w-full h-full bg-accent flex items-center justify-center text-muted-foreground">Hero Image</div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8 sm:p-12">
            <div className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground font-bold text-sm rounded-full mb-4 w-fit">
              {project.target_audience}의 선택
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] mb-4 tracking-tight drop-shadow-lg break-keep">
              {project.title}
            </h1>
            <p className="text-white/80 text-lg sm:text-xl font-medium drop-shadow-md break-keep">
              {longForm.subtitle || "AI가 디자인한 특별한 가치"}
            </p>
          </div>
        </section>

        {/* 2. Problem Section */}
        {longForm.problem && (
          <section className="px-6 py-20 bg-card text-center relative">
            <div className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm mb-6">문제 제기</div>
            <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep mb-6">
              {longForm.problem.title}
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium whitespace-pre-line leading-relaxed pb-12">
              {longForm.problem.desc}
            </p>
            {longForm.problem.image && (
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl mb-8">
                <Image src={longForm.problem.image} alt="Problem" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/10" />
              </div>
            )}
          </section>
        )}

        {/* 3. Nano Banana AI Generated Section */}
        {longForm.nanoBanana && (
          <section className="py-20 bg-primary/[0.03] border-y border-primary/10 overflow-hidden">
            <div className="px-6 text-center mb-10">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4 border border-primary/20 flex items-center justify-center gap-2 w-fit mx-auto">
                <Sparkles className="w-4 h-4" /> AI 엔진
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep mb-4 whitespace-pre-line">
                {longForm.nanoBanana.title}
              </h2>
              <p className="text-muted-foreground text-lg font-medium whitespace-pre-line leading-relaxed">
                {longForm.nanoBanana.desc}
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-2 sm:gap-4 px-4 sm:px-6">
              {longForm.nanoBanana.cuts?.map((cut: string, idx: number) => (
                <div key={idx} className={`relative aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md group ${idx % 2 !== 0 ? 'mt-8' : ''}`}>
                  <Image src={cut} alt={`AI Generated Cut ${idx + 1}`} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <span className="text-white font-bold text-sm">AI Model Cut 0{idx + 1}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. Solution Section */}
        {longForm.solution && (
          <section className="px-6 py-20 bg-card text-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-[#E5F3FF] text-[#1B64F2] dark:bg-blue-900/40 dark:text-blue-300 font-bold text-sm mb-6">완벽한 솔루션</div>
            <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep mb-6">
              {longForm.solution.title}
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium whitespace-pre-line leading-relaxed mb-16">
              {longForm.solution.desc}
            </p>

            {longForm.solution.stats && (
              <div className="grid grid-cols-3 gap-4 mb-20">
                {longForm.solution.stats.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-accent/40 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-2xl sm:text-3xl font-black text-primary mb-1">{stat.value}</span>
                    <span className="text-xs sm:text-sm font-semibold text-muted-foreground">{stat.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-16 text-left">
              {longForm.solution.details?.map((detail: any, idx: number) => (
                <div key={idx} className="space-y-6">
                  <h3 className="text-2xl font-black text-card-foreground leading-snug">{detail.title}</h3>
                  <p className="text-muted-foreground text-[17px] font-medium leading-relaxed">
                    {detail.desc}
                  </p>
                  {detail.image && (
                    <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-lg border border-border/20">
                      <Image src={detail.image} alt={detail.title} fill className="object-cover" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. Social Proof (Reviews) */}
        {longForm.socialProof && (
          <section className="px-6 py-24 bg-[#F9FAFB] dark:bg-accent/20 border-t border-border/50 text-center">
            <h2 className="text-3xl font-black mb-12 text-card-foreground">{longForm.socialProof.title}</h2>
            <div className="space-y-6 text-left">
              {longForm.socialProof.reviews?.map((review: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-card rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-border/50 relative">
                  <div className="flex items-center gap-1 text-yellow-500 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-[#333D4B] dark:text-foreground text-[17px] mb-6 font-medium leading-relaxed">
                    &quot;{review.content}&quot;
                  </p>
                  <div className="flex items-center text-[#8B95A1] font-semibold text-sm">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-foreground mr-3 inline-flex">
                      {review.author?.[0]}
                    </div>
                    {review.author} 고객님
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>
      
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 w-full z-40 bg-background/90 backdrop-blur-xl border-t border-border p-4 sm:p-5 flex justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-2xl flex gap-3">
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-[16px] border-border shrink-0 bg-background hover:bg-accent hover:text-foreground transition-colors overflow-hidden flex items-center justify-center">
             <ShoppingCart className="w-6 h-6 text-muted-foreground" />
          </Button>
          <Button className="flex-1 h-14 text-[17px] font-bold rounded-[16px] bg-primary text-white shadow-[0_4px_14px_0_rgba(49,130,246,0.39)] hover:bg-primary/95 transition-transform active:scale-[0.98]">
             지금 바로 구매하기
          </Button>
        </div>
      </div>
    </div>
  );
}
