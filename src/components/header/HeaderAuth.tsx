"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "./UserMenu";

export default function HeaderAuth() {
    const { isAuthenticated, user, isLoading } = useAuth();

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

    if (isAuthenticated && user) {
        return (
            <UserMenu
                user={{
                    name: user.username || "User",
                    email: user.email || "",
                    role: user.role || 2,
                }}
            />
        );
    }

    return (
        <div className="flex items-center space-x-3">
            <Link
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
