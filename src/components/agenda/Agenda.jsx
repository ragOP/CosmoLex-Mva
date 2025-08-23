import React, { useState, useEffect } from 'react';
import { Stack, Tabs, Tab, Box } from '@mui/material';
import { useSearchParams, useNavigate } from 'react-router-dom';
import BreadCrumb from '@/components/BreadCrumb';
import TabPanel from './TabPanel';
import TasksTab from './TasksTab';
import EventsTab from './EventsTab';
import NewsfeedTab from './NewsfeedTab';

const Agenda = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  
  // Get slug from URL parameters
  const slugId = searchParams.get('slugId');

  // Get tab from URL params
  const tabParam = searchParams.get('tab');
  
  // Set initial tab based on URL and ensure tab parameter exists
  useEffect(() => {
    if (tabParam === 'tasks') {
      setTabValue(0);
    } else if (tabParam === 'events') {
      setTabValue(1);
    } else if (tabParam === 'newsfeed') {
      setTabValue(2);
    } else {
      // If no tab parameter, set default to tasks and update URL
      setTabValue(0);
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set('tab', 'tasks');
      
      // Preserve slugId if it exists
      if (slugId) {
        currentParams.set('slugId', slugId);
      }
      
      navigate(`?${currentParams.toString()}`, { replace: true });
    }
  }, [tabParam, searchParams, navigate, slugId]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    // Update URL with tab parameter while preserving slugId
    const currentParams = new URLSearchParams(searchParams);
    let newTab = 'tasks';
    if (newValue === 1) newTab = 'events';
    else if (newValue === 2) newTab = 'newsfeed';
    
    currentParams.set('tab', newTab);
    
    // Preserve slugId if it exists
    if (slugId) {
      currentParams.set('slugId', slugId);
    }
    
    navigate(`?${currentParams.toString()}`, { replace: true });
  };

  return (
    <div className="px-4">
      <BreadCrumb label="Agenda" />
      
      <Stack spacing={2}>
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
              label="Tasks" 
              id="agenda-tab-0"
              aria-controls="agenda-tabpanel-0"
            />
            <Tab 
              label="Events" 
              id="agenda-tab-1"
              aria-controls="agenda-tabpanel-1"
            />
            <Tab 
              label="Newsfeed" 
              id="agenda-tab-2"
              aria-controls="agenda-tabpanel-2"
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
            <TasksTab slugId={slugId} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <EventsTab slugId={slugId} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <NewsfeedTab slugId={slugId} />
          </TabPanel>
        </Box>
      </Stack>
    </div>
  );
};

export default Agenda; 