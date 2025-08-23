import React, { useState } from 'react';
import Button from '@/components/Button';
import ContactDialog from '@/components/contact/components/ContactDialog';
// import ShowContactDialog from '@/components/contact/components/ShowContactDialog';
import DeleteContactDialog from '@/components/contact/components/DeleteContactDialog';
import ContactTable from '@/components/contact/components/ContactTable';
import { Loader2, Plus } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';
import { useContact } from '@/components/contact/hooks/useContact';

const ContactPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);

  // Get matter slug from URL params (assuming notes are matter-specific)
  const matterSlug = searchParams.get('slugId');

  let matter = null;
  if (matterSlug) {
    matter = useMatter();
  }

  const { contacts, contactsLoading, handleDeleteContact, isDeleting } =
    useContact();

  const handleNavigate = (contactId) => {
    if (matterSlug) {
      if (contactId) {
        navigate(
          `/dashboard/inbox/contacts?slugId=${matterSlug}&contactId=${contactId}`,
          {
            replace: false,
          }
        );
      } else {
        navigate(`/dashboard/inbox/contacts?slugId=${matterSlug}`, {
          replace: false,
        });
      }
    } else {
      if (contactId) {
        navigate(`/dashboard/contacts?contactId=${contactId}`, {
          replace: false,
        });
      } else {
        navigate(`/dashboard/contacts`, {
          replace: false,
        });
      }
    }
  };

  if (contactsLoading) {
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
          setSelectedContactId(params.row.id);
          setSelectedContact(params.row);
          setShowViewDialog(true);
        }}
        handleEdit={(contact) => {
          handleNavigate(contact.id);
          setSelectedContactId(contact.id);
          setSelectedContact(contact);
          setShowUpdateDialog(true);
        }}
        handleDelete={(contact) => {
          setSelectedContact(contact);
          setShowDeleteConfirm(true);
        }}
      />

      <ContactDialog
        open={open}
        setOpen={setOpen}
        contact={selectedContact}
        mode="create"
      />

      <ContactDialog
        open={showUpdateDialog}
        setOpen={setShowUpdateDialog}
        contact={selectedContact}
        mode="update"
      />

      {/* Delete */}
      <DeleteContactDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        contact={selectedContact}
        onConfirm={() => {
          handleDeleteContact(selectedContact?.id);
          setShowDeleteConfirm(false);
          handleNavigate(null);
        }}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default ContactPage;
