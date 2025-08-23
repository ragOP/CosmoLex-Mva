import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getUsersMeta,
  getUsers,
  getUserById,
  searchUser,
  createUser,
  updateUser,
  deleteUser,
} from '@/api/api_services/user';
import { toast } from 'sonner';

export const useUsers = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract userId from URL
  const userId = searchParams.get('userId');

  // Users meta
  const { data: usersMeta = {}, isLoading: usersMetaLoading } = useQuery({
    queryKey: ['usersMeta'],
    queryFn: getUsersMeta,
    staleTime: 5 * 60 * 1000,
  });

  // All users
  const { data: usersData = {}, isLoading: usersLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsers(),
    staleTime: 5 * 60 * 1000,
  });

  // Extract users array from API response
  const users = usersData?.data || [];

  // Single user
  const { data: userData = {}, isLoading: userLoading } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });

  // Extract user from API response
  const user = userData?.data || {};

  // Fetch user by ID function for view dialog
  const fetchUserMutation = useMutation({
    mutationFn: (userId) => getUserById(userId),
  });

  // Search users
  const searchUsersMutation = useMutation({
    mutationFn: (searchData) => searchUser(searchData),
  });

  // Create user
  const createUserMutation = useMutation({
    mutationFn: (userData) => createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User created successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create user');
    },
  });

  // Update user
  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) => updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      queryClient.invalidateQueries(['user', userId]);
      toast.success('User updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update user');
    },
  });

  // Delete user
  const deleteUserMutation = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['users']);
      toast.success('User deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete user');
    },
  });

  // Navigation helpers
  const navigateToUser = useCallback((userObj) => {
    setSelectedUser(userObj);
  }, []);

  const navigateToRoot = useCallback(() => {
    setSelectedUser(null);
  }, []);

  return {
    // Data
    usersMeta,
    users,
    user,
    selectedUser,

    // Loading states
    usersMetaLoading,
    usersLoading,
    userLoading,

    // Actions
    navigateToUser,
    navigateToRoot,

    // Mutations
    fetchUser: fetchUserMutation.mutateAsync,
    searchUsers: searchUsersMutation.mutateAsync,
    createUser: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,

    // Mutation states
    isFetchingUser: fetchUserMutation.isPending,
    isCreating: createUserMutation.isPending,
    isUpdating: updateUserMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
    isSearching: searchUsersMutation.isPending,
  };
};
