import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button
} from "@mui/material";
import { AlertTriangle } from "lucide-react";

const PrimaryAddressConfirmDialog = ({
  open = false,
  onClose = () => {},
  onConfirm = () => {},
  currentPrimaryAddress = null
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2, backgroundColor: "#F5F5FA", p: 2 }
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <AlertTriangle color="#fb2c36 " size={20} />
          <Typography variant="h6" fontWeight={600} color="#1E293B">
            Change Primary Address
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box display="flex" flexDirection="column" gap={2} color="#334155">
          <Typography variant="body2">
            A primary address already exists:
          </Typography>

          {currentPrimaryAddress && (
            <Box
              bgcolor="#E5E7EB"
              p={2}
              borderRadius={1}
            >
              <Typography fontWeight={500}>
                {currentPrimaryAddress.address_1}
                {currentPrimaryAddress.address_2 && `, ${currentPrimaryAddress.address_2}`}
              </Typography>
              <Typography>
                {currentPrimaryAddress.city}
                {currentPrimaryAddress.state && `, ${currentPrimaryAddress.state}`}
                {currentPrimaryAddress.zip && ` ${currentPrimaryAddress.zip}`}
              </Typography>
            </Box>
          )}

          <Typography variant="body2">
            Setting a new primary address will automatically make the current primary address secondary. Do you want to continue?
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ mt: 1, gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onConfirm}
          sx={{ backgroundColor: "#fb2c36 ", "&:hover": { backgroundColor: "#fb2c36 " } }}
        >
          Change Primary
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrimaryAddressConfirmDialog;
