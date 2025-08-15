import { cookies } from 'next/headers';
import { MiddlewareConfig, NextRequest, NextResponse } from 'next/server';

const publicRoutes = [{ path: '/sign-in' }] as const;
const PATH_TO_REDIRECT_WHEN_UNAUTHENTICATED = '/sign-in';

export async function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname;
  const publicRoute = publicRoutes.find((route) => route.path === currentPath);
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    if (publicRoute) {
      return NextResponse.next();
    }

    if (!publicRoute) {
      return NextResponse.redirect(
        new URL(PATH_TO_REDIRECT_WHEN_UNAUTHENTICATED, request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config: MiddlewareConfig = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
