/**
 * User related type definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserResponse {
  data: User;
  success: boolean;
}

export interface UsersListResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
  success: boolean;
}

export interface UserError {
  message: string;
  field?: string;
}
