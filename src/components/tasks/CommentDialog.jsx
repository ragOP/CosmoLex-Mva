// import React, { useState } from 'react';
// import { Dialog, Stack, Divider, IconButton, Card } from '@mui/material';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Avatar, AvatarFallback } from '@/components/ui/avatar';
// import { X, Plus, Loader2, Paperclip } from 'lucide-react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { uploadCommentAttachment } from '@/api/api_services/task';
// import { useSearchParams } from 'react-router-dom';
// import { useMatter } from '@/components/inbox/MatterContext';
// import { useTasks } from '@/components/tasks/hooks/useTasks';
// import { toast } from 'sonner';
// import UploadMediaDialog from '@/components/UploadMediaDialog';
// import isArrayWithValues from '@/utils/isArrayWithValues';

// const CommentDialog = ({ open = false, onClose = () => {} }) => {
//   const queryClient = useQueryClient();
//   const [comment, setComment] = useState('');
//   const [attachment, setAttachment] = useState([]);
//   const [showUploadMediaDialog, setShowUploadMediaDialog] = useState(false);
//   const [showAddComment, setShowAddComment] = useState(false);
//   const [searchParams] = useSearchParams();
//   const slugId = searchParams.get('slugId');
//   let contactId = null;

//   if (slugId) {
//     const matterData = useMatter();
//     contactId = matterData?.matter?.contact_id;
//   }


//   const uploadCommentAttachmentMutation = useMutation({
//     mutationFn: (attachmentData) => uploadCommentAttachment(attachmentData),
//     onSuccess: (res) => {
//       if (isArrayWithValues(res?.attachments)) {
//         res?.attachments?.forEach((attachment) => {
//           setAttachment((prev) => [
//             ...prev,
//             {
//               id: attachment?.attachment_id,
//               file_path: attachment?.file_path,
//               name: attachment?.file_name,
//             },
//           ]);
//         });
//       } else {
//         setAttachment((prev) => [
//           ...prev,
//           {
//             id: res?.attachment_id,
//             file_path: res?.file_path,
//             name: res?.file_name,
//           },
//         ]);
//       }
//       queryClient.invalidateQueries(['comments', currentTask?.id]);
//       toast.success(res?.message || 'Attachment uploaded successfully');
//     },
//     onError: (error) =>
//       toast.error(error?.message || 'Failed to upload attachment'),
//   });

//   const handleCommentAttachment = (payload) => {
//     const formData = new FormData();
//     formData.append('category_id', payload.category_id);
//     formData.append('folder_id', payload.folder_id);
//     formData.append('description', payload.description);

//     payload.files.forEach((fileItem) => {
//       formData.append('attachment', fileItem.file);
//     });

//     if (slugId && contactId) {
//       formData.append('slug', slugId);
//       formData.append('contact_id', contactId);
//     }

//     uploadCommentAttachmentMutation.mutateAsync(formData);
//   };

//   const createNewComment = async () => {
//     if (!comment) {
//       return;
//     }

//     try {
//       const result = await createCommentMutation.mutateAsync({
//         commentData: {
//           comment,
//           attachment_ids: isArrayWithValues(attachment)
//             ? attachment?.map((a) => a.id)
//             : [],
//         },
//         task_id: currentTask.id,
//       });

//       // Reset form only on success
//       setComment('');
//       setAttachment([]);
//       setShowAddComment(false);
//     } catch (error) {
//       // Error is handled by the mutation's onError callback
//     }
//   };

//   const handleClose = () => {
//     setComment('');
//     setAttachment([]);
//     setShowAddComment(false);
//     onClose();
//   };

//   // Get taskId from useTasks hook (from URL params)
//   const {
//     task: currentTask,
//     comments,
//     createCommentMutation,
//     handleCreateComment,
//     isCreatingComment,
//   } = useTasks();

//   if (!currentTask || !currentTask.id) {
//     return null;
//   }

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
//         <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
//           {/* Header */}
//           <div className="flex items-center justify-between p-4">
//             <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
//               Task Comments
//             </h1>
//             <IconButton onClick={handleClose}>
//               <X className="text-black" />
//             </IconButton>
//           </div>

//           <Divider />

//           <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
//             <Stack className="overflow-auto no-scrollbar">
//               <h3 className="text-lg font-semibold text-[#40444D] mb-2">
//                 Comments ({comments.length})
//               </h3>

//               {comments.length === 0 && (
//                 <p className="text-muted-foreground">No comments added.</p>
//               )}

