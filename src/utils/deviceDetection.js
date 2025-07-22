import FingerprintJS from '@fingerprintjs/fingerprintjs';

// Get device name based on user agent
export const getDeviceName = () => {
  const userAgent = navigator.userAgent || navigator.vendor || window.opera;
  if (/Windows NT/i.test(userAgent)) {
    return 'Windows';
  }
  if (/Macintosh|MacIntel|MacPPC|Mac68K/i.test(userAgent)) {
    return 'macOS';
  }
  if (/Linux/i.test(userAgent) && !/Android/i.test(userAgent)) {
    return 'Linux';
  }

  // Mobile checks after desktop
  if (/Android/i.test(userAgent)) {
    return 'Android';
  }
  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    return 'iOS';
  }
  if (/Windows Phone/i.test(userAgent)) {
    return 'Windows Phone';
  }

  return 'Unknown';
};

// Generate unique browser fingerprint
export const generateBrowserToken = async () => {
  try {
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    return result.visitorId;
  } catch (error) {
    console.error('Error generating browser token:', error);
    // Fallback to a simple token based on user agent and timestamp
    const fallback = btoa(navigator.userAgent + Date.now()).substring(0, 10);
    return fallback;
  }
};

// Get browser info for API payload
export const getBrowserInfo = async () => {
  const deviceName = getDeviceName();
  const token = await generateBrowserToken();

  return {
    device_name: deviceName,
    token: token,
  };
};
