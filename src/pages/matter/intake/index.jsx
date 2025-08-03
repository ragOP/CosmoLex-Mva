import React, { useEffect, useState } from 'react';
import Button from '@/components/Button';
import CreateMatterDialog from '@/components/matter/CreateMatterDialog';
import UpdateMatterDialog from '@/components/matter/UpdateMatterDialog';
import ShowMatterDialog from '@/components/matter/ShowMatterDialog';
// import DeleteTaskDialog from '@/components/tasks/DeleteTaskDialog';
import MatterTable from '@/components/matter/MatterTable';
import createMatter from './helpers/createMatter';
import { Loader2 } from 'lucide-react';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import getMatters from './helpers/getMatters';
import getMatter from './helpers/getMatter';
// import deleteMatter from './helpers/deleteMatter';
import updateMatter from './helpers/updateMatter';

const TasksPage = () => {
  const [open, setOpen] = useState(false);
  const [selectedMatter, setSelectedMatter] = useState(null);
  const [selectedMatterSlug, setSelectedMatterSlug] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: matters, isLoading } = useQuery({
    queryKey: ['matters'],
    queryFn: getMatters,
  });

  const { data: matter, isLoading: matterLoading } = useQuery({
    queryKey: ['matter', selectedMatterSlug],
    queryFn: () => getMatter({ slug: selectedMatterSlug }),
    enabled: !!selectedMatterSlug,
    onSuccess: (data) => setSelectedMatter(data),
  });

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

  const updateMatterMutation = useMutation({
    mutationFn: updateMatter,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matters'] });
    },
  });

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

  const handleUpdateMatter = async (slug, data) => {
    console.log(slug, data);
    updateMatterMutation.mutate({ slug, data });
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
        <Button onClick={() => setOpen(true)} className="cursor-pointer">
          Create Matter
        </Button>
      </div>
      <MatterTable
        matters={matters || []}
        onRowClick={(params) => {
          setSelectedMatterSlug(params.row.slug);
          setShowViewDialog(true);
        }}
        handleEdit={(matter) => {
          setSelectedMatterSlug(matter.slug);
          setShowUpdateDialog(true);
        }}
        handleDelete={(matter) => {
          setSelectedMatter(matter);
          setShowDeleteConfirm(true);
        }}
      />
      <ShowMatterDialog
        open={showViewDialog}
        onClose={() => setShowViewDialog(false)}
        matter={matter}
      />
      <CreateMatterDialog
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleCreateMatter}
      />
      <UpdateMatterDialog
        open={showUpdateDialog}
        onClose={() => setShowUpdateDialog(false)}
        onSubmit={handleUpdateMatter}
        slug={selectedMatterSlug}
      />
      {/* <DeleteMatterDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        matter={selectedMatter}
        onConfirm={handleDelete}
      /> */}
    </div>
  );
};

export default TasksPage;
