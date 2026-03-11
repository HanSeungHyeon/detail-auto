import { create } from 'zustand';

interface CreditState {
  balance: number;
  setBalance: (balance: number) => void;
  deductCredit: (amount: number) => void;
  addCredit: (amount: number) => void;
}

export const useCreditStore = create<CreditState>((set) => ({
  balance: 0,
  setBalance: (balance) => set({ balance }),
  deductCredit: (amount) => set((state) => ({ balance: Math.max(0, state.balance - amount) })),
  addCredit: (amount) => set((state) => ({ balance: state.balance + amount })),
}));
