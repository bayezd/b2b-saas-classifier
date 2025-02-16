import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Paths that require contact information
const PROTECTED_PATHS = ['/classify', '/batch']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Skip middleware for API routes and public assets
  if (request.nextUrl.pathname.startsWith('/api') || 
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname === '/') {
    return NextResponse.next()
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  // Protect routes that require authentication
  const protectedRoutes = ['/dashboard', '/batch-upload']
  if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route)) && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if the path requires contact information
  if (PROTECTED_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    // Get contact info from cookie
    const hasSubmittedContact = request.cookies.get('hasSubmittedContact')

    // If no contact info, redirect to get-started page
    if (!hasSubmittedContact) {
      const url = new URL('/get-started', request.url)
      url.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(url)
    }
  }

  return response
}
