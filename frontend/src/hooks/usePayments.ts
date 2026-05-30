'use client';

import { useState, useCallback } from 'react';
import { api } from '@/lib/api';

export interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
}

export function usePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.get('/payments');
      setPayments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  }, []);

  return { payments, loading, error, fetchPayments };
}
