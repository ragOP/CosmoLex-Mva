import React from 'react';
import { Stack } from '@mui/material';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack sx={{ }}>
          {children}
        </Stack>
      )}
    </div>
  );
};

export default TabPanel; 