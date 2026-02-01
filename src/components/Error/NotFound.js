import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const NotFound = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useApp();

  const handleGoHome = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
            <AlertTriangle size={40} className="text-red-600" />
          </div>

          {/* Error Code */}
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          
          {/* Error Message */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center justify-center space-x-2 w-full bg-primary-500 text-white py-3 px-6 rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Home size={20} />
              <span>{isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}</span>
            </button>

            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center space-x-2 w-full text-gray-700 border border-gray-300 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Go Back</span>
            </button>
          </div>

          {/* Search Suggestion */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2 text-gray-600">
              <Search size={16} />
              <span className="text-sm">Looking for something specific?</span>
            </div>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className="block hover:text-primary-600">• Dashboard</Link>
                  <Link to="/qa-history" className="block hover:text-primary-600">• Q&A History</Link>
                  <Link to="/profile" className="block hover:text-primary-600">• Profile</Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="block hover:text-primary-600">• Login</Link>
                  <Link to="/register" className="block hover:text-primary-600">• Register</Link>
                </>
              )}
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-gray-500 mt-6">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;