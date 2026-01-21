import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 保護されたルート
const protectedRoutes = ['/dashboard', '/profile', '/artworks', '/social-links', '/settings'];

// 認証済みユーザーがアクセスできないルート
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // クライアント側でのトークン検証のため、ここではCookieを確認
  // 注意: localStorageはミドルウェアからはアクセスできないため、
  // 実際の認証チェックはクライアント側で行う
  
  // api/authへのリクエストはスルー
  if (pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // 静的ファイルはスルー
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
