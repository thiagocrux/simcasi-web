'use client';

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  return (
    <>
      <h1>Home Page</h1>
      <button onClick={() => router.push('/sign-in')}>
        Go to sign in page
      </button>
    </>
  );
}
