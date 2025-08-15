'use server';

import { SessionService } from '@/services/SessionService';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signInAction(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const { accessToken, session } = await SessionService.signIn({
      email,
      password,
    });

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('session', session, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);

    return {
      success: false,
      ...error.response?.data.error,
    };
  }

  redirect('/dashboard');
}

export async function signOutAction() {
  const cookieStore = await cookies();

  console.log(cookieStore.get('accessToken'));
  console.log(cookieStore.get('session'));

  cookieStore.set('accessToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 0,
  });

  cookieStore.set('session', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 0,
  });

  console.log(cookieStore.get('accessToken'));
  console.log(cookieStore.get('session'));

  redirect('/sign-in');
}
