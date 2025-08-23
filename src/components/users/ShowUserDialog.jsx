import React from 'react';
import { Dialog, Stack, Divider, IconButton, Card, Avatar } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import formatDate from '@/utils/formatDate';

const ShowUserDialog = ({ open = false, onClose = () => {}, user = null, isLoading = false }) => {
  // Show loading state
  if (isLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
              Loading User Details...
            </h1>
            <IconButton onClick={onClose}>
              <X className="text-black" />
            </IconButton>
          </div>
          <Divider />
          <div className="flex items-center justify-center p-8">
            <Loader2 className="w-8 h-8 animate-spin text-[#6366F1]" />
          </div>
        </Stack>
      </Dialog>
    );
  }

  // If user is empty or not found, return null
  if (!user || !Object?.keys(user)?.length > 0) return null;

  const {
    role_id,
    first_name,
    last_name,
    email,
    phone_number,
    street_number,
    street_name,
    unit_number,
    city,
    province,
    postal_code,
    country,
    is_active,
    email_verified_at,
    last_login_at,
    two_factor_enabled,
    created_at,
    updated_at,
    firm,
    country_code,
  } = user;

  const fullName = `${first_name || ''} ${last_name || ''}`.trim();
  const fullAddress = [street_number, street_name, unit_number, city, province, postal_code, country]
    .filter(Boolean)
    .join(', ');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
            User Details
          </h1>
          <IconButton onClick={onClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        {/* User Content */}
        <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
          {/* Subject + Description */}
          <div>
            <h2 className="text-lg font-semibold text-[#40444D]">
              {fullName}
            </h2>
            <p className="text-muted-foreground mt-1">
              {email || 'No email provided.'}
            </p>
          </div>

          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Role:</strong> {role_id === 1 ? 'Administrator' : 'User'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Verified:</strong> {email_verified_at ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <Divider />

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span><strong>Phone:</strong> {phone_number || 'N/A'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span><strong>Country Code:</strong> {country_code?.code || 'N/A'}</span>
              </div>
              {fullAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <span><strong>Address:</strong> {fullAddress}</span>
                </div>
              )}
            </div>
          </div>

          <Divider />

          {/* Security */}
          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Security
            </h3>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant={two_factor_enabled ? 'default' : 'outline'}
                className="text-xs px-3 py-1 rounded-full"
              >
                {two_factor_enabled ? '2FA Enabled' : '2FA Disabled'}
              </Badge>
              {email_verified_at && (
                <Badge
                  variant="default"
                  className="text-xs px-3 py-1 rounded-full"
                >
                  Email Verified
                </Badge>
              )}
            </div>
          </div>

          <Divider />

          {/* Activity */}
          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Activity
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span><strong>Last Login:</strong> {last_login_at ? formatDate(last_login_at) : 'Never'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span><strong>Created:</strong> {formatDate(created_at)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span><strong>Updated:</strong> {formatDate(updated_at)}</span>
              </div>
            </div>
          </div>

          {firm && (
            <>
              <Divider />
              
              {/* Firm Information */}
              <div>
                <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                  Firm Information
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span><strong>Firm Name:</strong> {firm.firm_name || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span><strong>Users:</strong> {firm.number_of_users || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span><strong>Email:</strong> {firm.email || 'N/A'}</span>
                  </div>
                  {firm.website_address && (
                    <div className="flex items-center gap-2 text-sm">
                      <span><strong>Website:</strong> {firm.website_address}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <Divider />

        {/* Footer */}
        <div className="flex items-center justify-end p-4 gap-2">
          <Button
            onClick={onClose}
            className="bg-[#6366F1] text-white hover:bg-[#4f51d8]"
          >
            Close
          </Button>
        </div>
      </Stack>
    </Dialog>
  );
};

export default ShowUserDialog;
