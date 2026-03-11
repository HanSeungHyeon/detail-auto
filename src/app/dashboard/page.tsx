"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { useAuthStore } from "@/stores/use-auth-store"
import { fetchUserProjects } from "@/app/actions/project"
import { verifySession } from "@/app/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { Sparkles, Plus, Image as ImageIcon, LogOut, Loader2 } from "lucide-react"

export default function DashboardPage() {
  const { user, isAuthenticated, logout } = useAuthStore()
  const router = useRouter()
  
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    const checkAuthAndLoadProjects = async () => {
      let currentIsAuth = isAuthenticated;
      
      if (!currentIsAuth) {
        const sessionResult = await verifySession();
        if (sessionResult.isAuthenticated && sessionResult.user) {
          useAuthStore.getState().setUser({ ...sessionResult.user, email: sessionResult.user.email || "" });
          currentIsAuth = true;
        } else {
          router.push("/login");
          return;
        }
      }

      const response = await fetchUserProjects()
      if (response.projects) {
        setProjects(response.projects)
      }
      setLoading(false)
      setIsVerifying(false)
    }

    checkAuthAndLoadProjects();
  }, [isAuthenticated, router])

  if (isVerifying || !isAuthenticated) return null // 깜빡임 방지용

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <header className="sticky top-0 w-full z-40 bg-background/80 backdrop-blur-xl border-b border-border transition-colors duration-300">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight flex items-center gap-2">
            <div className="w-8 h-8 rounded-[10px] bg-primary flex items-center justify-center text-white font-black text-lg shadow-sm">DA</div>
            <span className="text-card-foreground font-bold text-xl tracking-wide hidden sm:block">DA</span>
          </Link>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={async () => {
                const { signOut } = await import("@/app/actions/auth");
                await signOut();
                logout(); // Zustand 초기화
                router.push("/");
              }} 
              className="text-muted-foreground hover:bg-accent rounded-xl text-[15px]"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Link href="/create">
              <Button className="bg-card-foreground text-background hover:bg-card-foreground/90 rounded-2xl px-6 font-semibold shadow-sm transition-transform active:scale-95">
                <Plus className="w-4 h-4 mr-1" />
                새로 만들기
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-10 pb-20 max-w-5xl">
        {/* Credit Banner */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-blue-100 dark:border-blue-900/50">
            <div>
              <h2 className="text-lg font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-1">
                <Sparkles className="w-5 h-5 text-blue-500" />
                환영합니다, {user?.email?.split('@')[0]}님!
              </h2>
              <p className="text-blue-700/80 dark:text-blue-200/70 text-[15px] font-medium">
                결제 없이 바로 멋진 상세페이지를 생성해 보세요.
              </p>
            </div>
            <div className="bg-white dark:bg-card px-5 py-3 rounded-2xl shadow-sm border border-border flex items-center gap-3">
              <span className="text-muted-foreground text-[14px] font-medium">잔여 크레딧</span>
              <span className="text-2xl font-black text-primary">{user?.credits || 10}</span>
            </div>
          </div>
        </section>

        {/* Project Grid / Empty State */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-card-foreground tracking-tight">나의 템플릿</h3>
            <span className="text-muted-foreground font-medium text-[15px]">총 {projects.length}개</span>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card rounded-[24px] border border-border/50 shadow-sm px-4">
              <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mb-6">
                <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
              </div>
              <h4 className="text-xl font-bold text-card-foreground mb-2">아직 만든 상세페이지가 없어요.</h4>
              <p className="text-[#8B95A1] font-medium mb-8">
                상품 컷 하나만 올리면 눈길을 끄는 템플릿이 바로 완성됩니다.
              </p>
              <Link href="/create">
                <Button size="lg" className="h-[52px] px-8 rounded-2xl text-[16px] bg-primary text-white shadow-sm hover:translate-y-[-2px] transition-all">
                  첫 템플릿 만들기
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Link key={project.id} href={`/project/${project.id}`}>
                  <div className="group bg-card rounded-[24px] overflow-hidden border border-border hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all hover:-translate-y-1 cursor-pointer">
                    <div className="aspect-[4/3] bg-accent relative flex items-center justify-center overflow-hidden">
                      {project.thumbnail_url ? (
                        <Image src={project.thumbnail_url} alt={project.title} fill className="object-cover transition-transform group-hover:scale-105" />
                      ) : (
                        <span className="text-muted-foreground font-medium text-sm">썸네일 영역</span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-bold px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 rounded-full">
                          {project.status === 'completed' ? '생성 완료' : 
                           project.status === 'processing' ? '생성 중' : '대기 중'}
                        </span>
                        <span className="text-[13px] text-muted-foreground">{new Date(project.created_at).toLocaleDateString()}</span>
                      </div>
                      <h4 className="font-bold text-[17px] text-card-foreground truncate">{project.title}</h4>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
