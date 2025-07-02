"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import Image from "next/image";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "Active" | "Inactive";
  image: string;
  lastLogin: string;
}

const usersData: User[] = [
  {
    id: 1,
    name: "Lindsey Curtis",
    email: "lindsey@example.com",
    role: "Admin",
    status: "Active",
    image: "/images/user/user-01.jpg",
    lastLogin: "2023-06-15 09:43",
  },
  {
    id: 2,
    name: "Kaiya George",
    email: "kaiya@example.com",
    role: "Editor",
    status: "Active",
    image: "/images/user/user-02.jpg",
    lastLogin: "2023-06-14 15:20",
  },
  {
    id: 3,
    name: "Zain Geidt",
    email: "zain@example.com",
    role: "Author",
    status: "Inactive",
    image: "/images/user/user-03.jpg",
    lastLogin: "2023-06-10 11:35",
  },
  {
    id: 4,
    name: "Abram Schleifer",
    email: "abram@example.com",
    role: "Author",
    status: "Active",
    image: "/images/user/user-04.jpg",
    lastLogin: "2023-06-14 08:15",
  },
  {
    id: 5,
    name: "Carla George",
    email: "carla@example.com",
    role: "Editor",
    status: "Active",
    image: "/images/user/user-05.jpg",
    lastLogin: "2023-06-15 14:22",
  },
];

const UsersPage = () => {
  // State for search and pagination
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);

  // Function to handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Function to handle page changes
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="space-y-6 bg-[#0f172a] min-h-screen p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-white">Users</h1>

        <div className="relative">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={handleSearch}
            className="py-2 px-4 pl-10 rounded-md border border-gray-700 bg-[#1e293b] text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 w-72"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="text-gray-400"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-md bg-[#0f172a] border border-gray-800">
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <h2 className="text-lg font-semibold text-white">Users</h2>
          <button className="flex items-center gap-2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 5V19M5 12H19"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Add User
          </button>
        </div>

        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="bg-[#0f172a]">
                <TableRow>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    User
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    Email
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    Role
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    Status
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    Last Login
                  </TableCell>
                  <TableCell
                    isHeader
                    className="px-5 py-4 font-medium text-gray-400 text-start"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="bg-[#0f172a]">
                {usersData.map((user) => (
                  <TableRow
                    key={user.id}
                    className="border-b border-gray-800 hover:bg-[#1e293b]"
                  >
                    <TableCell className="px-5 py-4 text-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 overflow-hidden rounded-full">
                          <Image
                            width={40}
                            height={40}
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-white">
                          {user.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-300 text-start">
                      {user.email}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-300 text-start">
                      {user.role}
                    </TableCell>
                    <TableCell className="px-5 py-4 text-start">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "Active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-gray-300">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="px-5 py-4">
                      <div className="flex space-x-2">
                        <button className="p-1.5 text-blue-400 rounded-md hover:bg-[#1e293b]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M13.75 4.375L16.25 6.875L13.75 4.375ZM5 15H2.5V12.5L11.875 3.125C12.0408 2.95924 12.2704 2.86377 12.5 2.86377C12.7296 2.86377 12.9592 2.95924 13.125 3.125L16.875 6.875C17.0408 7.04076 17.1362 7.27038 17.1362 7.5C17.1362 7.72962 17.0408 7.95924 16.875 8.125L7.5 17.5H5V15Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                        <button className="p-1.5 text-red-400 rounded-md hover:bg-[#1e293b]">
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M16.875 4.375L3.125 4.375"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M8.125 8.125V13.125"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M11.875 8.125V13.125"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M15.625 4.375V16.25C15.625 16.4158 15.5592 16.5747 15.4419 16.6919C15.3247 16.8092 15.1658 16.875 15 16.875H5C4.83424 16.875 4.67527 16.8092 4.55806 16.6919C4.44085 16.5747 4.375 16.4158 4.375 16.25V4.375"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M13.125 4.375V3.125C13.125 2.79348 12.9933 2.47554 12.7589 2.24112C12.5245 2.0067 12.2065 1.875 11.875 1.875H8.125C7.79348 1.875 7.47554 2.0067 7.24112 2.24112C7.0067 2.47554 6.875 2.79348 6.875 3.125V4.375"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-800 bg-[#0f172a]">
              <button
                className="flex items-center px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-md hover:bg-[#1e293b] transition-colors"
                onClick={() =>
                  handlePageChange(currentPage > 1 ? currentPage - 1 : 1)
                }
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2"
                >
                  <path
                    d="M19 12H5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 19L5 12L12 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Previous
              </button>

              <div className="flex items-center space-x-2">
                {[1, 2, 3].map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`flex items-center justify-center w-9 h-9 rounded-md ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 border border-gray-700 hover:bg-[#1e293b]"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className="flex items-center px-4 py-2 text-sm text-gray-300 border border-gray-700 rounded-md hover:bg-[#1e293b] transition-colors"
                onClick={() =>
                  handlePageChange(currentPage < 3 ? currentPage + 1 : 3)
                }
              >
                Next
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="ml-2"
                >
                  <path
                    d="M5 12H19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 5L19 12L12 19"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersPage;
