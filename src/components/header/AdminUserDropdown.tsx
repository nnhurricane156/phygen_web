"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Dropdown from "../common/Dropdown";
import { logoutUser } from "@/actions/auth"; // Adjust the import path as necessary

export default function AdminUserDropdown() {
    const [isOpen, setIsOpen] = useState(false);

    function toggleDropdown(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        e.stopPropagation();
        setIsOpen((prev) => !prev);
    }

    function closeDropdown() {
        setIsOpen(false);
    }

    return (
        <div className="relative">
            <button
                onClick={toggleDropdown}
                className="flex items-center text-gray-700 dropdown-toggle"
            >
                <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
                    <Image
                        width={44}
                        height={44}
                        src="/images/user/owner.jpg"
                        alt="User"
                    />
                </span>

                <span className="block mr-1 font-medium text-theme-sm">Admin</span>

                <svg
                    className={`stroke-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                    width="18"
                    height="20"
                    viewBox="0 0 18 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </button>

            <Dropdown
                isOpen={isOpen}
                onClose={closeDropdown}
                className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-lg border border-gray-200 bg-white p-4 shadow-md"
            >
                <div className="mb-2">
                    <span className="block font-medium text-gray-800 text-lg">
                        Admin User
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-500">
                        admin@example.com
                    </span>
                </div>

                <ul className="flex flex-col gap-2 py-3 border-b border-gray-200">
                    <li>
                        <Link
                            href="/admin/profile"
                            className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-gray-900 text-sm"
                            onClick={closeDropdown}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.0001 11.6667C12.3013 11.6667 14.1667 9.80123 14.1667 7.50001C14.1667 5.19879 12.3013 3.33334 10.0001 3.33334C7.69885 3.33334 5.8334 5.19879 5.8334 7.50001C5.8334 9.80123 7.69885 11.6667 10.0001 11.6667Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16.6666 16.6667C16.6666 14.8258 15.9553 13.0603 14.7676 11.8726C13.5798 10.6849 11.8144 9.97368 9.99998 9.97368C8.18556 9.97368 6.42011 10.6849 5.23236 11.8726C4.04461 13.0603 3.33331 14.8258 3.33331 16.6667" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="underline">View Profile</span>
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="/admin/settings"
                            className="flex items-center gap-2 py-1.5 text-gray-600 hover:text-gray-900 text-sm"
                            onClick={closeDropdown}
                        >
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8.325 2.31673C8.911 1.11673 10.084 1.11673 10.669 2.31673L11.05 3.09173C11.1668 3.33192 11.3485 3.5331 11.5736 3.66849C11.7988 3.80388 12.0581 3.8677 12.319 3.85006L13.186 3.78339C14.488 3.68339 15.096 4.67506 14.288 5.70006L13.713 6.42506C13.5301 6.64822 13.4181 6.92554 13.3926 7.21692C13.3671 7.5083 13.4294 7.8007 13.57 8.05006L13.953 8.82506C14.371 9.90006 13.543 10.8501 12.371 10.8501H11.474C11.1828 10.8478 10.8993 10.9415 10.6693 11.1155C10.4393 11.2896 10.2761 11.534 10.205 11.8084L10.016 12.6334C9.81096 13.8834 8.69096 13.8834 8.48596 12.6334L8.29596 11.8084C8.22487 11.534 8.06167 11.2896 7.83167 11.1155C7.60167 10.9415 7.31817 10.8478 7.02696 10.8501H6.12196C4.95696 10.8501 4.12196 9.90006 4.54696 8.82506L4.92996 8.05006C5.07056 7.8007 5.13285 7.5083 5.10735 7.21692C5.08185 6.92554 4.96986 6.64822 4.78696 6.42506L4.21196 5.70006C3.40696 4.67506 4.01196 3.68339 5.31696 3.78339L6.18296 3.85006C6.44392 3.8677 6.7032 3.80388 6.92836 3.66849C7.15352 3.5331 7.33516 3.33192 7.45196 3.09173L7.83196 2.31673H8.32496H8.325Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M12.5 14.1667C12.5 15.55 11.3833 16.6667 10 16.6667C8.61667 16.6667 7.5 15.55 7.5 14.1667C7.5 12.7834 8.61667 11.6667 10 11.6667C11.3833 11.6667 12.5 12.7834 12.5 14.1667Z" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            <span className="underline">Settings</span>
                        </Link>
                    </li>
                </ul>
                <Link
                    href="/login"
                    className="flex items-center gap-2 py-2 mt-3 text-gray-600 hover:text-gray-900 text-sm"
                    onClick={() => logoutUser()}
                >
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5M7.5 2.5H6.5C5.09987 2.5 4.3998 2.5 3.86502 2.77248C3.39462 3.01217 3.01217 3.39462 2.77248 3.86502C2.5 4.3998 2.5 5.09987 2.5 6.5V13.5C2.5 14.9001 2.5 15.6002 2.77248 16.135C3.01217 16.6054 3.39462 16.9878 3.86502 17.2275C4.3998 17.5 5.09987 17.5 6.5 17.5H7.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="underline">Sign out</span>
                </Link>
            </Dropdown>
        </div>
    );
}
