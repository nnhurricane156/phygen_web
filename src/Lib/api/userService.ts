import { apiClient } from './apiClient';
import type { User, UserResponse, UsersListResponse } from '../../types/user';

/**
 * User API service - handles all user-related API calls
 */
export const userService = {
  /**
   * Get a list of users with optional pagination
   */
  getUsers: async (page = 1, limit = 10): Promise<UsersListResponse> => {
    return apiClient.get<UsersListResponse>('/users', {
      params: {
        page: page.toString(),
        limit: limit.toString()
      }
    });
  },

  /**
   * Get a single user by ID
   */
  getUserById: async (id: string): Promise<UserResponse> => {
    return apiClient.get<UserResponse>(`/users/${id}`);
  },

  /**
   * Create a new user
   */
  createUser: async (userData: Omit<User, 'id'>): Promise<UserResponse> => {
    return apiClient.post<UserResponse>('/users', userData);
  },

  /**
   * Update an existing user
   */
  updateUser: async (id: string, userData: Partial<User>): Promise<UserResponse> => {
    return apiClient.put<UserResponse>(`/users/${id}`, userData);
  },

  /**
   * Delete a user
   */
  deleteUser: async (id: string): Promise<void> => {
    return apiClient.delete<void>(`/users/${id}`);
  }
};

export default userService;
