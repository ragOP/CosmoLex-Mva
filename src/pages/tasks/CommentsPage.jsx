import React, { useState } from 'react';
import { Stack, Divider, IconButton, Card } from '@mui/material';
import { Button as ShadButton } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, BadgeCheck, Loader2, Paperclip } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadCommentAttachment } from '@/api/api_services/task';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMatter } from '@/components/inbox/MatterContext';
import { useTasks } from '@/components/tasks/hooks/useTasks';
import { toast } from 'sonner';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import isArrayWithValues from '@/utils/isArrayWithValues';
import { useSelector } from 'react-redux';
import { profileUrlConversion } from '@/utils/profileUrlConversion';
import { formatRelativeTime } from '@/utils/formatRelativeTime';

const CommentsPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [attachment, setAttachment] = useState([]);
  const [showUploadMediaDialog, setShowUploadMediaDialog] = useState(false);
  const [searchParams] = useSearchParams();
  const slugId = searchParams.get('slugId');

  // Get current user from Redux store
  const currentUser = useSelector((state) => state.auth.user) || { id: 1 };

  let contactId = null;
  if (slugId) {
    const matterData = useMatter();
    contactId = matterData?.matter?.contact_id;
  }

  const {
    task: currentTask,
    comments,
    createCommentMutation,
    isCreatingComment,
  } = useTasks();

  const uploadCommentAttachmentMutation = useMutation({
    mutationFn: (attachmentData) => uploadCommentAttachment(attachmentData),
    onSuccess: (res) => {
      if (isArrayWithValues(res?.attachments)) {
        res?.attachments?.forEach((a) => {
          setAttachment((prev) => [
            ...prev,
            {
              id: a?.attachment_id,
              file_path: a?.file_path,
              name: a?.file_name,
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
      toast.success(res?.message || 'Attachment uploaded successfully');
    },
    onError: (error) =>
      toast.error(error?.message || 'Failed to upload attachment'),
  });

  const handleCommentAttachment = (payload) => {
    const formData = new FormData();
    formData.append('category_id', payload.category_id);
    formData.append('folder_id', payload.folder_id);
    formData.append('description', payload.description);
    payload.files.forEach((fileItem) => {
      formData.append('attachment', fileItem.file);
    });
    if (slugId && contactId) {
      formData.append('slug', slugId);
      formData.append('contact_id', contactId);
    }
    uploadCommentAttachmentMutation.mutateAsync(formData);
  };

  const createNewComment = async () => {
    if (!comment) return;

    // Get taskId from URL params as fallback if currentTask.id is not available
    const taskIdFromUrl = searchParams.get('taskId');
    const taskIdToUse = currentTask?.id || taskIdFromUrl;

    if (!taskIdToUse) {
      toast.error('Task ID not found. Please refresh and try again.');
      return;
    }

    try {
      await createCommentMutation.mutateAsync({
        commentData: {
          comment,
          attachment_ids: isArrayWithValues(attachment)
            ? attachment.map((a) => a.id)
            : [],
        },
        task_id: taskIdToUse,
      });
      setComment('');
      setAttachment([]);
    } catch (error) {
      console.error('Error creating comment:', error);
      toast.error('Failed to create comment');
    }
  };

  const goBackToTasks = () => {
    const taskId = searchParams.get('taskId');
    if (slugId) {
      navigate(`/dashboard/inbox/tasks${slugId ? `?slugId=${slugId}` : ''}`);
    } else {
      navigate('/dashboard/tasks');
    }
  };

  if (!currentTask || !currentTask.id) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-sm text-muted-foreground">
          Select a task to view comments.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-[#F5F5FA]">
      {/* <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <IconButton onClick={goBackToTasks}>
            <ArrowLeft className="text-black" />
          </IconButton>
          <h1 className="text-xl text-[#40444D] font-bold font-sans">
            Task Comments
          </h1>
        </div>
        <div />
      </div> */}

      <Divider />

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto p-6 pb-0">
          <Stack className="overflow-auto no-scrollbar">
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Comments ({comments.length})
            </h3>

            {comments.length === 0 && (
              <p className="text-muted-foreground">No comments added.</p>
            )}

            {comments.length > 0 && (
              <div className="w-full flex flex-col gap-4">
                {isArrayWithValues(comments) &&
                  comments.map((c) => {
                    const profileUrl = profileUrlConversion(c.user?.profile);
                    const isCurrentUser =
                      c.user?.id?.toString() === currentUser?.id?.toString();

                    return (
                      <div
                        key={c.id}
                        className={`flex ${
                          isCurrentUser ? 'justify-start' : 'justify-end'
                        }`}
                      >
                        <Card
                          className="p-2 flex flex-col gap-2 border-none shadow-none bg-[#F5F5FA] max-w-[60%] min-w-[60%] w-full"
                          sx={{
                            backgroundColor: 'white',
                            boxShadow: 'none',
                            // border: '2px solid #e5e7eb',
                            borderRadius: '10px',
                            '&:before': {
                              display: 'none',
                            },
                          }}
                        >
                          <div className="flex items-end gap-4">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <img
                                  src={profileUrl}
                                  alt={c.user?.name}
                                  className="w-full h-full rounded-full"
                                />
                              </Avatar>
                              <div className="flex flex-col items-start gap-1">
                                <div className="flex items-center gap-1">
                                  <span className="font-medium text-sm text-gray-800">
                                    {c.user?.name}
                                  </span>
                                  {c.user?.author && (
                                    <BadgeCheck className="w-4 h-4 text-[#6366F1]" />
                                  )}
                                </div>
                                <div className="flex items-center gap-2">
                                  {c.user?.author && (
                                    <span className="text-xs text-[#6366F1]">
                                      Author
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-500">
                                    {formatRelativeTime(c.created_at)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-md text-black-700">
                            {c.user?.comment || ''}
                          </p>
                          {isArrayWithValues(c.attachments) && (
                            <div className="flex flex-col gap-2">
                              {c.attachments.map((file) => (
                                <Card
                                  key={file.id}
                                  className="p-2 flex items-center gap-2 shadow-none"
                                  sx={{
                                    backgroundColor: 'transparent',
                                    boxShadow: 'none',
                                    // border: '1px solid #e5e7eb',
                                  }}
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
                      </div>
                    );
                  })}
              </div>
            )}
          </Stack>
        </div>

        <div className="border-t bg-white p-6 pt-2">
          {/* <h4 className="text-md font-semibold text-[#40444D]">
            Add New Comment
          </h4> */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[80px]"
            />

            {isArrayWithValues(attachment) && (
              <Stack className="mt-4">
                {attachment.map((file, index) => (
                  <Card
                    key={index}
                    className="p-2 flex items-center gap-2 shadow-sm"
                    sx={{
                      backgroundColor: 'transparent',
                      boxShadow: 'none',
                      border: 'none',
                    }}
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

            <div className="flex items-center justify-between">
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconButton
                  onClick={() => setShowUploadMediaDialog(true)}
                  component="span"
                  size="small"
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    '&:hover': { bgcolor: '#e3f2fd' },
                  }}
                >
                  <Paperclip size={18} color="#666" />
                </IconButton>
              </Stack>
              <div className="flex gap-2">
                <ShadButton
                  variant="outline"
                  onClick={() => {
                    setComment('');
                    setAttachment([]);
                  }}
                  disabled={isCreatingComment}
                >
                  Cancel
                </ShadButton>
                <ShadButton
                  disabled={isCreatingComment}
                  className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
                  onClick={createNewComment}
                >
                  {isCreatingComment ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Add Comment'
                  )}
                </ShadButton>
              </div>
            </div>
          </div>
        </div>
        <UploadMediaDialog
          open={showUploadMediaDialog}
          onClose={() => setShowUploadMediaDialog(false)}
          onSubmit={(payload) => {
            handleCommentAttachment(payload);
          }}
          isLoading={uploadCommentAttachmentMutation.isPending}
        />
      </div>
    </div>
  );
};

export default CommentsPage;
