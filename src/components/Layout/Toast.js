import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { useApp } from "../../context/AppContext";

const toastIcons = {
  success: <CheckCircle className="text-green-500" />,
  error: <XCircle className="text-red-500" />,
  info: <Info className="text-blue-500" />,
  warning: <AlertTriangle className="text-yellow-500" />,
};

const Toast = () => {
  const { toast, hideToast } = useApp();

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
      <div className="max-w-sm w-full bg-white rounded-lg shadow-lg ring-1 ring-black/5">
        <div className="p-4 flex items-start gap-3">
          <div>{toastIcons[toast.type]}</div>

          <p className="flex-1 text-sm font-medium text-gray-900">
            {toast.message}
          </p>

          <button
            onClick={hideToast}
            className="text-gray-400 hover:text-gray-600"
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
