// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR BACKEND URL
// ============================================
const API_CONFIG = {
BASE_URL: 'https://your-backend-api.com', // Replace with actual backend URL
ENDPOINTS: {
ARTISTS: '/api/artists',
STATS: '/api/stats'
}
};

// ============================================
// STATE MANAGEMENT
// ============================================
let artistsData = [];
let filteredArtists = [];

// ============================================
// API FUNCTIONS
// ============================================

/**

- Fetch all artists from backend API
- @returns {Promise<Array>} Array of artist objects
  */
  async function fetchArtistsFromAPI() {
  try {
  const response = await fetch('${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.ARTISTS}');
  
  
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   }
   
   const data = await response.json();
   return data;
  
  
  } catch (error) {
  console.error('Error fetching artists:', error);
  throw error;
  }
  }

/**

- Fetch dashboard statistics from backend API
- @returns {Promise<Object>} Statistics object
  */
  async function fetchStatsFromAPI() {
  try {
  const response = await fetch('${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.STATS}');
  
  
   if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
   }
   
   const data = await response.json();
   return data;
  
  
  } catch (error) {
  console.error('Error fetching stats:', error);
  return null;
  }
  }

// ============================================
// UI STATE FUNCTIONS
// ============================================

/**

- Show loading state in artists container
  */
  function showLoading() {
  const container = document.getElementById('artists-container');
  container.innerHTML = <div class="loading-state"> <div class="spinner"></div> <p>Loading artists...</p> </div>;
  }

/**

- Show error state with retry option
- @param {string} message - Error message to display
  */
  function showError(message) {
  const container = document.getElementById('artists-container');
  container.innerHTML = <div class="error-state"> <div class="error-icon">❌</div> <p class="error-message">${message}</p> <button onclick="init()" class="retry-button">Try Again</button> </div>;
  }

// ============================================
// DATA PROCESSING FUNCTIONS
// ============================================

/**

- Update statistics display with real data
- @param {Object} stats - Statistics object from API
  */
  function updateStatsWithData(stats) {
  document.getElementById('total-artists').textContent = stats.totalArtists || 0;
  document.getElementById('viral-artists').textContent = stats.viralArtists || 0;
  document.getElementById('rising-artists').textContent = stats.risingArtists || 0;
  document.getElementById('avg-growth').textContent = '+${stats.avgGrowth || 0}%';
  }

/**

- Calculate statistics from artists data (fallback if stats endpoint fails)
  */
  function calculateStatsFromData() {
  const totalArtists = artistsData.length;
  const viralArtists = artistsData.filter(a => a.status === 'viral').length;
  const risingArtists = artistsData.filter(a => a.status === 'rising').length;
  const avgGrowth = totalArtists > 0
  ? Math.round(artistsData.reduce((sum, a) => sum + a.overallScore, 0) / totalArtists)
  : 0;
  
  return { totalArtists, viralArtists, risingArtists, avgGrowth };
  }

// ============================================
// RENDERING FUNCTIONS
// ============================================

/**

- Render artist cards to the DOM
- @param {Array} artists - Array of artist objects to render
  */
  function renderArtists(artists) {
  const container = document.getElementById('artists-container');
  
  if (artists.length === 0) {
  container.innerHTML = <div class="no-results"> <p>No artists found matching your criteria</p> </div>;
  return;
  }
  
  container.innerHTML = artists.map(artist => `
  <div class="artist-card">
  <div class="artist-header">
  <img src="${artist.image}" alt="${artist.name}" class="artist-avatar">
  <div class="artist-info">
  <div class="artist-name-row">
  <div>
  <div class="artist-name">${escapeHtml(artist.name)}</div>
  <div class="artist-genre">${escapeHtml(artist.genre)}</div>
  <div class="artist-region">${escapeHtml(artist.region)}</div>
  </div>
  <span class="status-badge status-${artist.status}">
  ${getStatusLabel(artist.status)}
  </span>
  </div>
  </div>
  </div>
  
  
       <div class="metrics-grid">
           <div class="metric-card">
               <div class="metric-header">
                   <span class="metric-icon">🎵</span>
                   <span class="metric-label">Spotify</span>
               </div>
               <div class="metric-value">${formatNumber(artist.spotify.listeners)}</div>
               <div class="metric-growth growth-positive">+${artist.spotify.growth}% ${artist.spotify.trend}</div>
           </div>
           <div class="metric-card">
               <div class="metric-header">
                   <span class="metric-icon">📱</span>
                   <span class="metric-label">TikTok</span>
               </div>
               <div class="metric-value">${formatNumber(artist.tiktok.mentions)}</div>
               <div class="metric-growth growth-pink">+${artist.tiktok.growth}% ${artist.tiktok.trend}</div>
           </div>
           <div class="metric-card">
               <div class="metric-header">
                   <span class="metric-icon">👁️</span>
                   <span class="metric-label">YouTube</span>
               </div>
               <div class="metric-value">${formatNumber(artist.youtube.subscribers)}</div>
               <div class="metric-growth growth-red">+${artist.youtube.growth}% ${artist.youtube.trend}</div>
           </div>
       </div>
       
       <div class="overall-score">
           <span>Overall Growth Score</span>
           <span>${artist.overallScore.toFixed(1)}</span>
       </div>
   </div>
  
  
  `).join('');
  }

