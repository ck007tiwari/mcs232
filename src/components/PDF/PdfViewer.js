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
  Send,
  FileText,
  File,
  Files,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import Tooltip from "../../utils/tooltip";

// Configure PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const PdfViewer = () => {
  const { pdfId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { subjects, updateProgress, askQuestion, showToast } = useApp();

  const [currentPage, setCurrentPage] = useState(location.state?.page || 1);
  const [fetchedProgress, setFetchedProgress] = useState(null);
  const [zoom, setZoom] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [showQA, setShowQA] = useState(false);
  const [numPages, setNumPages] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [contextMode, setContextMode] = useState("page"); // 'page' or 'document'
  const [rangeStart, setRangeStart] = useState("");
  const [rangeEnd, setRangeEnd] = useState("");
  const [isTyping, setIsTyping] = useState(false);
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
  const pdfSize = pdfFromState?.fileSize || pdfFromState?.size || 0;
  const isSmallEnough = pdfSize ? pdfSize < 5 * 1024 * 1024 : true;

  const subject = subjects.find(
    (s) =>
      String(s.id) === String(subjectId) ||
      String(s.subjectId) === String(subjectId),
  );

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, showQA]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [questionInput]);

  useEffect(() => {
    if (subject && pdfId) {
      const subjectProgress = subject.files || [];
      const currentFile = subjectProgress.find(
        (f) => String(f.id) === String(pdfId),
      );

      if (currentFile) {
        const progressData = {
          user_max_visited_page: currentFile.user_max_visited_page || 0,
          page_read: currentFile.page_read || 0,
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
          user_max_visited_page: 0,
          page_read: 0,
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
        (currentProgress.user_max_visited_page
          ? Array.from(
              { length: currentProgress.user_max_visited_page },
              (_, i) => i + 1,
            )
          : []);

      const updatedVisited = currentVisited.includes(currentPage)
        ? currentVisited
        : [...currentVisited, currentPage];

      const newProgress = {
        user_max_visited_page: Math.max(
          currentProgress.user_max_visited_page || 0,
          currentPage,
        ),
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

  const handleSendMessage = async () => {
    if (!questionInput.trim()) return;

    let context;
    if (contextMode === "range") {
      const start = parseInt(rangeStart);
      const end = parseInt(rangeEnd);
      const maxPage = numPages || pdfTotalPages;

      if (!rangeStart || !rangeEnd) {
        return showToast("Please enter both start and end pages", "error");
      }
      if (isNaN(start) || isNaN(end) || start < 1 || end > maxPage) {
        return showToast(
          `Page range must be between 1 and ${maxPage}`,
          "error",
        );
      }
      if (start > end) {
        return showToast("Start page cannot be greater than end page", "error");
      }
      context = `${start}-${end}`;
    } else {
      context = contextMode === "page" ? currentPage : "document";
    }

    const currentQuestion = questionInput;
    setQuestionInput("");
    setIsTyping(true);

    // Add user message
    const userMsg = {
      id: Date.now(),
      text: currentQuestion,
      sender: "user",
      timestamp: new Date(),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    try {
      const response = await askQuestion(pdfId, currentQuestion, context);

      const aiMsg = {
        id: Date.now() + 1,
        text: response.answerText,
        sender: "ai",
        timestamp: new Date(),
        confidence: response.confidenceScore,
      };
      setChatMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      // Error handling is done in askQuestion but we can add a message here if needed
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex h-full bg-gray-100 overflow-hidden">
      {/* Sidebar Toolbar (Left) */}
      <aside className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 shadow-sm z-20 shrink-0 gap-6">
        {/* Back Button */}
        <Tooltip text="Back to Dashboard">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
        </Tooltip>

        <div className="w-8 border-b border-gray-200"></div>

        {/* Navigation */}
        <div className="flex flex-col items-center gap-1">
          <Tooltip text="Previous Page">
            <button
              onClick={handlePrevPage}
              disabled={currentPage <= 1}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30"
            >
              <ChevronLeft size={20} />
            </button>
          </Tooltip>
          <span className="text-xs font-semibold text-gray-700 py-1">
            {currentPage}
          </span>
          <Tooltip text="Next Page">
            <button
              onClick={handleNextPage}
              disabled={numPages && currentPage >= numPages}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all disabled:opacity-30"
            >
              <ChevronRight size={20} />
            </button>
          </Tooltip>
        </div>

        <div className="w-8 border-b border-gray-200"></div>

        {/* Zoom */}
        <div className="flex flex-col items-center gap-1">
          <Tooltip text="Zoom In">
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 3.0))}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all"
            >
              <ZoomIn size={20} />
            </button>
          </Tooltip>
          <span className="text-xs font-semibold text-gray-700 py-1">
            {Math.round(zoom * 100)}%
          </span>
          <Tooltip text="Zoom Out">
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.5))}
              className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-all"
            >
              <ZoomOut size={20} />
            </button>
          </Tooltip>
        </div>

        <div className="w-8 border-b border-gray-200"></div>

        {/* Tools */}
        <div className="flex flex-col items-center gap-4">
          <Tooltip text="Rotate Page">
            <button
              onClick={() => setRotation((r) => (r + 90) % 360)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-all"
            >
              <RotateCw size={20} />
            </button>
          </Tooltip>

          <Tooltip text="AI Assistant">
            <button
              onClick={() => setShowQA(!showQA)}
              className={`p-2 rounded-lg transition-all ${
                showQA
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <MessageCircle size={20} />
            </button>
          </Tooltip>
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
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-xl z-10 absolute right-0 top-0 bottom-0 sm:relative">
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

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {chatMessages.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3">
                    <MessageCircle size={24} className="text-primary-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    No messages yet
                  </p>
                  <p className="text-xs mt-1">
                    Ask a question to start the conversation.
                  </p>
                </div>
              ) : (
                chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-3 text-sm ${
                        msg.sender === "user"
                          ? "bg-primary-600 text-white rounded-br-none"
                          : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm"
                      }`}
                    >
                      <p>{msg.text}</p>
                      {msg.confidence && (
                        <p className="text-[10px] mt-1 opacity-70 text-right">
                          Confidence: {Math.round(msg.confidence * 100)}%
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-200 rounded-lg rounded-bl-none p-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-white border-t border-gray-200">
              {/* Context Selector */}
              <div className="flex flex-col gap-2 mb-3">
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-gray-500 font-medium">Context:</span>
                  <button
                    onClick={() => setContextMode("page")}
                    className={`flex items-center px-2 py-1 rounded border ${
                      contextMode === "page"
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <File size={12} className="mr-1" />
                    Page {currentPage}
                  </button>

                  <button
                    onClick={() => setContextMode("document")}
                    disabled={!isSmallEnough}
                    className={`flex items-center px-2 py-1 rounded border ${
                      contextMode === "document"
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    } ${!isSmallEnough ? "opacity-50 cursor-not-allowed" : ""}`}
                    title={
                      !isSmallEnough
                        ? "File too large (>5MB) for full context"
                        : "Use whole document"
                    }
                  >
                    <FileText size={12} className="mr-1" />
                    Whole PDF
                  </button>

                  <button
                    onClick={() => setContextMode("range")}
                    className={`flex items-center px-2 py-1 rounded border ${
                      contextMode === "range"
                        ? "bg-primary-50 border-primary-200 text-primary-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <Files size={12} className="mr-1" />
                    Range
                  </button>
                </div>

                {contextMode === "range" && (
                  <div className="flex items-center space-x-2 text-xs bg-gray-50 p-2 rounded border border-gray-200">
                    <span className="text-gray-600">Pages:</span>
                    <input
                      type="number"
                      min="1"
                      max={numPages || pdfTotalPages}
                      value={rangeStart}
                      onChange={(e) => setRangeStart(e.target.value)}
                      className="w-12 p-1 border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 outline-none"
                      placeholder="Start"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="number"
                      min="1"
                      max={numPages || pdfTotalPages}
                      value={rangeEnd}
                      onChange={(e) => setRangeEnd(e.target.value)}
                      className="w-12 p-1 border border-gray-300 rounded text-center focus:ring-1 focus:ring-primary-500 outline-none"
                      placeholder="End"
                    />
                  </div>
                )}
              </div>

              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={questionInput}
                  onChange={(e) => setQuestionInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your question..."
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none text-sm custom-scrollbar"
                  rows={2}
                  style={{ minHeight: "58px", maxHeight: "98px" }}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!questionInput.trim() || isTyping}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfViewer;
