import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "./lib/session";

const protectedRoutes = ["/admin"];
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

    if (isPublicRoute && session?.userId) {
        url.pathname = "/admin";
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
};