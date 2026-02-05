import React, { useState } from "react";
import {
  Search,
  MessageCircle,
  BookOpen,
  Filter,
  Calendar,
  Clock,
  ArrowRight,
  ChevronDown,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const UserQAHistory = ({ data }) => {
  const { subjects } = useApp();
  
  // Flatten all PDFs from subjects for easy lookup
  const allPdfs = React.useMemo(() => {
    return (subjects || []).flatMap(subject => 
      (subject.files || []).map(file => ({...file, subjectId: subject.id || subject.subjectId}))
    );
  }, [subjects]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [openQuestionId, setOpenQuestionId] = useState(null);

  // Filter and sort questions
  const questions = data?.questions || [];
  const filteredQuestions = questions
    .filter((q) => {
      const pdf = allPdfs.find((p) => String(p.id) === String(q.pdfId)); // Match backend ID
      const subject = subjects?.find((s) => (s.id || s.subjectId) === pdf?.subjectId);

      const matchesSearch =
        q.question_text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.answer_text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSubject =
        selectedSubject === "all" || subject?.subjectId === selectedSubject;

      return matchesSearch && matchesSubject;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.timestamp) - new Date(a.timestamp);
        case "oldest":
          return new Date(a.timestamp) - new Date(b.timestamp);
        case "confidence":
          return b.confidence_score - a.confidence_score;
        default:
          return 0;
      }
    });

  const getPdfInfo = (pdfId) => {
    const pdf = allPdfs.find((p) => String(p.id) === String(pdfId));
    const subject = subjects?.find((s) => (s.id || s.subjectId) === pdf?.subjectId);
    return { pdf, subject };
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const toggleQuestion = (id) => {
    setOpenQuestionId(openQuestionId === id ? null : id);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Stats Section - Compact & Modern */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Questions", value: data?.total_questions || 0, icon: MessageCircle, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
          { label: "PDFs Discussed", value: data?.pdfs_discussed || 0, icon: BookOpen, color: "text-green-500", bg: "bg-green-50 dark:bg-green-900/20" },
          { label: "Avg Confidence", value: `${Math.round((data?.avg_confidence || 0) * 100)}%`, icon: Filter, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
          { label: "Active Since", value: "Feb 2026", icon: Calendar, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" }, // Placeholder stat
        ].map((stat, idx) => (
          <div key={idx} className="bg-white dark:bg-dark-secondary rounded-2xl p-4 border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Control Panel: Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 bg-white dark:bg-dark-secondary p-2 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search your Q&A history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-dark-primary border-transparent focus:bg-white dark:focus:bg-dark-secondary focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-900 rounded-xl text-sm transition-all outline-none dark:text-gray-200"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-dark-primary border-none rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors outline-none min-w-[140px]"
          >
            <option value="all">All Subjects</option>
            {subjects.map((subject) => (
              <option key={subject.subjectId} value={subject.subjectId}>
                {subject.name}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 bg-gray-50 dark:bg-dark-primary border-none rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors outline-none min-w-[140px]"
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="confidence">High Confidence</option>
          </select>
        </div>
      </div>

      {/* Timeline / Stream View */}
      <div className="space-y-6">
        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-dark-secondary rounded-3xl border-2 border-dashed border-gray-100 dark:border-gray-700">
            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <MessageCircle size={32} className="text-gray-300 dark:text-gray-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No conversations found</h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-sm">
              Try adjusting your filters or start exploring your PDF documents to ask new questions.
            </p>
          </div>
        ) : (
          filteredQuestions.map((question, index) => {
             const { pdf, subject } = getPdfInfo(question.pdf_id);
             const isOpen = openQuestionId === question.question_id;

             return (
               <div 
                 key={question.question_id} 
                 className={`group relative bg-white dark:bg-dark-secondary rounded-2xl border transition-all duration-300 ${
                   isOpen 
                   ? "border-primary-200 dark:border-primary-800 shadow-md ring-1 ring-primary-50 dark:ring-primary-900" 
                   : "border-gray-100 dark:border-gray-700 hover:border-primary-100 dark:hover:border-primary-800 hover:shadow-sm"
                 }`}
               >
                 {/* Header Row */}
                 <div 
                   className="p-5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                   onClick={() => toggleQuestion(question.question_id)}
                 >
                   <div className="flex items-start space-x-4">
                     <div className="mt-1 flex-shrink-0">
                       <div 
                         className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                         style={{ backgroundColor: subject?.color || "#6B7280" }}
                       >
                         <BookOpen size={18} />
                       </div>
                     </div>
                     <div>
                       <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                         {question.question_text}
                       </h3>
                       <div className="flex flex-wrap items-center gap-2 mt-1.5">
                         <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                           {pdf?.filename || "Unknown PDF"}
                         </span>
                         <span className="text-xs text-gray-400 dark:text-gray-500 flex items-center">
                           <Clock size={12} className="mr-1" />
                           {formatDate(question.timestamp)}
                         </span>
                       </div>
                     </div>
                   </div>
                   
                   <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pl-14 sm:pl-0">
                      <div className="text-right hidden sm:block">
                        <span className={`text-xs font-semibold ${
                          question.confidence_score > 0.8 ? "text-green-500" : "text-amber-500"
                        }`}>
                          {Math.round(question.confidence_score * 100)}% Match
                        </span>
                      </div>
                      <div className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? "rotate-180 bg-gray-100 dark:bg-gray-700" : ""}`}>
                        <ChevronDown size={20} className="text-gray-400" />
                      </div>
                   </div>
                 </div>

                 {/* Expanded Content */}
                 <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
                   <div className="px-5 pb-6 pt-0 space-y-5">
                      <div className="h-px bg-gray-100 dark:bg-gray-700 w-full mb-4"></div>
                      
                      {/* Q&A Thread */}
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                             <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">You</span>
                             </div>
                          </div>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4 text-gray-700 dark:text-gray-300 text-sm leading-relaxed w-full">
                            {question.question_text}
                          </div>
                        </div>

                        <div className="flex gap-4">
                          <div className="flex-shrink-0 mt-1">
                             <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-md">
                                <MessageCircle size={14} className="text-white" />
                             </div>
                          </div>
                          <div className="bg-gradient-to-br from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border border-primary-100 dark:border-primary-800/30 rounded-2xl p-4 text-gray-800 dark:text-gray-200 text-sm leading-relaxed w-full shadow-sm">
                            <p className="whitespace-pre-wrap">{question.answer_text}</p>
                            
                            <div className="mt-4 flex items-center justify-end gap-3 border-t border-primary-100 dark:border-primary-800/30 pt-3">
                               <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors">
                                 Copy Answer
                               </button>
                               <button className="text-xs font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 flex items-center transition-colors">
                                 Ask Follow-up <ArrowRight size={12} className="ml-1" />
                               </button>
                            </div>
                          </div>
                        </div>
                      </div>

                   </div>
                 </div>
               </div>
             );
          })
        )}
      </div>
    </div>
  );
};

export default UserQAHistory;
