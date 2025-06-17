import { useState, useEffect, useCallback } from 'react';
import { userService } from '../api/userService';
import type { User, UsersListResponse } from '../../types/user';

interface UseUsersOptions {
  initialPage?: number;
  initialLimit?: number;
  autoFetch?: boolean;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: Error | null;
  totalUsers: number;
  currentPage: number;
  limit: number;
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
}

/**
 * Custom hook for fetching and managing users data
 */
export function useUsers({
  initialPage = 1,
  initialLimit = 10,
  autoFetch = true
}: UseUsersOptions = {}): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState<Error | null>(null);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (page?: number, newLimit?: number) => {
    const pageToFetch = page || currentPage;
    const limitToFetch = newLimit || limit;
    
    if (page) setCurrentPage(page);
    if (newLimit) setLimit(newLimit);
    
    setLoading(true);
    setError(null);
    
    try {
      const response: UsersListResponse = await userService.getUsers(pageToFetch, limitToFetch);
      setUsers(response.data);
      setTotalUsers(response.total);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch users'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, limit]);

  // Initial fetch
  useEffect(() => {
    if (autoFetch) {
      fetchUsers();
    }
  }, [autoFetch, fetchUsers]);

  const hasNextPage = currentPage * limit < totalUsers;
  const hasPreviousPage = currentPage > 1;

  const goToNextPage = useCallback(async () => {
    if (hasNextPage) {
      await fetchUsers(currentPage + 1);
    }
  }, [currentPage, fetchUsers, hasNextPage]);

  const goToPreviousPage = useCallback(async () => {
    if (hasPreviousPage) {
      await fetchUsers(currentPage - 1);
    }
  }, [currentPage, fetchUsers, hasPreviousPage]);

  return {
    users,
    loading,
    error,
    totalUsers,
    currentPage,
    limit,
    fetchUsers,
    hasNextPage,
    hasPreviousPage,
    goToNextPage,
    goToPreviousPage
  };
}
