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
  deleteReminder,
  getCommentMeta,
  getAllComments,
  createComment,
  uploadCommentAttachment,
} from '@/api/api_services/task';
import { toast } from 'sonner';

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
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task created successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to create task');
    },
  });

  // Update
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, taskData }) => updateTask(taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update task');
    },
  });

  // Update status
  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status_id }) => updateTaskStatus(taskId, status_id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task status updated successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to update task status');
    },
  });

  // Delete
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId) => deleteTask(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      toast.success('Task deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete task');
    },
  });

  // Upload file
  const uploadFileMutation = useMutation({
    mutationFn: (fileData) => uploadTaskFile(fileData),
    onSuccess: () => {
      if (selectedTask)
        queryClient.invalidateQueries(['tasks', selectedTask.id]);
      toast.success('File uploaded successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to upload file');
    },
  });

  // Delete file
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteTaskFile(fileId),
    onSuccess: () => {
      if (selectedTask)
        queryClient.invalidateQueries(['tasks', selectedTask.id]);
      toast.success('File deleted successfully');
    },
    onError: (error) => {
      toast.error(error?.message || 'Failed to delete file');
    },
  });

  const deleteReminderMutation = useMutation({
    mutationFn: (reminderId) => deleteReminder(reminderId),
    onSuccess: () => {
      toast.success('Reminder deleted successfully');
      queryClient.invalidateQueries(['tasks']);
    },
    onError: (error) =>
      toast.error(error?.message || 'Failed to delete reminder'),
  });

  // Get comment meta
  const { data: commentMeta = [], isLoading: commentMetaLoading } = useQuery({
    queryKey: ['commentMeta'],
    queryFn: getCommentMeta,
    staleTime: 5 * 60 * 1000,
  });

  // Get all Comments
  const { data: comments = [], isLoading: commentsLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: () => getAllComments(taskId),
    staleTime: 5 * 60 * 1000,
  });

  // Create comment
  const createCommentMutation = useMutation({
    mutationFn: (commentData) => {
      console.log('commentData', commentData);
      console.log('taskId', taskId);
      createComment({ commentData, task_id: taskId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
      toast.success('Comment created successfully');
    },
    onError: (error) =>
      toast.error(error?.message || 'Failed to create comment'),
  });

  // Upload comment attachment
  const uploadCommentAttachmentMutation = useMutation({
    mutationFn: (attachmentData) => uploadCommentAttachment(attachmentData),
    onSuccess: () => {
      queryClient.invalidateQueries(['comments']);
      toast.success('Attachment uploaded successfully');
    },
    onError: (error) =>
      toast.error(error?.message || 'Failed to upload attachment'),
  });

  const handleCreateComment = useCallback(
    (commentData) => {
      console.log('commentData', commentData);
      createCommentMutation.mutateAsync(commentData);
    },
    [createCommentMutation]
  );

  const handleUploadCommentAttachment = useCallback(
    (attachmentData) => {
      uploadCommentAttachmentMutation.mutateAsync(attachmentData);
    },
    [uploadCommentAttachmentMutation]
  );

  const handleSearchTask = useCallback(
    (searchBar, contact_type_id) => {
      searchTasksMutation.mutateAsync({
        searchBar,
        contact_type_id,
      });
    },
    [searchTasksMutation]
  );

  const handleDeleteReminder = useCallback(
    (reminderId) => {
      deleteReminderMutation.mutateAsync(reminderId);
    },
    [deleteReminderMutation]
  );

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
    comments,
    commentMeta,

    // Loading
    tasksMetaLoading,
    tasksLoading,
    taskLoading,
    commentMetaLoading,
    commentsLoading,

    // Actions
    navigateToTask,
    navigateBack,
    navigateToRoot,
    handleSearchTask,
    handleDeleteReminder,
    handleCreateComment,
    handleUploadCommentAttachment,

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
    isUpdatingStatus: updateStatusMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
    isUploadingFile: uploadFileMutation.isPending,
    isDeletingFile: deleteFileMutation.isPending,
    isDeletingReminder: deleteReminderMutation.isPending,
    isCreatingComment: createCommentMutation.isPending,
    isUploadingCommentAttachment: uploadCommentAttachmentMutation.isPending,
  };
};
