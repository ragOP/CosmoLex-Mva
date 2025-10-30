import React, { useState } from 'react';
import Button from '@/components/Button';
import ContactDialog from '@/components/contact/components/ContactDialog';
// import ShowContactDialog from '@/components/contact/components/ShowContactDialog';
import DeleteContactDialog from '@/components/contact/components/DeleteContactDialog';
import ContactTable from '@/components/contact/components/ContactTable';
import { Loader2, Plus, X } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';
import { useContact } from '@/components/contact/hooks/useContact';
import PermissionGuard from '@/components/auth/PermissionGuard';

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

  const {
    contacts,
    contact,
    contactLoading,
    contactsLoading,
    handleDeleteContact,
    isDeleting,
  } = useContact();

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
    <PermissionGuard
      permission="contacts.view"
      fallback={
        <div className="px-4 pb-2 flex flex-col gap-2 h-full overflow-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h1 className="text-xl font-bold text-gray-900">Contacts</h1>
              <p className="text-base text-gray-600">
                Manage your contacts and relationships
              </p>
            </div>
          </div>

          {/* Permission Denied Message */}
          <div className="bg-white/50 backdrop-blur-md border border-gray-200/80 shadow-lg gap-4 p-8 rounded-lg flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Access Denied
              </h3>
              <p className="text-base text-gray-600 mb-1">
                You do not have permission to view contacts.
              </p>
              <p className="text-sm text-gray-500">
                Please contact your administrator if you need access to this
                feature.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4 h-full w-full overflow-auto">
        <div className="flex justify-between w-full items-center px-4 pt-4">
          <p className="text-2xl font-bold">
            Contacts ({contacts?.length || 0})
          </p>
          <PermissionGuard permission="contacts.create">
            <Button
              onClick={() => setOpen(true)}
              className="cursor-pointer max-w-48"
              icon={Plus}
              iconPosition="left"
            >
              Create Contact
            </Button>
          </PermissionGuard>
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
          open={open || showUpdateDialog}
          setOpen={(val) => {
            setOpen(val);
            setShowUpdateDialog(val && mode === 'update' ? true : false);
            handleNavigate(null);
          }}
          contact={!contactLoading && setSelectedContactId ? contact : null}
          mode={showUpdateDialog ? 'update' : 'create'}
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
    </PermissionGuard>
  );
};

export default ContactPage;
