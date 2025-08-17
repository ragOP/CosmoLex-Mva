import React from 'react';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  Stack,
  Avatar,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import { X, MessageSquare, Phone, Clock, Send } from 'lucide-react';
import { format } from 'date-fns';

const SMSPreviewDialog = ({ open, onClose, sms }) => {
  if (!sms) return null;

  const getInitials = (text) => {
    if (!text) return '?';
    return text
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return format(date, 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  const isOutgoing = sms.from === sms.recipient?.[0]; // Simple check for outgoing

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '12px',
          overflow: 'hidden',
          maxHeight: '80vh',
          minHeight: '60vh'
        }
      }}
    >
      {/* SMS Header */}
      <Box sx={{ 
        bgcolor: '#F5F5FA', 
        borderBottom: '1px solid #e2e8f0',
        p: 2.5
      }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ 
              p: 1, 
              bgcolor: '#e0e7ff', 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageSquare size={18} color="#4338ca" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#40444D' }}>
              {sms.subject || 'SMS Message'}
            </Typography>
          </Stack>
          
          {/* Close Button */}
          <IconButton 
            onClick={onClose}
            sx={{ 
              color: '#64748b',
              '&:hover': { 
                bgcolor: '#e2e8f0',
                color: '#475569'
              }
            }}
          >
            <X size={20} />
          </IconButton>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 0, bgcolor: 'white' }}>
        <Stack spacing={0}>
          {/* SMS Headers */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
            <Stack spacing={2}>
              {/* From Section */}
              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: isOutgoing ? '#10b981' : '#3b82f6',
                      fontSize: '16px',
                      mt: 0.5
                    }}
                  >
                    {getInitials(sms.contact_name || 'Unknown')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {sms.from || 'No sender'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {sms.contact_name || 'No contact name'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                
                {/* SMS Type Chip and Time */}
                <Stack spacing={1} alignItems="flex-end">
                  <Box
                    sx={{
                      px: 2,
                      py: 1,
                      bgcolor: isOutgoing ? '#ecfdf5' : '#eff6ff',
                      color: isOutgoing ? '#065f46' : '#1e40af',
                      borderRadius: 2,
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      border: `1px solid ${isOutgoing ? '#a7f3d0' : '#bfdbfe'}`,
                      display: 'inline-block'
                    }}
                  >
                    {isOutgoing ? 'Outgoing SMS' : 'Incoming SMS'}
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem' }}>
                    {formatDate(sms.created_at)}
                  </Typography>
                </Stack>
              </Stack>

              {/* Recipients Section */}
              {sms.recipient && sms.recipient.length > 0 && (
                <Box sx={{ pl: 7 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 'fit-content' }}>
                      To:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(sms.recipient) ? 
                        sms.recipient.map((recipient, index) => (
                          <Box
                            key={index}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: '#e8f5e8',
                              color: '#2e7d32',
                              borderRadius: 1,
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: '1px solid #c8e6c9'
                            }}
                          >
                            {recipient}
                          </Box>
                        )) : 
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#e8f5e8',
                            color: '#2e7d32',
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid #c8e6c9'
                          }}
                        >
                          {sms.recipient}
                        </Box>
                      }
                    </Box>
                  </Stack>
                </Box>
              )}


            </Stack>
          </Box>

          {/* SMS Body */}
          <Box sx={{ p: 3, flex: 1 }}>
            {sms.message ? (
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569', mb: 2 }}>
                  Message:
                </Typography>
                <Box 
                  sx={{ 
                    p: 3, 
                    bgcolor: '#f8fafc', 
                    borderRadius: 2, 
                    border: '1px solid #e2e8f0',
                    minHeight: '120px'
                  }}
                >
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      whiteSpace: 'pre-wrap', 
                      lineHeight: 1.6,
                      color: '#334155',
                      fontSize: '0.95rem'
                    }}
                  >
                    {sms.message}
                  </Typography>
                </Box>
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                No message content
              </Typography>
            )}
          </Box>
        </Stack>
      </DialogContent>


    </Dialog>
  );
};

export default SMSPreviewDialog; 