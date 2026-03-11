"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { signupWithEmailAndPassword } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeToggle } from "@/components/theme-toggle"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== passwordConfirm) {
      setMessage("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)
    setMessage("")

    const formData = new FormData()
    formData.append("email", email)
    formData.append("password", password)

    const result = await signupWithEmailAndPassword(formData)
    
    if (result.error) {
      setMessage(result.error)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="absolute top-6 w-full px-6 flex justify-between items-center max-w-xl">
        <Link href="/login" className="p-2 hover:bg-accent rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-foreground" />
        </Link>
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-card p-10 rounded-[24px] shadow-[0_8px_30px_rgba(0,0,0,0.08)] animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-[14px] flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-sm">
            DA
          </div>
          <h1 className="text-2xl font-bold text-card-foreground mb-2">회원가입</h1>
          <p className="text-[#8B95A1] font-medium text-[15px]">
            기본 정보 2개만 입력하면 바로 시작할 수 있어요.
          </p>
        </div>

        {success ? (
          <div className="text-center py-6 animate-in zoom-in-95">
            <div className="w-16 h-16 bg-blue-100 text-primary rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">🎉</div>
            <h2 className="text-xl font-bold text-card-foreground mb-2">가입이 완료되었습니다!</h2>
            <p className="text-[#8B95A1] font-medium mb-6">잠시 후 로그인 페이지로 이동합니다.</p>
          </div>
        ) : (
          <form onSubmit={handleSignup} className="space-y-4 shadow-none">
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
                placeholder="비밀번호 (6자리 이상)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-14 bg-[#F2F4F6] dark:bg-background border-none text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-card rounded-[16px] px-5"
              />
              <Input
                type="password"
                placeholder="비밀번호 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                required
                minLength={6}
                className="h-14 bg-[#F2F4F6] dark:bg-background border-none text-[16px] text-[#191F28] dark:text-foreground placeholder:text-[#8B95A1] focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white dark:focus-visible:bg-card rounded-[16px] px-5"
              />
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary hover:bg-primary/95 text-white rounded-[16px] text-[16px] font-semibold transition-transform active:scale-[0.98] mt-2 shadow-sm"
            >
              {loading ? "가입 중..." : "회원가입 완료"}
            </Button>

            {message && (
              <p className="text-center text-sm font-medium mt-4 text-destructive">
                {message}
              </p>
            )}

            <div className="mt-6 text-center text-[14px]">
              <span className="text-muted-foreground">이미 계정이 있으신가요? </span>
              <Link href="/login" className="text-primary font-semibold hover:underline">
                로그인하기
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
