import React, { useState, useEffect } from 'react';
import { Stack, Tabs, Tab, Box } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import BreadCrumb from '@/components/BreadCrumb';
import TabPanel from './TabPanel';
import SMSTab from './SMSTab';
import EmailTab from './EmailTab';
import PermissionGuard from '@/components/auth/PermissionGuard';

const Communication = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  // Get context information
  const slugId = searchParams.get('slugId');
  const isFromInbox = !!slugId;

  // Get tab from URL params
  const tabParam = searchParams.get('tab');

  // Set initial tab based on URL and ensure tab parameter exists
  useEffect(() => {
    if (tabParam === 'sms') {
      setTabValue(1);
    } else if (tabParam === 'email') {
      setTabValue(0);
    } else {
      // If no tab parameter, set default to email and update URL
      setTabValue(0);
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set('tab', 'email');
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  }, [tabParam, searchParams, navigate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);

    // Update URL with tab parameter
    const currentParams = new URLSearchParams(searchParams);
    const newTab = newValue === 0 ? 'email' : 'sms';
    currentParams.set('tab', newTab);
    navigate(`?${currentParams.toString()}`, { replace: true });
  };

  return (
    <PermissionGuard
      permission="communications.view"
      fallback={
        <div className="px-4 pb-2 flex flex-col gap-2 h-full overflow-auto py-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="pl-2">
              <h1 className="text-xl font-bold text-gray-900">
                {isFromInbox ? 'Communication' : 'Communications'}
              </h1>
              <p className="text-base text-gray-600">
                Manage your email and SMS communications
              </p>
            </div>
          </div>

          {/* Permission Denied Message */}
          <div className="bg-white/50 backdrop-blur-md border border-gray-200/80 shadow-lg gap-4 p-8 rounded-lg flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Access Denied
              </h3>
              <p className="text-base text-gray-600 mb-1">
                You do not have permission to view communications.
              </p>
              <p className="text-sm text-gray-500">
                Please contact your administrator if you need access to this
                feature.
              </p>
            </div>
          </div>
        </div>
      }
    >
      <div className="px-4">
        <BreadCrumb label={isFromInbox ? 'Communication' : 'Communications'} />

        <Stack spacing={2} sx={{}}>
          {/* Tabs - Outside White Background */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  '&.Mui-selected': {
                    color: '#7367F0',
                    fontWeight: 600,
                  },
                },
                '& .MuiTabs-indicator': {
                  background:
                    'linear-gradient(90deg, #7367F0 0%, #453E90 100%)',
                  height: 3,
                  borderRadius: '2px 2px 0 0',
                },
              }}
            >
              <Tab
                label="Email"
                id="communication-tab-0"
                aria-controls="communication-tabpanel-0"
              />
              <Tab
                label="SMS"
                id="communication-tab-1"
                aria-controls="communication-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* Tab Content - Inside Glassmorphism Background */}
          <Box
            sx={{
              bgcolor: 'rgba(255, 255, 255, 0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: 3,
              boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
              border: '1px solid rgba(226, 232, 240, 0.8)',
              overflow: 'hidden',
            }}
          >
            <TabPanel value={tabValue} index={0}>
              <EmailTab />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <SMSTab />
            </TabPanel>
          </Box>
        </Stack>
      </div>
    </PermissionGuard>
  );
};

export default Communication;
