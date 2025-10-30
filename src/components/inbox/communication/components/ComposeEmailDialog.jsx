import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack,
  Chip,
  IconButton,
  Typography,
  Divider,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
} from '@mui/material';
import { Button } from '@/components/ui/button';
import {
  X,
  Paperclip,
  Send,
  ChevronDown,
  ChevronUp,
  Search,
  Mail,
} from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCommunicationMeta,
  composeEmail,
  searchUsers,
} from '@/api/api_services/communications';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import UploadMediaDialog from '@/components/UploadMediaDialog';
import PermissionGuard from '@/components/auth/PermissionGuard';
import { usePermission } from '@/utils/usePermission';

const ComposeEmailDialog = ({ open, onClose, onSuccess, matterId }) => {
  const [attachments, setAttachments] = useState([]);
  const [showToDialog, setShowToDialog] = useState(false);
  const [showCcDialog, setShowCcDialog] = useState(false);
  const [showBccDialog, setShowBccDialog] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [fromSearchTerm, setFromSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    from: '',
    recipient: [],
    cc: [],
    bcc: [],
    subject: '',
    message: '',
  });

  // Upload media dialog state
  const [showUploadMediaDialog, setShowUploadMediaDialog] = useState(false);

  // Permission hooks
  const { hasPermission } = usePermission();
  const canUploadAttachment = hasPermission(
    'communications.attachments.upload'
  );
  const canSearchUsers = hasPermission('communications.users.search');

  // Debounced search terms
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [debouncedFromSearchTerm, setDebouncedFromSearchTerm] = useState('');

  // Debounce effect for recipient search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Debounce effect for from search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFromSearchTerm(fromSearchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [fromSearchTerm]);

  // Fetch email meta data
  const { data: metaData } = useQuery({
    queryKey: ['email-communicationMeta', matterId],
    queryFn: () => getCommunicationMeta(matterId, 1), // Type 1 for emails
    enabled: open,
  });

  // Search for From email addresses (independent search)
  const { data: fromSearchResults } = useQuery({
    queryKey: ['email-from-search', debouncedFromSearchTerm],
    queryFn: () =>
      searchUsers({ searchBar: debouncedFromSearchTerm, role_type: '' }, 1),
    enabled: open && debouncedFromSearchTerm.length > 0,
  });

  // Search for To/CC/BCC recipients (independent search)
  const { data: recipientSearchResults, isLoading: recipientsLoading } =
    useQuery({
      queryKey: ['email-recipients-search', debouncedSearchTerm],
      queryFn: () =>
        searchUsers({ searchBar: debouncedSearchTerm, role_type: '' }, 1),
      enabled: open && debouncedSearchTerm.length > 0,
    });

  const fromEmails = metaData?.from || [];
  const fromSearchContacts = fromSearchResults?.data || [];
  const allAvailableContacts = Array.isArray(metaData?.to)
    ? metaData.to
    : metaData?.to
    ? [metaData.to]
    : [];
  const searchedContacts = recipientSearchResults?.data || [];

  // For To/CC/BCC: Show meta data contacts if no search, otherwise show search results
  const availableContacts =
    debouncedSearchTerm.length > 0 ? searchedContacts : allAvailableContacts;

  // Debug logging
  useEffect(() => {
    if (metaData) {
      console.log('Email Dialog - metaData:', metaData);
      console.log('Email Dialog - fromEmails:', fromEmails);
      console.log('Email Dialog - allAvailableContacts:', allAvailableContacts);
      console.log(
        'Email Dialog - availableContacts (filtered):',
        availableContacts
      );
      console.log('Email Dialog - searchTerm:', searchTerm);
    }
  }, [
    metaData,
    fromEmails,
    allAvailableContacts,
    availableContacts,
    searchTerm,
  ]);

  // Don't set any defaults - let user select manually
  useEffect(() => {
    // Reset form when dialog opens/closes
    if (!open) {
      setFormData({
        from: '',
        recipient: [],
        cc: [],
        bcc: [],
        subject: '',
        message: '',
      });
      setAttachments([]);
      setShowCcBcc(false);
    }
  }, [open]);

  // Custom email selection dialog for From field
  const [showFromEmailDialog, setShowFromEmailDialog] = useState(false);

  // Compose email mutation
  const composeEmailMutation = useMutation({
    mutationFn: ({ emailData, slug }) => composeEmail(emailData, slug),
    onSuccess: (response) => {
      console.log('Email send response:', response);

      // Check API status
      if (response?.Apistatus === true) {
        toast.success('Email sent successfully!');
        handleClose();
        onSuccess();
      } else {
        // API returned false status
        const errorMessage = response?.message || 'Failed to send email';
        toast.error(`Send failed: ${errorMessage}`);

        // Show validation errors if present
        if (response?.errors) {
          Object.entries(response.errors).forEach(([field, messages]) => {
            messages.forEach((message) => {
              toast.error(`${field}: ${message}`);
            });
          });
        }
      }
    },
    onError: (error) => {
      console.error('Email send error:', error);

      // Handle different types of errors
      if (error?.response?.data) {
        const errorData = error.response.data;

        if (errorData.Apistatus === false) {
          const errorMessage = errorData.message || 'Failed to send email';
          toast.error(`Send failed: ${errorMessage}`);

          // Show validation errors
          if (errorData.errors) {
            Object.entries(errorData.errors).forEach(([field, messages]) => {
              messages.forEach((message) => {
                toast.error(`${field}: ${message}`);
              });
            });
          }
        } else {
          toast.error('Failed to send email. Please try again.');
        }
      } else {
        toast.error(
          'Network error. Please check your connection and try again.'
        );
      }
    },
  });

  const handleClose = () => {
    setFormData({
      from: '',
      recipient: [],
      cc: [],
      bcc: [],
      subject: '',
      message: '',
    });
    setAttachments([]);
    setShowCcBcc(false);
    onClose();
  };

  const handleInputChange = (field, value) => {
    console.log(`handleInputChange called: field=${field}, value=`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFromEmailSelect = (email) => {
    handleInputChange('from', email);
    setShowFromEmailDialog(false);
  };

  const handleFileAttachment = (event) => {
    const files = Array.from(event.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!formData.recipient.length) {
      toast.error('Please add at least one recipient');
      return;
    }
    if (!formData.subject.trim()) {
      toast.error('Please add a subject');
      return;
    }

    // Format recipients properly - extract email addresses
    const formatRecipients = (recipients) => {
      return recipients
        .map((recipient) => recipient.recipient || recipient.email || recipient)
        .join(',');
    };

    const emailData = {
      type: '1',
      from: formData.from,
      recipient: formatRecipients(formData.recipient),
      cc: formatRecipients(formData.cc),
      bcc: formatRecipients(formData.bcc),
      subject: formData.subject,
      message: formData.message,
      attachments,
    };

    console.log('Sending email data:', emailData);
    console.log('Using matterId/slug:', matterId);
    composeEmailMutation.mutate({ emailData, slug: matterId });
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="lg"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '700px',
            maxHeight: '95vh',
            width: '90vw',
            maxWidth: '1200px',
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">New Message</Typography>
            <IconButton onClick={handleClose} size="small">
              <X size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>

        <Divider />

        <DialogContent sx={{ p: 0 }}>
          <Stack spacing={0}>
            {/* From Field */}
            <Box sx={{ px: 2, mt: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 60, color: '#666', fontWeight: 500 }}
                >
                  From:
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.from ? (
                      <Chip
                        label={formData.from}
                        onDelete={() => handleInputChange('from', '')}
                        deleteIcon={<X size={16} />}
                        size="small"
                        sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                      />
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        No sender selected
                      </Typography>
                    )}
                  </Box>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowFromEmailDialog(true)}
                    className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Select
                  </Button>
                </Box>
              </Stack>
            </Box>

            {/* To Field */}
            <Box sx={{ p: 2 }}>
              <Stack direction="row" alignItems="flex-start" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}
                >
                  To:
                </Typography>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}
                  >
                    {formData.recipient.length > 0 ? (
                      formData.recipient.map((recipient, index) => (
                        <Chip
                          key={index}
                          label={
                            recipient.recipient || recipient.email || recipient
                          }
                          onDelete={() => {
                            const newRecipients = formData.recipient.filter(
                              (_, i) => i !== index
                            );
                            handleInputChange('recipient', newRecipients);
                          }}
                          deleteIcon={<X size={16} />}
                          size="small"
                          sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}
                        />
                      ))
                    ) : (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontStyle: 'italic' }}
                      >
                        No recipients selected
                      </Typography>
                    )}
                  </Box>
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowToDialog(true)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                      title="Search and select email contacts"
                      disabled={!canSearchUsers}
                    >
                      Select
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCcBcc(!showCcBcc)}
                      className="border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      {showCcBcc ? 'Hide CC/BCC' : 'Add CC/BCC'}
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            {/* CC/BCC Fields */}
            {showCcBcc && (
              <>
                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 60,
                        color: '#666',
                        mt: 1,
                        fontWeight: 500,
                      }}
                    >
                      Cc:
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          minHeight: 32,
                          flex: 1,
                        }}
                      >
                        {formData.cc.length > 0 ? (
                          formData.cc.map((recipient, index) => (
                            <Chip
                              key={index}
                              label={
                                recipient.recipient ||
                                recipient.email ||
                                recipient
                              }
                              onDelete={() => {
                                const newRecipients = formData.cc.filter(
                                  (_, i) => i !== index
                                );
                                handleInputChange('cc', newRecipients);
                              }}
                              deleteIcon={<X size={16} />}
                              size="small"
                              sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                            />
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            No CC recipients selected
                          </Typography>
                        )}
                      </Box>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowCcDialog(true)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        disabled={!canSearchUsers}
                      >
                        Select
                      </Button>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{ p: 2 }}>
                  <Stack direction="row" alignItems="flex-start" spacing={2}>
                    <Typography
                      variant="body2"
                      sx={{
                        minWidth: 60,
                        color: '#666',
                        mt: 1,
                        fontWeight: 500,
                      }}
                    >
                      Bcc:
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: 1,
                          minHeight: 32,
                          flex: 1,
                        }}
                      >
                        {formData.bcc.length > 0 ? (
                          formData.bcc.map((recipient, index) => (
                            <Chip
                              key={index}
                              label={
                                recipient.recipient ||
                                recipient.email ||
                                recipient
                              }
                              onDelete={() => {
                                const newRecipients = formData.bcc.filter(
                                  (_, i) => i !== index
                                );
                                handleInputChange('bcc', newRecipients);
                              }}
                              deleteIcon={<X size={16} />}
                              size="small"
                              sx={{ bgcolor: '#fce4ec', color: '#c2185b' }}
                            />
                          ))
                        ) : (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ fontStyle: 'italic' }}
                          >
                            No BCC recipients selected
                          </Typography>
                        )}
                      </Box>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowBccDialog(true)}
                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
                        disabled={!canSearchUsers}
                      >
                        Select
                      </Button>
                    </Box>
                  </Stack>
                </Box>
              </>
            )}

            {/* Subject Field */}
            <Box sx={{ px: 2 }}>
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography
                  variant="body2"
                  sx={{ minWidth: 60, color: '#666' }}
                >
                  Subject:
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  variant="standard"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  placeholder="Subject"
                  sx={{
                    '& .MuiInput-underline:before': { borderBottom: 'none' },
                    '& .MuiInput-underline:after': { borderBottom: 'none' },
                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                      borderBottom: 'none',
                    },
                    '& .MuiInputBase-root': {
                      fontSize: '14px',
                      padding: '8px 0',
                      mt: 0.5,
                    },
                  }}
                />
              </Stack>
            </Box>

            {/* Message Body */}
            <Box sx={{ p: 2, flex: 1 }}>
              <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                Message:
              </Typography>
              <Box
                sx={{
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  minHeight: '400px',
                  '& .ql-editor': {
                    minHeight: '350px',
                    fontSize: '14px',
                    lineHeight: 1.6,
                    fontFamily: 'inherit',
                  },
                  '& .ql-toolbar': {
                    borderTop: 'none',
                    borderLeft: 'none',
                    borderRight: 'none',
                    borderBottom: '1px solid #e0e0e0',
                  },
                }}
              >
                <ReactQuill
                  theme="snow"
                  value={formData.message}
                  onChange={(value) => handleInputChange('message', value)}
                  placeholder="Compose your message..."
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ color: [] }, { background: [] }],
                      [{ list: 'ordered' }, { list: 'bullet' }],
                      [{ align: [] }],
                      ['link', 'image'],
                      ['clean'],
                    ],
                  }}
                />
              </Box>
            </Box>

            {/* Attachments */}
            {attachments.length > 0 && (
              <Box sx={{ px: 2, pb: 4 }}>
                <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                  Attachments:
                </Typography>
                <Stack direction="row" flexWrap="wrap" gap={1}>
                  {attachments.map((file, index) => (
                    <Chip
                      key={index}
                      label={file.name}
                      size="small"
                      onDelete={() => removeAttachment(index)}
                      icon={<Paperclip size={14} />}
                    />
                  ))}
                </Stack>
              </Box>
            )}
          </Stack>
        </DialogContent>

        <Divider />

        <DialogActions
          sx={{ p: 2, justifyContent: 'space-between', bgcolor: '#f8f9fa' }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <PermissionGuard permission="communications.attachments.upload">
              <input
                type="file"
                multiple
                onChange={handleFileAttachment}
                style={{ display: 'none' }}
                id="attachment-input"
              />
              <label htmlFor="attachment-input">
                <IconButton
                  // onClick={() => setShowUploadMediaDialog(true)}
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
            </PermissionGuard>
          </Stack>

          <Stack direction="row" spacing={2}>
            <Button
              onClick={handleClose}
              className="bg-gray-300 text-black hover:bg-gray-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSend}
              disabled={composeEmailMutation.isPending}
              className="bg-[#6366F1] text-white hover:bg-[#4e5564] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {composeEmailMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} className="mr-2" />
                  Send Email
                </>
              )}
            </Button>
          </Stack>
        </DialogActions>

        {/* Contact Selection Dialogs */}
        <Dialog
          open={showToDialog}
          onClose={() => setShowToDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Select Recipients</Typography>
              <IconButton onClick={() => setShowToDialog(false)} size="small">
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small">
                      <Search size={18} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      disabled={!searchTerm}
                    >
                      <X size={18} />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '14px',
                    padding: '8px 12px',
                  },
                }}
              />
              {availableContacts.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {availableContacts.map((contact, index) => {
                    const isSelected = formData.recipient.some(
                      (item) => item.recipient === contact.recipient
                    );
                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{
                          borderRadius: 1,
                          mb: 0.25,
                          '&:hover': {
                            bgcolor: '#f9fafb',
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() => {
                            const selectedContact = {
                              name: contact.name,
                              recipient: contact.recipient,
                              id: contact.id,
                            };
                            if (isSelected) {
                              // Remove contact
                              const newRecipients = formData.recipient.filter(
                                (item) => item.recipient !== contact.recipient
                              );
                              handleInputChange('recipient', newRecipients);
                            } else {
                              // Add contact
                              const newRecipients = [
                                ...formData.recipient,
                                selectedContact,
                              ];
                              handleInputChange('recipient', newRecipients);
                            }
                          }}
                          sx={{
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            sx={{
                              color: '#9ca3af',
                              '&.Mui-checked': {
                                color: '#7367F0',
                              },
                            }}
                          />
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#1976d2',
                                fontSize: '12px',
                              }}
                            >
                              {contact.recipient?.charAt(0)?.toUpperCase() ||
                                'C'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 400 }}
                              >
                                {contact.name || contact.recipient}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {contact.recipient}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : recipientsLoading ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  Searching recipients...
                </Typography>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  {debouncedSearchTerm
                    ? `No recipients found for "${debouncedSearchTerm}"`
                    : 'No recipients found'}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {formData.recipient.length} recipient(s) selected
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => setShowToDialog(false)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowToDialog(false)}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              >
                Done
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>

        {/* CC Contact Selection Dialog */}
        <Dialog
          open={showCcDialog}
          onClose={() => setShowCcDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Select CC Recipients</Typography>
              <IconButton onClick={() => setShowCcDialog(false)} size="small">
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search CC recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small">
                      <Search size={18} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      disabled={!searchTerm}
                    >
                      <X size={18} />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '14px',
                    padding: '8px 12px',
                  },
                }}
              />
              {availableContacts.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {availableContacts.map((contact, index) => {
                    const isSelected = formData.cc.some(
                      (item) => item.recipient === contact.recipient
                    );
                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{
                          borderRadius: 1,
                          mb: 0.25,
                          '&:hover': {
                            bgcolor: '#f9fafb',
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() => {
                            const selectedContact = {
                              name: contact.name,
                              recipient: contact.recipient,
                              id: contact.id,
                            };
                            if (isSelected) {
                              // Remove contact
                              const newRecipients = formData.cc.filter(
                                (item) => item.recipient !== contact.recipient
                              );
                              handleInputChange('cc', newRecipients);
                            } else {
                              // Add contact
                              const newRecipients = [
                                ...formData.cc,
                                selectedContact,
                              ];
                              handleInputChange('cc', newRecipients);
                            }
                          }}
                          sx={{
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            sx={{
                              color: '#9ca3af',
                              '&.Mui-checked': {
                                color: '#f57c00',
                              },
                            }}
                          />
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#f57c00',
                                fontSize: '12px',
                              }}
                            >
                              {contact.recipient?.charAt(0)?.toUpperCase() ||
                                'C'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 400 }}
                              >
                                {contact.name || contact.recipient}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {contact.recipient}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  {debouncedSearchTerm
                    ? `No CC recipients found for "${debouncedSearchTerm}"`
                    : 'No CC recipients found'}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {formData.cc.length} CC recipient(s) selected
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => setShowCcDialog(false)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowCcDialog(false)}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              >
                Done
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>

        {/* BCC Contact Selection Dialog */}
        <Dialog
          open={showBccDialog}
          onClose={() => setShowBccDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Select BCC Recipients</Typography>
              <IconButton onClick={() => setShowBccDialog(false)} size="small">
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search BCC recipients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small">
                      <Search size={18} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => setSearchTerm('')}
                      disabled={!searchTerm}
                    >
                      <X size={18} />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '14px',
                    padding: '8px 12px',
                  },
                }}
              />
              {availableContacts.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {availableContacts.map((contact, index) => {
                    const isSelected = formData.bcc.some(
                      (item) => item.recipient === contact.recipient
                    );
                    return (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{
                          borderRadius: 1,
                          mb: 0.25,
                          '&:hover': {
                            bgcolor: '#f9fafb',
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() => {
                            const selectedContact = {
                              name: contact.name,
                              recipient: contact.recipient,
                              id: contact.id,
                            };
                            if (isSelected) {
                              // Remove contact
                              const newRecipients = formData.bcc.filter(
                                (item) => item.recipient !== contact.recipient
                              );
                              handleInputChange('bcc', newRecipients);
                            } else {
                              // Add contact
                              const newRecipients = [
                                ...formData.bcc,
                                selectedContact,
                              ];
                              handleInputChange('bcc', newRecipients);
                            }
                          }}
                          sx={{
                            borderRadius: 1,
                            py: 0.5,
                            px: 1,
                          }}
                        >
                          <Checkbox
                            checked={isSelected}
                            sx={{
                              color: '#9ca3af',
                              '&.Mui-checked': {
                                color: '#c2185b',
                              },
                            }}
                          />
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: '#c2185b',
                                fontSize: '12px',
                              }}
                            >
                              {contact.recipient?.charAt(0)?.toUpperCase() ||
                                'B'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 400 }}
                              >
                                {contact.name || contact.recipient}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {contact.recipient}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  {debouncedSearchTerm
                    ? `No BCC recipients found for "${debouncedSearchTerm}"`
                    : 'No BCC recipients found'}
                </Typography>
              )}
            </Stack>
          </DialogContent>
          <Divider />
          <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">
              {formData.bcc.length} BCC recipient(s) selected
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                onClick={() => setShowBccDialog(false)}
                className="bg-gray-300 text-black hover:bg-gray-400"
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowBccDialog(false)}
                className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
              >
                Done
              </Button>
            </Stack>
          </DialogActions>
        </Dialog>

        {/* Custom Email Selection Dialog for From field */}
        <Dialog
          open={showFromEmailDialog}
          onClose={() => setShowFromEmailDialog(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 },
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6">Select Sender Email</Typography>
              <IconButton
                onClick={() => setShowFromEmailDialog(false)}
                size="small"
              >
                <X size={20} />
              </IconButton>
            </Stack>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ p: 0 }}>
            <Stack spacing={2} sx={{ p: 2 }}>
              {/* Search Field for From emails */}
              <TextField
                fullWidth
                size="small"
                variant="outlined"
                placeholder="Search sender emails..."
                value={fromSearchTerm}
                onChange={(e) => setFromSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <IconButton size="small">
                      <Search size={18} />
                    </IconButton>
                  ),
                  endAdornment: (
                    <IconButton
                      size="small"
                      onClick={() => setFromSearchTerm('')}
                      disabled={!fromSearchTerm}
                    >
                      <X size={18} />
                    </IconButton>
                  ),
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    fontSize: '14px',
                    padding: '8px 12px',
                  },
                }}
              />

              {/* Show meta data emails if no search, otherwise show search results */}
              {debouncedFromSearchTerm.length > 0 ? (
                // Show search results
                fromSearchContacts.length > 0 ? (
                  <List sx={{ p: 0 }}>
                    {fromSearchContacts.map((contact, index) => (
                      <ListItem
                        key={index}
                        disablePadding
                        sx={{
                          borderRadius: 1,
                          mb: 0.25,
                          '&:hover': {
                            bgcolor: '#f9fafb',
                          },
                        }}
                      >
                        <ListItemButton
                          onClick={() =>
                            handleFromEmailSelect(contact.recipient)
                          }
                          sx={{
                            borderRadius: 1,
                            py: 1,
                            px: 2,
                          }}
                        >
                          <ListItemAvatar>
                            <Avatar
                              sx={{
                                width: 40,
                                height: 40,
                                bgcolor: '#1976d2',
                                fontSize: '14px',
                              }}
                            >
                              {contact.recipient?.charAt(0)?.toUpperCase() ||
                                'E'}
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 500 }}
                              >
                                {contact.name || contact.recipient}
                              </Typography>
                            }
                            secondary={contact.recipient}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', py: 4 }}
                  >
                    No sender emails found for "{debouncedFromSearchTerm}"
                  </Typography>
                )
              ) : // Show meta data emails
              fromEmails.length > 0 ? (
                <List sx={{ p: 0 }}>
                  {fromEmails.map((emailObj, index) => (
                    <ListItem
                      key={index}
                      disablePadding
                      sx={{
                        borderRadius: 1,
                        mb: 0.25,
                        '&:hover': {
                          bgcolor: '#f9fafb',
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => handleFromEmailSelect(emailObj.email)}
                        sx={{
                          borderRadius: 1,
                          py: 1,
                          px: 2,
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: '#1976d2',
                              fontSize: '14px',
                            }}
                          >
                            {emailObj.email?.charAt(0)?.toUpperCase() || 'E'}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 500 }}
                            >
                              {emailObj.email}
                            </Typography>
                          }
                          secondary="Click to select as sender"
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  No email addresses available
                </Typography>
              )}
            </Stack>
          </DialogContent>
        </Dialog>
      </Dialog>

      <UploadMediaDialog
        open={showUploadMediaDialog}
        onClose={() => setShowUploadMediaDialog(false)}
        onSubmit={(payload) => console.log('Upload media', payload)}
        // isLoading={isUploadingFile}
      />
    </>
  );
};

export default ComposeEmailDialog;
