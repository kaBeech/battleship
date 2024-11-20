// In development, use localhost. In production, use relative URLs
const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:5000'
  : '';

export { API_BASE_URL };
