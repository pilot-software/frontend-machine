'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function UsersListPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams();
    searchParams.forEach((value, key) => {
      params.set(key, value);
    });
    const queryString = params.toString();
    router.replace(`/users${queryString ? `?${queryString}` : ''}`);
  }, [router, searchParams]);

  return null;
}