"use client";

import ProtectedRoute, { USER_ROLES } from "@/components/auth/ProtectedRoute";
import { useAuth } from "@/context/AuthContext";
import { httpClient } from "@/lib/http-client";
import { useState, useEffect } from "react";

interface User {
    id: string;
    username: string;
    email: string;
    role: number;
    status: string;
    createdAt: string;
}

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            // Example: Fetch users from your API using the authenticated HTTP client
            // const response = await httpClient.get<User[]>('/users');
            // setUsers(response);
            
            // For demo purposes, using mock data
            const mockUsers: User[] = [
                {
                    id: "1",
                    username: "adminuser",
                    email: "admin@example.com",
                    role: 1,
                    status: "Active",
                    createdAt: "2024-01-01"
                },
                {
                    id: "2", 
                    username: "testuser",
                    email: "user@example.com",
                    role: 2,
                    status: "Active",
                    createdAt: "2024-01-02"
                }
            ];
            setUsers(mockUsers);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch users');
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = (role: number) => {
        switch (role) {
            case 1: return "Admin";
            case 2: return "User";
            case 3: return "Manager";
            default: return "Unknown";
        }
    };

    return (
        <ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]}>
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-white rounded-lg shadow">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h1 className="text-2xl font-semibold text-gray-900">
                                User Management
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Manage users in your system. Welcome, {user?.username}!
                            </p>
                        </div>
                        
                        <div className="p-6">
                            {loading ? (
                                <div className="flex justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                </div>
                            ) : error ? (
                                <div className="text-red-600 text-center py-8">
                                    Error: {error}
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    User
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map((user) => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">
                                                                {user.username}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {user.email}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                            user.role === 1 ? 'bg-red-100 text-red-800' :
                                                            user.role === 2 ? 'bg-blue-100 text-blue-800' :
                                                            'bg-green-100 text-green-800'
                                                        }`}>
                                                            {getRoleName(user.role)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {user.createdAt}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">
                                                            Edit
                                                        </button>
                                                        <button className="text-red-600 hover:text-red-900">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Demo section showing how to make authenticated API calls */}
                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                            API Demo
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            This page demonstrates how to make authenticated API calls with automatic token attachment.
                        </p>
                        <button
                            onClick={() => {
                                // Example of making an authenticated API call
                                httpClient.get('/users')
                                    .then(data => console.log('API Response:', data))
                                    .catch(err => console.error('API Error:', err));
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Test Authenticated API Call
                        </button>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
