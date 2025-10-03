import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';

export function middleware(request: NextRequest) {
  // For now, we'll let the client-side handle authentication
  // In a real app, you'd check for valid session/token here
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/(dashboard|patients|appointments|clinical|prescriptions|financial)/:path*'
  ]
};
