"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logoutAction } from "@/actions/auth";
import { useRouter } from "next/navigation";

interface UserMenuProps {
    user: {
        name: string;
        email: string;
        role: number;
    };
}

export default function UserMenu({ user }: UserMenuProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();

    // Fix hydration mismatch
    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await logoutAction();
            router.push("/login");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const getUserRoleName = (role: number) => {
        switch (role) {
            case 1: return "Admin";
            case 2: return "User";
            case 3: return "Manager";
            default: return "User";
        }
    };

    const getDashboardLink = (role: number) => {
        switch (role) {
            case 1: return "/admin";
            case 2: return "/createExam";
            case 3: return "/manager";
            default: return "/manager";
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => isMounted && setIsOpen(!isOpen)}
                className="flex items-center space-x-3 text-gray-700 hover:text-blue-700 font-medium"
            >
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="hidden md:block">{user.name}</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isMounted && isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-xs text-blue-600">{getUserRoleName(user.role)}</p>
                    </div>
                    <Link
                        href={getDashboardLink(user.role)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                    >
                        Dashboard
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}
