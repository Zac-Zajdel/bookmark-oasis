import { auth } from "./auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  // If user is authenticated and hitting '/login' route, redirect them back to main screen.
  if (req.auth && req.url.includes('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
})

export const config = {
  matcher: [
    "/login",
  ],
}