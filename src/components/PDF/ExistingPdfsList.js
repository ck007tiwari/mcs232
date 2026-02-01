import React, { useState } from 'react';
import { FileText, Download, Eye, AlertTriangle, CheckCircle } from 'lucide-react';

const ExistingPdfsList = () => {
  const [showList, setShowList] = useState(false);

  // List of PDFs in public folder
  const existingPdfs = [
    {
      filename: "Computer_800KB_148_page.pdf",
      size: "800 KB",
      pages: 148,
      path: "/pdf/Computer_800KB_148_page.pdf",
      status: "valid", // Under 10MB, under 100 pages
      reason: "File exceeds 100 pages limit"
    },
    {
      filename: "Web_development_1MB_PDF_84_page.pdf", 
      size: "1 MB",
      pages: 84,
      path: "/pdf/Web_development_1MB_PDF_84_page.pdf",
      status: "valid"
    },
    {
      filename: "10.5MB_PDF_57_pages.pdf",
      size: "10.5 MB", 
      pages: 57,
      path: "/pdf/10.5MB_PDF_57_pages.pdf",
      status: "invalid",
      reason: "File exceeds 10MB size limit"
    }
  ];

  const handleDownload = (pdf) => {
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = pdf.path;
    link.download = pdf.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleView = (pdf) => {
    // Open PDF in new tab
    window.open(pdf.path, '_blank');
  };

  if (!showList) {
    return (
      <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText size={16} className="text-blue-600 dark:text-blue-300" />
            <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Demo PDFs Available
            </span>
          </div>
          <button
            onClick={() => setShowList(true)}
            className="text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200 font-medium"
          >
            View Files
          </button>
        </div>
        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
          Test the upload system with existing PDFs in your public folder
        </p>
      </div>
    );
  }

  return (
    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">Available Test PDFs</h3>
        <button
          onClick={() => setShowList(false)}
          className="text-sm text-blue-600 dark:text-blue-300 hover:text-blue-700 dark:hover:text-blue-200"
        >
          Hide
        </button>
      </div>
      
      <div className="space-y-2">
        {existingPdfs.map((pdf, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-dark-secondary rounded border dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                pdf.status === 'valid' ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{pdf.filename}</h4>
                <div className="flex items-center space-x-4 text-xs text-gray-600 dark:text-gray-400">
                  <span>Size: {pdf.size}</span>
                  <span>Pages: {pdf.pages}</span>
                  {pdf.status === 'valid' ? (
                    <span className="text-green-600 dark:text-green-400 flex items-center space-x-1">
                      <CheckCircle size={12} />
                      <span>Valid for upload</span>
                    </span>
                  ) : (
                    <span className="text-red-600 dark:text-red-400 flex items-center space-x-1">
                      <AlertTriangle size={12} />
                      <span>{pdf.reason}</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleView(pdf)}
                className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="View PDF"
              >
                <Eye size={14} />
              </button>
              <button
                onClick={() => handleDownload(pdf)}
                className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                title="Download PDF"
              >
                <Download size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900 border border-yellow-200 dark:border-yellow-700 rounded text-xs text-yellow-800 dark:text-yellow-200">
        <strong>Note:</strong> These are sample PDFs in your public/pdf folder. Use them to test the upload validation system.
        Only files under 10MB and 100 pages will be accepted.
      </div>
    </div>
  );
};

export default ExistingPdfsList;