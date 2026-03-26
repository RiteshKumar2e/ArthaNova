/**
 * Simple In-memory API Cache Middleware
 * Accelerates GET requests by serving from memory instead of triggering DB queries/external APIs
 */
const cacheMap = new Map();

export const apiCache = (durationSeconds = 60) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Create unique key based on URL string
    const key = req.originalUrl || req.url;
    
    // Check if key exists in active memory
    const cachedItem = cacheMap.get(key);
    
    if (cachedItem) {
      // Check if TTL is still valid
      if (Date.now() < cachedItem.expiry) {
        console.log(`⚡ Serving CACHED response: ${key}`);
        return res.json(cachedItem.data);
      } else {
        // Purge expired cache key
        cacheMap.delete(key);
      }
    }
    
    // Cache miss or expired - intercept res.json to store out-bound data
    const originalJson = res.json;
    res.json = function (body) {
      // Restore original function to avoid double-intercept
      res.json = originalJson;
      
      // Only cache successful responses (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Store JSON in cache map with expiration
        cacheMap.set(key, {
          expiry: Date.now() + (durationSeconds * 1000),
          data: body
        });
        console.log(`💾 Stored NEW Cache: ${key} (TTL: ${durationSeconds}s)`);
      } else {
        console.log(`⚠️  Skipped cache for ${key} (status: ${res.statusCode})`);
      }
      
      // Complete the outbound response
      return originalJson.call(this, body);
    };
    
    next();
  };
};
