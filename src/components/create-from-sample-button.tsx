"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createProjectFromSample } from "@/app/actions/project"

export function CreateFromSampleButton({ sampleId }: { sampleId: string }) {
  const [isPending, setIsPending] = useState(false)
  const router = useRouter()

  const handleCreate = async () => {
    setIsPending(true)
    try {
      const result = await createProjectFromSample(sampleId)
      if (result.success && result.projectId) {
        router.push(`/project/${result.projectId}`)
      } else {
        alert(result.error || "템플릿 생성 중 오류가 발생했습니다.")
        setIsPending(false)
      }
    } catch (error) {
      alert("오류가 발생했습니다.")
      setIsPending(false)
    }
  }

  return (
    <Button 
      onClick={handleCreate}
      disabled={isPending}
      className="flex-1 h-14 text-[17px] font-bold rounded-[16px] bg-primary text-white shadow-[0_4px_14px_0_rgba(49,130,246,0.39)] hover:bg-primary/95 transition-transform active:scale-[0.98] disabled:opacity-70"
    >
      {isPending ? (
        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
      ) : (
        <Sparkles className="w-5 h-5 mr-2" />
      )}
      {isPending ? "생성 중..." : "이 템플릿으로 내 상세페이지 만들기"}
    </Button>
  )
}
