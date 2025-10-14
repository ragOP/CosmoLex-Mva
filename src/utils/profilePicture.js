import { BACKEND_URL } from '@/api/endpoint';

/**
 * Get the full URL for a profile picture
 * @param {string} profilePicture - The profile picture filename or URL
 * @returns {string|null} - The full URL or null if no picture
 */
export const getProfilePictureUrl = (profilePicture) => {
  if (!profilePicture) return null;

  // If it's already a full URL, return as is
  if (profilePicture.startsWith('http')) {
    return profilePicture;
  }

  // Construct the full URL using the backend storage path
  const storageHost = BACKEND_URL.replace('/api', '');
  const fullUrl = `${storageHost}/storage/user_profiles/${profilePicture}`;

  return fullUrl;
};

/**
 * Get user initials for fallback avatar
 * @param {string} firstName - User's first name
 * @param {string} lastName - User's last name
 * @returns {string} - User initials
 */
export const getUserInitials = (firstName = '') => {
  const lastName = firstName.split(' ')[1];
  const firstInitial = firstName?.[0]?.toUpperCase() || '';
  const lastInitial = lastName?.[0]?.toUpperCase() || '';
  return `${firstInitial}${lastInitial}` || 'U';
};

// get user first name
export function getFirstName(fullName = '') {
  if (!fullName) return '';
  return fullName.trim().split(' ')[0];
}

/**
 * Handle profile picture load error
 * @param {Event} event - The error event
 */
export const handleProfilePictureError = (event) => {
  // Hide the broken image
  if (event.target) {
    event.target.style.display = 'none';

    // Show fallback if it exists
    const fallback = event.target.nextElementSibling;
    if (fallback && fallback.classList.contains('profile-fallback')) {
      fallback.style.display = 'flex';
    }
  }
};

/**
 * Test if a profile picture URL is accessible
 * @param {string} url - The URL to test
 * @returns {Promise<boolean>} - Whether the URL is accessible
 */
export const testProfilePictureUrl = async (url) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};
