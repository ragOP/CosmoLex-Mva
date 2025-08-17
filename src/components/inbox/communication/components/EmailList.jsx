import React, { useState } from 'react';
import { 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Stack, 
  Chip, 
  Avatar,
  IconButton,
  Skeleton,
  Box,
  Collapse
} from '@mui/material';
import { 
  Paperclip, 
  Star, 
  Archive, 
  Delete, 
  ChevronDown, 
  ChevronRight 
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';

const EmailList = ({ emails, isLoading }) => {
  const [expandedEmail, setExpandedEmail] = useState(null);

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

  const toggleEmailExpansion = (emailId) => {
    setExpandedEmail(expandedEmail === emailId ? null : emailId);
  };

  const truncateMessage = (message, maxLength = 120) => {
    if (!message) return '';
    const plainText = message.replace(/<[^>]*>/g, '');
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...' 
      : plainText;
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
          alignItems: 'center', 
          justifyContent: 'center', 
          height: 400,
          color: '#666'
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
    <List sx={{ p: 0 }}>
      {emails.map((email) => (
        <React.Fragment key={email.id}>
          <ListItem
            sx={{
              borderBottom: '1px solid #f0f0f0',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f9f9f9'
              },
              py: 2
            }}
            onClick={() => toggleEmailExpansion(email.id)}
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
                {getInitials(email.created_by || email.from)}
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
                        maxWidth: 150
                      }}
                    >
                      {email.created_by || email.from}
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
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
                      {formatDate(email.created_at)}
                    </Typography>
                    <IconButton size="small" sx={{ p: 0.5 }}>
                      {expandedEmail === email.id ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </IconButton>
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

                <Typography 
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
                </Typography>
              </Stack>

              {/* Action Buttons */}
              <Stack direction="row" spacing={0.5} sx={{ opacity: 0.7, '&:hover': { opacity: 1 } }}>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}>
                  <Archive size={16} />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}>
                  <Delete size={16} />
                </IconButton>
                <IconButton size="small" onClick={(e) => { e.stopPropagation(); }}>
                  <Star size={16} />
                </IconButton>
              </Stack>
            </Stack>
          </ListItem>

          {/* Expanded Email Content */}
          <Collapse in={expandedEmail === email.id} timeout="auto" unmountOnExit>
            <Box sx={{ px: 3, py: 2, bgcolor: '#fafafa', borderBottom: '1px solid #f0f0f0' }}>
              <Stack spacing={2}>
                {/* Email Headers */}
                <Stack spacing={1}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>From:</strong> {email.from}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>To:</strong> {Array.isArray(email.recipient) ? email.recipient.join(', ') : email.recipient}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Date:</strong> {format(new Date(email.created_at), 'PPpp')}
                  </Typography>
                </Stack>

                {/* Attachments */}
                {email.attachments && email.attachments.length > 0 && (
                  <Stack spacing={1}>
                    <Typography variant="caption" color="text.secondary">
                      <strong>Attachments:</strong>
                    </Typography>
                    <Stack direction="row" flexWrap="wrap" gap={1}>
                      {email.attachments.map((attachment, index) => (
                        <Chip
                          key={index}
                          label={attachment.file_name}
                          size="small"
                          icon={<Paperclip size={12} />}
                          component="a"
                          href={attachment.file_path}
                          target="_blank"
                          clickable
                          sx={{ 
                            textDecoration: 'none',
                            '&:hover': { backgroundColor: '#e0e0e0' }
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                )}

                {/* Email Body */}
                <Box 
                  sx={{ 
                    p: 2, 
                    bgcolor: 'white', 
                    borderRadius: 1, 
                    border: '1px solid #e0e0e0'
                  }}
                >
                  <Typography 
                    variant="body2" 
                    sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                    dangerouslySetInnerHTML={{ __html: email.message }}
                  />
                </Box>
              </Stack>
            </Box>
          </Collapse>
        </React.Fragment>
      ))}
    </List>
  );
};

export default EmailList; 