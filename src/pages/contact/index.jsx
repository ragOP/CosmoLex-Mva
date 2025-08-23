import React, { useState } from 'react';
import Button from '@/components/Button';
// import ContactDialog from '@/components/contact/components/ContactDialog';
// import ShowContactDialog from '@/components/contact/components/ShowContactDialog';
// import DeleteContactDialog from '@/components/contact/components/DeleteContactDialog';
import ContactTable from '@/components/contact/components/ContactTable';
import { Loader2, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';
import { useContacts } from '@/components/contact/hooks/useContacts';

const ContactPage = () => {
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

  const { contacts, contactsLoading } = useContacts();

  console.log('contacts >>>', contacts);
  console.log('contactsLoading >>>', contactsLoading);

  // Handlers
  //   const handleDelete = (id) => {
  //     deleteTask(id).then(() => setShowDeleteConfirm(false));
  //   };

  //   const handleUpdateTaskStatus = (id, status) =>
  //     updateStatus({ taskId: id, status_id: parseInt(status) });

  //   const handleNavigate = (taskId) => {
  //     if (matterSlug) {
  //       if (taskId) {
  //         navigate(
  //           `/dashboard/inbox/tasks?slugId=${matterSlug}&taskId=${taskId}`,
  //           {
  //             replace: false,
  //           }
  //         );
  //       } else {
  //         navigate(`/dashboard/inbox/tasks?slugId=${matterSlug}`, {
  //           replace: false,
  //         });
  //       }
  //     } else {
  //       if (taskId) {
  //         navigate(`/dashboard/tasks?taskId=${taskId}`, {
  //           replace: false,
  //         });
  //       } else {
  //         navigate(`/dashboard/tasks`, {
  //           replace: false,
  //         });
  //       }
  //     }
  //   };

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
        <p className="text-2xl font-bold">Contacts ({contacts?.length || 0})</p>
        <Button
          onClick={() => setOpen(true)}
          className="cursor-pointer max-w-48"
          icon={Plus}
          iconPosition="left"
        >
          Create Contact
        </Button>
      </div>

      <ContactTable
        contacts={contacts || []}
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
      {/* <ShowContactDialog
        open={showViewDialog}
        onClose={() => {
          // remove taskId from url params
          handleNavigate(null);
          setShowViewDialog(false);
        }}
      />

      <TaskDialog open={open} onClose={() => setOpen(false)} mode="create" />

      <TaskDialog
        open={showUpdateDialog}
        onClose={() => {
          setShowUpdateDialog(false);
          handleNavigate(null);
        }}
        task={selectedTask}
        mode="update"
      /> */}

      {/* Delete */}
      {/* <DeleteTaskDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        task={selectedTask}
        onConfirm={() => handleDelete(selectedTask?.id)}
        isDeleting={isDeleting}
      /> */}
    </div>
  );
};

export default ContactPage;
