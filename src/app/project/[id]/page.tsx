import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Sparkles, Loader2, Check, X, HelpCircle, User, Award, ShieldCheck, Zap } from "lucide-react";
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

  if (!project.long_form || !project.long_form.sections || project.status === "processing") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-6" />
        <h1 className="text-2xl font-bold mb-2">상세페이지를 생성하고 있습니다</h1>
        <p className="text-muted-foreground mb-8">AI가 13개의 고화질 이미지와 카피를 준비 중입니다. 잠시만 기다려 주세요.</p>
        <Link href="/dashboard">
          <Button variant="outline">대시보드로 돌아가기</Button>
        </Link>
      </div>
    );
  }

  if (project.status === "failed") {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-6">
          <X className="w-6 h-6 text-destructive" />
        </div>
        <h1 className="text-2xl font-bold mb-2">생성 중 오류가 발생했습니다</h1>
        <p className="text-muted-foreground mb-8">이미지 생성 중 문제가 발생했습니다. 다시 시도해 주세요.</p>
        <Link href="/create">
          <Button>다시 만들기</Button>
        </Link>
      </div>
    );
  }

  const { long_form: { sections, subtitle } } = project;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-24 font-sans">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-2xl">
          <Link href="/dashboard" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="font-bold text-lg truncate px-4">{project.title}</div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16 max-w-2xl mx-auto bg-card shadow-2xl min-h-screen relative overflow-hidden flex flex-col">
        
        {/* 01. Hero Section */}
        {sections.hero && (
          <section className="relative aspect-[4/5] w-full overflow-hidden">
            {sections.hero.image ? (
              <Image src={sections.hero.image} alt="Hero" fill className="object-cover" priority unoptimized={true} />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-8 sm:p-12">
              <div className="inline-block px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 text-primary-foreground font-bold text-sm rounded-full mb-4 w-fit">
                {project.target_audience}를 위한 스마트 솔루션
              </div>
              <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] mb-4 tracking-tight drop-shadow-lg break-keep">
                {sections.hero.title}
              </h1>
              <p className="text-white/80 text-lg sm:text-xl font-medium drop-shadow-md break-keep">
                {subtitle}
              </p>
            </div>
          </section>
        )}

        {/* 02. Pain Section */}
        {sections.pain && (
          <section className="px-6 py-24 bg-card text-center border-b border-border/50">
            <div className="inline-block px-4 py-1.5 rounded-full bg-destructive/10 text-destructive font-bold text-sm mb-8">PAIN POINT</div>
            <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep mb-8">
              {sections.pain.title}
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium whitespace-pre-line leading-relaxed mb-12">
              {sections.pain.desc}
            </p>
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
              {sections.pain.image ? (
                <Image src={sections.pain.image} alt="Pain" fill className="object-cover" unoptimized={true} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-destructive/10 to-destructive/5" />
              )}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </section>
        )}

        {/* 03. Problem Section */}
        {sections.problem && (
          <section className="px-6 py-24 bg-accent/10 text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep mb-8">
              {sections.problem.title}
            </h2>
            <p className="text-muted-foreground text-lg sm:text-xl font-medium leading-relaxed mb-12">
              {sections.problem.desc}
            </p>
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
              {sections.problem.image ? (
                <Image src={sections.problem.image} alt="Problem" fill className="object-cover" unoptimized={true} />
              ) : (
                <div className="w-full h-full bg-accent/20" />
              )}
            </div>
          </section>
        )}

        {/* 04. Story Section */}
        {sections.story && (
          <section className="px-6 py-24 bg-card flex flex-col items-center">
            <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-8 border border-primary/20">REAL STORY</div>
            <h2 className="text-3xl sm:text-4xl font-black text-card-foreground leading-snug break-keep text-center mb-12">
              {sections.story.title}
            </h2>
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden shadow-2xl mb-12">
              {sections.story.image ? (
                <Image src={sections.story.image} alt="Story" fill className="object-cover" unoptimized={true} />
              ) : (
                <div className="w-full h-full bg-primary/5" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed text-center whitespace-pre-line">
              {sections.story.desc}
            </p>
          </section>
        )}

        {/* 05. Solution Intro */}
        {sections.solutionIntro && (
          <section className="px-6 py-24 bg-primary text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mx-auto mb-6 opacity-80" />
              <h2 className="text-3xl sm:text-4xl font-black leading-snug break-keep mb-6">
                {sections.solutionIntro.title}
              </h2>
              <p className="text-primary-foreground/80 text-lg sm:text-xl font-bold mb-12 italic">
                &quot;{sections.solutionIntro.desc}&quot;
              </p>
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-white/20">
                {sections.solutionIntro.image ? (
                  <Image src={sections.solutionIntro.image} alt="Solution" fill className="object-cover" unoptimized={true} />
                ) : (
                  <div className="w-full h-full bg-white/10" />
                )}
              </div>
            </div>
          </section>
        )}

        {/* 06. How It Works */}
        {sections.howItWorks && (
          <section className="px-6 py-24 bg-card">
            <h2 className="text-3xl sm:text-4xl font-black text-center mb-16 text-card-foreground">{sections.howItWorks.title}</h2>
            <div className="space-y-12">
              {sections.howItWorks.steps?.map((step: any, idx: number) => (
                <div key={idx} className="flex gap-6 items-start">
                  <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-black shrink-0 shadow-lg">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-16 relative aspect-video rounded-3xl overflow-hidden shadow-xl border border-border">
              {sections.howItWorks.image ? (
                <Image src={sections.howItWorks.image} alt="Technical" fill className="object-cover" unoptimized={true} />
              ) : (
                <div className="w-full h-full bg-accent/10" />
              )}
            </div>
          </section>
        )}

        {/* 07. Social Proof */}
        {sections.socialProof && (
          <section className="px-6 py-24 bg-accent/5">
             <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-black mb-6">{sections.socialProof.title}</h2>
              <p className="text-muted-foreground text-lg mb-12">{sections.socialProof.desc}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-16">
                {sections.socialProof.stats?.map((stat: any, idx: number) => (
                  <div key={idx} className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
                    <div className="text-2xl font-black text-primary mb-1">{stat.value}</div>
                    <div className="text-xs font-bold text-muted-foreground uppercase">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {sections.socialProof.reviews?.map((review: any, idx: number) => (
                <div key={idx} className="bg-card p-8 rounded-3xl shadow-md border border-border flex flex-col gap-4">
                  <div className="flex text-yellow-500">
                    {[...Array(review.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                  </div>
                  <p className="text-foreground font-medium leading-relaxed italic">&quot;{review.content}&quot;</p>
                  <div className="flex items-center gap-3 text-sm font-bold text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-primary-foreground"><User className="w-4 h-4" /></div>
                    {review.author} 고객님
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 08. Authority */}
        {sections.authority && (
          <section className="px-6 py-24 bg-card text-center">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border border-primary/20">
              <Award className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-3xl font-black mb-6">{sections.authority.title}</h2>
            <p className="text-muted-foreground text-lg font-medium leading-relaxed mb-12">
              {sections.authority.desc}
            </p>
            <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl mb-8">
              {sections.authority.image ? (
                <Image src={sections.authority.image} alt="Studio" fill className="object-cover" unoptimized={true} />
              ) : (
                <div className="w-full h-full bg-primary/5" />
              )}
            </div>
          </section>
        )}

        {/* 09. Benefits + Bonus */}
        {sections.benefits && (
          <section className="px-6 py-24 bg-card border-y border-border/50">
            <h2 className="text-3xl font-black text-center mb-12">{sections.benefits.title}</h2>
            <div className="space-y-4 mb-16">
              {sections.benefits.items?.map((item: string, idx: number) => (
                <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-accent/5 border border-border/30">
                  <Check className="w-6 h-6 text-primary shrink-0" />
                  <span className="font-bold">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="bg-primary/5 rounded-3xl p-8 border border-primary/20">
              <div className="flex items-center gap-3 mb-6">
                <Zap className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">오늘 구매 시 특별 보너스</h3>
              </div>
              <div className="space-y-4">
                {sections.benefits.bonuses?.map((bonus: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-primary/10 last:border-0">
                    <span className="font-medium text-muted-foreground">{bonus.name}</span>
                    <span className="font-black text-primary">{bonus.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 10. Risk Removal */}
        {sections.riskRemoval && (
          <section className="px-6 py-24 bg-card">
            <div className="text-center mb-16">
              <ShieldCheck className="w-12 h-12 text-green-500 mx-auto mb-6" />
              <h2 className="text-3xl font-black mb-6">{sections.riskRemoval.title}</h2>
              <p className="text-muted-foreground font-medium">{sections.riskRemoval.desc}</p>
            </div>
            
            <div className="space-y-4">
              {sections.riskRemoval.faqs?.map((faq: any, idx: number) => (
                <div key={idx} className="bg-accent/5 rounded-2xl p-6">
                  <div className="flex gap-4 items-start">
                    <HelpCircle className="w-6 h-6 text-primary shrink-0 mt-1" />
                    <div>
                      <h4 className="font-black mb-2">{faq.q}</h4>
                      <p className="text-muted-foreground font-medium text-sm leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 11. Final Comparison */}
        {sections.finalComparison && (
          <section className="px-6 py-24 bg-accent/10">
            <h2 className="text-3xl font-black text-center mb-16">{sections.finalComparison.title}</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-card p-6 rounded-3xl border-t-4 border-destructive shadow-lg">
                <h4 className="text-destructive font-black mb-4 flex items-center gap-2"><X className="w-5 h-5" /> WITHOUT</h4>
                <ul className="space-y-3">
                  {sections.finalComparison.without?.map((item: string, i: number) => (
                    <li key={i} className="text-xs font-bold text-muted-foreground leading-tight">• {item}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-card p-6 rounded-3xl border-t-4 border-primary shadow-lg">
                <h4 className="text-primary font-black mb-4 flex items-center gap-2"><Check className="w-5 h-5" /> WITH ME</h4>
                <ul className="space-y-3">
                  {sections.finalComparison.with?.map((item: string, i: number) => (
                    <li key={i} className="text-xs font-black text-card-foreground leading-tight">• {item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="mt-12 relative aspect-video rounded-3xl overflow-hidden">
               {sections.finalComparison.image ? (
                 <Image src={sections.finalComparison.image} alt="Comparison" fill className="object-cover" unoptimized={true} />
               ) : (
                 <div className="w-full h-full bg-accent/10" />
               )}
            </div>
          </section>
        )}

        {/* 12. Target Filter */}
        {sections.targetFilter && (
          <section className="px-6 py-24 bg-card">
            <h2 className="text-3xl font-black text-center mb-12">{sections.targetFilter.title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h4 className="text-primary font-black mb-4">추천합니다 👍</h4>
                <ul className="space-y-2">
                  {sections.targetFilter.recommend?.map((item: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-muted-foreground leading-tight flex gap-2"><span>-</span> {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-muted-foreground font-bold mb-4">추천하지 않습니다 ✋</h4>
                <ul className="space-y-2">
                  {sections.targetFilter.avoid?.map((item: string, i: number) => (
                    <li key={i} className="text-sm font-medium text-muted-foreground/60 leading-tight flex gap-2"><span>-</span> {item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        )}

        {/* 13. Final CTA */}
        {sections.finalCTA && (
          <section className="px-6 py-32 bg-primary text-primary-foreground text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
            <div className="relative z-10">
              <h2 className="text-4xl font-black mb-12 break-keep">{sections.finalCTA.title}</h2>
              <div className="mb-12">
                <span className="text-primary-foreground/60 line-through text-2xl mr-4">{sections.finalCTA.price}</span>
                <span className="text-5xl font-black text-white">{sections.finalCTA.discountPrice}</span>
              </div>
              <div className="relative aspect-[16/9] w-full max-w-lg mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                 {sections.finalCTA.image ? (
                   <Image src={sections.finalCTA.image} alt="Final" fill className="object-cover" unoptimized={true} />
                 ) : (
                   <div className="w-full h-full bg-white/10" />
                 )}
              </div>
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
             {sections.finalCTA?.discountPrice || "지금 바로"} 구매하기
          </Button>
        </div>
      </div>
    </div>
  );
}
