// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR BACKEND URL
// ============================================
const API_CONFIG = {
  BASE_URL: 'https://your-backend-api.com', // Replace with actual backend URL
  ENDPOINTS: {
    ANALYTICS: '/api/analytics'
  }
};

// ============================================
// API FUNCTIONS
// ============================================

async function fetchAnalyticsFromAPI() {
  try {
    const response = await fetch(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ANALYTICS}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;

  } catch (error) {
    console.error('Error fetching analytics:', error);
    throw error;
  }
}

// ============================================
// RENDERING FUNCTIONS
// ============================================

function renderGenres(genres) {
  const container = document.getElementById('genres-container');

  if (!genres || genres.length === 0) {
    container.innerHTML = '<p class="no-data">No genre data available</p>';
    return;
  }

  container.innerHTML = genres.map(genre => `
    <div class="genre-bar">
      <span class="genre-name">${escapeHtml(genre.name)}</span>
      <div class="bar" style="width: ${genre.percentage}%">
        <span class="bar-value">${genre.percentage}%</span>
      </div>
    </div>
  `).join('');
}

function renderRegions(regions) {
  const container = document.getElementById('regions-container');

  if (!regions || regions.length === 0) {
    container.innerHTML = '<p class="no-data">No regional data available</p>';
    return;
  }

  container.innerHTML = regions.map(region => `
    <div class="region-stat">
      <div class="region-info">
        <span class="region-flag">${region.flag}</span>
        <span class="region-name">${escapeHtml(region.name)}</span>
      </div>
      <span class="region-count">${region.count} artists</span>
    </div>
  `).join('');
}

function renderPlatformStats(stats) {
  const container = document.getElementById('platform-stats-container');

  if (!stats) {
    container.innerHTML = '<p class="no-data">No platform data available</p>';
    return;
  }

  container.innerHTML = `
    <div class="platform-card">
      <div class="platform-icon">🎵</div>
      <div class="platform-info">
        <h4>Spotify</h4>
        <div class="platform-metric">
          <span class="metric-value">+${stats.spotify || 0}%</span>
          <span class="metric-label">Avg Growth</span>
        </div>
      </div>
    </div>

    <div class="platform-card">
      <div class="platform-icon">📱</div>
      <div class="platform-info">
        <h4>TikTok</h4>
        <div class="platform-metric">
          <span class="metric-value">+${stats.tiktok || 0}%</span>
          <span class="metric-label">Avg Growth</span>
        </div>
      </div>
    </div>

    <div class="platform-card">
      <div class="platform-icon">▶️</div>
      <div class="platform-info">
        <h4>YouTube</h4>
        <div class="platform-metric">
          <span class="metric-value">+${stats.youtube || 0}%</span>
          <span class="metric-label">Avg Growth</span>
        </div>
      </div>
    </div>
  `;
}

function renderTrending(trending) {
  const container = document.getElementById('trending-container');

  if (!trending || trending.length === 0) {
    container.innerHTML = '<p class="no-data">No trending data available</p>';
    return;
  }

  container.innerHTML = trending.map((artist, index) => `
    <div class="trending-item">
      <span class="trending-rank">#${index + 1}</span>
      <div class="trending-info">
        <span class="trending-name">${escapeHtml(artist.name)}</span>
        <span class="trending-genre">
          ${escapeHtml(artist.genre)} • ${escapeHtml(artist.region)}
        </span>
      </div>
      <span class="trending-growth">
        +${artist.growth}% ${artist.platform}
      </span>
    </div>
  `).join('');
}

// ============================================
// UI STATE FUNCTIONS
// ============================================

function showLoading() {
  const containers = [
    'genres-container',
    'regions-container',
    'platform-stats-container',
    'trending-container'
  ];

  containers.forEach(id => {
    const container = document.getElementById(id);
    container.innerHTML = `
      <div class="loading-placeholder">Loading data...</div>
    `;
  });
}

function showError(message) {
  const containers = [
    'genres-container',
    'regions-container',
    'platform-stats-container',
    'trending-container'
  ];

  containers.forEach(id => {
    const container = document.getElementById(id);
    container.innerHTML = `
      <div class="error-placeholder">
        <p>${message}</p>
        <button onclick="init()" class="retry-button">Try Again</button>
      </div>
    `;
  });
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function escapeHtml(text) {
  if (!text) return '';

  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return text.replace(/[&<>"']/g, m => map[m]);
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
  showLoading();

  try {
    const data = await fetchAnalyticsFromAPI();

    if (data) {
      renderGenres(data.genres);
      renderRegions(data.regions);
      renderPlatformStats(data.platformStats);
      renderTrending(data.trending);
    } else {
      throw new Error('No data received from API');
    }

  } catch (error) {
    showError(
      'Failed to load analytics data. Please check your internet connection and try again.'
    );
  }
}

document.addEventListener('DOMContentLoaded', init);
