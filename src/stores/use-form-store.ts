import { create } from "zustand"

interface FormState {
  title: string
  audience: string
  points: string[]
  setField: (field: keyof Omit<FormState, "setField">, value: any) => void
  resetForm: () => void
}

export const useFormStore = create<FormState>((set) => ({
  title: "",
  audience: "",
  points: [],
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  resetForm: () => set({ title: "", audience: "", points: [] }),
}))
