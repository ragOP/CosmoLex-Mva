import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    Chip,
    Autocomplete,
    IconButton,
    Typography,
    Divider,
    Box
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { X, Paperclip, Send, ChevronDown, ChevronUp } from 'lucide-react';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
    getCommunicationMeta,
    composeEmail
} from '@/api/api_services/communications';
import { toast } from 'sonner';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ContactSelectionDialog from './ContactSelectionDialog';

const ComposeEmailDialog = ({ open, onClose, onSuccess, matterId }) => {
    const [showCcBcc, setShowCcBcc] = useState(false);
    const [attachments, setAttachments] = useState([]);
    const [showFromDialog, setShowFromDialog] = useState(false);
    const [showToDialog, setShowToDialog] = useState(false);
    const [showCcDialog, setShowCcDialog] = useState(false);
    const [showBccDialog, setShowBccDialog] = useState(false);
    const [formData, setFormData] = useState({
        from: '',
        recipient: [],
        cc: [],
        bcc: [],
        subject: '',
        message: ''
    });

    // Fetch meta data for from emails
    const { data: metaData } = useQuery({
        queryKey: ['communicationMeta', matterId],
        queryFn: () => getCommunicationMeta(matterId),
        enabled: open
    });



    const fromEmails = metaData?.from || [];

    // Set default from email when meta data loads
    useEffect(() => {
        if (fromEmails.length > 0 && !formData.from) {
            setFormData(prev => ({ ...prev, from: fromEmails[0].email }));
        }
    }, [fromEmails, formData.from]);



    // Compose email mutation
    const composeEmailMutation = useMutation({
        mutationFn: composeEmail,
        onSuccess: () => {
            toast.success('Email sent successfully!');
            handleClose();
            onSuccess();
        },
        onError: (error) => {
            toast.error('Failed to send email. Please try again.');
            console.error('Email send error:', error);
        }
    });

    const handleClose = () => {
        setFormData({
            from: fromEmails[0]?.email || '',
            recipient: [],
            cc: [],
            bcc: [],
            subject: '',
            message: ''
        });
        setAttachments([]);
        setShowCcBcc(false);
        onClose();
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFileAttachment = (event) => {
        const files = Array.from(event.target.files);
        setAttachments(prev => [...prev, ...files]);
    };

    const removeAttachment = (index) => {
        setAttachments(prev => prev.filter((_, i) => i !== index));
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

        const emailData = {
            type: '1',
            from: formData.from,
            recipient: formData.recipient.join(','),
            cc: formData.cc.join(','),
            bcc: formData.bcc.join(','),
            subject: formData.subject,
            message: formData.message,
            attachments
        };

        composeEmailMutation.mutate(emailData);
    };



    return (
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
                    maxWidth: '1200px'
                }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
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
                    <Box sx={{ px: 2, mt: 2, }}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="body2" sx={{ minWidth: 60, color: '#666', fontWeight: 500, }}>
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
                    <Box sx={{ p: 2 }}>
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
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setShowToDialog(true)}
                                        className="border-gray-300 text-gray-600 hover:bg-gray-50"
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
                                    <Typography variant="body2" sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}>
                                        Cc:
                                    </Typography>
                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 32, flex: 1 }}>
                                            {formData.cc.length > 0 ? (
                                                formData.cc.map((recipient, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={recipient.name || recipient.recipient}
                                                        onDelete={() => {
                                                            const newRecipients = formData.cc.filter((_, i) => i !== index);
                                                            handleInputChange('cc', newRecipients);
                                                        }}
                                                        size="small"
                                                        sx={{ bgcolor: '#fff3e0', color: '#f57c00' }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    No CC recipients selected
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowCcDialog(true)}
                                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
                                        >
                                            Select
                                        </Button>
                                    </Box>
                                </Stack>
                            </Box>

                            <Box sx={{ p: 2 }}>
                                <Stack direction="row" alignItems="flex-start" spacing={2}>
                                    <Typography variant="body2" sx={{ minWidth: 60, color: '#666', mt: 1, fontWeight: 500 }}>
                                        Bcc:
                                    </Typography>
                                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, minHeight: 32, flex: 1 }}>
                                            {formData.bcc.length > 0 ? (
                                                formData.bcc.map((recipient, index) => (
                                                    <Chip
                                                        key={index}
                                                        label={recipient.name || recipient.recipient}
                                                        onDelete={() => {
                                                            const newRecipients = formData.bcc.filter((_, i) => i !== index);
                                                            handleInputChange('bcc', newRecipients);
                                                        }}
                                                        size="small"
                                                        sx={{ bgcolor: '#fce4ec', color: '#c2185b' }}
                                                    />
                                                ))
                                            ) : (
                                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                                    No BCC recipients selected
                                                </Typography>
                                            )}
                                        </Box>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setShowBccDialog(true)}
                                            className="border-gray-300 text-gray-600 hover:bg-gray-50"
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
                            <Typography variant="body2" sx={{ minWidth: 60, color: '#666' }}>
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
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
                                    '& .MuiInputBase-root': {
                                        fontSize: '14px',
                                        padding: '8px 0',
                                        mt: 0.5
                                    }
                                }}
                            />
                        </Stack>
                    </Box>

                    {/* Message Body */}
                    <Box sx={{ p: 2, flex: 1 }}>
                        <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
                            Message:
                        </Typography>
                        <Box sx={{
                            border: '1px solid #e0e0e0',
                            borderRadius: 1,
                            minHeight: '400px',
                            '& .ql-editor': {
                                minHeight: '350px',
                                fontSize: '14px',
                                lineHeight: 1.6,
                                fontFamily: 'inherit'
                            },
                            '& .ql-toolbar': {
                                borderTop: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderBottom: '1px solid #e0e0e0'
                            }
                        }}>
                            <ReactQuill
                                theme="snow"
                                value={formData.message}
                                onChange={(value) => handleInputChange('message', value)}
                                placeholder="Compose your message..."
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, 3, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'color': [] }, { 'background': [] }],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        [{ 'align': [] }],
                                        ['link', 'image'],
                                        ['clean']
                                    ]
                                }}
                            />
                        </Box>
                    </Box>

                    {/* Attachments */}
                    {attachments.length > 0 && (
                        <Box sx={{ px: 2, pb: 4  }}>
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

            <DialogActions sx={{ p: 2, justifyContent: 'space-between', bgcolor: '#f8f9fa' }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <input
                        type="file"
                        multiple
                        onChange={handleFileAttachment}
                        style={{ display: 'none' }}
                        id="attachment-input"
                    />
                    <label htmlFor="attachment-input">
                        <IconButton
                            component="span"
                            size="small"
                            sx={{
                                p: 1.5,
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: '#e3f2fd'
                                }
                            }}
                        >
                            <Paperclip size={18} color="#666" />
                        </IconButton>
                    </label>
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
                        className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
                    >
                        <Send size={16} className="mr-2" />
                        {composeEmailMutation.isPending ? 'Sending...' : 'Send'}
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
                title="Select Sender Email"
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

            <ContactSelectionDialog
                open={showCcDialog}
                onClose={() => setShowCcDialog(false)}
                onSelect={(contacts) => {
                    handleInputChange('cc', contacts);
                }}
                title="Select CC Recipients"
                matterId={matterId}
                selectedContacts={formData.cc}
                multiple={true}
            />

            <ContactSelectionDialog
                open={showBccDialog}
                onClose={() => setShowBccDialog(false)}
                onSelect={(contacts) => {
                    handleInputChange('bcc', contacts);
                }}
                title="Select BCC Recipients"
                matterId={matterId}
                selectedContacts={formData.bcc}
                multiple={true}
            />
        </Dialog>
    );
};

export default ComposeEmailDialog; 