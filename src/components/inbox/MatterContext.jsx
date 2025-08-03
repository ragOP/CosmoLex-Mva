import React, { createContext, useContext } from 'react';

// Create context for matter data
const MatterContext = createContext();

// Hook to use matter context
export const useMatter = () => {
  const context = useContext(MatterContext);
  if (context === undefined) {
    throw new Error('useMatter must be used within a MatterProvider');
  }
  return context;
};

export const MatterProvider = ({ children, matter }) => {
  return (
    <MatterContext.Provider value={{ matter }}>
      {children}
    </MatterContext.Provider>
  );
};

export default MatterContext; 