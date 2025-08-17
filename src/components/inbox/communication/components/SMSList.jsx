import React, { useState } from 'react';
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  IconButton,
  Collapse,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { 
  MessageSquare, 
  Phone, 
  ChevronDown, 
  ChevronUp, 
  Trash2,
  Clock
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCommunication } from '@/api/api_services/communications';
import { toast } from 'sonner';

const SMSList = ({ smsMessages, isLoading, matterId }) => {
  const [expandedSMS, setExpandedSMS] = useState(null);
  const queryClient = useQueryClient();

  const deleteSMSMutation = useMutation({
    mutationFn: deleteCommunication,
    onSuccess: () => {
      toast.success('SMS deleted successfully');
      queryClient.invalidateQueries(['communications', matterId]);
    },
    onError: (error) => {
      toast.error('Failed to delete SMS');
      console.error('Delete SMS error:', error);
    }
  });

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

  const handleDelete = (smsId) => {
    if (window.confirm('Are you sure you want to delete this SMS?')) {
      deleteSMSMutation.mutate(smsId);
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
        <MessageSquare size={48} color="#9ca3af" style={{ margin: '0 auto 16px' }} />
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
    <List sx={{ p: 0 }}>
      {smsMessages.map((sms) => {
        const isExpanded = expandedSMS === sms.id;
        const isOutgoing = sms.from === sms.recipient?.[0]; // Simple check for outgoing

        return (
          <ListItem
            key={sms.id}
            sx={{
              border: '1px solid #e5e7eb',
              borderRadius: 2,
              mb: 2,
              bgcolor: 'white',
              '&:hover': {
                bgcolor: '#f9fafb',
                borderColor: '#d1d5db'
              }
            }}
          >
            <Box sx={{ width: '100%' }}>
              {/* SMS Header */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2,
                pb: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar 
                    sx={{ 
                      width: 40, 
                      height: 40, 
                      bgcolor: isOutgoing ? '#10b981' : '#3b82f6'
                    }}
                  >
                    <MessageSquare size={20} color="white" />
                  </Avatar>
                  
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 600, color: '#1f2937' }}>
                      {isOutgoing ? 'Outgoing SMS' : 'Incoming SMS'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sms.contact_name || 'Unknown Contact'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip
                    label={isOutgoing ? 'Sent' : 'Received'}
                    size="small"
                    sx={{
                      bgcolor: isOutgoing ? '#d1fae5' : '#dbeafe',
                      color: isOutgoing ? '#065f46' : '#1e40af'
                    }}
                  />
                  
                  <IconButton
                    size="small"
                    onClick={() => setExpandedSMS(isExpanded ? null : sms.id)}
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </IconButton>
                </Box>
              </Box>

              {/* SMS Preview */}
              <Box sx={{ px: 2, pb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {sms.message.length > 100 
                    ? `${sms.message.substring(0, 100)}...` 
                    : sms.message
                  }
                </Typography>
                
                <Stack direction="row" alignItems="center" gap={2} sx={{ color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Phone size={14} />
                    <Typography variant="caption">
                      {sms.from}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Clock size={14} />
                    <Typography variant="caption">
                      {formatDate(sms.created_at)}
                    </Typography>
                  </Box>
                </Stack>
              </Box>

              {/* Expanded SMS Details */}
              <Collapse in={isExpanded}>
                <Box sx={{ 
                  p: 2, 
                  bgcolor: '#f8fafc', 
                  borderTop: '1px solid #e5e7eb',
                  borderRadius: '0 0 8px 8px'
                }}>
                  <Stack spacing={2}>
                    {/* Full Message */}
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
                        Message:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        bgcolor: 'white', 
                        p: 2, 
                        borderRadius: 1,
                        border: '1px solid #e5e7eb'
                      }}>
                        {sms.message}
                      </Typography>
                    </Box>

                    {/* Details */}
                    <Stack direction="row" spacing={4}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          From:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {sms.from}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          To:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {sms.recipient?.join(', ') || 'N/A'}
                        </Typography>
                      </Box>
                      
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Sent by:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {sms.created_by || 'Unknown'}
                        </Typography>
                      </Box>
                    </Stack>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton
                        size="small"
                        onClick={() => handleDelete(sms.id)}
                        sx={{ 
                          color: '#ef4444',
                          '&:hover': { bgcolor: '#fef2f2' }
                        }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                  </Stack>
                </Box>
              </Collapse>
            </Box>
          </ListItem>
        );
      })}
    </List>
  );
};

export default SMSList; 