import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  MessageCircle,
  BookOpen,
  Clock,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Send,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const PdfViewer = () => {
  const { pdfId } = useParams();
  const location = useLocation();
  const { pdfs, subjects, getProgressByPdf, updateProgress } = useApp();

  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [zoom, setZoom] = useState(100);
  const [showQA, setShowQA] = useState(false);

  const pdf = pdfs.find((p) => p.pdfId === pdfId);
  const subject = subjects.find((s) => s.subjectId === pdf?.subjectId);
  const progress = getProgressByPdf(pdfId);

  useEffect(() => {
    if (pdf && progress) {
      // Simulate reading progress update
      const newProgress = {
        pagesRead: Math.max(progress.pagesRead, currentPage),
        lastPageRead: currentPage,
        completionPercentage: Math.round(
          (Math.max(progress.pagesRead, currentPage) / pdf.totalPages) * 100
        ),
        lastAccessed: new Date().toISOString(),
        totalTimeSpent: progress.totalTimeSpent + 60, // Add 1 minute
      };
      updateProgress(pdfId, newProgress);
    }
  }, [currentPage, pdfId]);

  if (!pdf) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">PDF not found</h2>
        <Link
          to="/dashboard"
          className="text-primary-600 hover:text-primary-700 mt-4 inline-block"
        >
          ← Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleNextPage = () => {
    if (currentPage < pdf.totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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
    <>
      <div className="flex h-screen bg-gray-50">
        {/* PDF Viewer */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link
                  to={subject ? `/subject/${subject.subjectId}` : "/dashboard"}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900 truncate">
                    {pdf.filename}
                  </h1>
                  <p className="text-sm text-gray-600">
                    {subject?.name} • Page {currentPage} of {pdf.totalPages}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowQA(true)}
                  className={`p-2 rounded-lg transition-colors text-gray-600 hover:bg-gray-100`}
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* PDF Controls */}
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <span className="text-sm text-gray-600">
                    {currentPage} / {pdf.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === pdf.totalPages}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setZoom(Math.max(50, zoom - 25))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ZoomOut size={16} />
                  </button>
                  <span className="text-sm text-gray-600 w-12 text-center">
                    {zoom}%
                  </span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 25))}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <ZoomIn size={16} />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <BookOpen size={16} />
                  <span>{progress?.completionPercentage || 0}% Complete</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock size={16} />
                  <span>{formatDuration(progress?.totalTimeSpent || 0)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* PDF Content */}
          <div className="flex-1 overflow-auto bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
              <div
                className="bg-white shadow-lg border border-gray-200 mx-auto"
                style={{
                  width: `${zoom}%`,
                  minHeight: "800px",
                }}
              >
                <div className="flex items-center justify-center h-full text-gray-500">
                  <div className="text-center">
                    <BookOpen size={48} className="mx-auto mb-4" />
                    <p className="text-lg font-medium">
                      PDF Page {currentPage}
                    </p>
                    <p className="text-sm">
                      In a real application, this would display the actual PDF
                      content using PDF.js
                    </p>
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
                      <h4 className="font-medium mb-2">
                        Sample Content Preview:
                      </h4>
                      <p className="text-sm">
                        This page would contain the actual PDF content. The
                        viewer supports:
                        <br />• Zooming and navigation
                        <br />• Progress tracking
                        <br />• Q&A integration
                        <br />• Responsive design
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PdfViewer;
