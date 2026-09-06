import axios from "axios";

// Derive API Base URL with production / Render support
export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  // Accommodate Render cold start time (~30-45s)
  timeout: 45000,
});

/**
 * Fast ping to check backend health without authentication
 */
export const pingServerHealth = async (timeoutMs = 5000) => {
  return await axios.get(`${BASE_URL}/health`, {
    timeout: timeoutMs,
    headers: {
      "Cache-Control": "no-cache",
      Pragma: "no-cache",
    },
  });
};