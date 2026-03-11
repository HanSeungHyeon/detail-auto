import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, ShoppingCart, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { sampleProducts } from "@/data/samples";
import { CreateFromSampleButton } from "@/components/create-from-sample-button";

export function generateStaticParams() {
  return sampleProducts.map((p) => ({ id: p.id }));
}

export default async function SampleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sample = sampleProducts.find((p) => p.id === id);

  if (!sample) {
    notFound();
  }

  const { longForm } = sample;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 pb-24">
      <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between max-w-2xl">
          <Link href="/#sample-section" className="p-2 -ml-2 hover:bg-accent rounded-full transition-colors text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="font-bold text-lg truncate px-4">{sample.title}</div>
          <ThemeToggle />
        </div>
      </header>

      <main className="pt-16 max-w-2xl mx-auto bg-card shadow-2xl min-h-screen relative overflow-hidden">
        {/* 1. Hero Section */}
        <section className="relative aspect-[4/5] w-full overflow-hidden">
          <Image src={sample.thumbnailUrl} alt={sample.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-10 sm:p-14">
            <div className="inline-block px-4 py-1.5 bg-blue-600 text-white font-bold text-sm rounded-full mb-5 w-fit shadow-lg shadow-blue-500/30">
              {sample.audience}의 선택
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-white leading-[1.15] mb-5 tracking-tighter drop-shadow-xl break-keep">
              {sample.title}
            </h1>
            <p className="text-white/90 text-lg sm:text-2xl font-semibold drop-shadow-md break-keep">
              {sample.subtitle}
            </p>
          </div>
        </section>

        {/* 2. Problem Section */}
        <section className="px-8 py-32 bg-white text-center relative">
          <div className="inline-block px-5 py-2 rounded-full bg-slate-100 text-slate-900 font-bold text-sm mb-8">페인포인트 분석</div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight break-keep mb-8 tracking-tighter">
            {longForm.problem.title}
          </h2>
          <p className="text-slate-600 text-lg sm:text-xl font-medium whitespace-pre-line leading-relaxed mb-16">
            {longForm.problem.desc}
          </p>
          {longForm.problem.image && (
            <div className="relative aspect-[16/10] rounded-[32px] overflow-hidden shadow-2xl shadow-slate-200 mb-8 border border-slate-100">
              <Image src={longForm.problem.image} alt="Problem" fill className="object-cover" />
            </div>
          )}
        </section>

        {/* 3. Nano Banana AI Generated Section */}
        <section className="py-32 bg-blue-50/30 border-y border-blue-100/50 overflow-hidden">
          <div className="px-8 text-center mb-16">
            <div className="inline-block px-5 py-2 rounded-full bg-blue-600 text-white font-bold text-sm mb-5 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 w-fit mx-auto">
              <Sparkles className="w-4 h-4" /> AI 엔진
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight break-keep mb-6 tracking-tighter whitespace-pre-line">
              {longForm.nanoBanana.title}
            </h2>
            <p className="text-slate-600 text-xl font-medium whitespace-pre-line leading-relaxed">
              {longForm.nanoBanana.desc}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 sm:gap-6 px-4 sm:px-8">
            {longForm.nanoBanana.cuts.map((cut, idx) => (
              <div key={idx} className={`relative aspect-[3/4] rounded-[32px] overflow-hidden shadow-xl shadow-blue-900/5 group ${idx % 2 !== 0 ? 'mt-12' : ''} border border-white`}>
                <Image src={cut} alt={`AI Generated Cut ${idx + 1}`} fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold text-sm tracking-widest">AI SCENE 0{idx + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. Solution Section */}
        <section className="px-8 py-32 bg-white">
          <div className="text-center mb-20">
            <div className="inline-block px-5 py-2 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-8">독보적 솔루션</div>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 leading-tight break-keep mb-8 tracking-tighter">
              {longForm.solution.title}
            </h2>
            <p className="text-slate-600 text-xl font-medium whitespace-pre-line leading-relaxed">
              {longForm.solution.desc}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-32">
            {longForm.solution.stats.map((stat, idx) => (
              <div key={idx} className="bg-slate-50 rounded-[24px] p-6 flex flex-col items-center justify-center text-center border border-slate-100">
                <span className="text-3xl sm:text-4xl font-black text-blue-600 mb-2">{stat.value}</span>
                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="space-y-32">
            {longForm.solution.details.map((detail, idx) => (
              <div key={idx} className="space-y-8 animate-in fade-in slide-in-from-bottom-10">
                <h3 className="text-3xl font-black text-slate-900 leading-tight tracking-tight">{detail.title}</h3>
                <p className="text-slate-600 text-[19px] font-medium leading-relaxed">
                  {detail.desc}
                </p>
                <div className="relative aspect-[16/9] rounded-[40px] overflow-hidden shadow-2xl shadow-slate-200 border border-slate-100">
                  <Image src={detail.image} alt={detail.title} fill className="object-cover" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Social Proof (Reviews) */}
        <section className="px-8 py-32 bg-slate-50 text-center">
          <h2 className="text-4xl font-black mb-20 text-slate-900 tracking-tighter">{longForm.socialProof.title}</h2>
          <div className="space-y-8 text-left max-w-xl mx-auto">
            {longForm.socialProof.reviews.map((review, idx) => (
              <div key={idx} className="bg-white rounded-[32px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100 relative">
                <div className="flex items-center gap-1.5 text-blue-600 mb-6">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-slate-900 text-[19px] mb-8 font-semibold leading-relaxed break-keep">
                  &quot;{review.content}&quot;
                </p>
                <div className="flex items-center text-slate-400 font-bold text-[15px]">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 mr-4 font-black">
                    {review.author[0]}
                  </div>
                  {review.author} 고객님
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      
      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 w-full z-50 bg-white/80 backdrop-blur-2xl border-t border-slate-100 p-6 flex justify-center shadow-[0_-20px_50px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-2xl flex gap-4">
          <Button variant="outline" size="icon" className="h-16 w-16 rounded-2xl border-slate-200 shrink-0 bg-white hover:bg-slate-50 transition-all flex items-center justify-center shadow-sm">
             <ShoppingCart className="w-7 h-7 text-slate-400" />
          </Button>
          <CreateFromSampleButton sampleId={sample.id} />
        </div>
      </div>
    </div>
  );
}
