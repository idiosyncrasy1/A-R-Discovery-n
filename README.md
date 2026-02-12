# A&R Discovery Tool - Frontend

AI-powered platform for identifying breakout artists before they go viral.

-----

## 📁 Project Structure


A&R-Discovery/
├── index.html          # Landing page (marketing/hero)
├── dashboard.html      # Main analytics dashboard
├── artists.html        # Artist directory/catalog
├── analytics.html      # Platform-wide metrics
├── about.html          # Static informational page
├── styles.css          # Global stylesheet (shared across all pages)
├── script.js           # Dashboard logic (filtering, sorting, rendering)
├── artists.js          # Artists page logic (catalog filtering)
├── analytics.js        # Analytics page logic
├── home.js             # Home page statistics
├── config.js           # API configuration (OPTIONAL)
└── README.md           # This file


-----

## 🚀 Getting Started

### Step 1: Download/Clone the Project

Download all files to your local machine.

### Step 2: Update API Configuration

*IMPORTANT:* Before the website works, you need to update the backend API URL.

Open each JavaScript file and change this line:

javascript
// FIND THIS LINE in:
// - script.js
// - artists.js
// - analytics.js
// - home.js

const API_CONFIG = {
    BASE_URL: 'https://your-backend-api.com', // ⚠️ UPDATE THIS!
    // ...
};

// CHANGE TO YOUR ACTUAL BACKEND URL:
const API_CONFIG = {
    BASE_URL: 'https://ar-api.herokuapp.com', // Example
    // ...
};


### Step 3: Open in Browser

Simply open index.html in your web browser.

-----

## 🔗 Backend Integration

### Required Backend API Endpoints

Your backend developer needs to create these endpoints:

#### 1. *GET /api/artists*

Returns array of all artists with metrics.

*Response Format:*

json
[
  {
    "id": 1,
    "name": "Artist Name",
    "genre": "Afrobeats",
    "region": "Lagos, Nigeria",
    "location": "Lagos, Nigeria",
    "image": "https://example.com/artist.jpg",
    "spotify": {
      "listeners": 45000,
      "growth": 85,
      "trend": "🚀"
    },
    "tiktok": {
      "mentions": 12000,
      "growth": 220,
      "trend": "🔥"
    },
    "youtube": {
      "subscribers": 8500,
      "growth": 45,
      "trend": "📈"
    },
    "status": "viral",
    "overallScore": 116.7
  }
]


#### 2. *GET /api/stats*

Returns dashboard statistics.

*Response Format:*

json
{
  "totalArtists": 156,
  "viralArtists": 12,
  "risingArtists": 45,
  "avgGrowth": 98
}


#### 3. *GET /api/home-stats*

Returns home page statistics.

*Response Format:*

json
{
  "totalArtists": 500,
  "countries": 15,
  "accuracy": 98
}


#### 4. *GET /api/analytics*

Returns analytics data for charts.

*Response Format:*

json
{
  "genres": [
    { "name": "Afrobeats", "percentage": 85 },
    { "name": "Amapiano", "percentage": 72 }
  ],
  "regions": [
    { "name": "Nigeria", "flag": "🇳🇬", "count": 156 },
    { "name": "South Africa", "flag": "🇿🇦", "count": 98 }
  ],
  "platformStats": {
    "spotify": 64,
    "tiktok": 158,
    "youtube": 44
  },
  "trending": [
    {
      "name": "Melodia",
      "genre": "Afro-Pop",
      "region": "Uganda",
      "growth": 310,
      "platform": "TikTok"
    }
  ]
}


-----

## ⚙️ Features

### ✅ Implemented (Frontend Only)

- Responsive design (mobile, tablet, desktop)
- Search and filter functionality
- Sort by different metrics
- Loading and error states
- Clean, modern UI with glassmorphism
- Multi-page navigation
- XSS protection (HTML escaping)

### ⏳ Requires Backend

- Real artist data from Spotify/TikTok/YouTube
- Live statistics and metrics
- Growth calculations
- Predictive analytics
- User authentication (future)
- Data refresh scheduling

-----

## 🔧 Customization

### Changing Colors

Edit styles.css:

css
/* Primary gradient (purple to pink) */
--primary-gradient: linear-gradient(135deg, #a855f7, #ec4899);

/* Background */
--bg-dark: #1a1a2e;

/* Glass effect */
--glass-bg: rgba(255, 255, 255, 0.1);


### Adding New Pages

1. Create new HTML file (e.g., contact.html)
1. Copy structure from existing page
1. Add navigation link to all pages:

html
<li><a href="contact.html">Contact</a></li>


### Adding New Filters

Edit the respective JavaScript file and add to filterArtists() function.

-----

## 📊 Data Flow


User Opens Page
    ↓
JavaScript Loads (script.js)
    ↓
Fetch Data from Backend API
    ↓
Display Loading State
    ↓
Receive JSON Response
    ↓
Render Artists/Stats
    ↓
User Interacts (Search/Filter)
    ↓
Filter Data (Client-Side)
    ↓
Re-Render Results


-----

## 🐛 Troubleshooting

### “Failed to load artists”

*Problem:* API URL is incorrect or backend is down.

*Solution:*

1. Check API_CONFIG.BASE_URL in JavaScript files
1. Verify backend is running
1. Check browser console for errors (F12)
1. Test API directly: https://your-api.com/api/artists

### CORS Error

*Problem:* Backend is blocking requests from frontend domain.

*Solution:* Backend developer needs to add CORS headers:

javascript
// Backend (Node.js/Express example)
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));


### Images Not Loading

*Problem:* Image URLs are broken or incorrect.

*Solution:*

1. Check image field in API response
1. Ensure URLs are valid and accessible
1. Verify HTTPS (not HTTP) if site is HTTPS

-----

## 🚀 Deployment

### Option 1: Netlify (Recommended)

1. Create account at netlify.com
1. Drag and drop project folder
1. Done! Free hosting.

### Option 2: Vercel

1. Create account at vercel.com
1. Import from Git or upload folder
1. Deploy automatically

### Option 3: GitHub Pages

1. Upload to GitHub repository
1. Settings → Pages → Enable
1. Access at username.github.io/repo-name

-----

## 📝 Before Sending to Backend Developer

### Checklist:

- [ ] All HTML files have clean structure
- [ ] No fake data in JavaScript files
- [ ] API endpoints are clearly documented
- [ ] Response formats are specified
- [ ] Error handling is implemented
- [ ] Loading states work properly

### What to Send:

1. *All project files* (zip folder)
1. *This README.md*
1. *API endpoint documentation* (see above)
1. *Response format examples* (see above)

### What to Ask Backend Developer:

1. What will be the production API URL?
1. When will the APIs be ready?
1. Do we need authentication/API keys?
1. What’s the rate limit per endpoint?
1. How often will data refresh?

-----

## 📞 Support

For questions or issues:

1. Check browser console (F12) for errors
1. Review this README
1. Test API endpoints directly
1. Contact backend developer for API issues

-----

## 📄 License

© 2024 A&R Discovery. All rights reserved.

-----

## 🎯 Next Steps

1. ✅ Update API_CONFIG.BASE_URL in all JS files
1. ⏳ Wait for backend APIs to be ready
1. ✅ Test with real data
1. ✅ Deploy to production
1. 🎉 Launch!

-----

*Good luck with your A&R Discovery platform! 🎵🚀*