import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import BreadCrumb from '@/components/BreadCrumb';
import BackButton from '@/components/BackButton';
import CreateEditNoteDialog from '@/components/notes/CreateEditNoteDialog';
import DeleteConfirmationDialog from '@/components/notes/DeleteConfirmationDialog';
import { Skeleton, IconButton, Tooltip } from '@mui/material';
import {
  Edit,
  Trash2,
  FileText,
  Eye,
  FileImage,
  FileVideo,
  FileText as FileTextIcon,
  File,
  ChevronLeft,
} from 'lucide-react';
import {
  getNote,
  updateNote,
  deleteNote,
  getNotesMeta,
} from '@/api/api_services/notes';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const NoteDetail = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  // Permission checks
  const { hasPermission } = usePermission();
  const canShowNote = hasPermission('notes.show');
  const canUpdateNote = hasPermission('notes.update');
  const canDeleteNote = hasPermission('notes.delete');
  const canDeleteAttachment = hasPermission('notes.attachments.delete');

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Get matter slug from URL params
  const matterSlug = searchParams.get('slugId');

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['notesMeta'],
    queryFn: async () => {
      const response = await getNotesMeta();
      if (response?.Apistatus) {
        return response.note_categories.map((cat) => ({
          id: cat.id.toString(),
          name: cat.name,
        }));
      }
      return [];
    },
  });

  // Fetch note details
  const { data: note, isLoading } = useQuery({
    queryKey: ['note', noteId],
    queryFn: () => getNote(noteId),
    enabled: !!noteId,
    select: (data) => {
      // Handle the actual API response structure
      const noteData = data?.data || data?.response || data || null;
      if (noteData) {
        console.log('Raw note data:', noteData);
        const processedNote = {
          ...noteData,
          category_id: noteData.category_id?.toString() || '175',
          body: noteData.body || 'No content available',
        };
        console.log('Processed note data:', processedNote);
        return processedNote;
      }
      return null;
    },
  });

  // Update note mutation
  const updateNoteMutation = useMutation({
    mutationFn: (noteData) => updateNote(noteId, noteData),
    onSuccess: () => {
      queryClient.invalidateQueries(['note', noteId]);
      queryClient.invalidateQueries(['notes', matterSlug]);
      setEditDialogOpen(false);
    },
  });

  // Delete note mutation
  const deleteNoteMutation = useMutation({
    mutationFn: () => deleteNote(noteId),
    onSuccess: () => {
      queryClient.invalidateQueries(['notes', matterSlug]);
      navigate(`/dashboard/notes?slugId=${matterSlug}`);
    },
  });

  const handleUpdateNote = (noteData) => {
    updateNoteMutation.mutate(noteData);
  };

  const handleDeleteNote = () => {
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    deleteNoteMutation.mutate();
    setDeleteDialogOpen(false);
  };

  const getCategoryName = (categoryId) => {
    const category = categoriesData?.find((cat) => cat.id === categoryId);
    return category?.name || 'General';
  };

  const getFileIcon = (fileType) => {
    if (fileType?.startsWith('image/'))
      return <FileImage className="h-5 w-5 text-blue-500" />;
    if (fileType?.startsWith('video/'))
      return <FileVideo className="h-5 w-5 text-purple-500" />;
    if (fileType === 'application/pdf')
      return <FileTextIcon className="h-5 w-5 text-red-500" />;
    if (fileType?.includes('document') || fileType?.includes('text'))
      return <FileText className="h-5 w-5 text-green-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  const handleAttachmentClick = (attachment) => {
    if (attachment.file_path) {
      window.open(attachment.file_path, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className="px-4">
        <BreadCrumb label="Notes" />

        {/* Note Content Skeleton */}
        <div className="w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Title and Category Row Skeleton */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <Skeleton variant="text" width={300} height={40} />
              <Skeleton
                variant="rectangular"
                width={120}
                height={32}
                className="rounded-full"
              />
            </div>

            {/* Content Skeleton */}
            <div className="mb-6 space-y-3">
              <Skeleton variant="text" width="100%" height={24} />
              <Skeleton variant="text" width="95%" height={24} />
              <Skeleton variant="text" width="88%" height={24} />
              <Skeleton variant="text" width="92%" height={24} />
              <Skeleton variant="text" width="75%" height={24} />
            </div>

            {/* Attachments Skeleton */}
            <div className="pt-4 border-t border-gray-200">
              <Skeleton
                variant="text"
                width={150}
                height={24}
                className="mb-3"
              />
              <div className="space-y-2">
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  className="rounded-lg"
                />
                <Skeleton
                  variant="rectangular"
                  width="100%"
                  height={60}
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="px-4">
        <BreadCrumb label="Notes" />
        <div className="text-center py-12">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            Note not found
          </h3>
          <p className="text-gray-500 mb-4">
            The note you're looking for doesn't exist.
          </p>
          <Button
            onClick={() => navigate(`/dashboard/notes?slugId=${matterSlug}`)}
            className="bg-[#6366F1] text-white hover:bg-[#5856eb] transition-colors"
          >
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  console.log('note >>>>', note);
  // console.log();
  return (
    <PermissionGuard
      permission="notes.show"
      fallback={
        <div className="px-4">
          <BreadCrumb label="Notes" />
          <div className="text-center py-8">
            <p className="text-red-600">
              You don't have permission to view note details.
            </p>
          </div>
        </div>
      }
    >
      <div className="px-4">
        <BreadCrumb label="Notes" />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-4 mb-6">
          <div className="flex items-center gap-3">
            <BackButton
              to={`/dashboard/notes?slugId=${matterSlug}`}
              tooltip="Back to Notes"
            />
            <h1 className="text-2xl font-bold text-[#40444D]">Note Details</h1>
          </div>

          <div className="flex gap-2">
            <PermissionGuard permission="notes.update">
              <Button onClick={() => setEditDialogOpen(true)} variant="outline">
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </PermissionGuard>
            <PermissionGuard permission="notes.delete">
              <Button
                onClick={handleDeleteNote}
                variant="outline"
                disabled={deleteNoteMutation.isPending}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Note Content - Simple White Box */}
        <div className="w-full">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            {/* Title and Category Row */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-[#40444D]">
                {note.title}
              </h2>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {getCategoryName(note.category_id)}
              </div>
            </div>

            {/* Content */}
            <div className="mb-6">
              <div
                className="text-gray-800 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: note.body }}
              />
            </div>

            {/* Attachments */}
            {note.attachments && note.attachments.length > 0 && (
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-[#40444D] mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-gray-600" />
                  Attachments ({note.attachments.length})
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {note.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <div className="flex-shrink-0">
                        {attachment.file_type?.startsWith('image/') &&
                        attachment.file_path ? (
                          <img
                            src={attachment.file_path}
                            alt={attachment.file_name}
                            className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer"
                            onClick={() => handleAttachmentClick(attachment)}
                          />
                        ) : (
                          <div className="w-12 h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                            {getFileIcon(attachment.file_type)}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p
                          className="font-medium text-[#40444D] truncate text-sm"
                          title={attachment.file_name}
                        >
                          {attachment.file_name || `Attachment ${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {attachment.file_type &&
                            `${attachment.file_type
                              .split('/')[1]
                              ?.toUpperCase()}`}
                        </p>
                      </div>

                      <div className="flex gap-1">
                        <Button
                          onClick={() => handleAttachmentClick(attachment)}
                          size="sm"
                          variant="outline"
                          className="h-7 w-7 p-0 border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                          title="View"
                        >
                          <Eye className="h-3 w-3 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Edit Dialog */}
        <CreateEditNoteDialog
          open={editDialogOpen}
          onClose={() => setEditDialogOpen(false)}
          onSubmit={handleUpdateNote}
          isLoading={updateNoteMutation.isPending}
          note={note}
          isEdit={true}
          categories={categoriesData || []}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          isLoading={deleteNoteMutation.isPending}
          title="Delete Note"
          message="Are you sure you want to delete this note? This action cannot be undone."
        />
      </div>
    </PermissionGuard>
  );
};

export default NoteDetail;
