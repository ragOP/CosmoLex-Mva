import { apiService } from './index';

// Get communication meta data (from, to, roles)
export const getCommunicationMeta = async (matterId = 1, type = 1) => {
  try {
    const response = await apiService({
      // endpoint: `v2/communications/meta/${type}/${matterId}`,
      endpoint: `v2/communications/meta/${type}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching communication meta:', error);
    throw error;
  }
};

// Get all communications/emails
export const getCommunications = async (matterSlug, type = 1) => {
  try {
    let endpoint;
    
    if (matterSlug) {
      // Matter-specific context - use slug-based endpoint
      endpoint = `v2/communications/getCommunications/${type}/${matterSlug}`;
    } else {
      // Main dashboard context - use general endpoint
      endpoint = `v2/communications/getCommunications/${type}`;
    }

    const response = await apiService({
      endpoint: endpoint,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error fetching communications:', error);
    throw error;
  }
};

// Get emails specifically (type 1)
export const getEmails = async (matterSlug) => {
  return getCommunications(matterSlug, 1);
};

// Get SMS messages specifically (type 2)
export const getSMS = async (matterSlug) => {
  return getCommunications(matterSlug, 2);
};

// Compose/Send email
export const composeEmail = async (emailData, slug = null) => {
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
    
    // Use slug in endpoint URL only
    const endpoint = slug ? 
      `v2/communications/ComposeEmail/${slug}` : 
      'v2/communications/ComposeEmail';
    
    console.log('Compose email endpoint:', endpoint, 'slug:', slug);
    
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
    console.error('Error composing email:', error);
    throw error;
  }
};

// Search users for recipient selection
export const searchUsers = async (searchData = {}, type = 1) => {
  try {
    console.log(`searchUsers called with type: ${type}, searchData:`, searchData);
    
    const response = await apiService({
      endpoint: `v2/communications/searchUsers/${type}`,
      method: 'POST',
      data: {
        searchBar: searchData.searchBar || '',
        role_type: searchData.role_type || ''
      }
    });
    
    console.log(`searchUsers response for type ${type}:`, response);
    return response.response;
  } catch (error) {
    console.error('Error searching users:', error);
    throw error;
  }
};

// Send SMS
export const sendSMS = async (smsData, slug = null) => {
  try {
    const formData = new FormData();
    
    // Add SMS fields
    formData.append('type', smsData.type || '2');
    formData.append('from', smsData.from);
    formData.append('recipient', smsData.recipient);
    formData.append('message', smsData.message);
    
    // Use slug in endpoint URL only
    const endpoint = slug ? 
      `v2/communications/Sendsms/${slug}` : 
      'v2/communications/Sendsms';
    
    console.log('Send SMS endpoint:', endpoint, 'slug:', slug);
    
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
    console.error('Error sending SMS:', error);
    throw error;
  }
};

// Delete communication (sends OTP)
export const deleteCommunication = async (communicationId) => {
  try {
    const response = await apiService({
      endpoint: `v2/communications/delete/${communicationId}`,
      method: 'GET'
    });
    
    return response.response;
  } catch (error) {
    console.error('Error deleting communication:', error);
    throw error;
  }
};

// Confirm and delete communication with OTP
export const confirmAndDeleteCommunication = async (requestId, otp) => {
  try {
    const response = await apiService({
      endpoint: 'v2/confirmAndDelete',
      method: 'POST',
      data: {
        request_id: requestId,
        otp: otp
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    return response.response;
  } catch (error) {
    console.error('Error confirming delete:', error);
    throw error;
  }
}; 