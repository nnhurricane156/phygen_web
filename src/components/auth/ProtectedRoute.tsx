"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: number[]; // Array of allowed user roles
    redirectTo?: string; // Custom redirect path
}

export default function ProtectedRoute({ 
    children, 
    allowedRoles, 
    redirectTo = "/login" 
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return; // Wait for auth to initialize

        if (!isAuthenticated) {
            router.push(redirectTo);
            return;
        }

        // Check role-based access if allowedRoles is specified
        if (allowedRoles && user && !allowedRoles.includes(user.role)) {
            // Redirect to appropriate dashboard based on user role
            const userRedirectPath = getUserDashboard(user.role);
            router.push(userRedirectPath);
            return;
        }
    }, [isAuthenticated, isLoading, user, allowedRoles, router, redirectTo]);

    // Show loading state while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Show loading state while redirecting
    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return <>{children}</>;
}

// Helper function to get dashboard path based on user role
function getUserDashboard(role: number): string {
    switch (role) {
        case 1: return "/admin";      // Admin
        case 2: return "/createExam"; // User
        case 3: return "/manager";    // Manager
        default: return "/manager";
    }
}

// Role constants for easy usage
export const USER_ROLES = {
    ADMIN: 1,
    USER: 2,
    MANAGER: 3,
} as const;