// ============================================
// HELPER FUNCTIONS
// ============================================

/**

- Get human-readable status label
- @param {string} status - Artist status (viral, rising, steady)
- @returns {string} Formatted label
  */
  function getStatusLabel(status) {
  const labels = {
  'viral': 'Viral 🔥',
  'rising': 'Rising 🚀',
  'steady': 'Steady 📈'
  };
  return labels[status] || 'Unknown';
  }

/**

- Format number with commas
- @param {number} num - Number to format
- @returns {string} Formatted number
  */
  function formatNumber(num) {
  return num.toLocaleString();
  }

/**

- Escape HTML to prevent XSS attacks
- @param {string} text - Text to escape
- @returns {string} Escaped text
  */
  function escapeHtml(text) {
  const map = {
  '&': '&amp;',
  '<': '<',
  '>': '>',
  '"': '&qout;',
  "'": '&#039;'
  };
  return text.replace(/[&<>”’]/g, m => map[m]);
  }

// ============================================
// FILTER & SORT FUNCTIONS
// ============================================

/**

- Filter and sort artists based on user input
  */
  function filterAndSort() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const platformFilter = document.getElementById('platform-filter').value;
  const sortBy = document.getElementById('sort-by').value;
  
  // Filter artists
  filteredArtists = artistsData.filter(artist => {
  const matchesSearch = artist.name.toLowerCase().includes(searchTerm) ||
  artist.genre.toLowerCase().includes(searchTerm);
  
  
   let matchesPlatform = true;
   if (platformFilter === 'spotify') matchesPlatform = artist.spotify.growth > 50;
   if (platformFilter === 'tiktok') matchesPlatform = artist.tiktok.growth > 100;
   if (platformFilter === 'youtube') matchesPlatform = artist.youtube.growth > 40;
   
   return matchesSearch && matchesPlatform;
  
  
  });
  
  // Sort artists
  filteredArtists.sort((a, b) => {
  if (sortBy === 'overall') return b.overallScore - a.overallScore;
  if (sortBy === 'spotify') return b.spotify.growth - a.spotify.growth;
  if (sortBy === 'tiktok') return b.tiktok.growth - a.tiktok.growth;
  if (sortBy === 'youtube') return b.youtube.growth - a.youtube.growth;
  return 0;
  });
  
  renderArtists(filteredArtists);
  }

// ============================================
// EVENT LISTENERS
// ============================================

/**

- Attach event listeners to filter controls
  */
  function attachEventListeners() {
  document.getElementById('search').addEventListener('input', filterAndSort);
  document.getElementById('platform-filter').addEventListener('change', filterAndSort);
  document.getElementById('sort-by').addEventListener('change', filterAndSort);
  }

// ============================================
// INITIALIZATION
// ============================================

/**

- Initialize the dashboard
  */
  async function init() {
  showLoading();
  
  try {
  // Fetch data from backend
  artistsData = await fetchArtistsFromAPI();
  filteredArtists = [...artistsData];
  
  
   // Update statistics
   const stats = await fetchStatsFromAPI();
   if (stats) {
       updateStatsWithData(stats);
   } else {
       // Fallback: calculate from artist data
       const calculatedStats = calculateStatsFromData();
       updateStatsWithData(calculatedStats);
   }
   
   // Render artists
   renderArtists(filteredArtists);
   
   // Attach event listeners
   attachEventListeners();
  
  
  } catch (error) {
  showError('Failed to load artists. Please check your internet connection and try again.');
  }
  }

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);