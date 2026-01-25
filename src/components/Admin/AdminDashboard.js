import React, { useState } from "react";
import {
  Users,
  FileText,
  MessageCircle,
  Shield,
  Trash2,
  Upload,
  Globe,
  Lock,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const AdminDashboard = () => {
  const {
    subjects,
    pdfs,
    questions,
    progress,
    deletePdf,
    isAdmin,
    getAllPdfs,
    showToast,
  } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);

  if (!isAdmin()) {
    return (
      <div className="text-center py-12">
        <Shield size={48} className="text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2">
          You need admin privileges to view this page.
        </p>
      </div>
    );
  }

  const totalUsers = 1; // In real app, this would come from user management
  const totalPdfs = pdfs.length;
  const totalQuestions = questions.length;
  const totalSubjects = subjects.length;

  const handleDeletePdf = (pdfId, filename) => {
    if (window.confirm(`Are you sure you want to delete "${filename}"?`)) {
      deletePdf(pdfId);
      showToast("PDF deleted successfully", "success");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Manage system resources and user content
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Upload size={16} />
          <span>Upload PDF (Public)</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
              <p className="text-sm text-gray-600">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FileText size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPdfs}</p>
              <p className="text-sm text-gray-600">Total PDFs</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalQuestions}
              </p>
              <p className="text-sm text-gray-600">Q&A Sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Shield size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {totalSubjects}
              </p>
              <p className="text-sm text-gray-600">Subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Management */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            PDF Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage all PDFs across the platform
          </p>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {pdfs.map((pdf, index) => {
              const subject = subjects.find(
                (s) => s.subjectId === pdf.subjectId,
              );
              const pdfProgress = progress.filter((p) => p.pdfId === pdf.pdfId);
              const avgProgress =
                pdfProgress.length > 0
                  ? Math.round(
                      pdfProgress.reduce(
                        (sum, p) => sum + (Number(p.completionPercentage) || 0),
                        0,
                      ) / pdfProgress.length,
                    )
                  : 0;

              return (
                <div
                  key={`${pdf.pdfId || pdf.id || "pdf"}-${index}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={pdf.thumbnail}
                      alt={pdf.filename}
                      className="w-12 h-16 object-cover rounded border border-gray-200"
                    />
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">
                          {pdf.filename}
                        </h3>
                        {pdf.isPublic ? (
                          <Globe
                            size={14}
                            className="text-green-500"
                            title="Public Access"
                          />
                        ) : (
                          <Lock
                            size={14}
                            className="text-orange-500"
                            title="Private Access"
                          />
                        )}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center space-x-1">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: subject?.color }}
                          ></div>
                          <span>{subject?.name}</span>
                        </span>
                        <span>{pdf.totalPages} pages</span>
                        <span>
                          {(pdf.fileSize / (1024 * 1024)).toFixed(1)} MB
                        </span>
                        <span>Avg Progress: {avgProgress}%</span>
                        <span
                          className={
                            pdf.isPublic
                              ? "text-green-600 font-medium"
                              : "text-orange-600 font-medium"
                          }
                        >
                          {pdf.isPublic ? "Public" : "Private"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeletePdf(pdf.pdfId, pdf.filename)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete PDF"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Q&A Activity
          </h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {questions.slice(0, 5).map((question, index) => {
              const pdf = pdfs.find((p) => p.pdfId === question.pdfId);
              const subject = subjects.find(
                (s) => s.subjectId === pdf?.subjectId,
              );

              return (
                <div
                  key={`${question.questionId || question.id || "q"}-${index}`}
                  className="p-4 border border-gray-200 rounded-lg"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: subject?.color }}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {pdf?.filename}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(question.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Q:</strong> {question.questionText}
                  </p>
                  <p className="text-sm text-gray-600">
                    Confidence: {Math.round(question.confidenceScore * 100)}% •
                    Page {question.pageContext}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
