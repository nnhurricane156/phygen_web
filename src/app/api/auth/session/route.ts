import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const session = await getSession();

        if (session?.userId) {
            return NextResponse.json({
                userId: session.userId,
                email: session.email,
                name: session.name,
                role: session.role,
            });
        }

        return NextResponse.json(null);
    } catch (error) {
        console.error('Session check error:', error);
        return NextResponse.json(null);
    }
}
