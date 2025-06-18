"use client";
import React from "react";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import AdminSidebar from "@/components/layout/AdminSidebar";
import AdminHeader from "@/components/header/AdminHeader";
import Backdrop from "@/components/layout/Backdrop";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (<ThemeProvider>
        <SidebarProvider>
            <div className="flex min-h-screen bg-gray-50">
                <AdminSidebar />
                <div className="flex-1 flex flex-col lg:pl-[16rem]">
                    <AdminHeader />
                    <main className="flex-grow p-4 lg:p-6">
                        {children}
                    </main>
                </div>
                <Backdrop />
            </div>
        </SidebarProvider>
    </ThemeProvider>
    );
}