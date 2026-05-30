import { create } from 'zustand';

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

interface PaymentState {
  payments: Payment[];
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  removePayment: (id: string) => void;
  clearPayments: () => void;
}

export const usePaymentStore = create<PaymentState>((set) => ({
  payments: [],
  setPayments: (payments) => set({ payments }),
  addPayment: (payment) =>
    set((state) => ({ payments: [...state.payments, payment] })),
  removePayment: (id) =>
    set((state) => ({
      payments: state.payments.filter((p) => p.id !== id),
    })),
  clearPayments: () => set({ payments: [] }),
}));
