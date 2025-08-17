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
import { X, Search } from 'lucide-react';

const ReusableSearchDialog = ({
  // Dialog state
  open,
  onClose,

  // Dialog customization
  title = 'Select Items',
  searchPlaceholder = 'Search items...',
  maxWidth = 'sm',

  // Data and state
  items = [],
  selectedItems = [],
  loading = false,

  // Search functionality
  searchTerm = '',
  onSearchChange,

  // Selection handling
  onItemSelect,
  onItemDeselect,
  multiSelect = true,

  // Item rendering customization
  getItemKey = (item, index) => item.id || index,
  getItemDisplay = (item) => ({
    primary: item.name || item.title || item.label,
    secondary: item.email || item.subtitle || item.description,
    avatar:
      item.avatar ||
      item.name?.charAt(0)?.toUpperCase() ||
      item.title?.charAt(0)?.toUpperCase() ||
      'I',
  }),

  // Selection comparison
  isItemSelected = (item, selectedItems) =>
    selectedItems.some((selected) => getItemKey(selected) === getItemKey(item)),

  // Empty states
  emptyStateText = 'No items found',
  loadingText = 'Searching...',
  getEmptySearchText = (searchTerm) => `No items found for "${searchTerm}"`,

  // Actions
  onCancel,
  onConfirm,
  cancelButtonText = 'Cancel',
  confirmButtonText = 'Done',

  // Custom styling
  dialogProps = {},
  searchFieldProps = {},
  listItemProps = {},

  // Advanced customization
  renderCustomItem,
  renderCustomEmpty,
  renderCustomLoading,
  showSelectionCount = true,

  // Accessibility
  searchAriaLabel = 'Search items',
  listAriaLabel = 'Items list',
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');

  // Use controlled or uncontrolled search term
  const currentSearchTerm = onSearchChange ? searchTerm : internalSearchTerm;
  const handleSearchChange = onSearchChange || setInternalSearchTerm;

  const handleClose = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm(selectedItems);
    } else {
      onClose();
    }
  };

  const handleItemToggle = (item) => {
    const isSelected = isItemSelected(item, selectedItems);

    if (isSelected && onItemDeselect) {
      onItemDeselect(item);
    } else if (!isSelected && onItemSelect) {
      onItemSelect(item);
    }
  };

  const renderItem = (item, index) => {
    if (renderCustomItem) {
      return renderCustomItem(item, index, {
        isSelected: isItemSelected(item, selectedItems),
        onToggle: () => handleItemToggle(item),
        multiSelect,
      });
    }

    const isSelected = isItemSelected(item, selectedItems);
    const display = getItemDisplay(item);

    return (
      <ListItem
        key={getItemKey(item, index)}
        disablePadding
        sx={{
          borderRadius: 1,
          mb: 0.25,
          '&:hover': {
            bgcolor: '#f9fafb',
          },
        }}
        {...listItemProps}
      >
        <ListItemButton
          onClick={() => handleItemToggle(item)}
          sx={{
            borderRadius: 1,
            py: 0.5,
            px: 1,
          }}
        >
          {multiSelect && (
            <Checkbox
              checked={isSelected}
              sx={{
                color: '#9ca3af',
                '&.Mui-checked': {
                  color: '#7367F0',
                },
              }}
            />
          )}
          <ListItemAvatar>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: isSelected ? '#7367F0' : '#1976d2',
                fontSize: '12px',
              }}
            >
              {display.avatar}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Typography variant="body2" sx={{ fontWeight: 400 }}>
                {display.primary}
              </Typography>
            }
            secondary={
              display.secondary && (
                <Typography variant="caption" color="text.secondary">
                  {display.secondary}
                </Typography>
              )
            }
          />
        </ListItemButton>
      </ListItem>
    );
  };

  const renderEmptyState = () => {
    if (renderCustomEmpty) {
      return renderCustomEmpty(currentSearchTerm);
    }

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 4 }}
      >
        {currentSearchTerm
          ? getEmptySearchText(currentSearchTerm)
          : emptyStateText}
      </Typography>
    );
  };

  const renderLoadingState = () => {
    if (renderCustomLoading) {
      return renderCustomLoading();
    }

    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: 'center', py: 4 }}
      >
        {loadingText}
      </Typography>
    );
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
        ...dialogProps.PaperProps,
      }}
      {...dialogProps}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">{title}</Typography>
          <IconButton onClick={handleClose} size="small">
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
            placeholder={searchPlaceholder}
            value={currentSearchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            aria-label={searchAriaLabel}
            InputProps={{
              startAdornment: (
                <IconButton size="small">
                  <Search size={18} />
                </IconButton>
              ),
              endAdornment: currentSearchTerm && (
                <IconButton size="small" onClick={() => handleSearchChange('')}>
                  <X size={18} />
                </IconButton>
              ),
            }}
            sx={{
              '& .MuiInputBase-root': {
                fontSize: '14px',
                padding: '8px 12px',
              },
              ...searchFieldProps.sx,
            }}
            {...searchFieldProps}
          />

          <Box sx={{ minHeight: 200, maxHeight: 400, overflow: 'auto' }}>
            {loading ? (
              renderLoadingState()
            ) : items.length > 0 ? (
              <List sx={{ p: 0 }} aria-label={listAriaLabel}>
                {items.map(renderItem)}
              </List>
            ) : (
              renderEmptyState()
            )}
          </Box>
        </Stack>
      </DialogContent>

      <Divider />
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        {showSelectionCount && (
          <Typography variant="body2" color="text.secondary">
            {selectedItems.length} item(s) selected
          </Typography>
        )}
        <Stack direction="row" spacing={2}>
          <Button
            onClick={handleClose}
            className="bg-gray-300 text-black hover:bg-gray-400"
          >
            {cancelButtonText}
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-[#6366F1] text-white hover:bg-[#4e5564]"
          >
            {confirmButtonText}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
};

export default ReusableSearchDialog;
