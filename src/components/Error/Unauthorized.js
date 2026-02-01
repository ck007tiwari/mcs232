import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, LogIn, Home } from 'lucide-react';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <Shield size={40} className="text-red-600" />
          </div>

          {/* Error Code */}
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Access Denied</h1>
          
          {/* Error Message */}
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-8">
            You need to be logged in to access this page. Please sign in to continue.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/login"
              className="inline-flex items-center justify-center space-x-2 w-full bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <LogIn size={20} />
              <span>Sign In</span>
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center justify-center space-x-2 w-full text-gray-700 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <span>Create Account</span>
            </Link>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 font-medium mb-2">Demo Credentials:</p>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Student:</strong> ck@tiwari.com / ck12345</p>
              <p><strong>Admin:</strong> ck@tiwari.com / ck123456</p>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-6">
            Need help? Contact support for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;