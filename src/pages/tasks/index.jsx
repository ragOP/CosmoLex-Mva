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
  // Comment dialog removed

  // Get matter slug from URL params (assuming notes are matter-specific)
  const matterSlug = searchParams.get('slugId');

  // Only call useMatter if slugId exists to prevent unnecessary API calls
  const matter = matterSlug ? useMatter() : null;
  const {
    tasks,
    tasksMeta,
    tasksLoading,
    updateStatus,
    deleteTask,
    isDeleting,
  } = useTasks();

  // Handlers
  const handleDelete = (id) => {
    deleteTask(id).then(() => setShowDeleteConfirm(false));
  };

  const handleUpdateTaskStatus = (id, status) =>
    updateStatus({ taskId: id, status_id: parseInt(status) });

  const handleCommentClick = (task) => {
    // Navigate to comments page with taskId (and slugId if present)
    if (matterSlug) {
      navigate(
        `/dashboard/inbox/tasks/comments?slugId=${matterSlug}&taskId=${task.id}`,
        { replace: false }
      );
    } else {
      navigate(`/dashboard/tasks/comments?taskId=${task.id}`, {
        replace: false,
      });
    }
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
    <div className="flex flex-col gap-4 h-full w-full overflow-auto">
      <div className="flex justify-between w-full items-center px-4 pt-4">
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
        tasksMeta={tasksMeta || []}
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
        handleCommentClick={handleCommentClick}
      />

      {/* View */}
      {showViewDialog && (
        <ShowTaskDialog
          open={showViewDialog}
          onClose={() => {
            // remove taskId from url params
            handleNavigate(null);
            setShowViewDialog(false);
          }}
        />
      )}

      {open && (
        <TaskDialog open={open} onClose={() => setOpen(false)} mode="create" />
      )}

      {showUpdateDialog && (
        <TaskDialog
          open={showUpdateDialog}
          onClose={() => {
            setShowUpdateDialog(false);
            handleNavigate(null);
          }}
          task={selectedTask}
          mode="update"
        />
      )}

      {/* Delete */}
      {showDeleteConfirm && (
        <DeleteTaskDialog
          open={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          task={selectedTask}
          onConfirm={() => handleDelete(selectedTask?.id)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default TasksPage;
