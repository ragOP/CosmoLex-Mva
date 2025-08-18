import React, { useState, useEffect } from 'react';
import { Stack, Tabs, Tab, Box } from '@mui/material';
import { useSearchParams, useNavigate, useParams, useLocation } from 'react-router-dom';
import BreadCrumb from '@/components/BreadCrumb';
import TabPanel from './TabPanel';
import FirmsTab from './FirmsTab';
import VendorsTab from './VendorsTab';
import FeeSplitsTab from './FeeSplitsTab';
import ExpensesTab from './ExpensesTab';
import FirmDetail from './FirmDetail';
import ExpenseDetail from './ExpenseDetail';
import VendorDetail from './VendorDetail';
import FeeSplitDetail from './FeeSplitDetail';
// import { MatterContext } from '@/components/inbox/MatterContext';

const Finance = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { id: itemId } = useParams();
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  
  // Get matter context to access slugId
  // const { matter } = useContext(MatterContext);
  
  // Get slug from URL parameters first, fallback to context
  const slugId = searchParams.get('slugId');

  // Get tab from URL params
  const tabParam = searchParams.get('tab');
  
  // Check if we're on a vendor detail route
  const isVendorDetail = location.pathname.includes('/finance/vendors/');
  
  // Set initial tab based on URL and ensure tab parameter exists
  useEffect(() => {
    if (tabParam === 'firms') {
      setTabValue(0);
    } else if (tabParam === 'vendors') {
      setTabValue(1);
    } else if (tabParam === 'fee-splits') {
      setTabValue(2);
    } else if (tabParam === 'expenses') {
      setTabValue(3);
    } else {
      // If no tab parameter, set default to firms and update URL
      setTabValue(0);
      const currentParams = new URLSearchParams(searchParams);
      currentParams.set('tab', 'firms');
      
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
    let newTab = 'firms';
    if (newValue === 1) newTab = 'vendors';
    else if (newValue === 2) newTab = 'fee-splits';
    else if (newValue === 3) newTab = 'expenses';
    
    currentParams.set('tab', newTab);
    
    // Preserve slugId if it exists
    if (slugId) {
      currentParams.set('slugId', slugId);
    }
    
    navigate(`?${currentParams.toString()}`, { replace: true });
  };

  // If we have an item ID and tab parameter, show detail view
  if (itemId && tabParam) {
    if (tabParam === 'firms') {
      return (
        <div className="px-4">
          <BreadCrumb label="Finance" />
          <FirmDetail firmId={itemId} />
        </div>
      );
    } else if (tabParam === 'vendors') {
      return (
        <div className="px-4">
          <BreadCrumb label="Finance" />
          <VendorDetail />
        </div>
      );
    } else if (tabParam === 'fee-splits') {
      return (
        <div className="px-4">
          <BreadCrumb label="Finance" />
          <FeeSplitDetail />
        </div>
      );
    } else if (tabParam === 'expenses') {
      return (
        <div className="px-4">
          <BreadCrumb label="Finance" />
          <ExpenseDetail expenseId={itemId} />
        </div>
      );
    }
  }
  
  // Check if we're on a vendor detail route
  if (isVendorDetail && itemId) {
    return (
      <div className="px-4">
        <BreadCrumb label="Finance" />
        <VendorDetail />
      </div>
    );
  }

  return (
    <div className="px-4">
      <BreadCrumb label="Finance" />
      
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
              label="Firms" 
              id="finance-tab-0"
              aria-controls="finance-tabpanel-0"
            />
            <Tab 
              label="Vendors" 
              id="finance-tab-1"
              aria-controls="finance-tabpanel-1"
            />
            <Tab 
              label="Fee Splits" 
              id="finance-tab-2"
              aria-controls="finance-tabpanel-2"
            />
            <Tab 
              label="Expenses" 
              id="finance-tab-3"
              aria-controls="finance-tabpanel-3"
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
            <FirmsTab slugId={slugId} />
          </TabPanel>
          
          <TabPanel value={tabValue} index={1}>
            <VendorsTab slugId={slugId} />
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <FeeSplitsTab slugId={slugId} />
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <ExpensesTab slugId={slugId} />
          </TabPanel>
        </Box>
      </Stack>
    </div>
  );
};

export default Finance; 