// axiosClient.js
import axios from "axios";

const isDev = import.meta.env.DEV === true;
const baseURL = isDev ? "/api" : import.meta.env.VITE_API_BASE_URL;

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// Avoid custom headers in development to prevent preflight
if (!isDev && import.meta.env.VITE_API_KEY) {
  headers["x-api-key"] = import.meta.env.VITE_API_KEY;
}

const axiosClient = axios.create({
  // baseURL: 'https://some-domain.com/api/',
  baseURL,
  timeout: 5000,
  withCredentials: true,
  withXSRFToken: true,
  headers,
});

// Simple in-memory cache for GET requests (opt-in via config.cache)
const inMemoryCache = new Map();

function buildCacheKey(config) {
  const key = JSON.stringify({
    m: config.method,
    u: config.url,
    p: config.params || null,
  });
  return key;
}

// Function to invalidate cache for specific URL patterns
export function invalidateCache(pattern) {
  if (!pattern) {
    inMemoryCache.clear();
    return;
  }
  
  const keysToDelete = [];
  for (const [key, value] of inMemoryCache.entries()) {
    try {
      const cacheKey = JSON.parse(key);
      if (cacheKey.u && cacheKey.u.includes(pattern)) {
        keysToDelete.push(key);
      }
    } catch (e) {
      // Invalid key format, skip
    }
  }
  
  keysToDelete.forEach(key => inMemoryCache.delete(key));
}

axiosClient.interceptors.request.use((config) => {
  if (
    config.method === "get" &&
    config.cache &&
    typeof config.cache.ttl === "number" &&
    config.cache.ttl > 0
  ) {
    const key = buildCacheKey(config);
    const entry = inMemoryCache.get(key);
    if (entry && entry.expiry > Date.now()) {
      // Serve from cache without making a network request
      const cached = entry.response;
      config.adapter = () =>
        Promise.resolve({
          data: cached.data,
          status: cached.status,
          statusText: cached.statusText,
          headers: cached.headers,
          config,
          request: null,
        });
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    const { config } = response;
    if (
      config &&
      config.method === "get" &&
      config.cache &&
      typeof config.cache.ttl === "number" &&
      config.cache.ttl > 0
    ) {
      const key = buildCacheKey(config);
      inMemoryCache.set(key, {
        expiry: Date.now() + config.cache.ttl,
        response: {
          data: response.data,
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        },
      });
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
