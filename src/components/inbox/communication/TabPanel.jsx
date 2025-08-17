import React from 'react';
import { Stack } from '@mui/material';

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`communication-tabpanel-${index}`}
      aria-labelledby={`communication-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Stack sx={{  }}>
          {children}
        </Stack>
      )}
    </div>
  );
};

export default TabPanel; 