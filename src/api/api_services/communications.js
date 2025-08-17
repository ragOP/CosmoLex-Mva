import { apiService } from './index';

// Get communication meta data (from, to, roles)
export const getCommunicationMeta = async (matterId = 1) => {
  try {
    const response = await apiService({
      endpoint: `v2/communications/meta/${matterId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching communication meta:', error);
    throw error;
  }
};

// Get all communications/emails
export const getCommunications = async (matterId = 1) => {
  try {
    const response = await apiService({
      endpoint: `v2/communications/getCommunications/${matterId}/`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

// Compose/Send email
export const composeEmail = async (emailData) => {
  try {
    const formData = new FormData();
    
    // Add basic email fields
    formData.append('type', emailData.type || '1');
    formData.append('from', emailData.from);
    formData.append('recipient', emailData.recipient);
    formData.append('cc', emailData.cc || '');
    formData.append('bcc', emailData.bcc || '');
    formData.append('subject', emailData.subject);
    formData.append('message', emailData.message);
    
    // Add attachments if any
    if (emailData.attachments && emailData.attachments.length > 0) {
      emailData.attachments.forEach((file) => {
        formData.append('attachments[]', file);
      });
    }
    
    const response = await apiService({
      endpoint: 'v2/communications/ComposeEmail',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error composing email:', error);
    throw error;
  }
};

// Search users for recipient selection
export const searchUsers = async (matterId = 1, searchData = {}) => {
  try {
    const response = await apiService({
      endpoint: `v2/communications/searchUsers/${matterId}`,
      method: 'POST',
      data: {
        searchBar: searchData.searchBar || '',
        role_type: searchData.role_type || ''
      }
    });
    
    return response.response;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Send SMS
export const sendSMS = async (smsData) => {
  try {
    const formData = new FormData();
    
    // Add SMS fields
    formData.append('type', smsData.type || '2');
    formData.append('from', smsData.from);
    formData.append('recipient', smsData.recipient);
    formData.append('message', smsData.message);
    
    const response = await apiService({
      endpoint: 'v2/communications/Sendsms',
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Delete communication
export const deleteCommunication = async (communicationId) => {
  try {
    const response = await apiService({
      endpoint: `v2/communications/delete/${communicationId}`,
      method: 'DELETE'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting communication:', error);
    throw error;
  }
}; 