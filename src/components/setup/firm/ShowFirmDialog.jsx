import React from 'react';
import { Dialog, Stack, Divider, IconButton, Card } from '@mui/material';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import formatDate from '@/utils/formatDate';

const ShowFirmDialog = ({
  open = false,
  onClose = () => {},
  firm = null,
  isLoading = false,
}) => {
  if (isLoading) {
    return null;
  }

  if (!firm || typeof firm !== 'object' || !Object?.keys(firm)?.length > 0) {
    return null;
  }

  const {
    firm_name,
    email,
    phone_number,
    website_address,
    number_of_users,
    is_active,
    first_name,
    last_name,
    firm_logo,
    street_number,
    street_name,
    unit_number,
    city,
    province,
    postal_code,
    country,
    business_number,
    fax_number,
    toll_free_number,
    country_code_id,
    time_zone_id,
    practice_area_id,
    heard_about_us,
    terms_accepted,
    email_verified_at,
    created_at,
    updated_at,
  } = firm;

  const fullName = `${first_name || ''} ${last_name || ''}`.trim();
  const fullAddress = [
    street_number,
    street_name,
    unit_number,
    city,
    province,
    postal_code,
    country,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Stack className="bg-[#F5F5FA] rounded-lg min-w-[60%] max-h-[90vh] no-scrollbar shadow-[0px_4px_24px_0px_#000000]">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-xl text-[#40444D] text-center font-bold font-sans">
            Firm Details
          </h1>
          <IconButton onClick={onClose}>
            <X className="text-black" />
          </IconButton>
        </div>

        <Divider />

        <div className="space-y-6 flex-1 overflow-auto p-6 no-scrollbar">
          <div>
            <h2 className="text-lg font-semibold text-[#40444D]">
              {firm_name || 'Firm'}
            </h2>
            <p className="text-muted-foreground mt-1">
              {email || 'No email provided.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Status:</strong> {is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Users:</strong> {number_of_users ?? 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Owner:</strong> {fullName || 'N/A'}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span>
                <strong>Verified:</strong> {email_verified_at ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <span>
                  <strong>Phone:</strong> {phone_number || 'N/A'}
                </span>
              </div>
              {email && (
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    <strong>Email:</strong> {email}
                  </span>
                </div>
              )}
              {website_address && (
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    <strong>Website:</strong>{' '}
                  </span>
                  <a
                    href={website_address}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    {website_address}
                  </a>
                </div>
              )}
              {fullAddress && (
                <div className="flex items-center gap-2 text-sm">
                  <span>
                    <strong>Address:</strong> {fullAddress}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Divider />

          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Business
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <span>
                <strong>Business #:</strong> {business_number || 'N/A'}
              </span>
              <span>
                <strong>Fax:</strong> {fax_number || 'N/A'}
              </span>
              <span>
                <strong>Toll Free:</strong> {toll_free_number || 'N/A'}
              </span>
              <span>
                <strong>Country Code ID:</strong> {country_code_id ?? 'N/A'}
              </span>
              <span>
                <strong>Time Zone ID:</strong> {time_zone_id ?? 'N/A'}
              </span>
              <span>
                <strong>Practice Area ID:</strong> {practice_area_id ?? 'N/A'}
              </span>
              <span>
                <strong>Heard About Us:</strong> {heard_about_us || 'N/A'}
              </span>
              <span>
                <strong>Terms Accepted:</strong> {terms_accepted ? 'Yes' : 'No'}
              </span>
            </div>
          </div>

          <Divider />

          {firm_logo && (
            <div>
              <h3 className="text-lg font-semibold text-[#40444D] mb-2">
                Logo
              </h3>
              <div className="flex items-center">
                <img
                  src={firm_logo}
                  alt="Firm Logo"
                  className="h-16 w-16 object-contain bg-white rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
            </div>
          )}

          <Divider />

          <div>
            <h3 className="text-lg font-semibold text-[#40444D] mb-2">
              Activity
            </h3>
            <div className="space-y-2 flex flex-col text-sm">
              <span>
                <strong>Created:</strong>{' '}
                {created_at ? formatDate(created_at) : '—'}
              </span>
              <span>
                <strong>Updated:</strong>{' '}
                {updated_at ? formatDate(updated_at) : '—'}
              </span>
            </div>
          </div>
        </div>

        <Divider />

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

export default ShowFirmDialog;
