import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware pour protéger les routes d'administration
//http://localhost:3000/admin/login?key=winsagency2024


// Clé secrète connue uniquement des admins
const ADMIN_SECRET = 'winsagency2024';

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  // Protège toutes les routes /admin/*
  if (pathname.startsWith('/admin')) {
    
    // 1. Si l'URL contient ?key=winsagency2024 → on pose un cookie et on redirige proprement
    if (searchParams.get('key') === ADMIN_SECRET) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.set('admin_access', ADMIN_SECRET, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 7 jours
      });
      return response;
    }

    // 2. Si le cookie admin_access est valide → laisser passer
    const cookie = request.cookies.get('admin_access');
    if (cookie?.value === ADMIN_SECRET) {
      return NextResponse.next();
    }

    // 3. Sinon → page 404 (invisible pour le public)
    return NextResponse.rewrite(new URL('/not-found', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};