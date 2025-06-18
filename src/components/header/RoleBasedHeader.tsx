"use client";

import React, { useRef, useEffect, useState } from "react";
import { ThemeToggleButton } from "../common/ThemeToggleButton";
import NotificationDropdown from "./NotificationDropdown";
import AdminUserDropdown from "./AdminUserDropdown";
import { useSidebar } from "@/context/SidebarContext";
import Link from "next/link";
import Image from "next/image";

/**
 * Shared Header Component for different user roles (admin, manager, user)
 * 
 * @param {Object} props - Component properties
 * @param {string} props.title - Title to display in the header
 * @param {string} props.userRole - User role (admin, manager, user)
 * @param {string} props.logoPath - Path to the logo image
 * @param {React.ReactNode} props.extraContent - Optional extra content to render in the header
 */
interface RoleBasedHeaderProps {
    title: string;
    userRole: 'admin' | 'manager' | 'user';
    logoPath?: string;
    extraContent?: React.ReactNode;
}

const RoleBasedHeader: React.FC<RoleBasedHeaderProps> = ({
    title,
    userRole,
    logoPath = "/images/logo/logo.svg",
    extraContent
}) => {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);
    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Determine which user dropdown to render based on role
    const renderUserDropdown = () => {
        switch (userRole) {
            case 'admin':
                // In a real app, these would be different components
                // with role-specific permissions and options
                return <AdminUserDropdown />;
            case 'manager':
                return <AdminUserDropdown />;
            case 'user':
                return <AdminUserDropdown />;
            default:
                return <AdminUserDropdown />;
        }
    };

    // Role-specific class to change header appearance based on user role
    const roleClass = {
        'admin': '',
        'manager': 'bg-blue-50',
        'user': 'bg-gray-50'
    };

    return (
        <header className={`sticky top-0 flex w-full bg-white border-gray-200 z-50 ${roleClass[userRole]}`}>
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <button
                        className="items-center justify-center w-10 h-10 text-gray-500 border border-gray-200 rounded-lg z-50 lg:flex lg:h-11 lg:w-11"
                        onClick={handleToggle}
                        aria-label="Toggle Sidebar"
                    >
                        {isMobileOpen ? (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.33331 5H16.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.33331 10H16.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M3.33331 15H16.6666" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </button>

                    <Link href="/" className="lg:hidden">
                        <div className="text-xl font-bold">TailAdmin</div>
                    </Link>

                    <button
                        onClick={toggleApplicationMenu}
                        className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg hover:bg-gray-100 lg:hidden"
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    <div className="hidden lg:block">
                        <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                    </div>
                </div>
                <div
                    className={`${isApplicationMenuOpen ? "flex" : "hidden"} items-center justify-between w-full gap-4 px-5 py-4 lg:flex shadow-lg lg:justify-end lg:px-0 lg:shadow-none`}
                >
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggleButton />
                        <NotificationDropdown />
                    </div>

                    <div className="relative hidden lg:flex lg:items-center">
                        <input
                            type="text"
                            ref={inputRef}
                            placeholder="Search..."
                            className="w-64 py-2 pl-10 pr-4 text-sm text-gray-700 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M17.5 17.5L14.5834 14.5833M16.6667 9.58333C16.6667 13.4954 13.4954 16.6667 9.58333 16.6667C5.67132 16.6667 2.5 13.4954 2.5 9.58333C2.5 5.67132 5.67132 2.5 9.58333 2.5C13.4954 2.5 16.6667 5.67132 16.6667 9.58333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    {extraContent}

                    {renderUserDropdown()}
                </div>
            </div>
        </header>
    );
};

export default RoleBasedHeader;
