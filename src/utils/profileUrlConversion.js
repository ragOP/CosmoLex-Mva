export function profileUrlConversion(base64String, mimeType = 'image/png') {
  if (!base64String) return null;

  // If the string already contains the prefix, return it directly
  if (base64String.startsWith('data:image')) {
    return base64String;
  }

  // Otherwise, add the proper data URL prefix
  return `data:${mimeType};base64,${base64String}`;
}
