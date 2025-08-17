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
  Typography
} from '@mui/material';
import { X, MessageSquare, Send } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  getCommunicationMeta, 
  sendSMS 
} from '@/api/api_services/communications';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import ContactSelectionDialog from './ContactSelectionDialog';

const ComposeSMSDialog = ({ open, onClose, onSuccess, matterId }) => {
  const [showFromDialog, setShowFromDialog] = useState(false);
  const [showToDialog, setShowToDialog] = useState(false);
  const [formData, setFormData] = useState({
    from: '',
    recipient: [],
    message: ''
  });

  // Fetch meta data for from phone numbers
  const { data: metaData } = useQuery({
    queryKey: ['communicationMeta', matterId, 'sms'],
    queryFn: () => getCommunicationMeta(matterId),
    enabled: open
  });

  const fromPhones = metaData?.from || [];

  // Set default from phone when meta data loads
  useEffect(() => {
    if (fromPhones.length > 0 && !formData.from) {
      setFormData(prev => ({ ...prev, from: fromPhones[0] }));
    }
  }, [fromPhones, formData.from]);

  // Send SMS mutation
  const sendSMSMutation = useMutation({
    mutationFn: sendSMS,
    onSuccess: () => {
      toast.success('SMS sent successfully!');
      handleClose();
      onSuccess();
    },
    onError: (error) => {
      toast.error('Failed to send SMS. Please try again.');
      console.error('SMS send error:', error);
    }
  });

  const handleClose = () => {
    setFormData({
      from: fromPhones[0] || '',
      recipient: [],
      message: ''
    });
    onClose();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

    const smsData = {
      type: '2',
      from: formData.from,
      recipient: formData.recipient.join(','),
      message: formData.message
    };

    sendSMSMutation.mutate(smsData);
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
          overflow: 'hidden'
        }
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
              <Typography variant="body2" sx={{ minWidth: 60, color: '#666', fontWeight: 500 }}>
                From:
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {formData.from ? (
                    <Chip
                      label={formData.from}
                      onDelete={() => handleInputChange('from', '')}
                      size="small"
                      sx={{ bgcolor: '#e3f2fd', color: '#1976d2' }}
                    />
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No sender selected
                    </Typography>
                  )}
                </Box>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowFromDialog(true)}
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
              <Typography variant="body2" sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}>
                To:
              </Typography>
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, flex: 1 }}>
                  {formData.recipient.length > 0 ? (
                    formData.recipient.map((recipient, index) => (
                      <Chip
                        key={index}
                        label={recipient.name || recipient.recipient}
                        onDelete={() => {
                          const newRecipients = formData.recipient.filter((_, i) => i !== index);
                          handleInputChange('recipient', newRecipients);
                        }}
                        size="small"
                        sx={{ bgcolor: '#e8f5e8', color: '#2e7d32' }}
                      />
                    ))
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      No recipients selected
                    </Typography>
                  )}
                </Box>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowToDialog(true)}
                  className="border-gray-300 text-gray-600 hover:bg-gray-50"
                >
                  Select
                </Button>
              </Box>
            </Stack>
          </Box>

          {/* Message Field */}
          <Box sx={{ px: 2, mt: 2 }}>
            <Stack direction="row" alignItems="flex-start" spacing={2}>
              <Typography variant="body2" sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}>
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
                    borderColor: '#e2e8f0'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#cbd5e1'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#667eea'
                  }
                }}
              />
            </Stack>
          </Box>
        </Stack>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
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
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
          >
            <Send size={16} className="mr-2" />
            {sendSMSMutation.isPending ? 'Sending...' : 'Send SMS'}
          </Button>
        </Stack>
      </DialogActions>

      {/* Contact Selection Dialogs */}
      <ContactSelectionDialog
        open={showFromDialog}
        onClose={() => setShowFromDialog(false)}
        onSelect={(contacts) => {
          if (contacts.length > 0) {
            handleInputChange('from', contacts[0].recipient);
          }
        }}
        title="Select Sender Phone"
        matterId={matterId}
        selectedContacts={formData.from ? [{ recipient: formData.from, name: '' }] : []}
        multiple={false}
      />

      <ContactSelectionDialog
        open={showToDialog}
        onClose={() => setShowToDialog(false)}
        onSelect={(contacts) => {
          handleInputChange('recipient', contacts);
        }}
        title="Select Recipients"
        matterId={matterId}
        selectedContacts={formData.recipient}
        multiple={true}
      />
    </Dialog>
  );
};

export default ComposeSMSDialog; 