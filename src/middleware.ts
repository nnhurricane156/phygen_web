import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

// const protectedRoutes = ["/admin", "/manager", "/createExam"];
const protectedRoutes = [""];

const publicRoutes = ["/login", "/register"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);


    const cookieStore = await cookies();
    const cookie = cookieStore.get("session")?.value;

    const session = await decrypt(cookie); const url = req.nextUrl.clone();

    if (isProtectedRoute && !session?.userId) {
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Check role-based access for protected routes
    if (session?.userId && isProtectedRoute) {
        const userRole = session.role as number;

        // Admin can access /admin only
        if (path === "/admin" && userRole !== 1) {
            url.pathname = userRole === 2 ? "/createExam" : "/manager";
            return NextResponse.redirect(url);
        }

        // User can access /createExam only
        if (path === "/createExam" && userRole !== 2) {
            url.pathname = userRole === 1 ? "/admin" : "/manager";
            return NextResponse.redirect(url);
        }

        // Manager can access /manager only
        if (path === "/manager" && userRole !== 3) {
            url.pathname = userRole === 1 ? "/admin" : "/createExam";
            return NextResponse.redirect(url);
        }
    }

    if (isPublicRoute && session?.userId) {
        // Redirect to appropriate dashboard based on user role
        if (session.role === 1) { // Admin
            url.pathname = "/admin";
        } else if (session.role === 2) { // User
            url.pathname = "/createExam";
        } else if (session.role === 3) { // Manager
            url.pathname = "/manager";
        } else {
            // Default fallback
            url.pathname = "/manager";
        }
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
    ],
};