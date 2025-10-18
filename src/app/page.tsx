'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, []);

  return (
    <>
      <h1>Home Page</h1>
      <button onClick={() => router.push('/sign-in')}>
        Go to sign in page
      </button>
    </>
  );
}
