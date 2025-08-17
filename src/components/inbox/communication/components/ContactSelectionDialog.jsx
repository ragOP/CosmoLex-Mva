import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemButton,
    Avatar,
    Typography,
    IconButton,
    Checkbox,
    Box,
    Divider
} from '@mui/material';
import { Button } from '@/components/ui/button';
import { X, Search, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { searchUsers } from '@/api/api_services/communications';

const ContactSelectionDialog = ({
    open,
    onClose,
    onSelect,
    title,
    matterId,
    selectedContacts = [],
    multiple = true
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedItems, setSelectedItems] = useState(selectedContacts);

    // Search users query
    const { data: usersData, isLoading } = useQuery({
        queryKey: ['searchUsers', matterId, searchTerm],
        queryFn: () => searchUsers(matterId, { searchBar: searchTerm, role_type: '' }),
        enabled: open && !!matterId
    });

    const users = usersData?.data || [];

    useEffect(() => {
        setSelectedItems(selectedContacts);
    }, [selectedContacts]);

    const handleContactSelect = (contact) => {
        if (multiple) {
            const isSelected = selectedItems.some(item => item.recipient === contact.recipient);
            if (isSelected) {
                setSelectedItems(prev => prev.filter(item => item.recipient !== contact.recipient));
            } else {
                setSelectedItems(prev => [...prev, contact]);
            }
        } else {
            // For single selection, toggle the selection
            const isSelected = selectedItems.some(item => item.recipient === contact.recipient);
            if (isSelected) {
                setSelectedItems([]);
            } else {
                setSelectedItems([contact]);
            }
        }
    };

    const handleConfirm = () => {
        onSelect(selectedItems);
        onClose();
    };

    const handleClose = () => {
        setSelectedItems(selectedContacts);
        setSearchTerm('');
        onClose();
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

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2 }
            }}
        >
            <DialogTitle sx={{ pb: 1 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">{title}</Typography>
                    <IconButton onClick={handleClose} size="small">
                        <X size={20} />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Divider />

            <DialogContent sx={{ p: 0 }}>
                <Stack spacing={2} sx={{ p: 2 }}>
                    {/* Search */}
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search contacts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <Search size={18} color="#666" />
                            ),
                        }}
                    />

                    {/* Selected Count Display */}
                    {selectedItems.length > 0 && (
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Selected: {selectedItems.length} contact(s)
                            </Typography>
                        </Box>
                    )}

                    {/* Contacts List */}
                    <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                        {isLoading ? (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                Loading contacts...
                            </Typography>
                        ) : users.length === 0 ? (
                            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                                No contacts found
                            </Typography>
                        ) : (
                            <List sx={{ p: 0 }}>
                                {users.map((contact, index) => {
                                    const isSelected = selectedItems.some(item => item.recipient === contact.recipient);
                                    return (
                                        <ListItem
                                            key={index}
                                            disablePadding
                                            sx={{
                                                borderRadius: 1,
                                                mb: 0.25,
                                                '&:hover': {
                                                    bgcolor: '#f9fafb'
                                                }
                                            }}
                                        >
                                            <ListItemButton
                                                onClick={() => handleContactSelect(contact)}
                                                sx={{
                                                    borderRadius: 1,
                                                    py: 0.5,
                                                    px: 1
                                                }}
                                            >
                                                <Checkbox
                                                    checked={isSelected}
                                                    onChange={() => handleContactSelect(contact)}
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
                                                            bgcolor: '#9ca3af',
                                                            fontSize: '12px'
                                                        }}
                                                    >
                                                        {getInitials(contact.name || contact.recipient)}
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="body2" sx={{ fontWeight: 400 }}>
                                                            {contact.name || 'No Name'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Typography variant="caption" color="text.secondary">
                                                            {contact.recipient}
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
                <Button onClick={handleClose} className="bg-gray-300 text-black hover:bg-gray-400">
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={selectedItems.length === 0}
                    className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
                >
                    {multiple ? 'Done' : 'Select'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ContactSelectionDialog; 