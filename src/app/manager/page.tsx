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
import Button from "@/components/ui/button/Button";

// Sample curriculum data based on the image
const tableData = [
    {
        id: 1,
        curriculum: {
            title: "Newton's Laws of Motion",
            description: "Key principles of classical mechanics",
            icon: "📘" // Book icon
        },
        duration: "2 weeks",
        status: "Active"
    },
    {
        id: 2,
        curriculum: {
            title: "Thermodynamics",
            description: "Study of heat and temperature",
            icon: "📐" // Triangle ruler icon
        },
        duration: "3 weeks",
        status: "Active"
    },
    {
        id: 3,
        curriculum: {
            title: "Astrophysics",
            description: "Physics of the universe",
            icon: "🌌" // Galaxy/universe icon
        },
        duration: "4 weeks",
        status: "Active"
    }
];

// Type definition for our curriculum entries
interface CurriculumEntry {
    id: number;
    curriculum: {
        title: string;
        description: string;
        icon: string;
    };
    duration: string;
    status: string;
}

const ContentManagerPage = () => {
    // State for search and pagination
    const [searchTerm, setSearchTerm] = React.useState<string>("");
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    // Function to handle search input changes
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    // Function to handle page changes
    const handlePageChange = (pageNumber: number): void => {
        setCurrentPage(pageNumber);
    };

    // Action handlers for the red buttons
    const handleEdit = (id: number): void => {
        console.log(`Edit item ${id}`);
    };

    const handleDelete = (id: number): void => {
        console.log(`Delete item ${id}`);
    };

    const handleAdd = (): void => {
        console.log("Add new item");
    }; return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center mb-6">
                <button className="mr-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        className="text-gray-700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>
                <h1 className="text-2xl font-bold text-gray-800">Content Manager</h1>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                {/* Search bar */}
                <div className="flex justify-between p-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-800">Physics Curriculum Entries</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="py-2 px-4 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2">
                            <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-gray-400">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="max-w-full overflow-x-auto">
                    <div className="min-w-[800px]">
                        <Table>
                            {/* Table Header */}
                            <TableHeader className="border-b border-gray-100">
                                <TableRow>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Curriculum
                                    </TableCell>
                                    <TableCell
                                        isHeader
                                        className="px-5 py-4 font-medium text-gray-500 text-start"
                                    >
                                        Duration
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
                                        Actions
                                    </TableCell>
                                </TableRow>
                            </TableHeader>

                            {/* Table Body */}
                            <TableBody className="divide-y divide-gray-100">
                                {tableData.map((entry: CurriculumEntry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="px-5 py-4 text-start">
                                            <div className="flex items-center gap-3">
                                                <div className="text-3xl">
                                                    {entry.curriculum.icon}
                                                </div>
                                                <div>
                                                    <span className="block font-medium text-gray-800">
                                                        {entry.curriculum.title}
                                                    </span>
                                                    <span className="block text-gray-500 text-sm">
                                                        {entry.curriculum.description}
                                                    </span>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-gray-500 text-start">
                                            {entry.duration}
                                        </TableCell>
                                        <TableCell className="px-5 py-4 text-start">
                                            <Badge
                                                size="sm"
                                                color={
                                                    entry.status === "Active"
                                                        ? "success"
                                                        : entry.status === "Pending"
                                                            ? "warning"
                                                            : "error"
                                                }
                                            >
                                                {entry.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="px-5 py-4">
                                            <div className="flex space-x-2">
                                                <Button
                                                    onClick={() => handleEdit(entry.id)}
                                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 text-sm rounded"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    onClick={() => handleDelete(entry.id)}
                                                    className="bg-red-500 text-white hover:bg-red-600 px-3 py-1.5 text-sm rounded"
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    onClick={handleAdd}
                                                    className="bg-indigo-600 text-white hover:bg-indigo-700 px-3 py-1.5 text-sm rounded"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </TableCell>
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
                                            ? "bg-indigo-600 text-white"
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

export default ContentManagerPage;