//               {comments.length > 0 && (
//                 <div className="w-full flex flex-col gap-4">
//                   {isArrayWithValues(comments) &&
//                     comments.map((c) => (
//                       <Card
//                         key={c.id}
//                         className="p-4 flex flex-col gap-3 shadow-sm bg-white"
//                       >
//                         {/* User Info */}
//                         <div className="flex items-center gap-3">
//                           <Avatar className="w-8 h-8">
//                             <img
//                               src={c.user?.profile}
//                               alt={c.user?.name}
//                               className="w-full h-full object-cover rounded-full"
//                             />
//                             <AvatarFallback className="bg-[#6366F1] text-white">
//                               {c.user?.name?.[0]?.toUpperCase() || 'U'}
//                             </AvatarFallback>
//                           </Avatar>
//                           <div className="flex flex-col">
//                             <span className="font-medium text-sm text-gray-800">
//                               {c.user?.name}
//                             </span>
//                             {c.user?.author && (
//                               <span className="text-xs text-[#6366F1]">
//                                 Author
//                               </span>
//                             )}
//                           </div>
//                         </div>

//                         <p className="text-sm text-gray-700">
//                           {c.comment || ''}
//                         </p>

//                         {/* Attachments */}
//                         {isArrayWithValues(c.attachments) && (
//                           <div className="flex flex-col gap-2">
//                             {c.attachments.map((file) => (
//                               <Card
//                                 key={file.id}
//                                 className="p-2 flex items-center gap-2 shadow-sm border border-gray-200"
//                               >
//                                 <Paperclip className="w-4 h-4 text-gray-500" />
//                                 <a
//                                   href={file.file_path}
//                                   target="_blank"
//                                   rel="noopener noreferrer"
//                                   className="text-sm text-blue-600 hover:underline truncate"
//                                 >
//                                   {file.file_name}
//                                 </a>
//                               </Card>
//                             ))}
//                           </div>
//                         )}
//                       </Card>
//                     ))}
//                 </div>
//               )}

//               {/* Add Comment Button */}
//               <Button
//                 type="button"
//                 onClick={() => setShowAddComment(true)}
//                 variant="outline"
//                 className="w-fit mt-4 bg-white hover:bg-gray-100 text-gray-700 cursor-pointer"
//               >
//                 <Plus className="mr-2 h-4 w-4" />
//                 Add Comment
//               </Button>
//             </Stack>

//             {/* Add Comment Section */}
//             {showAddComment && (
//               <div className="border-t pt-4">
//                 <h4 className="text-md font-semibold text-[#40444D] mb-3">
//                   Add New Comment
//                 </h4>
//                 <div className="space-y-4">
//                   <Input
//                     placeholder="Write a comment..."
//                     value={comment}
//                     onChange={(e) => setComment(e.target.value)}
//                   />

//                   {/* Show uploaded attachments */}
//                   {isArrayWithValues(attachment) && (
//                     <Stack className="mt-4">
//                       {attachment.map((file, index) => (
//                         <Card
//                           key={index}
//                           className="p-2 flex items-center gap-2 shadow-sm"
//                         >
//                           <Paperclip className="w-4 h-4 text-gray-500" />
//                           <a
//                             href={file.file_path}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="text-sm text-blue-600 hover:underline truncate"
//                           >
//                             {file.name}
//                           </a>
//                         </Card>
//                       ))}
//                     </Stack>
//                   )}

//                   {/* Action Buttons */}
//                   <div className="flex items-center justify-between">
//                     <Stack direction="row" alignItems="center" spacing={1}>
//                       <label htmlFor="attachment-input">
//                         <IconButton
//                           onClick={() => setShowUploadMediaDialog(true)}
//                           component="span"
//                           size="small"
//                           sx={{
//                             p: 1.5,
//                             borderRadius: 1,
//                             '&:hover': {
//                               bgcolor: '#e3f2fd',
//                             },
//                           }}
//                         >
//                           <Paperclip size={18} color="#666" />
//                         </IconButton>
//                       </label>
//                     </Stack>
//                     <div className="flex gap-2">
//                       <Button
//                         variant="outline"
//                         onClick={() => {
//                           setShowAddComment(false);
//                           setComment('');
//                           setAttachment([]);
//                         }}
//                         disabled={isCreatingComment}
//                       >
//                         Cancel
//                       </Button>
//                       <Button
//                         disabled={isCreatingComment}
//                         className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
//                         onClick={createNewComment}
//                       >
//                         {isCreatingComment ? (
//                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                         ) : (
//                           'Add Comment'
//                         )}
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>

//           {/* Footer */}
//           <div className="flex items-center justify-end p-4 gap-2">
//             <Button
//               onClick={handleClose}
//               className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
//             >
//               Close
//             </Button>
//           </div>
//         </Stack>
//       </Dialog>

//       {/* Upload Media Dialog */}
//       <UploadMediaDialog
//         open={showUploadMediaDialog}
//         onClose={() => setShowUploadMediaDialog(false)}
//         onSubmit={(payload) => {
//           handleCommentAttachment(payload);
//         }}
//         isLoading={uploadCommentAttachmentMutation.isPending}
//       />
//     </>
//   );
// };

// export default CommentDialog;
