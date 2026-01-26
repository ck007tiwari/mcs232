import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useLocation, useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";
import {
  ArrowLeft,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCw,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = () => {
  const { pdfId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { subjects, updateProgress } = useApp();

  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [fetchedProgress, setFetchedProgress] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [showQA, setShowQA] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const saveTimeoutRef = useRef(null);
  const lastSaveTimeRef = useRef(Date.now());
  const progressRef = useRef({});

  const pdfFromState = location.state?.pdf;

  // Normalize PDF data (handle API vs Dummy data structure)
  const pdfTitle = pdfFromState?.title || pdfFromState?.filename;
  const pdfFile = pdfFromState?.file || pdfFromState?.url;
  const pdfTotalPages =
    pdfFromState?.page_count || pdfFromState?.totalPages || numPages || 0;
  const subjectId = pdfFromState?.subject || pdfFromState?.subjectId;

  const subject = subjects.find(
    (s) =>
      String(s.id) === String(subjectId) ||
      String(s.subjectId) === String(subjectId),
  );

  useEffect(() => {
    if (subject && pdfId) {
      const subjectProgress = subject.files || [];
      const currentFile = subjectProgress.find(
        (f) => String(f.id) === String(pdfId),
      );

      if (currentFile) {
        const progressData = {
          pagesRead: currentFile.pages_read || 0,
          lastPageRead: currentFile.last_page_read || 1,
          visitedPages: currentFile.visited_pages || [],
          completionPercentage: currentFile.read_percentage || 0,
          lastAccessed: currentFile.last_accessed,
          totalTimeSpent: currentFile.total_time_spent || 0,
        };
        setFetchedProgress(progressData);
        progressRef.current = progressData;

        if (currentFile.last_page_read) {
          setCurrentPage(currentFile.last_page_read);
        }
      } else {
        const defaultProgress = {
          pagesRead: 0,
          lastPageRead: 1,
          visitedPages: [],
          completionPercentage: 0,
          lastAccessed: new Date().toISOString(),
          totalTimeSpent: 0,
        };
        setFetchedProgress(defaultProgress);
        progressRef.current = defaultProgress;
      }
    }
  }, [pdfId, subject]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  useEffect(() => {
    if (!pdfFromState || !fetchedProgress) return;

    // Clear previous timeout to debounce the API call
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    const saveProgress = () => {
      const currentProgress = progressRef.current;
      if (!currentProgress) return;

      const now = Date.now();
      const timeElapsed = Math.floor((now - lastSaveTimeRef.current) / 1000);
      lastSaveTimeRef.current = now;

      const currentVisited =
        currentProgress.visitedPages ||
        (currentProgress.pagesRead
          ? Array.from({ length: currentProgress.pagesRead }, (_, i) => i + 1)
          : []);

      const updatedVisited = currentVisited.includes(currentPage)
        ? currentVisited
        : [...currentVisited, currentPage];

      const newProgress = {
        pagesRead: Math.max(currentProgress.pagesRead || 0, currentPage),
        lastPageRead: currentPage,
        visitedPages: updatedVisited,
        completionPercentage:
          pdfTotalPages > 0
            ? Math.round((updatedVisited.length / pdfTotalPages) * 100)
            : 0,
        lastAccessed: new Date().toISOString(),
        totalTimeSpent:
          (Number(currentProgress.totalTimeSpent) || 0) + timeElapsed,
      };

      progressRef.current = newProgress;
      setFetchedProgress(newProgress);
      updateProgress(pdfId, newProgress);
    };

    saveTimeoutRef.current = setTimeout(saveProgress, 2000); // 2 seconds

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [currentPage, pdfId, pdfTotalPages, updateProgress, !!fetchedProgress]);

  if (!pdfFromState) {
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
    if (currentPage < (numPages || pdfTotalPages)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      {/* Sidebar Toolbar (Left) */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 shrink-0">
        {/* Header Section: Back & Title */}
        <div className="p-4 border-b border-gray-200">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
          >
            <div className="p-1 rounded-full group-hover:bg-gray-100 mr-2 transition-colors">
              <ArrowLeft size={20} />
            </div>
            <span className="text-sm font-medium">Back</span>
          </button>
          <div>
            <h1
              className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight"
              title={pdfTitle}
            >
              {pdfTitle}
            </h1>
            <p className="text-xs text-gray-500 mt-1 truncate">
              {subject?.name}
            </p>
          </div>
        </div>

        {/* Controls Section */}
        <div className="p-4 flex-1 overflow-y-auto space-y-6 custom-scrollbar">
          {/* Page Navigation */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Navigation
            </p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {currentPage} / {numPages || "--"}
              </span>
              <button
                onClick={handleNextPage}
                disabled={numPages && currentPage >= numPages}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Zoom Controls */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Zoom
            </p>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1 border border-gray-200">
              <button
                onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={18} />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={() => setZoom((z) => Math.min(z + 0.1, 3.0))}
                className="p-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-md transition-all"
                title="Zoom In"
              >
                <ZoomIn size={18} />
              </button>
            </div>
          </div>

          {/* Tools */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tools
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-all text-gray-600"
                title="Rotate"
              >
                <RotateCw size={20} className="mb-1" />
                <span className="text-xs font-medium">Rotate</span>
              </button>
              <button
                onClick={() => setShowQA(!showQA)}
                className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${
                  showQA
                    ? "bg-primary-50 border-primary-200 text-primary-600"
                    : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                }`}
                title="AI Assistant"
              >
                <MessageCircle size={20} className="mb-1" />
                <span className="text-xs font-medium">AI Chat</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* PDF Canvas Container */}
        <div className="flex-1 overflow-auto flex justify-center p-2 mb-1">
          <div className="relative shadow-lg w-fit">
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div className="flex flex-col items-center justify-center h-96 text-gray-500">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500 mb-4"></div>
                  <p>Loading PDF...</p>
                </div>
              }
              error={
                <div className="p-8 bg-white rounded-lg shadow text-center">
                  <div className="text-red-500 mb-2">Failed to load PDF</div>
                  <p className="text-sm text-gray-500">
                    The file might be corrupted or missing.
                  </p>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                scale={zoom}
                rotate={rotation}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="bg-white"
                loading={
                  <div className="h-[800px] w-[600px] bg-white animate-pulse" />
                }
              />
            </Document>
          </div>
        </div>

        {/* QA Sidebar */}
        {showQA && (
          <div className="w-80 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10 absolute right-0 top-0 bottom-0 sm:relative">
            <div className="p-4 border-b border-gray-200 font-semibold text-gray-700 flex justify-between items-center bg-gray-50">
              <div className="flex items-center space-x-2">
                <MessageCircle size={18} className="text-primary-500" />
                <span>AI Assistant</span>
              </div>
              <button
                onClick={() => setShowQA(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ChevronRight size={18} />
              </button>
            </div>
            <div className="flex-1 p-6 flex flex-col items-center justify-center text-center text-gray-500">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <MessageCircle size={32} className="text-gray-400" />
              </div>
              <h3 className="text-gray-900 font-medium mb-2">
                Ask questions about this PDF
              </h3>
              <p className="text-sm">
                The AI assistant can help you summarize content, explain
                concepts, and answer questions based on the document.
              </p>
              <button className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm">
                Start Conversation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
