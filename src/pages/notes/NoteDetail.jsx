import React, { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import BreadCrumb from '@/components/BreadCrumb';
import BackButton from '@/components/BackButton';
import CreateEditNoteDialog from '@/components/notes/CreateEditNoteDialog';
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

const NoteDetail = () => {
  const { noteId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const [editDialogOpen, setEditDialogOpen] = useState(false);

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
        return {
          ...noteData,
          category_id: noteData.category_id?.toString() || '175',
          body: noteData.body || 'No content available',
        };
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
    if (confirm('Are you sure you want to delete this note?')) {
      deleteNoteMutation.mutate();
    }
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

  const formatFileSize = (bytes) => {
    if (!bytes) return 'Unknown size';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAttachmentClick = (attachment) => {
    if (attachment.url) {
      window.open(attachment.url, '_blank');
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
          <Button onClick={() => setEditDialogOpen(true)} variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button
            onClick={handleDeleteNote}
            variant="outline"
            disabled={deleteNoteMutation.isPending}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </div>

      {/* Note Content - Simple White Box */}
      <div className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          {/* Title and Category Row */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-[#40444D]">{note.title}</h2>
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
                      {attachment.type?.startsWith('image/') &&
                      attachment.url ? (
                        <img
                          src={attachment.url}
                          alt={attachment.name}
                          className="w-12 h-12 object-cover rounded border border-gray-200 cursor-pointer"
                          onClick={() => handleAttachmentClick(attachment)}
                        />
                      ) : (
                        <div className="w-12 h-12 bg-white rounded border border-gray-200 flex items-center justify-center">
                          {getFileIcon(attachment.type)}
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p
                        className="font-medium text-[#40444D] truncate text-sm"
                        title={attachment.name}
                      >
                        {attachment.name || `Attachment ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(attachment.size)}
                        {attachment.type &&
                          ` • ${attachment.type.split('/')[1]?.toUpperCase()}`}
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
    </div>
  );
};

export default NoteDetail;
