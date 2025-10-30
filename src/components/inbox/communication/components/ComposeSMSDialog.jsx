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
  Divider,
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
} from '@mui/material';
import { X, MessageSquare, Send, Search, Phone } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCommunicationMeta,
  sendSMS,
  searchUsers,
} from '@/api/api_services/communications';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { usePermission } from '@/utils/usePermission';

const ComposeSMSDialog = ({ open, onClose, onSuccess, matterId }) => {
  const [showToDialog, setShowToDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    from: '',
    recipient: [],
    message: '',
  });

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Permission hooks
  const { hasPermission } = usePermission();
  const canSearchUsers = hasPermission('communications.users.search');

  // Debounce effect for search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch SMS meta data
  const { data: metaData } = useQuery({
    queryKey: ['sms-communicationMeta', matterId],
    queryFn: () => getCommunicationMeta(matterId, 2), // Type 2 for SMS
    enabled: open && !!matterId,
  });

  // Fetch SMS contacts for recipient selection (search)
  const { data: smsSearchResults, isLoading: contactsLoading } = useQuery({
    queryKey: ['sms-contacts-search', debouncedSearchTerm],
    queryFn: () =>
      searchUsers({ searchBar: debouncedSearchTerm, role_type: '' }, 2), // Type 2 for SMS
    enabled: open && debouncedSearchTerm.length > 0,
  });

  const fromPhones = metaData?.from || [];
  const metaContacts = Array.isArray(metaData?.to)
    ? metaData.to
    : metaData?.to
    ? [metaData.to]
    : [];
  const searchedContacts = smsSearchResults?.data || [];

  // Show meta data contacts if no search, otherwise show search results
  const availableContacts =
    debouncedSearchTerm.length > 0 ? searchedContacts : metaContacts;

  // Debug logging
  useEffect(() => {
    if (metaData) {
      console.log('SMS Dialog - metaData:', metaData);
      console.log('SMS Dialog - fromPhones:', fromPhones);
    }
    if (smsSearchResults) {
      console.log('SMS Dialog - smsSearchResults:', smsSearchResults);
      console.log('SMS Dialog - availableContacts:', availableContacts);
    }
  }, [metaData, fromPhones, smsSearchResults, availableContacts]);

  // Don't set any defaults - let user select manually
  useEffect(() => {
    // Reset form when dialog opens/closes
    if (!open) {
      setFormData({
        from: '',
        recipient: [],
        message: '',
      });
    }
  }, [open]);

  // Custom phone selection dialog for From field
  const [showFromPhoneDialog, setShowFromPhoneDialog] = useState(false);

  // Send SMS mutation
  const sendSMSMutation = useMutation({
    mutationFn: ({ smsData, slug }) => sendSMS(smsData, slug),
    onSuccess: (response) => {
      console.log('SMS send response:', response);

      // Check API status
      if (response?.Apistatus === true) {
        toast.success('SMS sent successfully!');
        handleClose();
        onSuccess();
      } else {
        // API returned false status
        const errorMessage = response?.message || 'Failed to send SMS';
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
      console.error('SMS send error:', error);

      // Handle different types of errors
      if (error?.response?.data) {
        const errorData = error.response.data;

        if (errorData.Apistatus === false) {
          const errorMessage = errorData.message || 'Failed to send SMS';
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
          toast.error('Failed to send SMS. Please try again.');
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
      message: '',
    });
    onClose();
  };

  const handleInputChange = (field, value) => {
    console.log(`handleInputChange called: field=${field}, value=`, value);
    if (field === 'recipient') {
      console.log(
        'Recipient value type:',
        typeof value,
        'Array?',
        Array.isArray(value)
      );
      if (Array.isArray(value)) {
        value.forEach((item, index) => {
          console.log(`Recipient[${index}]:`, item, 'Type:', typeof item);
        });
      }
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFromPhoneSelect = (phone) => {
    // Extract phone number from object if needed
    const phoneNumber =
      typeof phone === 'object' && phone !== null ? phone.number : phone;
    handleInputChange('from', phoneNumber);
    setShowFromPhoneDialog(false);
  };

  const handleSend = () => {
    if (!formData.recipient.length) {
      toast.error('Please add at least one recipient');
      return;
    }
    if (!formData.message.trim()) {
      toast.error('Please add a message');
      return;
    }

    // Format recipients properly - extract phone numbers
    const formatRecipients = (recipients) => {
      console.log('Recipients to format:', recipients);
      const formatted = recipients
        .map((recipient) => {
          // Handle different recipient object structures
          if (typeof recipient === 'string') {
            return recipient;
          }
          if (typeof recipient === 'object' && recipient !== null) {
            // Try different possible phone number fields
            const phone =
              recipient.recipient ||
              recipient.phone ||
              recipient.phoneNumber ||
              recipient.number;
            console.log(
              'Extracted phone from recipient object:',
              phone,
              'from:',
              recipient
            );
            return phone;
          }
          return recipient;
        })
        .filter((phone) => phone && phone !== ''); // Remove empty values

      console.log('Formatted recipients:', formatted);
      return formatted.join(',');
    };

    const recipientString = formatRecipients(formData.recipient);

    const smsData = {
      type: '2',
      from: formData.from,
      recipient: recipientString,
      message: formData.message,
    };

    console.log('Final SMS data being sent:', smsData);
    console.log('Recipients string:', recipientString);
    console.log('Using matterId/slug:', matterId);
    sendSMSMutation.mutate({ smsData, slug: matterId });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: '500px',
          maxHeight: '80vh',
          width: '90vw',
          maxWidth: '800px',
          borderRadius: 3,
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3">
        <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
          Compose SMS
        </h1>
        <IconButton onClick={handleClose}>
          <X className="text-black" />
        </IconButton>
      </div>

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
                      label={
                        typeof formData.from === 'object' &&
                        formData.from !== null
                          ? formData.from.number
                          : formData.from
                      }
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
                  onClick={() => setShowFromPhoneDialog(true)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Select
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* To Field */}
          <Box sx={{ px: 2, mt: 2 }}>
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
                    formData.recipient.map((recipient, index) => {
                      // Handle different recipient object structures
                      let displayLabel = '';
                      if (typeof recipient === 'string') {
                        displayLabel = recipient;
                      } else if (
                        typeof recipient === 'object' &&
                        recipient !== null
                      ) {
                        // Extract phone number from various possible fields
                        displayLabel =
                          recipient.recipient ||
                          recipient.phone ||
                          recipient.phoneNumber ||
                          recipient.number ||
                          JSON.stringify(recipient);
                        // If recipient.recipient is an object, try to extract phone number
                        if (
                          typeof displayLabel === 'object' &&
                          displayLabel !== null
                        ) {
                          displayLabel =
                            displayLabel.number ||
                            displayLabel.phone ||
                            JSON.stringify(displayLabel);
                        }
                      }

                      return (
                        <Chip
                          key={index}
                          label={displayLabel}
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
                      );
                    })
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowToDialog(true)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                  title="Search and select SMS contacts"
                  disabled={!canSearchUsers}
                >
                  Select
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Message Field */}
          <Box sx={{ px: 2, mt: 2 }}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Typography
                variant="body2"
                sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}
              >
                Message:
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={6}
                maxRows={12}
                variant="outlined"
                value={formData.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                placeholder="Type your SMS message here..."
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#e2e8f0',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea',
                  },
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions
        sx={{ p: 2, justifyContent: 'space-between', bgcolor: '#f8f9fa' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Character count: {formData.message.length}/160
          </Typography>
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleClose}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sendSMSMutation.isPending}
            className="bg-[#6366F1] text-white hover:bg-[#4e5564] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendSMSMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Sending...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Send SMS
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
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or phone number..."
              InputProps={{
                startAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', mr: 1 }}>
                    <Search size={20} color="#666" />
                  </Box>
                ),
                endAdornment: (
                  <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                    <Phone size={20} color="#666" />
                  </Box>
                ),
              }}
              sx={{ mb: 2 }}
            />

            {/* Contacts List */}
            <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
              {contactsLoading ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  Loading SMS contacts...
                </Typography>
              ) : availableContacts.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ textAlign: 'center', py: 4 }}
                >
                  {debouncedSearchTerm
                    ? `No SMS contacts found matching "${debouncedSearchTerm}"`
                    : 'No SMS contacts available'}
                </Typography>
              ) : (
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
                            console.log('Contact clicked:', contact);
                            if (isSelected) {
                              const newRecipients = formData.recipient.filter(
                                (item) => item.recipient !== contact.recipient
                              );
                              console.log(
                                'Removing recipient, new list:',
                                newRecipients
                              );
                              handleInputChange('recipient', newRecipients);
                            } else {
                              const newRecipients = [
                                ...formData.recipient,
                                contact,
                              ];
                              console.log(
                                'Adding recipient, new list:',
                                newRecipients
                              );
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
                                bgcolor: '#3b82f6',
                                fontSize: '12px',
                              }}
                            >
                              <Phone size={16} color="white" />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={
                              <Typography
                                variant="body2"
                                sx={{ fontWeight: 400 }}
                              >
                                {contact.name || 'No Name'}
                              </Typography>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {typeof contact.recipient === 'object' &&
                                contact.recipient !== null
                                  ? contact.recipient.number ||
                                    contact.recipient.phone ||
                                    JSON.stringify(contact.recipient)
                                  : contact.recipient || 'No phone number'}
                              </Typography>
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </Box>
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

      {/* Phone Selection Dialog for From field */}
      <Dialog
        open={showFromPhoneDialog}
        onClose={() => setShowFromPhoneDialog(false)}
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
            <Typography variant="h6">Select Sender Phone</Typography>
            <IconButton
              onClick={() => setShowFromPhoneDialog(false)}
              size="small"
            >
              <X size={20} />
            </IconButton>
          </Stack>
        </DialogTitle>
        <Divider />
        <DialogContent sx={{ p: 0 }}>
          <Stack spacing={2} sx={{ p: 2 }}>
            {fromPhones.length > 0 ? (
              <List sx={{ p: 0 }}>
                {fromPhones.map((phone, index) => (
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
                      onClick={() => handleFromPhoneSelect(phone)}
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
                            bgcolor: '#3b82f6',
                            fontSize: '14px',
                          }}
                        >
                          <MessageSquare size={20} color="white" />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {typeof phone === 'object' && phone !== null
                              ? phone.number
                              : phone}
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
                No phone numbers available
              </Typography>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ComposeSMSDialog;
