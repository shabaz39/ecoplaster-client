// src/utils/safeId.ts
// Create this file to make the safeId function available across your application

/**
 * Safely converts any MongoDB ID type to a string
 * Handles ObjectIDs, strings, and MongoDB Buffer representation
 */
export const safeId = (id: any): string => {
    if (!id) return '';
    
    // If it's already a string, return it
    if (typeof id === 'string') return id;
    
    // If it's an object with a toString method, use it
    if (id && typeof id.toString === 'function') {
      try {
        return id.toString();
      } catch (e) {
        console.error('Error calling toString:', e);
        return '';
      }
    }
    
    // If it's a buffer object (this is what's causing your error)
    if (id && id.type === 'Buffer' && Array.isArray(id.data)) {
      try {
        const bufferData = Buffer.from(id.data);
        return bufferData.toString('hex');
      } catch (e) {
        console.error('Error converting Buffer to string:', e);
        return '';
      }
    }
    
    // Fallback to empty string
    return '';
  };
  
  /**
   * Deep processes an object to safely convert all IDs
   * Useful for objects with nested IDs
   */
  export const deepSafeIds = (obj: any): any => {
    if (!obj) return obj;
    
    // Handle arrays
    if (Array.isArray(obj)) {
      return obj.map(item => deepSafeIds(item));
    }
    
    // Handle objects
    if (typeof obj === 'object') {
      const result: Record<string, any> = {};
      
      // Process each property
      for (const key in obj) {
        // Special handling for _id or id fields
        if (key === '_id' || key === 'id') {
          result[key] = safeId(obj[key]);
        }
        // Special handling for fields ending with "Id"
        else if (key.endsWith('Id')) {
          result[key] = safeId(obj[key]);
        }
        // Recursively process nested objects and arrays
        else if (typeof obj[key] === 'object' && obj[key] !== null) {
          result[key] = deepSafeIds(obj[key]);
        }
        // Copy over primitive values
        else {
          result[key] = obj[key];
        }
      }
      
      return result;
    }
    
    // Return primitives as-is
    return obj;
  };