"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/stores/use-auth-store"
import { loginWithEmailAndPassword, verifySession } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const router = useRouter()
  const setUser = useAuthStore((state) => state.setUser)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await loginWithEmailAndPassword(formData)
    
    if (result.error) {
      setMessage(result.error)
    } else {
      // Sync with Zustand store
      const sessionResult = await verifySession()
      if (sessionResult.isAuthenticated && sessionResult.user) {
        setUser({ ...sessionResult.user, email: sessionResult.user.email || "" })
      }
      router.push("/dashboard")
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 w-full px-6 flex justify-between items-center max-w-xl">
        <Link href="/" className="p-2 hover:bg-accent rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card p-10 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-[14px] flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-sm">
            DA
          </div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2">로그인</h1>
          <p className="text-[#8B95A1] font-medium text-[15px]">
            작업하신 상세페이지 내역을 안전하게 보관합니다.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 shadow-none">
          <div className="space-y-3">
            <Input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-14 bg-[#F2F4F6] dark:bg-background border-none text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-card rounded-[16px] px-5"
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="h-14 bg-[#F2F4F6] dark:bg-background border-none text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-card rounded-[16px] px-5"
            />
          </div>
          
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] text-[16px] font-semibold transition-transform active:scale-[0.98] mt-2 shadow-sm"
          >
            {loading ? "로그인 중..." : "로그인"}
          </Button>

          {message && (
            <p className="text-center text-sm font-medium mt-4 text-destructive">
              {message}
            </p>
          )}

          <div className="mt-6 text-center text-[14px]">
            <span className="text-muted-foreground">계정이 없으신가요? </span>
            <Link href="/signup" className="text-primary font-semibold hover:underline">
              회원가입하기
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
