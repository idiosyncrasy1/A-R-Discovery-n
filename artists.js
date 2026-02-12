// ============================================
// CONFIGURATION - UPDATE THIS WITH YOUR BACKEND URL
// ============================================
const API_CONFIG = {
BASE_URL: 'https://your-backend-api.com', // Replace with actual backend URL
ENDPOINTS: {
ARTISTS: '/api/artists'
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

// ============================================
// UI STATE FUNCTIONS
// ============================================

/**

- Show loading state in artists list container
  */
  function showLoading() {
  const container = document.getElementById('artists-list-container');
  container.innerHTML = <div class="loading-state" style="grid-column: 1 / -1;"> <div class="spinner"></div> <p>Loading artists...</p> </div>;
  }

/**

- Show error state with retry option
- @param {string} message - Error message to display
  */
  function showError(message) {
  const container = document.getElementById('artists-list-container');
  container.innerHTML = <div class="error-state" style="grid-column: 1 / -1;"> <div class="error-icon">❌</div> <p class="error-message">${message}</p> <button onclick="init()" class="retry-button">Try Again</button> </div>;
  }

// ============================================
// RENDERING FUNCTIONS
// ============================================

/**

- Render artists list to the DOM
- @param {Array} artists - Array of artist objects to render
  */
  function renderArtistsList(artists) {
  const container = document.getElementById('artists-list-container');
  
  if (artists.length === 0) {
    container.innerHTML = `
      <div class="no-results" style="grid-column: 1 / -1;">
        <p>No artists found matching your criteria</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = artists.map(artist => `
    <div class="artist-list-card">
      <img src="${artist.image}" 
           alt="${escapeHtml(artist.name)}" 
           class="artist-list-avatar"> 
      <div class="artist-list-name">${escapeHtml(artist.name)}</div>
      <div class="artist-list-genre">${escapeHtml(artist.genre)}</div>
      <div class="artist-list-region">${escapeHtml(artist.location)}</div>
      <span class="status-badge status-${artist.status}" 
            style="margin-top: 15px; display: inline-block;">
        ${getStatusLabel(artist.status)}
      </span> 
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

- Escape HTML to prevent XSS attacks
- @param {string} text - Text to escape
- @returns {string} Escaped text
  */
  function escapeHtml(text) {
  const map = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&qout;',
  "’": '&#039;'
  };
  return text.replace(/[&<>”’]/g, m => map[m]);
  }

// ============================================
// FILTER FUNCTIONS
// ============================================

/**

- Filter artists based on user input
  */
  function filterArtists() {
  const searchTerm = document.getElementById('artist-search').value.toLowerCase();
  const genreFilter = document.getElementById('genre-filter').value;
  const regionFilter = document.getElementById('region-filter').value;
  
  filteredArtists = artistsData.filter(artist => {
  // Search filter
  const matchesSearch = artist.name.toLowerCase().includes(searchTerm) ||
  artist.location.toLowerCase().includes(searchTerm);
  
  
   // Genre filter
   const matchesGenre = genreFilter === 'all' || 
                       artist.genre.toLowerCase().replace(/\//g, '').replace(/\s/g, '').replace(/-/g, '') === genreFilter;
   
   // Region filter
   const matchesRegion = regionFilter === 'all' || 
                        artist.region.toLowerCase().replace(/\s/g, '-') === regionFilter;
   
   return matchesSearch && matchesGenre && matchesRegion;
  
  
  });
  
  renderArtistsList(filteredArtists);
  }

// ============================================
// EVENT LISTENERS
// ============================================

/**

- Attach event listeners to filter controls
  */
  function attachEventListeners() {
  document.getElementById('artist-search').addEventListener('input', filterArtists);
  document.getElementById('genre-filter').addEventListener('change', filterArtists);
  document.getElementById('region-filter').addEventListener('change', filterArtists);
  }

// ============================================
// INITIALIZATION
// ============================================

/**

- Initialize the artists page
  */
  async function init() {
  showLoading();
  
  try {
  // Fetch data from backend
  artistsData = await fetchArtistsFromAPI();
  filteredArtists = [...artistsData];
  
  
   // Render artists
   renderArtistsList(filteredArtists);
   
   // Attach event listeners
   attachEventListeners();
  
  
  } catch (error) {
  showError('Failed to load artists. Please check your internet connection and try again.');
  }
  }

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', init);