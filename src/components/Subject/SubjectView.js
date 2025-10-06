import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText, Play, Trash2, AlertTriangle, Upload, Lock, Globe } from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../../context/AppContext';
import PdfUpload from '../PDF/PdfUpload';

const SubjectView = () => {
  const { subjectId } = useParams();
  const { subjects, getPdfsBySubject, getProgressByPdf, deletePdf, isAdmin, user } = useApp();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  
  const subject = subjects.find(s => s.subjectId === subjectId);
  const pdfs = getPdfsBySubject(subjectId);

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Subject not found</h2>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const handleDeletePdf = (pdfId) => {
    const result = deletePdf(pdfId);
    if (result.success) {
      toast.success('PDF deleted successfully', {
        icon: '🗑️'
      });
      setShowDeleteConfirm(null);
    } else {
      toast.error(result.message, {
        icon: '❌'
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div className="flex items-center space-x-3">
            <div
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: subject.color }}
            ></div>
            <h1 className="text-2xl font-bold text-gray-900">{subject.name}</h1>
          </div>
        </div>
        
        <button 
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Upload size={16} />
          <span>Upload PDF</span>
        </button>
      </div>

      {/* Subject Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{subject.totalPdfs}</p>
            <p className="text-sm text-gray-600">Total PDFs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{subject.completedPdfs}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock size={24} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{subject.totalPages}</p>
            <p className="text-sm text-gray-600">Total Pages</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Play size={24} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round((subject.readPages / subject.totalPages) * 100)}%
            </p>
            <p className="text-sm text-gray-600">Progress</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">Overall Progress</h2>
          <span className="text-sm text-gray-600">
            {subject.readPages} of {subject.totalPages} pages
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{ 
              width: `${(subject.readPages / subject.totalPages) * 100}%`,
              backgroundColor: subject.color
            }}
          ></div>
        </div>
      </div>

      {/* PDFs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">PDFs in this subject</h2>
        </div>
        <div className="p-6">
          {pdfs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No PDFs yet</h3>
              <p className="text-gray-600 mb-4">Upload your first PDF to get started with this subject.</p>
              <button 
                onClick={() => setShowUploadModal(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
              >
                Upload PDF
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => {
                const progress = getProgressByPdf(pdf.pdfId);
                const progressPercentage = progress ? progress.completionPercentage : 0;
                
                return (
                  <div
                    key={pdf.pdfId}
                    className="group border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all relative"
                  >
                    {isAdmin() && (
                      <button
                        onClick={() => setShowDeleteConfirm(pdf.pdfId)}
                        className="absolute top-2 right-2 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                        title="Delete PDF (Admin)"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                    
                    <Link
                      to={`/pdf/${pdf.pdfId}`}
                      className="block"
                    >
                      <div className="flex items-start space-x-3">
                        <img
                          src={pdf.thumbnail}
                          alt={pdf.filename}
                          className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-medium text-gray-900 group-hover:text-primary-600 truncate">
                              {pdf.filename}
                            </h3>
                            {pdf.isPublic ? (
                              <Globe size={14} className="text-green-500" title="Public - Accessible to all users" />
                            ) : (
                              <Lock size={14} className="text-orange-500" title="Private - Only you and admins can access" />
                            )}
                          </div>
                          <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                            <span>{pdf.totalPages} pages</span>
                            <span>{formatFileSize(pdf.fileSize)}</span>
                            {!pdf.isPublic && (
                              <span className="text-orange-600 font-medium">Private</span>
                            )}
                          </div>
                          {progress && (
                            <p className="text-sm text-gray-600">
                              {formatDuration(progress.totalTimeSpent)} studied
                            </p>
                          )}
                          
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-900 font-medium">{progressPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{ 
                                  width: `${progressPercentage}%`,
                                  backgroundColor: subject.color
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle size={20} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete PDF</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete this PDF? All associated progress and questions will also be removed.
            </p>
            
            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePdf(showDeleteConfirm)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete PDF
              </button>
            </div>
          </div>
        </div>
      )}

      <PdfUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </div>
  );
};

export default SubjectView;