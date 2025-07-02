"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import UserMenu from "./UserMenu";

interface Session {
    userId: string;
    email: string;
    name: string;
    role: number;
}

export default function HeaderAuth() {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check session on client side
        const checkSession = async () => {
            try {
                const response = await fetch('/api/auth/session');
                if (response.ok) {
                    const sessionData = await response.json();
                    setSession(sessionData);
                }
            } catch (error) {
                console.error('Error checking session:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    // Show loading state
    if (isLoading) {
        return (
            <div className="flex items-center space-x-3">
                <div className="animate-pulse">
                    <div className="h-10 w-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (session?.userId) {
        return (
            <UserMenu
                user={{
                    name: session.name || "User",
                    email: session.email || "",
                    role: session.role || 2,
                }}
            />
        );
    }

    return (
        <div className="flex items-center space-x-3">              <Link
                href="/login"
                className="px-4 py-2 text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 font-medium"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                Register
              </Link>
        </div>
    );
}
