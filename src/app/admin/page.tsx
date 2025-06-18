"use client";
import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHeader,
    TableRow,
} from "@/components/ui/table/index";
import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";

// Define TypeScript interfaces
interface User {
    name: string;
    role: string;
    image: string;
}

interface Team {
    images: string[];
}

interface TableDataItem {
    id: number;
    user: User;
    projectName: string;
    team: Team;
    status: "Active" | "Pending" | "Cancel";
    budget: string;
}

// Sample user data based on the template
const tableData: TableDataItem[] = [
    {
        id: 1,
        user: {
            name: "Lindsey Curtis",
            role: "Web Designer",
            image: "https://randomuser.me/api/portraits/women/1.jpg"
        },
        projectName: "Agency Website",
        team: {
            images: [
                "https://randomuser.me/api/portraits/men/1.jpg",
                "https://randomuser.me/api/portraits/women/2.jpg",
                "https://randomuser.me/api/portraits/men/3.jpg"
            ]
        },
        status: "Active",
        budget: "3.9K"
    },
    {
        id: 2,
        user: {
            name: "Kaiya George",
            role: "Project Manager",
            image: "https://randomuser.me/api/portraits/women/3.jpg"
        },
        projectName: "Technology",
        team: {
            images: [
                "https://randomuser.me/api/portraits/men/4.jpg",
                "https://randomuser.me/api/portraits/women/5.jpg"
            ]
        },
        status: "Pending",
        budget: "24.9K"
    },
    {
        id: 3,
        user: {
            name: "Zain Geidt",
            role: "Content Writing",
            image: "https://randomuser.me/api/portraits/men/5.jpg"
        },
        projectName: "Blog Writing",
        team: {
            images: [
                "https://randomuser.me/api/portraits/men/6.jpg"
            ]
        },
        status: "Active",
        budget: "12.7K"
    },
    {
        id: 4,
        user: {
            name: "Abram Schleifer",
            role: "Digital Marketer",
            image: "https://randomuser.me/api/portraits/men/7.jpg"
        },
        projectName: "Social Media",
        team: {
            images: [
                "https://randomuser.me/api/portraits/women/7.jpg",
                "https://randomuser.me/api/portraits/men/8.jpg",
                "https://randomuser.me/api/portraits/women/8.jpg"
            ]
        },
        status: "Cancel",
        budget: "2.8K"
    },
    {
        id: 5,
        user: {
            name: "Carla George",
            role: "Front-end Developer",
            image: "https://randomuser.me/api/portraits/women/9.jpg"
        },
        projectName: "Website",
        team: {
            images: [
                "https://randomuser.me/api/portraits/men/10.jpg",
                "https://randomuser.me/api/portraits/women/10.jpg",
                "https://randomuser.me/api/portraits/men/11.jpg"
            ]
        },
        status: "Active",
        budget: "4.5K"
    }
];

const AdminPage = () => {
    // State for search and pagination
    const [searchTerm, setSearchTerm] = React.useState("");
    const [currentPage, setCurrentPage] = React.useState(1);    // Function to handle search input changes
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Function to handle page changes
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Search bar */}
                <div className="flex justify-end p-4 border-b border-gray-100">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="py-2 px-4 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[1102px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        User
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Project Name
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Team
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Status
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Budget
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100">
                                {tableData.map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell className="px-5 py-4 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 overflow-hidden rounded-full">
                                                    <Image
                                                        width={40}
                                                        height={40}
                                                        src={order.user.image}
                                                        alt={order.user.name}
                                                    />
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800">
                                                        {order.user.name}
                                                    </span>
                                                    <span className="block text-gray-500 text-sm">
                                                        {order.user.role}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start">
                                            {order.projectName}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start">
                                            <div className="flex -space-x-2">
                                                {order.team.images.map((teamImage, index) => (
                                                    <div
                                                        key={index}
                                                        className="w-6 h-6 overflow-hidden border-2 border-white rounded-full"
                                                    >
                                                        <Image
                                                            width={24}
                                                            height={24}
                                                            src={teamImage}
                                                            alt={`Team member ${index + 1}`}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start">
                                            <Badge
                                                size="sm"
                                                color={
                                                    order.status === "Active"
                                                        ? "success"
                                                        : order.status === "Pending"
                                                            ? "warning"
                                                            : "error"
                                                }
                                            >
                                                {order.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500">
                                            {order.budget}                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-100">
                            <button
                                className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                onClick={() => handlePageChange(currentPage > 1 ? currentPage - 1 : 1)}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                    <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Previous
                            </button>

                            <div className="flex items-center space-x-2">
                                {[1, 2, 3].map((page) => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageChange(page)}
                                        className={`flex items-center justify-center w-10 h-10 rounded-lg ${currentPage === page
                                            ? "bg-blue-500 text-white"
                                            : "text-gray-600 border border-gray-200 hover:bg-gray-50"
                                            }`}
                                    >
                                        {page}
                                    </button>
                                ))}
                            </div>

                            <button
                                className="flex items-center px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
                                onClick={() => handlePageChange(currentPage < 3 ? currentPage + 1 : 3)}
                            >
                                Next
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="ml-2">
                                    <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M12 5L19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;