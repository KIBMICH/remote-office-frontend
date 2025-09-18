import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Protected routes
  const protectedPaths = ['/dashboard', '/projects', '/settings', '/teams', '/chat', '/meetings', '/files']
  const isProtected = protectedPaths.some(path => pathname.startsWith(path))
  
  if (isProtected) {
    const token = request.cookies.get('token')?.value
    
    if (!token) {
      const url = new URL('/sign-in', request.url)
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/projects/:path*', 
    '/settings/:path*',
    '/teams/:path*',
    '/chat/:path*',
    '/meetings/:path*',
    '/files/:path*'
  ]
}
