// PDF utility functions for file handling and validation

/**
 * Extract PDF metadata using PDF.js
 */
export const extractPdfMetadata = async (file) => {
  return new Promise((resolve, reject) => {
    try {
      // For demo purposes, we'll simulate PDF processing
      // In a real app, you'd use PDF.js library to extract actual metadata
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Simulate PDF processing delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Simulate page count based on file size (rough estimation)
          const fileSizeKB = file.size / 1024;
          let estimatedPages;
          
          if (fileSizeKB < 500) {
            estimatedPages = Math.floor(fileSizeKB / 10) + Math.floor(Math.random() * 20) + 10;
          } else if (fileSizeKB < 2000) {
            estimatedPages = Math.floor(fileSizeKB / 15) + Math.floor(Math.random() * 30) + 20;
          } else {
            estimatedPages = Math.floor(fileSizeKB / 20) + Math.floor(Math.random() * 40) + 50;
          }
          
          // Ensure we don't exceed realistic bounds
          estimatedPages = Math.min(estimatedPages, 500);
          estimatedPages = Math.max(estimatedPages, 1);
          
          resolve({
            pageCount: estimatedPages,
            fileSize: file.size,
            fileName: file.name,
            fileType: file.type
          });
        } catch (error) {
          reject(new Error('Failed to process PDF'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Validate PDF file against constraints
 */
export const validatePdfFile = async (file, maxSizeMB = 10, maxPages = 100) => {
  const errors = [];
  
  // Check file type
  if (file.type !== 'application/pdf') {
    errors.push('Only PDF files are allowed');
  }
  
  // Check file size
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    errors.push(`File size must be less than ${maxSizeMB}MB (current: ${(file.size / (1024 * 1024)).toFixed(1)}MB)`);
  }
  
  // Check if file is empty
  if (file.size === 0) {
    errors.push('File appears to be empty');
  }
  
  // If basic validation passes, check page count
  if (errors.length === 0) {
    try {
      const metadata = await extractPdfMetadata(file);
      
      if (metadata.pageCount > maxPages) {
        errors.push(`PDF has ${metadata.pageCount} pages. Maximum allowed is ${maxPages} pages.`);
      }
      
      return {
        isValid: errors.length === 0,
        errors,
        metadata: errors.length === 0 ? metadata : null
      };
    } catch (error) {
      errors.push('Failed to process PDF file. Please ensure it\'s a valid PDF.');
      return {
        isValid: false,
        errors,
        metadata: null
      };
    }
  }
  
  return {
    isValid: false,
    errors,
    metadata: null
  };
};

/**
 * Generate a unique filename to avoid conflicts
 */
export const generateUniqueFilename = (originalName, userId) => {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const extension = originalName.split('.').pop();
  const nameWithoutExtension = originalName.replace(`.${extension}`, '');
  
  // Clean the filename to remove special characters
  const cleanName = nameWithoutExtension.replace(/[^a-zA-Z0-9_-]/g, '_');
  
  return `${cleanName}_${userId}_${timestamp}_${randomString}.${extension}`;
};

/**
 * Save file to public folder (simulation for development)
 * In production, this would be handled by the backend
 */
export const saveFileToPublic = async (file, fileName) => {
  return new Promise((resolve, reject) => {
    try {
      // Since we can't actually write to the file system from the browser,
      // we'll simulate the file saving process
      
      // In a real application, this would:
      // 1. Send the file to a backend API
      // 2. The backend would save the file to the server
      // 3. Return the file path/URL
      
      // For development, we'll simulate this process
      setTimeout(() => {
        const publicPath = `/pdf/${fileName}`;
        console.log(`File would be saved to: public${publicPath}`);
        
        // Simulate success
        resolve({
          success: true,
          filePath: publicPath,
          message: `File saved as ${fileName}`
        });
      }, 1500); // Simulate upload time
      
    } catch (error) {
      reject({
        success: false,
        error: error.message || 'Failed to save file'
      });
    }
  });
};

/**
 * Get file size in human readable format
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Generate thumbnail URL (placeholder for now)
 */
export const generateThumbnailUrl = (fileName, subjectColor = '#3B82F6') => {
  const fileNameShort = fileName.substring(0, 4).toUpperCase();
  return `https://via.placeholder.com/200x280/${subjectColor.replace('#', '')}/FFFFFF?text=${fileNameShort}`;
};