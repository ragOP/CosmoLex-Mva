import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Stack,
  Box,
  Alert
} from '@mui/material';
import { X, Trash2, Shield } from 'lucide-react';
import { confirmAndDeleteCommunication } from '@/api/api_services/communications';
import { toast } from 'sonner';
import OtpInput from 'react-otp-input';
import CustomButton from '@/components/CustomButton';

const DeleteConfirmationDialog = ({
  open,
  onClose,
  onSuccess,
  requestId,
  firmEmail
}) => {
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const response = await confirmAndDeleteCommunication(requestId, otp);
      
      if (response.Apistatus === true) {
        toast.success(response.message || 'Communication deleted successfully!');
        onSuccess();
        onClose();
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      console.error('Error confirming delete:', error);
      setError('Failed to confirm deletion. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setOtp('');
      setError('');
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="xs"
      fullWidth={false}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          overflow: 'hidden',
          minWidth: '400px'
        }
      }}
    >
      <DialogTitle sx={{ 
        bgcolor: '#F5F5FA', 
        color: '#40444D',
        borderBottom: '1px solid #e2e8f0',
        p: 2.5
      }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ 
            p: 1, 
            bgcolor: '#e0e7ff', 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={18} color="#4338ca" />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
            Confirm Deletion
          </Typography>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>
        <Stack spacing={2.5}>
          <Alert severity="warning" sx={{ bgcolor: '#fef3c7', color: '#92400e', py: 1, mt: 5 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              An OTP has been sent to <strong>{firmEmail}</strong> for deletion confirmation.
            </Typography>
          </Alert>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <OtpInput
                  value={otp}
                  onChange={setOtp}
                  numInputs={6}
                  renderSeparator={<span style={{ width: '8px' }} />}
                  renderInput={(props) => (
                    <input
                      {...props}
                      style={{
                        width: '40px',
                        height: '48px',
                        fontSize: '18px',
                        fontWeight: '600',
                        textAlign: 'center',
                        border: '2px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: 'white',
                        color: '#1e293b',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#7367F0';
                        e.target.style.boxShadow = '0 0 0 3px rgba(115, 103, 240, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e2e8f0';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  )}
                />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 0.5, py: 0.5 }}>
                  <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                    {error}
                  </Typography>
                </Alert>
              )}
            </Stack>
          </form>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2.5, pt: 0 }}>
        <CustomButton
          onClick={handleClose}
          disabled={isSubmitting}
          variant="secondary"
          className="w-auto px-6"
        >
          Cancel
        </CustomButton>
        <CustomButton
          onClick={handleSubmit}
          disabled={isSubmitting || !otp.trim()}
          variant="primary"
          loading={isSubmitting}
          icon={Trash2}
          iconPosition="left"
          className="w-auto px-6"
        >
          {isSubmitting ? 'Confirming...' : 'Confirm Delete'}
        </CustomButton>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteConfirmationDialog; 