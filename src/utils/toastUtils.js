import { toast } from 'react-toastify';

/**
 * Utility functions for standardized toast notifications
 */

// Authentication toasts
export const authToasts = {
  loginSuccess: (userName) => 
    toast.success(`Welcome back, ${userName}!`, {
      icon: '👋'
    }),
  
  loginError: (message) => 
    toast.error(message || 'Invalid credentials', {
      icon: '🚫'
    }),
  
  registerSuccess: () => 
    toast.success('Account created successfully! Welcome to ELearn!', {
      icon: '🎉'
    }),
  
  registerError: (message) => 
    toast.error(message || 'Registration failed. Please try again.', {
      icon: '❌'
    }),
  
  passwordMismatch: () => 
    toast.error('Passwords do not match', {
      icon: '🔒'
    }),
  
  logoutSuccess: () => 
    toast.info('You have been logged out. See you soon!', {
      icon: '👋'
    })
};

// PDF management toasts
export const pdfToasts = {
  uploadSuccess: (fileName, isPublic) => 
    toast.success(
      <div>
        <p className="font-medium">PDF uploaded successfully!</p>
        <p className="text-sm opacity-90">File: {fileName}</p>
        <p className="text-sm opacity-90">
          Access: {isPublic ? 'Public (all users)' : 'Private (you + admin)'}
        </p>
      </div>,
      {
        icon: '📄',
        autoClose: 4000
      }
    ),
  
  uploadError: (message) => 
    toast.error(
      <div>
        <p className="font-medium">Upload failed!</p>
        <p className="text-sm opacity-90">{message || 'Please try again.'}</p>
      </div>,
      {
        icon: '❌'
      }
    ),
  
  deleteSuccess: () => 
    toast.success('PDF deleted successfully', {
      icon: '🗑️'
    }),
  
  deleteError: (message) => 
    toast.error(message, {
      icon: '❌'
    }),
  
  deleteConfirmation: (filename, onConfirm) => 
    toast.warning(
      <div>
        <p className="font-medium">Delete PDF?</p>
        <p className="text-sm opacity-90">"{filename}" will be permanently removed.</p>
        <div className="flex space-x-2 mt-3">
          <button
            onClick={() => {
              toast.dismiss();
              onConfirm();
            }}
            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
        icon: '⚠️'
      }
    )
};

// Q&A toasts
export const qaToasts = {
  questionSubmitted: () => 
    toast.success('Question submitted successfully!', {
      icon: '💭'
    }),
  
  questionError: () => 
    toast.error('Failed to submit question. Please try again.', {
      icon: '❌'
    }),
  
  answerReceived: () => 
    toast.info('AI answer generated!', {
      icon: '🤖'
    })
};

// General app toasts
export const appToasts = {
  featureNotAvailable: () => 
    toast.info('This feature is coming soon!', {
      icon: '🚧'
    }),
  
  accessDenied: () => 
    toast.warning('You do not have permission to access this feature', {
      icon: '🚫'
    }),
  
  networkError: () => 
    toast.error('Network error. Please check your connection.', {
      icon: '🌐'
    }),
  
  saveSuccess: () => 
    toast.success('Changes saved successfully!', {
      icon: '💾'
    }),
  
  saveError: () => 
    toast.error('Failed to save changes. Please try again.', {
      icon: '❌'
    }),
  
  copySuccess: () => 
    toast.success('Copied to clipboard!', {
      icon: '📋',
      autoClose: 2000
    })
};

// Development and testing toasts
export const devToasts = {
  routeProtected: (route) => 
    toast.warning(`Route "${route}" is protected`, {
      icon: '🛡️',
      autoClose: 2000
    }),
  
  adminRequired: () => 
    toast.warning('Admin access required', {
      icon: '👮‍♂️',
      autoClose: 2000
    }),
  
  demo: (message) => 
    toast.info(message || 'This is a demo feature', {
      icon: '🧪',
      autoClose: 3000
    })
};

// Custom toast wrapper with consistent styling
export const customToast = {
  success: (message, options = {}) => 
    toast.success(message, {
      icon: '✅',
      ...options
    }),
  
  error: (message, options = {}) => 
    toast.error(message, {
      icon: '❌',
      ...options
    }),
  
  warning: (message, options = {}) => 
    toast.warning(message, {
      icon: '⚠️',
      ...options
    }),
  
  info: (message, options = {}) => 
    toast.info(message, {
      icon: 'ℹ️',
      ...options
    })
};

export default {
  auth: authToasts,
  pdf: pdfToasts,
  qa: qaToasts,
  app: appToasts,
  dev: devToasts,
  custom: customToast
};