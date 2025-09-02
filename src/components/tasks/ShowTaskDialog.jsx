import React, { useState } from 'react';
import { Dialog, Stack, Divider, IconButton, Card } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  CalendarDays,
  AlarmClock,
  Paperclip,
  X,
  Plus,
  Loader2,
} from 'lucide-react';
import formatDate from '@/utils/formatDate';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import isArrayWithValues from '@/utils/isArrayWithValues';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import { useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';
import { uploadCommentAttachment } from '@/api/api_services/task';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const ShowTaskDialog = ({ open = false, onClose = () => {} }) => {
  const queryClient = useQueryClient();
  const {
    task,
    tasksMeta,
    comments,
    commentMeta,
    handleCreateComment,
    isCreatingComment,
  } = useTasks();
  const [commentOpen, setCommentOpen] = useState(false);
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [showUploadMediaDialog, setShowUploadMediaDialog] = useState(false);

  const uploadCommentAttachmentMutation = useMutation({
    mutationFn: (attachmentData) => uploadCommentAttachment(attachmentData),
    onSuccess: (res) => {
      if (isArrayWithValues(res?.attachments)) {
        res?.attachments?.forEach((attachment) => {
          setAttachment((prev) => [
            ...prev,
            {
              id: attachment?.attachment_id,
              file_path: attachment?.file_path,
              name: attachment?.file_name,
            },
          ]);
        });
      } else {
        setAttachment((prev) => [
          ...prev,
          {
            id: res?.attachment_id,
            file_path: res?.file_path,
            name: res?.file_name,
          },
        ]);
      }
      queryClient.invalidateQueries(['comments']);
      toast.success(res?.message || 'Attachment uploaded successfully');
    },
    onError: (error) =>
      toast.error(error?.message || 'Failed to upload attachment'),
  });

  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');
  let contactId = null;

  if (slugId) {
    const matterData = useMatter();
    contactId = matterData?.matter?.contact_id;
  }

  // If task is empty or not found, return null
  if (!task || !Object?.keys(task)?.length > 0) return null;

  const mapMetaValue = (metaList = [], id) => {
    return metaList.find((m) => m.id === id)?.name || 'N/A';
  };

  const {
    subject,
    description,
    due_date,
    priority_id,
    status_id,
    type_id,
    utbms_code_id,
    billable,
    notify_text,
    add_calendar_event,
    trigger_appointment_reminders,
    assignees = [],
    reminders = [],
    attachments = [],
  } = task;

  const priorityName = mapMetaValue(tasksMeta?.taks_priority, priority_id);
  const statusName = mapMetaValue(tasksMeta?.taks_status, status_id);
  const typeName = mapMetaValue(tasksMeta?.taks_type, type_id);

  // Assignees
  const assigneeDetails = tasksMeta?.assignees?.filter((a) =>
    assignees?.map((a) => a.id).includes(a.id)
  );

  // Reminders
  const formattedReminders = reminders?.map((r) => {
    const typeName = mapMetaValue(tasksMeta?.taks_reminders_type, r.type_id);
    return {
      type: typeName,
      value: r?.scheduled_at,
    };
  });

  const handleCommentAttachment = (payload) => {
    const formData = new FormData();
    formData.append('category_id', payload.category_id);
    formData.append('folder_id', payload.folder_id);
    formData.append('description', payload.description);
    // formData.append('attachment', payload.files);

    payload.files.forEach((fileItem) => {
      formData.append('attachment', fileItem.file);
    });

    if (slugId && contactId) {
      formData.append('slug', slugId);
      formData.append('contact_id', contactId);
    }

    uploadCommentAttachmentMutation.mutateAsync(formData);
  };

  const createComment = () => {
    if (!comment) return;
    try {
      handleCreateComment({
        comment,
        attachment_ids: isArrayWithValues(attachment)
          ? attachment?.map((a) => a.id)
          : [],
      });
      setComment('');
      setAttachment([]);
      setCommentOpen(false);
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              Task Details
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          {/* Task Content */}
          <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
            {/* Subject + Description */}
            <div>
              <h2 className="text-lg font-semibold text-[#40444D]">
                {subject}
              </h2>
              <p className="text-muted-foreground mt-1">
                {description || 'No description provided.'}
              </p>
            </div>

            {/* Meta info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CalendarDays className="w-4 h-4" />
                <span>
                  <strong>Due:</strong> {formatDate(due_date)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>
                  <strong>Status ID:</strong> {statusName || 'N/A'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span>
                  <strong>Priority ID:</strong> {priorityName || 'N/A'}
                </span>
              </div>
            </div>

            <Divider />

            {/* Participants */}
            <div>
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Participants
              </h3>
              {assigneeDetails?.length === 0 && (
                <p className="text-muted-foreground">No participants added.</p>
              )}
              {assigneeDetails?.map((p, index) => (
                <div key={index} className="flex items-center gap-3 py-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-[#6366F1] text-white">
                      {p?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{p?.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <Divider />

            {/* Reminders */}
            <div>
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Reminders
              </h3>
              {formattedReminders.length === 0 && (
                <p className="text-muted-foreground">No reminders set.</p>
              )}
              <div className="flex flex-wrap gap-2">
                {formattedReminders.map((r, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="text-xs px-3 py-1 rounded-full flex items-center gap-1"
                  >
                    <AlarmClock className="w-3 h-3" />
                    {`${r.type} - ${r.value}`}
                  </Badge>
                ))}
              </div>
            </div>

            <Divider />

            {/* Attachments */}
            <div>
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Attachments
              </h3>
              {attachments.length === 0 && (
                <p className="text-muted-foreground">
                  No attachments uploaded.
                </p>
              )}
              <div className="grid grid-cols-2 gap-3">
                {attachments.map((file) => (
                  <Card
                    key={file.id}
                    className="p-2 flex items-center gap-2 shadow-sm"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <a
                      href={file.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {file.file_name}
                    </a>
                  </Card>
                ))}
              </div>
            </div>

            <Divider />

            {/* Comments */}
            {/* Comments */}
            <Stack className="overflow-auto no-scrollbar">
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Comments
              </h3>

              {comments.length === 0 && (
                <p className="text-muted-foreground">No comments added.</p>
              )}

              <div className="w-full flex flex-col gap-4">
                {isArrayWithValues(comments) &&
                  comments.map((c) => (
                    <Card
                      key={c.id}
                      className="p-4 flex flex-col gap-3 shadow-sm bg-white"
                    >
                      {/* User Info */}
                      <div className="flex items-center gap-3">
                        <Avatar className="w-8 h-8">
                          <img
                            src={c.user?.profile}
                            alt={c.user?.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                          <AvatarFallback className="bg-[#6366F1] text-white">
                            {c.user?.name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm text-gray-800">
                            {c.user?.name}
                          </span>
                          {c.user?.author && (
                            <span className="text-xs text-[#6366F1]">
                              Author
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Comment text */}
                      <p className="text-sm text-gray-700">{c.comment || ''}</p>

                      {/* Attachments */}
                      {isArrayWithValues(c.attachments) && (
                        <div className="flex flex-col gap-2">
                          {c.attachments.map((file) => (
                            <Card
                              key={file.id}
                              className="p-2 flex items-center gap-2 shadow-sm border border-gray-200"
                            >
                              <Paperclip className="w-4 h-4 text-gray-500" />
                              <a
                                href={file.file_path}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-blue-600 hover:underline truncate"
                              >
                                {file.file_name}
                              </a>
                            </Card>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))}
              </div>

              <Button
                type="button"
                onClick={() => setCommentOpen(true)}
                variant="outline"
                className="w-fit mt-2 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Comment
              </Button>
            </Stack>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end p-4 gap-2">
            <Button
              onClick={onClose}
              className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
            >
              Close
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Comment Dialog */}
      <Dialog
        open={commentOpen}
        onClose={() => setCommentOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              Comments
            </h1>
            <IconButton onClick={() => setCommentOpen(false)}>
              <X className="text-black" />
            </IconButton>
          </div>

          <Divider />

          <Stack className="p-4">
            <Input
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Show uploaded attachments */}
            {isArrayWithValues(attachment) && (
              <Stack className="mt-4">
                {attachment.map((file, index) => (
                  <Card
                    key={index}
                    className="p-2 flex items-center gap-2 shadow-sm"
                  >
                    <Paperclip className="w-4 h-4 text-gray-500" />
                    <a
                      href={file.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline truncate"
                    >
                      {file.name}
                    </a>
                  </Card>
                ))}
              </Stack>
            )}
          </Stack>

          <Divider />

          {/* Footer */}
          <div className="flex items-center justify-between p-4 gap-2">
            <Stack direction="row" alignItems="center" spacing={1}>
              <label htmlFor="attachment-input">
                <IconButton
                  onClick={() => setShowUploadMediaDialog(true)}
                  component="span"
                  size="small"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: '#e3f2fd',
                    },
                  }}
                >
                  <Paperclip size={18} color="#666" />
                </IconButton>
              </label>
            </Stack>
            <Button
              disabled={isCreatingComment}
              className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
              onClick={() => {
                createComment();
              }}
            >
              {isCreatingComment ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                'Upload Comment'
              )}
            </Button>
          </div>
        </Stack>
      </Dialog>

      {/* Upload Media Dialog */}
      <UploadMediaDialog
        open={showUploadMediaDialog}
        onClose={() => setShowUploadMediaDialog(false)}
        onSubmit={(payload) => {
          handleCommentAttachment(payload);
        }}
        isLoading={false}
      />
    </>
  );
};

export default ShowTaskDialog;
