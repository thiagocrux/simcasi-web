import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionService } from '../SessionService';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getOriginalError(error: any) {
  return error.response?.data?.error;
}

export async function withAuthentication(requestFn: () => Promise<unknown>) {
  try {
    return await requestFn();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // try to refresh the access token
    if (getOriginalError(error).name === 'TokenExpiredError') {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('session')?.value;

      if (!refreshToken) {
        redirect('/sign-in');
      }

      if (refreshToken) {
        try {
          const { accessToken } = await SessionService.refreshToken({
            session: refreshToken,
          });

          cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            secure: true,
            maxAge: 60 * 60 * 24 * 7,
          });

          // Retry original request
          return await requestFn();
        } catch (innerError: unknown) {
          if (getOriginalError(innerError).name === 'ExpiredSessionError') {
            redirect('/sign-in');
          }
        }
      }
    }

    return {
      success: false,
      ...error.response?.data.error,
    };
  }
}
