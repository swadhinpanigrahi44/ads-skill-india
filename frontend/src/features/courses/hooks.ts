'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await api.get('/courses');
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch courses');
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  const enrollCourse = useCallback(async (courseId: string) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`, {});
      return response;
    } catch (error) {
      throw error;
    }
  }, []);

  return { courses, loading, error, enrollCourse };
}
