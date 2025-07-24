"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table/index";
import Badge from "@/components/ui/badge/Badge";
import { Modal } from "@/components/ui/modal/index";
import Link from "next/link";
import { 
  getAllUsers, 
  deactivateUser,
  type AdminUserData, 
  type UsersQueryParams,
  type PaginatedResponse 
} from "@/lib/api";
import Image from "next/image";

// Remove the local User interface and use AdminUserData from API instead

// Mock data - using AdminUserData structure
const mockUsers: AdminUserData[] = [
  {
    id: "1",
    username: "Admin User",
    email: "admin@phygen.com",
    role: 0, // 0 = Admin
    status: 1, // 1 = Active
    createdAt: "2024-01-15",
    isProvider: false,
    identityId: "1"
  },
  {
    id: "2", 
    username: "Teacher John",
    email: "john@phygen.com",
    role: 1, // 1 = Teacher  
    status: 1, // 1 = Active
    createdAt: "2024-01-20",
    isProvider: false,
    identityId: "2"
  },
  {
    id: "3",
    username: "Student Alice", 
    email: "alice@phygen.com",
    role: 2, // 2 = Student
    status: 0, // 0 = Inactive
    createdAt: "2024-01-25",
    isProvider: false,
    identityId: "3"
  },
  {
    id: "4",
    username: "Student Bob",
    email: "bob@phygen.com", 
    role: 2, // 2 = Student
    status: 1, // 1 = Active
    createdAt: "2024-02-01",
    isProvider: false,
    identityId: "4"
  }
];

const UsersPage = () => {
  // State for users data
  const [users, setUsers] = useState<AdminUserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUserData | null>(null);
  
  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const itemsPerPage = 10;

  // Form state
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: 2, // Student role
    status: 1, // Active status
  });

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getAllUsers({ 
          pageNumber: currentPage, 
          pageSize: itemsPerPage 
        });
        setUsers(response.items.$values || []);
        setTotalPages(response.totalPages);
        setTotalCount(response.totalCount);
      } catch (err) {
        // console.error('❌ Error fetching users:', err);
        setError(err instanceof Error ? err.message : 'Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage]);

  // Filter users based on search term (client-side for now)
  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toString().includes(searchTerm.toLowerCase())
  );

  // Use filtered users for display
  const paginatedUsers = filteredUsers;

  // Function to handle search input changes
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Open modal for create/edit
  const openModal = (user?: AdminUserData) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        role: user.role,
        status: user.status,
      });
    } else {
      setEditingUser(null);
      setFormData({
        username: "",
        email: "",
        role: 2, // Student
        status: 1, // Active
      });
    }
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      username: "",
      email: "",
      role: 2, // Student role (number)
      status: 1, // Active status (number)
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUser) {
      // Update existing user
      setUsers(prev => prev.map(user =>
        user.id === editingUser.id
          ? { 
              ...user, 
              ...formData,
              createdAt: user.createdAt, // Keep existing creation date
              isProvider: user.isProvider, // Keep existing provider status  
              identityId: user.identityId // Keep existing identity ID
            }
          : user
      ));
    } else {
      // Create new user
      const newUser: AdminUserData = {
        id: Date.now().toString(), // Use timestamp as string ID
        ...formData,
        createdAt: new Date().toISOString().split('T')[0],
        isProvider: false,
        identityId: Date.now().toString()
      };
      setUsers(prev => [newUser, ...prev]);
    }
    
    closeModal();
  };

  // Handle delete
  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      setUsers(prev => prev.filter(user => user.id !== id));
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
        <button
          onClick={() => openModal()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Thêm người dùng mới
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Tìm kiếm người dùng..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-3 text-gray-600">Loading users...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-white rounded-lg shadow p-8">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading users</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Người dùng
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vai trò
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Trạng thái
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đăng nhập cuối
              </TableCell>
              <TableCell isHeader={true} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thao tác
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody>
            {paginatedUsers.map((user, index) => (
              <TableRow key={user.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {user.username?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {user.username}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  {user.email}
                </TableCell>
                <TableCell className="px-6 py-4 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.role === 1 
                      ? "bg-purple-100 text-purple-800"
                      : user.role === 0
                      ? "bg-yellow-100 text-yellow-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {user.role === 1 ? "Quản trị viên" : user.role === 0 ? "Giáo viên" : "Học sinh"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 1
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status === 1 ? "Hoạt động" : "Không hoạt động"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(user)}
                      className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors text-xs"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors text-xs"
                    >
                      Xóa
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
      )}

      {/* Create/Edit User Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} showCloseButton={false}>
        <div className="bg-white rounded-lg w-full max-w-md mx-auto">
          {/* Modal Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingUser ? "Sửa người dùng" : "Thêm người dùng mới"}
            </h3>
            <button
              onClick={closeModal}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
          
          {/* Modal Body */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập họ và tên..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Nhập email..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò *
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái *
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="Active">Hoạt động</option>
                  <option value="Inactive">Không hoạt động</option>
                </select>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {editingUser ? "Cập nhật" : "Thêm mới"}
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default UsersPage;
