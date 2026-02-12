// ============================================
// API CONFIGURATION FILE
// ============================================
// This file contains all API configuration
// Update the BASE_URL when backend is ready
// ============================================

/**
 * API Configuration
 * Replace 'https://your-backend-api.com' with your actual backend URL
 */
const API_CONFIG = {
  // Production backend URL (update this!)
  BASE_URL: 'https://your-backend-api.com',

  // API Endpoints
  ENDPOINTS: {
    // Artists endpoints
    ARTISTS: '/api/artists',              // GET - Fetch all artists
    ARTISTS_BY_ID: '/api/artists/:id',    // GET - Fetch single artist

    // Statistics endpoints
    STATS: '/api/stats',                  // GET - Dashboard stats
    HOME_STATS: '/api/home-stats',        // GET - Home page stats
    ANALYTICS: '/api/analytics',          // GET - Analytics data

    // Search/Filter endpoints (optional)
    SEARCH: '/api/search',                // GET - Search artists
    FILTER: '/api/filter'                 // GET - Filter by criteria
  },

  // Request timeout (milliseconds)
  TIMEOUT: 30000,

  // Retry configuration
  RETRY: {
    MAX_ATTEMPTS: 3,
    DELAY: 1000
  }
};

/**
 * Environment detection
 * Automatically switch between development and production
 */
if (
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  // Development environment
  API_CONFIG.BASE_URL = 'http://localhost:3000';
  console.log('Development mode - Using local API');
} else {
  // Production environment
  console.log('Production mode - Using production API');
}

/**
 * Helper function to build complete URL
 * @param {string} endpoint - Endpoint path
 * @param {Object} params - URL parameters (optional)
 * @returns {string} Complete URL
 */
function buildUrl(endpoint, params = {}) {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;

  // Add query parameters if provided
  const queryString = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  if (queryString) {
    url += `?${queryString}`;
  }

  return url;
}

/**
 * Make API request with timeout logic
 * @param {string} url - URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch promise
 */
async function apiRequest(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();

  } catch (error) {
    clearTimeout(timeout);

    if (error.name === 'AbortError') {
      throw new Error('Request timeout');
    }

    throw error;
  }
}

// Export configuration (for module systems)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { API_CONFIG, buildUrl, apiRequest };
}
