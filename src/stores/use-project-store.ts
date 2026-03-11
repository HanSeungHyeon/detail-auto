import { create } from "zustand"

type Step = "upload" | "form" | "processing" | "result"

export interface DummyProject {
  id: string
  title: string
  thumbnailUrl: string
  createdAt: string
  status: "completed" | "failed"
}

interface ProjectState {
  isGenerating: boolean
  currentStep: Step
  projects: DummyProject[]
  setGenerating: (status: boolean) => void
  setStep: (step: Step) => void
  addProject: (project: DummyProject) => void
}

export const useProjectStore = create<ProjectState>((set) => ({
  isGenerating: false,
  currentStep: "upload",
  projects: [],
  setGenerating: (status) => set({ isGenerating: status }),
  setStep: (step) => set({ currentStep: step }),
  addProject: (project) => set((state) => ({ projects: [project, ...state.projects] })),
}))
