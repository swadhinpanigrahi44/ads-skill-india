'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export function useReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReferrals() {
      try {
        const data = await api.get('/referrals');
        setReferrals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch referrals');
      } finally {
        setLoading(false);
      }
    }

    fetchReferrals();
  }, []);

  return { referrals, loading, error };
}
