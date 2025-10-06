import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
  Send
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useApp } from '../../context/AppContext';

const PdfViewer = () => {
  const { pdfId } = useParams();
  const { pdfs, subjects, getProgressByPdf, getQuestionsByPdf, askQuestion, updateProgress } = useApp();
  
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [showQA, setShowQA] = useState(false);
  const [question, setQuestion] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  
  const pdf = pdfs.find(p => p.pdfId === pdfId);
  const subject = subjects.find(s => s.subjectId === pdf?.subjectId);
  const progress = getProgressByPdf(pdfId);
  const questions = getQuestionsByPdf(pdfId);

  useEffect(() => {
    if (pdf && progress) {
      // Simulate reading progress update
      const newProgress = {
        pagesRead: Math.max(progress.pagesRead, currentPage),
        lastPageRead: currentPage,
        completionPercentage: Math.round((Math.max(progress.pagesRead, currentPage) / pdf.totalPages) * 100),
        lastAccessed: new Date().toISOString(),
        totalTimeSpent: progress.totalTimeSpent + 60 // Add 1 minute
      };
      updateProgress(pdfId, newProgress);
    }
  }, [currentPage, pdfId]);

  if (!pdf) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">PDF not found</h2>
        <Link to="/dashboard" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
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

  const handleAskQuestion = async () => {
    if (!question.trim()) {
      toast.warning('Please enter a question before submitting', {
        icon: '💭'
      });
      return;
    }
    
    setIsAsking(true);
    try {
      await askQuestion(pdfId, question, currentPage);
      setQuestion('');
      toast.success('Question submitted! AI is generating an answer...', {
        icon: '🤖'
      });
    } catch (error) {
      console.error('Error asking question:', error);
      toast.error('Failed to submit question. Please try again.', {
        icon: '❌'
      });
    } finally {
      setIsAsking(false);
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
    <div className="flex h-screen bg-gray-50">
      {/* PDF Viewer */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                to={subject ? `/subject/${subject.subjectId}` : '/dashboard'}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} className="text-gray-600" />
              </Link>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 truncate">{pdf.filename}</h1>
                <p className="text-sm text-gray-600">
                  {subject?.name} • Page {currentPage} of {pdf.totalPages}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowQA(!showQA)}
                className={`p-2 rounded-lg transition-colors ${
                  showQA ? 'bg-primary-100 text-primary-700' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <MessageCircle size={20} />
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <Download size={20} />
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
                <span className="text-sm text-gray-600 w-12 text-center">{zoom}%</span>
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
                minHeight: '800px'
              }}
            >
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <BookOpen size={48} className="mx-auto mb-4" />
                  <p className="text-lg font-medium">PDF Page {currentPage}</p>
                  <p className="text-sm">
                    In a real application, this would display the actual PDF content using PDF.js
                  </p>
                  <div className="mt-8 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto">
                    <h4 className="font-medium mb-2">Sample Content Preview:</h4>
                    <p className="text-sm">
                      This page would contain the actual PDF content. The viewer supports:
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

      {/* Q&A Sidebar */}
      {showQA && (
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Ask Questions</h2>
            <p className="text-sm text-gray-600">Get AI-powered answers about this content</p>
          </div>

          {/* Question Input */}
          <div className="p-4 border-b border-gray-200">
            <div className="space-y-3">
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask a question about this page or content..."
                className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                rows="3"
              />
              <button
                onClick={handleAskQuestion}
                disabled={!question.trim() || isAsking}
                className="w-full flex items-center justify-center space-x-2 bg-primary-500 text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                <span>{isAsking ? 'Asking...' : 'Ask Question'}</span>
              </button>
            </div>
          </div>

          {/* Questions History */}
          <div className="flex-1 overflow-auto p-4 custom-scrollbar">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Previous Questions</h3>
            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <MessageCircle size={32} className="mx-auto mb-2" />
                <p className="text-sm">No questions yet</p>
                <p className="text-xs">Ask your first question about this PDF</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((q) => (
                  <div key={q.questionId} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-gray-900">
                        Page {q.pageContext}
                      </p>
                      <span className="text-xs text-gray-500">
                        {new Date(q.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-blue-50 p-2 rounded text-sm">
                        <strong className="text-blue-800">Q:</strong> {q.questionText}
                      </div>
                      <div className="bg-green-50 p-2 rounded text-sm">
                        <strong className="text-green-800">A:</strong> {q.answerText}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Confidence: {Math.round(q.confidenceScore * 100)}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfViewer;