import React, { useEffect, useContext } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";
import ThemeContext from "../../context/ThemeContext";

const Toast = () => {
  const { toast, hideToast } = useApp();
  const { theme } = useContext(ThemeContext);

  const toastIcons = {
    success: <CheckCircle className="text-green-500" />,
    error: <XCircle className="text-red-500" />,
    info: <Info className="text-blue-500" />,
    warning: <AlertTriangle className="text-yellow-500" />,
  };

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000); // Auto-dismiss after 5 seconds
      return () => clearTimeout(timer);
    }
  }, [toast, hideToast]);

  if (!toast.show) {
    return null;
  }

  return createPortal(
    <div className="fixed top-5 right-5 z-[9999]">
      <div className={`max-w-sm w-full rounded-lg shadow-lg ring-1 ${theme === 'dark' ? 'bg-dark-secondary ring-white/10' : 'bg-white ring-black/5'}`}>
        <div className="p-4 flex items-start gap-3">
          <div>{toastIcons[toast.type]}</div>

          <p className={`flex-1 text-sm font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
            {toast.message}
          </p>

          <button
            onClick={hideToast}
            className={`text-gray-400 hover:text-gray-600 ${theme === 'dark' ? 'dark:text-gray-500 dark:hover:text-gray-300' : ''}`}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Toast;
