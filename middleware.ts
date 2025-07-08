import { NextResponse } from 'next/server'

export function middleware(request: Request) {
  // Add SSR session protection logic here (to be implemented)
  return NextResponse.next()
}