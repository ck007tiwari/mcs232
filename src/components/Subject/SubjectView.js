import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, FileText, Play, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import ConfirmationDialog from '../Layout/ConfirmationDialog';

const SubjectView = () => {
  const { subjectId } = useParams();
  const { subjects, getPdfsBySubject, getProgressByPdf, deletePdf } = useApp();
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);

  const subject = subjects.find(s => s.subjectId === subjectId);
  const pdfs = getPdfsBySubject(subjectId);

  const handleDelete = (pdfId) => {
    setPdfToDelete(pdfId);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (pdfToDelete) {
      deletePdf(pdfToDelete);
      setPdfToDelete(null);
    }
    setShowConfirmation(false);
  };

  if (!subject) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Subject not found</h2>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors mt-4"
        >
          Go Back to Dashboard
        </button>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 rounded-full"
            style={{ backgroundColor: subject.color }}
          ></div>
          <h1 className="text-3xl font-bold text-gray-900">{subject.name}</h1>
        </div>
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
              <button className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors">
                Upload PDF
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf) => {
                const progress = getProgressByPdf(pdf.pdfId);
                const progressPercentage = progress ? progress.completionPercentage : 0;
                
                return (
                  <div key={pdf.pdfId} className="group border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all">
                    <div className="flex items-start space-x-3">
                      <Link to={`/pdf/${pdf.pdfId}`} className="flex-1 min-w-0">
                        <img
                          src={pdf.thumbnail}
                          alt={pdf.filename}
                          className="w-16 h-20 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 group-hover:text-primary-600 truncate">
                            {pdf.filename}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">{pdf.totalPages} pages</p>
                          <p className="text-sm text-gray-600">{formatFileSize(pdf.fileSize)}</p>
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
                      </Link>
                      <button
                        onClick={() => handleDelete(pdf.pdfId)}
                        className="p-2 text-gray-500 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {showConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this PDF?"
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmation(false)}
        />
      )}
    </div>
  );
};

export default SubjectView;