// Create React App only exposes env vars prefixed with REACT_APP_ to the
// browser bundle. The plain API_BASE_URL var was always undefined, so the
// hardcoded fallback below was silently used. REACT_APP_API_BASE_URL is now
// honored, with the same fallback for local development.
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://127.0.0.1:8000/api";
export default API_BASE_URL;
