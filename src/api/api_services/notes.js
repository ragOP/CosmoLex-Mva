import { apiService } from './index';
import { endpoints } from '../endpoint';

// Get notes meta data (categories, etc.)
export const getNotesMeta = async () => {
  try {
    const response = await apiService({
      endpoint: endpoints.getNotesMeta,
      method: 'GET',
    });
    console.log('>>', response);
    return response.response || {};
  } catch (error) {
    console.error('Error fetching notes meta:', error);
    throw error;
  }
};

// Get all notes for a matter
export const getNotes = async (matterSlug) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getNotes}/${matterSlug}`,
      method: 'GET',
    });

    return response.response;
  } catch (error) {
    console.error('Error fetching notes:', error);
    throw error;
  }
};

// Get single note
export const getNote = async (noteId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.getNote}/${noteId}`,
      method: 'GET',
    });

    if (response.error) {
      throw new Error('Failed to fetch note');
    }

    return response.response;
  } catch (error) {
    console.error('Error fetching note:', error);
    throw error;
  }
};

// Create new note
export const createNote = async (matterSlug, noteData) => {
  try {
    // Validate required fields
    if (
      !noteData ||
      !noteData.title ||
      !noteData.body ||
      !noteData.category_id
    ) {
      throw new Error(
        'Missing required fields: title, body, and category_id are required'
      );
    }

    // Create JSON payload with attachment_ids
    const jsonPayload = {
      title: noteData.title || '',
      body: noteData.body || '',
      category_id: noteData.category_id || '',
      attachment_ids: noteData.attachment_ids || [],
    };

    console.log('Creating note with JSON data:', {
      matterSlug,
      title: jsonPayload.title,
      body: jsonPayload.body,
      category_id: jsonPayload.category_id,
      attachment_ids: jsonPayload.attachment_ids,
    });

    const response = await apiService({
      endpoint: `${endpoints.createNote}/${matterSlug}`,
      method: 'POST',
      data: jsonPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Create note API response:', response);

    if (response.error) {
      throw new Error('Failed to create note');
    }

    return response.response;
  } catch (error) {
    console.error('Error creating note:', error);
    throw error;
  }
};

// Update note
export const updateNote = async (noteId, noteData) => {
  try {
    // Create JSON payload with attachment_ids
    const jsonPayload = {
      title: noteData.title || '',
      body: noteData.body || '',
      category_id: noteData.category_id || '',
      attachment_ids: noteData.attachment_ids || [],
      _method: 'PUT', // Laravel method spoofing
    };

    console.log('Updating note with JSON data:', {
      noteId,
      title: jsonPayload.title,
      body: jsonPayload.body,
      category_id: jsonPayload.category_id,
      attachment_ids: jsonPayload.attachment_ids,
    });

    const response = await apiService({
      endpoint: `${endpoints.updateNote}/${noteId}`,
      method: 'POST',
      data: jsonPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.error) {
      throw new Error('Failed to update note');
    }

    return response.response;
  } catch (error) {
    console.error('Error updating note:', error);
    throw error;
  }
};

// Delete note
export const deleteNote = async (noteId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.deleteNote}/${noteId}`,
      method: 'DELETE',
    });

    if (response.error) {
      throw new Error('Failed to delete note');
    }

    return response.response;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw error;
  }
};

// Get note attachments
export const uploadNoteAttachment = async (payload) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.uploadNoteAttachment}`,
      method: 'POST',
      data: payload,
    });

    if (response.error) {
      throw new Error('Failed to fetch note attachments');
    }

    return response.response;
  } catch (error) {
    console.error('Error fetching note attachments:', error);
    throw error;
  }
};

// Delete note attachment
export const deleteNoteAttachment = async (attachmentId) => {
  try {
    const response = await apiService({
      endpoint: `${endpoints.deleteNoteAttachment}/${attachmentId}`,
      method: 'DELETE',
      // data: {
      //   category_id: '',
      //   title: '',
      //   body: '',
      // },
    });

    if (response.error) {
      throw new Error('Failed to delete note attachment');
    }

    return response.response;
  } catch (error) {
    console.error('Error deleting note attachment:', error);
    throw error;
  }
};
