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
    <PermissionGuard permission="communications.view" fallback={null}>
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
