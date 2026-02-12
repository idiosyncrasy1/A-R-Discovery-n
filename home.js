// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR BACKEND URL
// ============================================
const API_CONFIG = {
  BASE_URL: 'https://your-backend-api.com', // Replace with actual backend URL
  ENDPOINTS: {
    HOME_STATS: '/api/home-stats'
  }
};

// ============================================
// API FUNCTIONS
// ============================================

/**
 * Fetch home page statistics from backend API
 * @returns {Promise<Object>} Home statistics object
 */
async function fetchHomeStatsFromAPI() {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.HOME_STATS}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching home stats:', error);
    return null;
  }
}

// ============================================
// UPDATE FUNCTIONS
// ============================================

/**
 * Update home page statistics display
 */
async function updateHomeStats() {
  try {
    const stats = await fetchHomeStatsFromAPI();

    if (stats) {
      document.getElementById('home-total-artists').textContent =
        stats.totalArtists ? `${stats.totalArtists}+` : '-';

      document.getElementById('home-countries').textContent =
        stats.countries ? `${stats.countries}+` : '-';

      document.getElementById('home-accuracy').textContent =
        stats.accuracy ? `${stats.accuracy}%` : '-';
    } else {
      document.getElementById('home-total-artists').textContent = '-';
      document.getElementById('home-countries').textContent = '-';
      document.getElementById('home-accuracy').textContent = '-';
    }

  } catch (error) {
    console.error('Error updating home stats:', error);

    document.getElementById('home-total-artists').textContent = '-';
    document.getElementById('home-countries').textContent = '-';
    document.getElementById('home-accuracy').textContent = '-';
  }
}

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', updateHomeStats);
