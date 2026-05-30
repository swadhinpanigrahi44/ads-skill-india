'use client';

import { useCallback } from 'react';
import { api } from '@/lib/api';

export function usePaymentProcessing() {
  const processPayment = useCallback(async (paymentData: any) => {
    try {
      const response = await api.post('/payments/process', paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  const verifyPayment = useCallback(async (transactionId: string) => {
    try {
      const response = await api.get(`/payments/verify/${transactionId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  return { processPayment, verifyPayment };
}
