"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

/**
 * Icon components for sidebar navigation
 * Each icon is a React component that renders an SVG
 */
// Icons
const DashboardIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.125 9.375C8.125 8.68464 8.68464 8.125 9.375 8.125H10.625C11.3154 8.125 11.875 8.68464 11.875 9.375V15C11.875 15.6904 11.3154 16.25 10.625 16.25H9.375C8.68464 16.25 8.125 15.6904 8.125 15V9.375Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3.125 13.125C3.125 12.4346 3.68464 11.875 4.375 11.875H5.625C6.31536 11.875 6.875 12.4346 6.875 13.125V15C6.875 15.6904 6.31536 16.25 5.625 16.25H4.375C3.68464 16.25 3.125 15.6904 3.125 15V13.125Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.125 5.625C13.125 4.93464 13.6846 4.375 14.375 4.375H15.625C16.3154 4.375 16.875 4.93464 16.875 5.625V15C16.875 15.6904 16.3154 16.25 15.625 16.25H14.375C13.6846 16.25 13.125 15.6904 13.125 15V5.625Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const UsersIcon = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.875 8.75C8.60089 8.75 10 7.35089 10 5.625C10 3.89911 8.60089 2.5 6.875 2.5C5.14911 2.5 3.75 3.89911 3.75 5.625C3.75 7.35089 5.14911 8.75 6.875 8.75Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12.5 3.75C13.5355 3.75 14.375 4.58947 14.375 5.625C14.375 6.66053 13.5355 7.5 12.5 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M1.875 16.25V15C1.875 12.9289 3.55393 11.25 5.625 11.25H8.125C10.1961 11.25 11.875 12.9289 11.875 15V16.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M13.125 16.25V15C13.125 12.9289 14.8039 11.25 16.875 11.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

/**
 * Navigation item type definition
 * Each navigation item has a name, icon, and path
 */
type NavItem = {
    name: string;
    icon: React.ReactNode;
    path: string;
};

/**
 * Navigation items for admin dashboard
 * These will be displayed in the sidebar
 * Only keeping Dashboard and Users as requested
 */
const navItems: NavItem[] = [
    {
        icon: <DashboardIcon />,
        name: "Dashboard",
        path: "/admin",
    },
    {
        icon: <UsersIcon />,
        name: "Users",
        path: "/admin/users",
    },
];

const AdminSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
    const pathname = usePathname();

    // Check if a nav item is active
    const isActive = useCallback((path: string) => {
        return path === pathname ||
            (path !== "/admin" && pathname?.startsWith(path));
    }, [pathname]); return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col pt-0 bg-indigo-700 border-r border-indigo-800 shadow-sm transition-width duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                    } ${isExpanded || isHovered ? "w-64" : "w-20"}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >                <div className="flex items-center justify-center h-16 px-4 border-b border-indigo-800 bg-indigo-800">
                    {(isExpanded || isHovered) ? (
                        <Link href="/" className="flex items-center">
                            <Image
                                src="/images/logo/logo-icon.svg"
                                width={32}
                                height={32}
                                alt="Logo"
                                className="mr-2"
                            />
                            <span className="text-xl font-bold text-white">PhyGen</span>
                        </Link>
                    ) : (
                        <Link href="/" className="flex items-center justify-center">
                            <Image
                                src="/images/logo/logo-icon.svg"
                                width={32}
                                height={32}
                                alt="Logo"
                            />
                        </Link>
                    )}
                </div>

                <div className="flex flex-col justify-between h-full px-4 py-6 overflow-y-auto">
                    <nav className="flex-1">
                        <h3 className={`${isExpanded || isHovered ? "px-4 text-xs font-medium" : "px-0 text-[0px]"
                            } mb-4 uppercase text-indigo-300`}
                        >
                            Menu
                        </h3>
                        <ul className="flex flex-col gap-2">
                            {navItems.map((item, index) => (
                                <li key={index}>
                                    <Link
                                        href={item.path}
                                        className={`group flex items-center gap-3 rounded-lg px-3 py-2 font-medium transition-colors ${isActive(item.path) ?
                                            "bg-indigo-800 text-white hover:bg-indigo-900" :
                                            "text-indigo-100 hover:bg-indigo-600"
                                            }`}
                                    >
                                        <span className={`${isActive(item.path) ? "text-white" : "text-indigo-300"} transition-colors group-hover:text-white`}>
                                            {item.icon}
                                        </span>
                                        <span className={`${!isExpanded && !isHovered ? "w-0 opacity-0" : "opacity-100"
                                            } whitespace-nowrap transition-all duration-300`}
                                        >
                                            {item.name}
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>                    {/* Sidebar widget removed as per requirements */}
                </div>
            </aside>            {/* Backdrop for mobile sidebar */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
                    onClick={toggleMobileSidebar}
                />
            )}
        </>
    );
};

export default AdminSidebar;
