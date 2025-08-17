import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import {
  getTaskMeta,
  getTasks,
  getTaskById,
  searchTask,
  filterTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  uploadTaskFile,
  deleteTaskFile,
} from '@/api/api_services/task';

export const useTasks = () => {
  const [currentPath, setCurrentPath] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Extract taskId from URL
  const taskId = searchParams.get('taskId');

  // Task meta
  const { data: tasksMeta = [], isLoading: tasksMetaLoading } = useQuery({
    queryKey: ['tasksMeta'],
    queryFn: getTaskMeta,
    staleTime: 5 * 60 * 1000,
  });

  // All tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => getTasks(),
    staleTime: 5 * 60 * 1000,
  });

  // Single task
  const { data: task = {}, isLoading: taskLoading } = useQuery({
    queryKey: ['task', taskId],
    queryFn: () => getTaskById(taskId),
    staleTime: 5 * 60 * 1000,
  });

  // Search tasks
  const searchTasksMutation = useMutation({
    mutationFn: (searchData) => searchTask(searchData),
  });

  // Filter tasks
  const filterTasksMutation = useMutation({
    mutationFn: (queryParams) => filterTask(queryParams),
  });

  // Create
  const createTaskMutation = useMutation({
    mutationFn: (taskData) => createTask(taskData),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  // Update
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => updateTask(taskId, taskData),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status_id }) => updateTaskStatus(taskId, status_id),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  // Delete
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => queryClient.invalidateQueries(['tasks']),
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: (fileData) => uploadTaskFile(fileData),
    onSuccess: () => {
      if (selectedTask)
        queryClient.invalidateQueries(['tasks', selectedTask.id]);
    },
  });

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteTaskFile(fileId),
    onSuccess: () => {
      if (selectedTask)
        queryClient.invalidateQueries(['tasks', selectedTask.id]);
    },
  });

  // Navigation (optional – mimic folder-style nav)
  const navigateToTask = useCallback((task) => {
    setSelectedTask(task);
    setCurrentPath((prev) => [...prev, task]);
  }, []);

  const navigateBack = useCallback(() => {
    if (currentPath.length > 0) {
      const newPath = currentPath.slice(0, -1);
      setCurrentPath(newPath);

      if (newPath.length > 0) {
        setSelectedTask(newPath[newPath.length - 1]);
      } else {
        setSelectedTask(null);
      }
    }
  }, [currentPath]);

  const navigateToRoot = useCallback(() => {
    setCurrentPath([]);
    setSelectedTask(null);
  }, []);

  return {
    // State
    tasksMeta,
    tasks,
    task,
    selectedTask,
    currentPath,

    // Loading
    tasksMetaLoading,
    tasksLoading,
    taskLoading,

    // Actions
    navigateToTask,
    navigateBack,
    navigateToRoot,

    // Mutations
    searchTasks: searchTasksMutation.mutateAsync,
    filterTasks: filterTasksMutation.mutateAsync,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
    uploadTaskFile: uploadFileMutation.mutateAsync,
    deleteTaskFile: deleteFileMutation.mutateAsync,

    // States
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isDeletingFile: deleteFileMutation.isPending,
  };
};
