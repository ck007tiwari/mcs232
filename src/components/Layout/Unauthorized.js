import React from "react";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-primary px-4">
      <div className="max-w-md w-full text-center">
        <ShieldAlert size={64} className="mx-auto text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Access Denied</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          You don't have permission to access this page. Please contact your
          administrator if you believe this is a mistake.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="bg-primary-500 text-white px-6 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
