import React, { useState } from 'react';
import { Stack, Tabs, Tab, Box } from '@mui/material';
import BreadCrumb from '@/components/BreadCrumb';
import TabPanel from './TabPanel';
import SMSTab from './SMSTab';
import EmailTab from './EmailTab';

const Communication = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <div className="px-4">
      <BreadCrumb label="Communication" />
      
      <Stack spacing={2} sx={{  }}>
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
                background: 'linear-gradient(90deg, #7367F0 0%, #453E90 100%)',
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
        <Box sx={{ 
          bgcolor: 'rgba(255, 255, 255, 0.5)', 
          backdropFilter: 'blur(8px)',
          borderRadius: 3, 
          boxShadow: '0 4px 24px 0px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(226, 232, 240, 0.8)',
          overflow: 'hidden'
        }}>
          <TabPanel value={tabValue} index={0}>
            <EmailTab />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <SMSTab />
          </TabPanel>
        </Box>
      </Stack>
    </div>
  );
};

export default Communication; 