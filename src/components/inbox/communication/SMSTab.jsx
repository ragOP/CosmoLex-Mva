import React, { useState } from 'react';
import { Stack, IconButton, Typography } from '@mui/material';
import { Search, RotateCcw, MessageSquare } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCommunications } from '@/api/api_services/communications';
import { useSearchParams } from 'react-router-dom';
import ComposeSMSDialog from './components/ComposeSMSDialog';
import SMSList from './components/SMSList';
import SMSPreviewDialog from './components/SMSPreviewDialog';
import { Input } from '@/components/ui/input';

const SMSTab = () => {
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const [composeOpen, setComposeOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedSMS, setSelectedSMS] = useState(null);

  const matterId = searchParams.get('slugId') || '2'; // SMS uses matterId 2

  // Fetch SMS messages
  const { data: smsResponse, isLoading, refetch } = useQuery({
    queryKey: ['sms-communications', matterId],
    queryFn: () => getCommunications(matterId, 2), // Type 2 for SMS
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const smsMessages = smsResponse?.data || [];

  const handleRefresh = () => {
    refetch();
  };

  const handleComposeSuccess = () => {
    setComposeOpen(false);
    queryClient.invalidateQueries(['sms-communications', matterId]);
  };

  const handleSMSClick = (sms) => {
    setSelectedSMS(sms);
    setPreviewDialogOpen(true);
  };

  const handleDeleteSuccess = () => {
    queryClient.invalidateQueries(['sms-communications', matterId]);
  };

  const filteredSMS = smsMessages.filter(sms =>
    sms.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sms.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (sms.contact_name && sms.contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-4">
      <Stack spacing={4}>
        {/* Header */}
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <h2 className="text-xl font-semibold text-gray-900">SMS Communications</h2>

          <Stack direction="row" spacing={2} alignItems="center">


            <IconButton onClick={handleRefresh} size="small">
              <RotateCcw size={18} />
            </IconButton>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 z-10" />
              <Input
                placeholder="Search SMS messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>


            <button
              onClick={() => setComposeOpen(true)}
              className="px-4 py-2 bg-gradient-to-b from-[#7367F0] to-[#453E90] text-white text-sm font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center gap-2"
            >
              <MessageSquare size={16} />
              Send SMS
            </button>
          </Stack>
        </Stack>

        {/* SMS List */}
        <div className="min-h-[600px] flex">
          {isLoading ? (
            <div className="flex flex-col flex-1 items-center justify-center">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#7367F0] rounded-full animate-spin mx-auto mb-4"></div>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
                Loading SMS messages...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please wait while we fetch your SMS history
              </Typography>
            </div>
          ) : filteredSMS.length === 0 ? (
            <div className="flex flex-col flex-1 items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#374151', mb: 2 }}>
                No SMS messages yet
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4, lineHeight: 1.6, textAlign: 'center' }}>
                {searchTerm ?
                  `No SMS messages found matching "${searchTerm}". Try adjusting your search terms.` :
                  "Start your SMS communication by sending your first text message. It's instant and convenient!"
                }
              </Typography>
              {!searchTerm && (
                <button
                  onClick={() => setComposeOpen(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#7367F0] to-[#453E90] text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  <MessageSquare size={18} className="mr-2 inline" />
                  Send First SMS
                </button>
              )}
            </div>
          ) : (
            <SMSList
              smsMessages={filteredSMS}
              isLoading={isLoading}
              matterId={matterId}
              onSMSClick={handleSMSClick}
              onDeleteSuccess={handleDeleteSuccess}
            />
          )}
        </div>

        {/* Compose SMS Dialog */}
        <ComposeSMSDialog
          open={composeOpen}
          onClose={() => setComposeOpen(false)}
          onSuccess={handleComposeSuccess}
          matterId={matterId}
        />

        {/* SMS Preview Dialog */}
        <SMSPreviewDialog
          open={previewDialogOpen}
          onClose={() => setPreviewDialogOpen(false)}
          sms={selectedSMS}
        />
      </Stack>
    </div>
  );
};

export default SMSTab; 