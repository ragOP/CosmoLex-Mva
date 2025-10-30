import React, { useState } from 'react';
import {
  ListItem,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { MessageSquare, Phone, Trash2, Clock } from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { deleteCommunication } from '@/api/api_services/communications';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import { toast } from 'sonner';
import PermissionGuard from '@/components/auth/PermissionGuard';

const SMSList = ({
  smsMessages,
  isLoading,
  matterId,
  onSMSClick,
  onDeleteSuccess,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState(null);
  const [deleteRequestId, setDeleteRequestId] = useState(null);
  const [deletingSMSId, setDeletingSMSId] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return `Today at ${format(date, 'h:mm a')}`;
    } else if (isYesterday(date)) {
      return `Yesterday at ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, yyyy h:mm a');
    }
  };

  const handleDeleteSMS = async (smsId, e) => {
    e.stopPropagation();
    setDeletingSMSId(smsId);

    try {
      const response = await deleteCommunication(smsId);

      if (response.Apistatus === true) {
        setDeleteRequestId(response.request_id);
        setSelectedSMS(smsMessages.find((sms) => sms.id === smsId));
        setDeleteDialogOpen(true);
        toast.success('OTP sent to your email for confirmation');
      } else {
        toast.error(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Error sending delete request:', error);
      toast.error('Failed to send delete request');
    } finally {
      setDeletingSMSId(null);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Loading SMS messages...
        </Typography>
      </Box>
    );
  }

  if (smsMessages.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <MessageSquare
          size={48}
          color="#9ca3af"
          style={{ margin: '0 auto 16px' }}
        />
        <Typography variant="body2" color="text.secondary">
          No SMS messages found
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Start by sending your first SMS message
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ p: 0, width: '100%' }}>
      {smsMessages.map((sms) => {
        const isOutgoing = sms.from === sms.recipient?.[0]; // Simple check for outgoing

        return (
          <ListItem
            key={sms.id}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              mb: 2,
              bgcolor: 'white',
              width: '100%',
              cursor: 'pointer',
              '&:hover': {
                bgcolor: '#f9fafb',
                borderColor: '#d1d5db',
              },
            }}
            onClick={() => onSMSClick && onSMSClick(sms)}
          >
            <Box sx={{ width: '100%' }}>
              {/* SMS Header */}
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  p: 2,
                  pb: 1,
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: isOutgoing ? '#10b981' : '#3b82f6',
                    }}
                  >
                    <MessageSquare size={20} color="white" />
                  </Avatar>

                  <Box>
                    <Typography
                      variant="body1"
                      sx={{ fontWeight: 600, color: '#1f2937' }}
                    >
                      {isOutgoing ? 'Outgoing SMS' : 'Incoming SMS'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sms.contact_name || 'Unknown Contact'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography
                    variant="caption"
                    color="text.secondary"
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    {formatDate(sms.created_at)}
                  </Typography>
                  <Chip
                    label={isOutgoing ? 'Sent' : 'Received'}
                    size="small"
                    sx={{
                      bgcolor: isOutgoing ? '#d1fae5' : '#dbeafe',
                      color: isOutgoing ? '#065f46' : '#1e40af',
                    }}
                  />
                </Box>
              </Box>

              {/* Phone Number and Delete Button Row */}
              <Box sx={{ px: 2, pb: 2 }}>
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Stack direction="row" alignItems="center" gap={1}>
                    <Phone size={16} color="#6b7280" />
                    <Typography variant="body2" color="text.secondary">
                      {sms.from}
                    </Typography>
                  </Stack>

                  <PermissionGuard permission="communications.delete">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteSMS(sms.id, e)}
                      disabled={deletingSMSId === sms.id}
                      sx={{
                        color: '#ef4444',
                        '&:hover': {
                          backgroundColor: '#fef2f2',
                          color: '#dc2626',
                        },
                      }}
                    >
                      {deletingSMSId === sms.id ? (
                        <CircularProgress size={16} sx={{ color: '#ef4444' }} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </IconButton>
                  </PermissionGuard>
                </Stack>
              </Box>
            </Box>
          </ListItem>
        );
      })}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onSuccess={() => {
          onDeleteSuccess && onDeleteSuccess();
          setDeleteDialogOpen(false);
        }}
        requestId={deleteRequestId}
        firmEmail={selectedSMS?.from || 'your email'}
      />
    </Stack>
  );
};

export default SMSList;
