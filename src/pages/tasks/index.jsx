import React, { useState } from 'react';
import Button from '@/components/Button';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import UpdateTaskDialog from '@/components/tasks/UpdateTaskDialog';
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

  console.log('matterSlug >>>>', matterSlug);

  const { matter } = useMatter();

  // console.log('matter >>>>', matter);

  // ✅ use custom hook
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
    updateStatus({ taskId: id, status });
  };

  const handleCreateTask = async (data) => {
    const newData = {
      ...data,
      contact_id: matter?.contact_id,
      slug: matterSlug,
    };
    setOpen(false);
    await createTask(newData);
  };

  const handleUpdateTask = async (id, data) => {
    const newData = {
      ...data,
      contact_id: matter?.contact_id,
      slug: matterSlug,
    };
    console.log('newData >>>>', newData);
    await updateTask({ taskId: id, taskData: newData });
    setShowUpdateDialog(false);
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
        <p className="text-2xl font-bold">Showing {tasks?.length || 0} tasks</p>
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
          navigate(
            `/dashboard/inbox/tasks?slugId=${matterSlug}&taskId=${params.row.id}`,
            {
              replace: false,
            }
          );
          setSelectedTaskId(params.row.id);
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

      {/* View */}
      <ShowTaskDialog
        open={showViewDialog}
        onClose={() => {
          // remove taskId from url params
          navigate(`/dashboard/inbox/tasks?slugId=${matterSlug}`);
          setShowViewDialog(false);
        }}
      />

      {/* Create */}
      <CreateTaskDialog
        open={open}
        task={selectedTask}
        onClose={() => setOpen(false)}
        handleCreateTask={handleCreateTask}
      />

      {/* Update */}
      <UpdateTaskDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        // task={tasks?.find((t) => t.id === selectedTaskId) || {}}
        isLoading={false}
        onSubmit={handleUpdateTask}
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
