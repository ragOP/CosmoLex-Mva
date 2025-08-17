import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Box,
  Chip,
  Avatar,
  Divider,
  IconButton,
  Button
} from '@mui/material';
import { X, Paperclip, Mail, User, Calendar, Send } from 'lucide-react';
import { format } from 'date-fns';

const EmailPreviewDialog = ({
  open,
  onClose,
  email
}) => {
  if (!email) return null;

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'PPpp');
    } catch {
      return dateString;
    }
  };

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
          maxHeight: '85vh',
          minHeight: '70vh',
          width: '60vw',
          maxWidth: '60vw'
        }
      }}
    >
      {/* Gmail-style Header */}
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
              <Mail size={18} color="#4338ca" />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#40444D' }}>
              {email.subject || 'No Subject'}
            </Typography>
          </Stack>
          
          <IconButton 
            onClick={onClose} 
            size="small"
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
          {/* Gmail-style Email Headers */}
          <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
            <Stack spacing={3}>
              {/* From Section */}
              <Stack direction="row" spacing={2} alignItems="flex-start" justifyContent="space-between">
                <Stack direction="row" spacing={2} alignItems="flex-start">
                  <Avatar 
                    sx={{ 
                      width: 48, 
                      height: 48, 
                      bgcolor: '#7367F0',
                      fontSize: '16px',
                      mt: 0.5
                    }}
                  >
                    {getInitials(email.from || 'Unknown')}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack spacing={0.5}>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#1e293b' }}>
                        {email.from || 'No sender'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {email.contact_name || 'No contact name'}
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
                
                {/* Date on the right */}
                <Stack spacing={0.5} alignItems="flex-end">
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', fontWeight: 500 }}>
                    Delivered
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                    {formatDate(email.created_at)}
                  </Typography>
                </Stack>
              </Stack>

              {/* Recipients Section */}
              {email.recipient && email.recipient.length > 0 && (
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 'fit-content' }}>
                      To:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(email.recipient) ? 
                        email.recipient.map((recipient, index) => (
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
                          {email.recipient}
                        </Box>
                      }
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* CC Section if exists */}
              {email.cc && email.cc.length > 0 && (
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 'fit-content' }}>
                      CC:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(email.cc) ? 
                        email.cc.map((recipient, index) => (
                          <Box
                            key={index}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: '#fff3e0',
                              color: '#f57c00',
                              borderRadius: 1,
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: '1px solid #ffcc80'
                            }}
                          >
                            {recipient}
                          </Box>
                        )) : 
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#fff3e0',
                            color: '#f57c00',
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid #ffcc80'
                          }}
                        >
                          {email.cc}
                        </Box>
                      }
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* BCC Section if exists */}
              {email.bcc && email.bcc.length > 0 && (
                <Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, minWidth: 'fit-content' }}>
                      BCC:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Array.isArray(email.bcc) ? 
                        email.bcc.map((recipient, index) => (
                          <Box
                            key={index}
                            sx={{
                              px: 1.5,
                              py: 0.5,
                              bgcolor: '#fce4ec',
                              color: '#c2185b',
                              borderRadius: 1,
                              fontSize: '0.8rem',
                              fontWeight: 500,
                              border: '1px solid #f8bbd9'
                            }}
                          >
                            {recipient}
                          </Box>
                        )) : 
                        <Box
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            bgcolor: '#fce4ec',
                            color: '#c2185b',
                            borderRadius: 1,
                            fontSize: '0.8rem',
                            fontWeight: 500,
                            border: '1px solid #f8bbd9'
                          }}
                        >
                          {email.bcc}
                        </Box>
                      }
                    </Box>
                  </Stack>
                </Box>
              )}
            </Stack>
          </Box>

          {/* Subject Section */}
          {email.subject && (
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9' }}>
              <Stack spacing={1}>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Subject:
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#1e293b' }}>
                  {email.subject}
                </Typography>
              </Stack>
            </Box>
          )}

          {/* Attachments Section */}
          {email.attachments && email.attachments.length > 0 && (
            <Box sx={{ p: 3, borderBottom: '1px solid #f1f5f9', bgcolor: '#fafafa' }}>
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#475569' }}>
                  📎 Attachments ({email.attachments.length})
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {email.attachments.map((attachment, index) => (
                    <Chip
                      key={index}
                      label={attachment.file_name || `Attachment ${index + 1}`}
                      size="small"
                      icon={<Paperclip size={12} />}
                      component="a"
                      href={attachment.file_path}
                      target="_blank"
                      clickable
                      sx={{ 
                        textDecoration: 'none',
                        bgcolor: 'white',
                        border: '1px solid #e2e8f0',
                        '&:hover': { 
                          backgroundColor: '#f1f5f9',
                          borderColor: '#cbd5e1'
                        }
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Email Body - Gmail Style */}
          <Box sx={{ p: 3, flex: 1 }}>
            {email.message ? (
              <Box 
                sx={{ 
                  lineHeight: 1.6,
                  color: '#334155',
                  fontSize: '0.95rem',
                  '& h1, & h2, & h3, & h4, & h5, & h6': {
                    color: '#1e293b',
                    fontWeight: 600,
                    mb: 1
                  },
                  '& p': {
                    mb: 1
                  },
                  '& ul, & ol': {
                    pl: 2,
                    mb: 1
                  },
                  '& a': {
                    color: '#3b82f6',
                    textDecoration: 'underline'
                  },
                  '& blockquote': {
                    borderLeft: '3px solid #e2e8f0',
                    pl: 2,
                    ml: 0,
                    fontStyle: 'italic',
                    color: '#64748b'
                  }
                }}
                dangerouslySetInnerHTML={{ __html: email.message }}
              />
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

export default EmailPreviewDialog; 