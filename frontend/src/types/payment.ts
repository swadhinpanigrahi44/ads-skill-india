export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'cancelled';

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  paymentMethod: string;
  transactionId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  planId: string;
  plan: Plan;
  status: 'active' | 'inactive' | 'cancelled';
  startDate: string;
  endDate?: string;
  autoRenew: boolean;
}

export interface Transaction {
  id: string;
  paymentId: string;
  type: 'payment' | 'refund' | 'settlement';
  amount: number;
  status: PaymentStatus;
  createdAt: string;
}
