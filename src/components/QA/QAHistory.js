import React, { useState } from 'react';
import { Search, MessageCircle, BookOpen, Filter, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const QAHistory = () => {
  const { questions, pdfs, subjects } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  // Filter and sort questions
  const filteredQuestions = questions
    .filter(q => {
      const pdf = pdfs.find(p => p.pdfId === q.pdfId);
      const subject = subjects.find(s => s.subjectId === pdf?.subjectId);
      
      const matchesSearch = q.questionText.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           q.answerText.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || subject?.subjectId === selectedSubject;
      
      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.timestamp) - new Date(a.timestamp);
        case 'oldest':
          return new Date(a.timestamp) - new Date(b.timestamp);
        case 'confidence':
          return b.confidenceScore - a.confidenceScore;
        default:
          return 0;
      }
    });

  const getPdfInfo = (pdfId) => {
    const pdf = pdfs.find(p => p.pdfId === pdfId);
    const subject = subjects.find(s => s.subjectId === pdf?.subjectId);
    return { pdf, subject };
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Q&A History</h1>
        <p className="text-gray-600 mt-1">
          Review all your questions and AI-powered answers
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <MessageCircle size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{questions.length}</p>
              <p className="text-sm text-gray-600">Total Questions</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <BookOpen size={20} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {[...new Set(questions.map(q => q.pdfId))].length}
              </p>
              <p className="text-sm text-gray-600">PDFs Discussed</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Filter size={20} className="text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(questions.reduce((sum, q) => sum + q.confidenceScore, 0) / questions.length * 100) || 0}%
              </p>
              <p className="text-sm text-gray-600">Avg Confidence</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search questions and answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.name}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">Highest Confidence</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Questions & Answers ({filteredQuestions.length})
          </h2>
        </div>
        <div className="p-6">
          {filteredQuestions.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">
                {searchTerm || selectedSubject !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'Start asking questions about your PDFs to see them here'
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredQuestions.map((question) => {
                const { pdf, subject } = getPdfInfo(question.pdfId);
                
                return (
                  <div key={question.questionId} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject?.color || '#gray' }}
                        ></div>
                        <div>
                          <h3 className="font-medium text-gray-900">{pdf?.filename}</h3>
                          <p className="text-sm text-gray-600">
                            {subject?.name} • Page {question.pageContext}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">{formatDate(question.timestamp)}</p>
                        <p className="text-xs text-gray-500">
                          Confidence: {Math.round(question.confidenceScore * 100)}%
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <MessageCircle size={16} className="text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800 mb-1">Question:</p>
                            <p className="text-sm text-blue-700">{question.questionText}</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-start space-x-2">
                          <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center mt-0.5">
                            <span className="text-white text-xs font-bold">AI</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-green-800 mb-1">Answer:</p>
                            <p className="text-sm text-green-700">{question.answerText}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                      <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                        Ask Follow-up
                      </button>
                      <button className="text-sm text-gray-600 hover:text-gray-700">
                        Copy Answer
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QAHistory;