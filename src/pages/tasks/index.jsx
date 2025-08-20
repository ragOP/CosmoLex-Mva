import React, { useState } from 'react';
import Button from '@/components/Button';
import TaskDialog from '@/components/dialogs/TaskDialog';
import ShowTaskDialog from '@/components/tasks/ShowTaskDialog';
import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import TaskTable from '@/components/tasks/TaskTable';
import { Loader2, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import { useMatter } from '@/components/inbox/MatterContext';

const TasksPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Get matter slug from URL params (assuming notes are matter-specific)
  const matterSlug = searchParams.get('slugId');

  let matter = null;
  if (matterSlug) {
    matter = useMatter();
  }
  const {
    tasks,
    tasksLoading,
    createTask,
    updateTask,
    updateStatus,
    deleteTask,
  } = useTasks();

  // Handlers
  const handleDelete = (id) => {
    deleteTask(id).then(() => setShowDeleteConfirm(false));
  };

  const handleUpdateTaskStatus = (id, status) => {
    console.log('id', id);
    console.log('status', status);
    updateStatus({ taskId: id, status_id: parseInt(status) });
  };

  const handleCreateTask = async (data) => {
    console.log('data', data);
    setOpen(false);
    await createTask(data);
  };

  const handleUpdateTask = async ({ id, data }) => {
    const newData = {
      ...data,
      contact_id: matter?.contact_id,
      slug: matterSlug,
    };
    await updateTask({ taskId: id, taskData: newData });
    setShowUpdateDialog(false);
  };

  const handleNavigate = (taskId) => {
    if (matterSlug) {
      if (taskId) {
        navigate(
          `/dashboard/inbox/tasks?slugId=${matterSlug}&taskId=${taskId}`,
          {
            replace: false,
          }
        );
      } else {
        navigate(`/dashboard/inbox/tasks?slugId=${matterSlug}`, {
          replace: false,
        });
      }
    } else {
      if (taskId) {
        navigate(`/dashboard/tasks?taskId=${taskId}`, {
          replace: false,
        });
      } else {
        navigate(`/dashboard/tasks`, {
          replace: false,
        });
      }
    }
  };

  if (tasksLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-12 h-12 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 h-full w-full p-4">
      <div className="flex justify-between w-full items-center">
        <p className="text-2xl font-bold">Tasks ({tasks?.length || 0})</p>
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer max-w-48"
          icon={Plus}
          iconPosition="left"
        >
          Create Task
        </Button>
      </div>

      <TaskTable
        tasks={tasks || []}
        handleUpdateTaskStatus={handleUpdateTaskStatus}
        onRowClick={(params) => {
          // append taskId to url params
          handleNavigate(params.row.id);
          setSelectedTaskId(params.row.id);
          setSelectedTask(params.row);
          setShowViewDialog(true);
        }}
        handleEdit={(task) => {
          handleNavigate(task.id);
          setSelectedTaskId(task.id);
          setSelectedTask(task);
          setShowUpdateDialog(true);
        }}
        handleDelete={(task) => {
          setSelectedTask(task);
          setShowDeleteConfirm(true);
        }}
      />

      {/* View */}
      <ShowTaskDialog
        open={showViewDialog}
        onClose={() => {
          // remove taskId from url params
          handleNavigate(null);
          setShowViewDialog(false);
        }}
      />

      <TaskDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateTask}
        mode="create"
      />

      <TaskDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        onSubmit={handleUpdateTask}
        // task={selectedTask}
        mode="update"
      />

      {/* Delete */}
      <DeleteTaskDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        task={selectedTask}
        onConfirm={() => handleDelete(selectedTask?.id)}
      />
    </div>
  );
};

export default TasksPage;
