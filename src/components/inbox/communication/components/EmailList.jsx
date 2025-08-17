import React, { useState } from 'react';
import { 
  ListItem, 
  Typography, 
  Stack, 
  Avatar,
  IconButton,
  Skeleton,
  Box,
  CircularProgress
} from '@mui/material';
import { 
  Paperclip, 
  Delete,
  Trash,
  Trash2
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { deleteCommunication } from '@/api/api_services/communications';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { toast } from 'sonner';

const EmailList = ({ emails, isLoading, onEmailClick, onDeleteSuccess }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [deletingEmailId, setDeletingEmailId] = useState(null);

  const handleDeleteEmail = async (emailId, e) => {
    e.stopPropagation();
    setDeletingEmailId(emailId);
    
    try {
      const response = await deleteCommunication(emailId);
      
      if (response.Apistatus === true) {
        setDeleteRequestId(response.request_id);
        setSelectedEmail(emails.find(email => email.id === emailId));
        setDeleteDialogOpen(true);
        toast.success('OTP sent to your email for confirmation');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending delete request:', error);
      toast.error('Failed to send delete request');
    } finally {
      setDeletingEmailId(null);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return 'Yesterday';
    } else {
      return format(date, 'MMM d');
    }
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };



  

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="30%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="80%" />
            </Box>
            <Skeleton variant="text" width={60} />
          </Stack>
        ))}
      </Box>
    );
  }

  if (!emails || emails.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          height: 400,
          color: '#666',
          p: 3
        }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          No emails found
        </Typography>
        <Typography variant="body2">
          Your email communications will appear here
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ p: 0, width: "100%", height: "100%" }}>
      {emails.map((email) => (
        <React.Fragment key={email.id}>
          <ListItem
            sx={{
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
              bgcolor: 'white',
              borderRadius: 1,
              mb: 1,
              '&:hover': {
                backgroundColor: '#f9f9f9'
              },
              py: 2
            }}
            onClick={() => onEmailClick && onEmailClick(email)}
          >
            <Stack direction="row" spacing={2} sx={{ width: '100%' }}>
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: '#7367F0',
                  fontSize: '14px'
                }}
              >
                {getInitials(email.from)}
              </Avatar>

              {/* Email Content */}
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        fontWeight: 600,
                        color: '#333',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 200
                      }}
                    >
                      {email.from}
                    </Typography>

                    {email.recipient && (
                      <Typography variant="caption" color="text.secondary">
                        to {Array.isArray(email.recipient) ? email.recipient.join(', ') : email.recipient}
                      </Typography>
                    )}
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center">
                    {email.attachments && email.attachments.length > 0 && (
                      <Paperclip size={14} color="#666" />
                    )}
                  </Stack>
                </Stack>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 500,
                    color: '#333',
                    mb: 0.5
                  }}
                >
                  {email.subject}
                </Typography>

                {/* <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}
                >
                  {truncateMessage(email.message)}
                </Typography> */}
              </Stack>

              {/* Date and Delete Action */}
              <Stack direction="column" spacing={1} alignItems="flex-end">
                <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                  {formatDate(email.created_at)}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={(e) => handleDeleteEmail(email.id, e)}
                  disabled={deletingEmailId === email.id}
                  sx={{ 
                    color: '#ef4444',
                    '&:hover': { 
                      backgroundColor: '#fef2f2',
                      color: '#dc2626'
                    }
                  }}
                >
                  {deletingEmailId === email.id ? (
                    <CircularProgress size={16} sx={{ color: '#ef4444' }} />
                  ) : (
                    <Trash2 size={16} />
                  )}
                </IconButton>
              </Stack>
            </Stack>
          </ListItem>

          
        </React.Fragment>
              ))}
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={() => {
          onDeleteSuccess && onDeleteSuccess();
          setDeleteDialogOpen(false);
        }}
        requestId={deleteRequestId}
        firmEmail={selectedEmail?.from || 'your email'}
      />
    </Stack>
  );
};

export default EmailList; 