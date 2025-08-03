import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import CreateMatterDialog from '@/components/matter/CreateMatterDialog';
// import UpdateTaskDialog from '@/components/tasks/UpdateTaskDialog';
// import ShowTaskDialog from '@/components/tasks/ShowTaskDialog';
// import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import MatterTable from '@/components/matter/MatterTable';
import createMatter from './helpers/createMatter';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatters from './helpers/getMatters';
// import getMatter from './helpers/getMatter';
// import deleteMatter from './helpers/deleteMatter';
// import updateMatter from './helpers/updateMatter';

const TasksPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: matters, isLoading } = useQuery({
    queryKey: ['matters'],
    queryFn: getMatters,
  });

  //   const { data: matter, isLoading: matterLoading } = useQuery({
  //     queryKey: ['matter', selectedTaskId],
  //     queryFn: () => getMatter(selectedTaskId),
  //     enabled: !!selectedTaskId,
  //   });

  //   const updateMatterMutation = useMutation({
  //     mutationFn: updateMatter,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['matters'] });
  //     },
  //   });

  //   const deleteMatterMutation = useMutation({
  //     mutationFn: deleteMatter,
  //     onSuccess: () => {
  //       setShowDeleteConfirm(false);
  //       queryClient.invalidateQueries({ queryKey: ['matters'] });
  //     },
  //   });

  //   const updateMatterMutation = useMutation({
  //     mutationFn: updateMatter,
  //     onSuccess: () => {
  //       queryClient.invalidateQueries({ queryKey: ['matters'] });
  //     },
  //   });

  const createMatterMutation = useMutation({
    mutationFn: createMatter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
    },
  });

  //   const handleDelete = (id) => {
  //     deleteMatterMutation.mutate({ id });
  //   };

  //   const handleUpdateTaskStatus = (id, status) => {
  //     updateMatterMutation.mutate({ id, status });
  //   };

  const handleCreateMatter = async (data) => {
    setOpen(false);
    console.log(data);
    createMatterMutation.mutate({ data });
  };

  //   const handleUpdateTask = async (id, data) => {
  //     updateMatterMutation.mutate({ id, data });
  //   };

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
        <Button onClick={() => setOpen(true)} className="cursor-pointer">
          Create Matter
        </Button>
      </div>
      <MatterTable
        matters={matters || []}
        onRowClick={(params) => {
          setSelectedTask(params.row);
          setShowViewDialog(true);
        }}
        handleEdit={(matter) => {
          setSelectedTaskId(matter.id);
          setShowUpdateDialog(true);
        }}
        handleDelete={(matter) => {
          setSelectedTask(matter);
          setShowDeleteConfirm(true);
        }}
      />
      {/* <ShowTaskDialog
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        matter={selectedTask}
      /> */}
      <CreateMatterDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateMatter}
      />
      {/* <UpdateTaskDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        matter={matter || {}}
        isLoading
        onSubmit={handleUpdateMatter}
      />
      <DeleteMatterDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        matter={selectedTask}
        onConfirm={handleDelete}
      /> */}
    </div>
  );
};

export default TasksPage;
