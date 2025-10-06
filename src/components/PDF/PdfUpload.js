import React, { useState } from 'react';
import { Upload, X, FileText, AlertCircle, CheckCircle, FileCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../../context/AppContext';
import { 
  validatePdfFile, 
  generateUniqueFilename, 
  saveFileToPublic, 
  formatFileSize,
  generateThumbnailUrl 
} from '../../utils/pdfUtils';
import ExistingPdfsList from './ExistingPdfsList';

const PdfUpload = ({ isOpen, onClose }) => {
  const { subjects, user, uploadPdf } = useApp();
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [errors, setErrors] = useState([]);
  const [success, setSuccess] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [isValidating, setIsValidating] = useState(false);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const MAX_PAGES = 100;
  const ALLOWED_TYPES = ['application/pdf'];

  const handleFileSelect = async (file) => {
    setIsValidating(true);
    setErrors([]);
    setSelectedFile(null);
    setValidationResult(null);

    try {
      const result = await validatePdfFile(file, MAX_FILE_SIZE / (1024 * 1024), MAX_PAGES);
      
      if (result.isValid) {
        setSelectedFile(file);
        setValidationResult(result.metadata);
        setErrors([]);
      } else {
        setErrors(result.errors);
        setSelectedFile(null);
        setValidationResult(null);
      }
    } catch (error) {
      setErrors(['Failed to validate PDF file. Please try again.']);
      setSelectedFile(null);
      setValidationResult(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedSubject || !validationResult) {
      setErrors(['Please select a valid file and subject']);
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setErrors([]);

    try {
      // Generate unique filename
      const uniqueFileName = generateUniqueFilename(selectedFile.name, user.userId);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 80) {
            clearInterval(progressInterval);
            return 80;
          }
          return prev + 20;
        });
      }, 300);

      // Save file to public folder (simulated)
      const saveResult = await saveFileToPublic(selectedFile, uniqueFileName);
      
      if (saveResult.success) {
        setUploadProgress(100);
        
        // Get subject info for thumbnail color
        const subject = subjects.find(s => s.subjectId === selectedSubject);
        
        const newPdf = {
          pdfId: `pdf_${Date.now()}`,
          subjectId: selectedSubject,
          filename: selectedFile.name,
          originalFileName: selectedFile.name,
          savedFileName: uniqueFileName,
          filePath: saveResult.filePath,
          totalPages: validationResult.pageCount,
          fileSize: selectedFile.size,
          uploadedAt: new Date().toISOString(),
          uploadedBy: user.userId,
          isPublic: user.role === 'admin', // Admin uploads are public
          thumbnail: generateThumbnailUrl(uniqueFileName, subject?.color)
        };

        uploadPdf(newPdf);
        setSuccess(true);
        
        // Show success toast
        toast.success(
          <div>
            <p className="font-medium">PDF uploaded successfully!</p>
            <p className="text-sm opacity-90">File: {selectedFile.name}</p>
            <p className="text-sm opacity-90">
              Access: {user?.role === 'admin' ? 'Public (all users)' : 'Private (you + admin)'}
            </p>
          </div>,
          {
            icon: '📄',
            autoClose: 4000
          }
        );
        
        // Close modal after toast
        setTimeout(() => {
          handleClose();
        }, 1000);
      } else {
        throw new Error(saveResult.error || 'Failed to save file');
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error(
        <div>
          <p className="font-medium">Upload failed!</p>
          <p className="text-sm opacity-90">{error.message || 'Please try again.'}</p>
        </div>,
        {
          icon: '❌'
        }
      );
      setErrors([error.message || 'Upload failed. Please try again.']);
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setSelectedSubject('');
    setErrors([]);
    setSuccess(false);
    setUploading(false);
    setUploadProgress(0);
    setValidationResult(null);
    setIsValidating(false);
    onClose();
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Upload PDF</h2>
              <p className="text-sm text-gray-600 mt-1">
                Max size: 10MB, Max pages: 100
                {user?.role === 'admin' ? ' (Public access)' : ' (Private access)'}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Subject Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              disabled={uploading}
            >
              <option value="">Choose a subject...</option>
              {subjects.map(subject => (
                <option key={subject.subjectId} value={subject.subjectId}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PDF File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragOver 
                  ? 'border-primary-500 bg-primary-50' 
                  : selectedFile 
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 hover:border-gray-400'
              }`}
              onDrop={handleDrop}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
            >
              {isValidating ? (
                <div className="space-y-2">
                  <FileCheck size={32} className="text-blue-500 mx-auto animate-pulse" />
                  <div>
                    <p className="font-medium text-gray-900">Validating PDF...</p>
                    <p className="text-sm text-gray-600">Checking file size and page count</p>
                  </div>
                </div>
              ) : selectedFile && validationResult ? (
                <div className="space-y-2">
                  <CheckCircle size={32} className="text-green-500 mx-auto" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedFile.name}</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Size: {formatFileSize(selectedFile.size)}</p>
                      <p>Pages: {validationResult.pageCount}</p>
                      <p className="text-green-600 font-medium">✓ Valid PDF</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setValidationResult(null);
                    }}
                    className="text-sm text-red-600 hover:text-red-700"
                    disabled={uploading}
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload size={32} className="text-gray-400 mx-auto" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">
                      Drop your PDF here or click to browse
                    </p>
                    <p className="text-sm text-gray-500">
                      PDF files only • Max 10MB • Max 100 pages
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-input"
                    disabled={uploading || isValidating}
                  />
                  <label
                    htmlFor="file-input"
                    className={`inline-block px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      uploading || isValidating
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-primary-500 hover:bg-primary-600'
                    } text-white`}
                  >
                    {isValidating ? 'Validating...' : 'Choose File'}
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Access Control Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <AlertCircle size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-800">Access Control</p>
                <p className="text-blue-700">
                  {user?.role === 'admin' 
                    ? 'As an admin, your uploaded PDFs will be accessible to all users.'
                    : 'Your uploaded PDFs will only be accessible to you and administrators.'
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Demo PDFs List */}
          <ExistingPdfsList />

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Uploading...</span>
                <span className="text-gray-900 font-medium">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle size={16} className="text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-800">
                    PDF uploaded successfully!
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    File saved as: {validationResult?.fileName}
                    <br />
                    Access: {user?.role === 'admin' ? 'Public (all users)' : 'Private (you + admin)'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="text-red-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-800">Upload Error</p>
                  <ul className="text-sm text-red-700 mt-1 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center justify-end space-x-3">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || !selectedSubject || !validationResult || uploading || success || isValidating}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? 'Uploading...' : isValidating ? 'Validating...' : 'Upload PDF'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfUpload;