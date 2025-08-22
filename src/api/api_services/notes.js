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

    const formData = new FormData();

    // Add basic fields with validation
    formData.append('title', noteData.title || '');
    formData.append('body', noteData.body || '');
    formData.append('category_id', noteData.category_id || '');

    // Add attachments safely
    if (
      noteData.attachments &&
      Array.isArray(noteData.attachments) &&
      noteData.attachments.length > 0
    ) {
      noteData.attachments.forEach((attachment) => {
        if (attachment && attachment.file) {
          formData.append(`attachments[]`, attachment.file);
        }
      });
    }

    console.log('Creating note with data:', {
      matterSlug,
      title: noteData.title,
      body: noteData.body,
      category_id: noteData.category_id,
      attachmentsCount: noteData.attachments?.length || 0,
    });

    const response = await apiService({
      endpoint: `${endpoints.createNote}/${matterSlug}`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();

    // Add basic fields
    formData.append('title', noteData.title);
    formData.append('body', noteData.body);
    formData.append('category_id', noteData.category_id);
    formData.append('_method', 'PUT'); // Laravel method spoofing

    // Add new attachments
    if (noteData.attachments && noteData.attachments.length > 0) {
      noteData.attachments.forEach((attachment) => {
        if (attachment.file) {
          formData.append(`attachments[]`, attachment.file);
        }
      });
    }

    const response = await apiService({
      endpoint: `${endpoints.updateNote}/${noteId}`,
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
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
