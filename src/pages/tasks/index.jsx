import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import UpdateTaskDialog from '@/components/tasks/UpdateTaskDialog';
import ShowTaskDialog from '@/components/tasks/ShowTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import TaskTable from '@/components/tasks/TaskTable';
import createTask from './helpers/createTask';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getTasks from './helpers/getTasks';
import getTask from './helpers/getTask';
import updateTaskStatus from './helpers/updateTaskStatus';
import deleteTask from './helpers/deleteTask';
import updateTask from './helpers/updateTask';

const TasksPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks,
  });

  const { data: task, isLoading: taskLoading } = useQuery({
    queryKey: ['task', selectedTaskId],
    queryFn: () => getTask(selectedTaskId),
    enabled: !!selectedTaskId,
  });

  const updateTaskStatusMutation = useMutation({
    mutationFn: updateTaskStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      setShowDeleteConfirm(false);
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  const handleDelete = (id) => {
    deleteTaskMutation.mutate({ id });
  };

  const handleUpdateTaskStatus = (id, status) => {
    updateTaskStatusMutation.mutate({ id, status });
  };

  const handleCreateTask = async (data) => {
    setOpen(false);
    createTaskMutation.mutate(data);
  };

  const handleUpdateTask = async (id, data) => {
    updateTaskMutation.mutate({ id, data });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full">
      <div className="flex justify-end w-[10%]">
        <Button onClick={() => setOpen(true)}>Create Task</Button>
      </div>
      <TaskTable
        tasks={tasks?.tasks || []}
        handleUpdateTaskStatus={handleUpdateTaskStatus}
        onRowClick={(params) => {
          setSelectedTask(params.row);
          setShowViewDialog(true);
        }}
        handleEdit={(task) => {
          setSelectedTaskId(task.id);
          setShowUpdateDialog(true);
        }}
        handleDelete={(task) => {
          setSelectedTask(task);
          setShowDeleteConfirm(true);
        }}
      />
      <ShowTaskDialog
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        task={selectedTask}
      />
      <CreateTaskDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTask}
      />
      <UpdateTaskDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        task={task || {}}
        isLoading
        onSubmit={handleUpdateTask}
      />
      <DeleteTaskDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        task={selectedTask}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default TasksPage;
