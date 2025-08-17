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
export const getFeeSplits = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Apistatus: true,
        data: [
          {
            id: 1,
            case_name: "Johnson vs. ABC Corp",
            case_number: "2024-CV-001",
            firm_name: "Smith & Associates",
            split_type: "Fee Share %",
            our_percentage: "60%",
            their_percentage: "40%",
            total_settlement: "$250,000.00",
            our_share: "$150,000.00",
            their_share: "$100,000.00",
            status: "Settled",
            created_at: "2024-03-01"
          },
          {
            id: 2,
            case_name: "Davis Personal Injury",
            case_number: "2024-CV-002",
            firm_name: "Legal Partners LLC",
            split_type: "Firm Flat Free %",
            our_percentage: "70%",
            their_percentage: "30%",
            total_settlement: "$180,000.00",
            our_share: "$126,000.00",
            their_share: "$54,000.00",
            status: "Pending",
            created_at: "2024-03-15"
          }
        ]
      });
    }, 600);
  });
};

// Expenses API
export const getExpenses = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Apistatus: true,
        data: [
          {
            id: 1,
            case_name: "Johnson vs. ABC Corp",
            case_number: "2024-CV-001",
            category: "Court Costs/Filing Fees",
            cost_type: "Hard Cost - Third-Party Vendors",
            description: "Filing fees for initial complaint",
            amount: "$450.00",
            date: "2024-01-15",
            vendor: "Court Clerk Office",
            status: "Paid",
            receipt_attached: true
          },
          {
            id: 2,
            case_name: "Davis Personal Injury",
            case_number: "2024-CV-002",
            category: "Expert/Professional",
            cost_type: "Hard Cost - Third-Party Vendors",
            description: "Medical expert witness consultation",
            amount: "$2,500.00",
            date: "2024-02-20",
            vendor: "Dr. Expert Medical Services",
            status: "Pending",
            receipt_attached: false
          },
          {
            id: 3,
            case_name: "Smith Contract Dispute",
            case_number: "2024-CV-003",
            category: "Depositions",
            cost_type: "Soft Cost - Due to our Firm",
            description: "Deposition transcript and court reporter",
            amount: "$850.00",
            date: "2024-03-10",
            vendor: "Legal Transcription Pro",
            status: "Paid",
            receipt_attached: true
          }
        ]
      });
    }, 900);
  });
};

// Create/Update/Delete functions for firms
export const createFirm = async (firmData) => {
  try {
    const formData = new FormData();
    
    // Add all firm fields
    Object.keys(firmData).forEach(key => {
      if (firmData[key] !== null && firmData[key] !== undefined) {
        if (key === 'attachments' && Array.isArray(firmData[key])) {
          firmData[key].forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, firmData[key]);
        }
      }
    });
    
    const response = await apiService({
      endpoint: 'v2/sub-firms/store',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();
    
    // Add all firm fields
    Object.keys(firmData).forEach(key => {
      if (firmData[key] !== null && firmData[key] !== undefined) {
        if (key === 'attachments' && Array.isArray(firmData[key])) {
          firmData[key].forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, firmData[key]);
        }
      }
    });
    
    const response = await apiService({
      endpoint: `v2/sub-firms/update/${firmId}`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();
    
    // Add all vendor fields
    Object.keys(vendorData).forEach(key => {
      if (vendorData[key] !== null && vendorData[key] !== undefined) {
        if (key === 'attachments' && Array.isArray(vendorData[key])) {
          vendorData[key].forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, vendorData[key]);
        }
      }
    });
    
    const response = await apiService({
      endpoint: 'v2/vendors/store',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();
    
    // Add all vendor fields
    Object.keys(vendorData).forEach(key => {
      if (vendorData[key] !== null && vendorData[key] !== undefined) {
        if (key === 'attachments' && Array.isArray(vendorData[key])) {
          vendorData[key].forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, vendorData[key]);
        }
      }
    });
    
    const response = await apiService({
      endpoint: `v2/vendors/update/${vendorId}`,
      method: 'PUT',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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

export const createFeeSplit = async (feeSplitData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Apistatus: true,
        message: "Fee split created successfully",
        data: { id: Date.now(), ...feeSplitData }
      });
    }, 500);
  });
};

export const createExpense = async (expenseData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        Apistatus: true,
        message: "Expense created successfully",
        data: { id: Date.now(), ...expenseData }
      });
    }, 500);
  });
}; 