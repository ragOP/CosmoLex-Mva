import { apiService } from './index';

// Finance Meta Data
export const getFinanceMeta = async () => {
  try {
    const response = await apiService({
      endpoint: 'v2/finance-meta',
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching finance meta:', error);
    throw error;
  }
};

// Firms API
export const getFirms = async () => {
  try {
    const response = await apiService({
      endpoint: 'v2/sub-firms/list',
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching firms:', error);
    throw error;
  }
};

// Get single firm
export const getFirm = async (firmId) => {
  try {
    const response = await apiService({
      endpoint: `v2/sub-firms/show/${firmId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching firm:', error);
    throw error;
  }
};

// Vendors API
export const getVendors = async () => {
  try {
    const response = await apiService({
      endpoint: 'v2/vendors/list',
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching vendors:', error);
    throw error;
  }
};

// Get single vendor
export const getVendor = async (vendorId) => {
  try {
    const response = await apiService({
      endpoint: `v2/vendors/show/${vendorId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching vendor:', error);
    throw error;
  }
};

// Fee Splits API
export const getFeeSplits = async (slug = null) => {
  try {
    const endpoint = slug ? 
      `v2/matter/finance/fee-splits/list/${slug}` : 
      'v2/matter/finance/fee-splits/list';
    
    const response = await apiService({
      endpoint: endpoint,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching fee splits:', error);
    throw error;
  }
};

// Expenses API
export const getExpenses = async (slug = null) => {
  try {
    const endpoint = slug ? 
      `v2/matter/finance/expenses/list/${slug}` : 
      'v2/matter/finance/expenses/list';
    
    const response = await apiService({
      endpoint: endpoint,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};

// Create/Update/Delete functions for firms
export const createFirm = async (firmData) => {
  try {
    // Comment out FormData for now, use normal JSON
    // const formData = new FormData();
    
    // // Add all firm fields
    // Object.keys(firmData).forEach(key => {
    //   if (firmData[key] !== null && firmData[key] !== undefined) {
    //     if (key === 'attachments' && Array.isArray(firmData[key])) {
    //       firmData[key].forEach((file) => {
    //       formData.append('attachments', file);
    //     });
    //   } else {
    //       formData.append(key, firmData[key]);
    //     }
    //   }
    // });
    
    // Use normal JSON data
    const jsonData = {
      ...firmData,
      // attachments: firmData.attachments // Comment out attachments for now
    };
    
    const response = await apiService({
      endpoint: 'v2/sub-firms/store',
      method: 'POST',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error creating firm:', error);
    throw error;
  }
};

// Update firm
export const updateFirm = async (firmId, firmData) => {
  try {
    // Comment out FormData for now, use normal JSON
    // const formData = new FormData();
    
    // // Add all firm fields
    // Object.keys(firmData).forEach(key => {
    //   if (firmData[key] !== null && firmData[key] !== undefined) {
    //     if (key === 'attachments' && Array.isArray(firmData[key])) {
    //       firmData[key].forEach((file) => {
    //         formData.append('attachments', file);
    //       });
    //     } else {
    //       formData.append(key, firmData[key]);
    //     }
    //   }
    // });
    
    // Use normal JSON data
    const jsonData = {
      ...firmData,
      // attachments: firmData.attachments // Comment out attachments for now
    };
    
    const response = await apiService({
      endpoint: `v2/sub-firms/update/${firmId}`,
      method: 'PUT',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error updating firm:', error);
    throw error;
  }
};

// Delete firm
export const deleteFirm = async (firmId) => {
  try {
    const response = await apiService({
      endpoint: `v2/sub-firms/delete/${firmId}`,
      method: 'DELETE'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting firm:', error);
    throw error;
  }
};

export const createVendor = async (vendorData) => {
  try {
    // Use normal JSON data instead of FormData
    const jsonData = {
      ...vendorData,
      // Comment out attachments for now
      // attachments: vendorData.attachments
    };
    
    const response = await apiService({
      endpoint: 'v2/vendors/store',
      method: 'POST',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error creating vendor:', error);
    throw error;
  }
};

// Update vendor
export const updateVendor = async (vendorId, vendorData) => {
  try {
    // Use normal JSON data instead of FormData
    const jsonData = {
      ...vendorData,
      // Comment out attachments for now
      // attachments: vendorData.attachments
    };
    
    const response = await apiService({
      endpoint: `v2/vendors/update/${vendorId}`,
      method: 'PUT',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error updating vendor:', error);
    throw error;
  }
};

// Delete vendor
export const deleteVendor = async (vendorId) => {
  try {
    const response = await apiService({
      endpoint: `v2/vendors/delete/${vendorId}`,
      method: 'DELETE'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting vendor:', error);
    throw error;
  }
};

export const createFeeSplit = async (feeSplitData, slug = null) => {
  try {
    const formData = new FormData();
    
    // Add all fee split fields
    Object.keys(feeSplitData).forEach(key => {
      if (feeSplitData[key] !== null && feeSplitData[key] !== undefined) {
        formData.append(key, feeSplitData[key]);
      }
    });
    
    // Add slug if provided
    if (slug) {
      formData.append('slug', slug);
    }
    
    const endpoint = slug ? 
      `v2/matter/finance/fee-splits/store/${slug}` : 
      'v2/matter/finance/fee-splits/store';
    
    const response = await apiService({
      endpoint: endpoint,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error creating fee split:', error);
    throw error;
  }
};

// Get single fee split
export const getFeeSplit = async (feeSplitId) => {
  try {
    const response = await apiService({
      endpoint: `v2/matter/finance/fee-splits/show/${feeSplitId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching fee split:', error);
    throw error;
  }
};

// Update fee split
export const updateFeeSplit = async (feeSplitId, feeSplitData, slug = null) => {
  try {
    const formData = new FormData();
    
    // Add all fee split fields
    Object.keys(feeSplitData).forEach(key => {
      if (feeSplitData[key] !== null && feeSplitData[key] !== undefined) {
        formData.append(key, feeSplitData[key]);
      }
    });
    
    // Add slug if provided
    if (slug) {
      formData.append('slug', slug);
    }
    
    const endpoint = slug ? 
      `v2/matter/finance/fee-splits/update/${feeSplitId}/${slug}` : 
      `v2/matter/finance/fee-splits/update/${feeSplitId}`;
    
    const response = await apiService({
      endpoint: endpoint,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error updating fee split:', error);
    throw error;
  }
};

// Delete fee split
export const deleteFeeSplit = async (feeSplitId) => {
  try {
    const response = await apiService({
      endpoint: `v2/matter/finance/fee-splits/delete/${feeSplitId}`,
      method: 'DELETE'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting fee split:', error);
    throw error;
  }
};

// Get single expense
export const getExpense = async (expenseId) => {
  try {
    const response = await apiService({
      endpoint: `v2/matter/finance/expenses/show/${expenseId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching expense:', error);
    throw error;
  }
};

// Update expense
export const updateExpense = async (expenseId, expenseData) => {
  try {
    // Use normal JSON data instead of FormData
    const jsonData = {
      ...expenseData,
      // Comment out attachments for now
      // attachments: expenseData.attachments
    };
    
    const response = await apiService({
      endpoint: `v2/matter/finance/expenses/update/${expenseId}`,
      method: 'PUT',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

// Delete expense
export const deleteExpense = async (expenseId) => {
  try {
    const response = await apiService({
      endpoint: `v2/matter/finance/expenses/delete/${expenseId}`,
      method: 'DELETE'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const createExpense = async (expenseData, slug = null) => {
  try {
    // Use normal JSON data instead of FormData
    const jsonData = {
      ...expenseData,
      // Remove slug from body since it's in the URL
      // attachments: expenseData.attachments
    };
    
    // Debug: Log the data being sent
    console.log('Creating expense with data:', jsonData);
    console.log('Slug being used:', slug);
    
    // Use the correct endpoint with slug in URL path
    const endpoint = slug ? 
      `v2/matter/finance/expenses/store/${slug}` : 
      'v2/matter/finance/expenses/store';
    
    const response = await apiService({
      endpoint: endpoint,
      method: 'POST',
      data: jsonData,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('API Response:', response);
    
    // Check if the response indicates an error
    if (response && response.Apistatus === false) {
      throw new Error(response.message || 'API returned false status');
    }
    
    return response.response;
  } catch (error) {
    console.error('Error creating expense:', error);
    console.error('Full error object:', error);
    throw error;
  }
};

// Get firms by type
export const getFirmsByType = async (typeId) => {
  try {
    const response = await apiService({
      endpoint: `v2/finance-by-type/${typeId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching firms by type:', error);
    throw error;
  }
}; 