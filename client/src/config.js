// Single source of truth for the backend URL.
// Set VITE_API_URL in client/.env for local dev,
// or in your Vercel project's Environment Variables for production.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default API_URL;
