import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Play,
  Trash2,
  Edit,
  Download,
  Search,
  Filter,
  CheckCircle,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ConfirmationDialog from "../components/Layout/ConfirmationDialog";
import AddSubjectForm from "../components/Subject/AddSubjectForm";
import EditPdfModal from "../components/Subject/EditPdfModal";

const SubjectView = () => {
  const { subjectId } = useParams();
  const {
    deletePdf,
    openUploadForm,
    getSubjectDetails,
    subjectUpdateTrigger,
    isAdmin,
  } = useApp();

  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editingPdf, setEditingPdf] = useState(null);
  const [pdfSearchQuery, setPdfSearchQuery] = useState("");
  const [pdfFilter, setPdfFilter] = useState("all");

  const fetchSubDetailsById = useCallback(async () => {
    setLoading(true);
    if (subjectId) {
      const { success, data } = await getSubjectDetails(subjectId);
      if (success) {
        setSubjectDetails(data);
      } else {
        setSubjectDetails(null);
      }
    }
    setLoading(false);
  }, [subjectId, getSubjectDetails]);

  useEffect(() => {
    fetchSubDetailsById();
  }, [fetchSubDetailsById, subjectUpdateTrigger]);

  const handleDelete = useCallback((pdfId) => {
    setPdfToDelete(pdfId);
    setShowConfirmation(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (pdfToDelete) {
      const { success } = await deletePdf(pdfToDelete, subjectId);
      if (success) {
        fetchSubDetailsById();
        setPdfToDelete(null);
      }
    }
    setShowConfirmation(false);
  }, [pdfToDelete, subjectId, deletePdf, fetchSubDetailsById]);

  const {
    pdfs,
    totalPdfs,
    totalPages,
    completedPdfs,
    readPages,
    overallProgress,
  } = useMemo(() => {
    const files = subjectDetails?.files || [];
    const totalPdfs = files.length;
    const totalPages = files.reduce(
      (sum, file) => sum + (Number(file.page_count) || 0),
      0,
    );
    const completedPdfs = files.filter(
      (file) => file.read_percentage === 100,
    ).length;
    const readPages = files.reduce(
      (sum, file) => sum + (Number(file.page_read) || 0),
      0,
    );
    const overallProgress = totalPages > 0 ? (readPages / totalPages) * 100 : 0;

    return {
      pdfs: files,
      totalPdfs,
      totalPages,
      completedPdfs,
      readPages,
      overallProgress,
    };
  }, [subjectDetails]);

  const filteredPdfs = useMemo(() => {
    return pdfs.filter((pdf) => {
      const matchSearch = (pdf.title || "")
        .toLowerCase()
        .includes(pdfSearchQuery.toLowerCase());
      if (!matchSearch) return false;

      const pct = Number(pdf.read_percentage) || 0;
      if (pdfFilter === "completed") return pct === 100;
      if (pdfFilter === "in_progress") return pct > 0 && pct < 100;
      if (pdfFilter === "unread") return pct === 0;
      return true;
    });
  }, [pdfs, pdfSearchQuery, pdfFilter]);

  const handleEditPdf = (e, pdf) => {
    e.preventDefault();
    e.stopPropagation();
    setEditingPdf(pdf);
  };

  const handleDownloadPdf = (e, pdf) => {
    e.preventDefault();
    e.stopPropagation();
    if (!pdf?.file) return;
    const link = document.createElement("a");
    link.href = pdf.file;
    link.target = "_blank";
    link.download = `${pdf.title || "document"}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeletePdf = (e, pdfId) => {
    e.preventDefault();
    e.stopPropagation();
    handleDelete(pdfId);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="dark:text-gray-300">Loading subject details...</p>
      </div>
    );
  }

  if (!subjectDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Subject not found</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors mt-4"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  const subjectColor = subjectDetails.color || "#4f46e5";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full transition-colors flex-shrink-0"
          >
            <ArrowLeft size={24} className="text-gray-700 dark:text-gray-200" />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: subjectColor }}
              />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {subjectDetails.name}
              </h1>
              {isAdmin && subjectDetails.user_email && (
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium">
                  Student: {subjectDetails.user_name || subjectDetails.user_email}
                </span>
              )}
            </div>
            {subjectDetails.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                {subjectDetails.description}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-1.5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors text-sm font-medium"
          >
            <Edit size={16} />
            <span>Edit Subject</span>
          </button>
          <button
            className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm"
            onClick={() => openUploadForm(subjectDetails.id)}
          >
            Upload PDF
          </button>
        </div>
      </div>
      {/* Subject Stats */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText size={24} className="text-blue-600 dark:text-blue-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalPdfs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total PDFs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen size={24} className="text-green-600 dark:text-green-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{completedPdfs}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock size={24} className="text-purple-600 dark:text-purple-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalPages}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pages</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Play size={24} className="text-orange-600 dark:text-orange-300" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(overallProgress)}%
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Progress</p>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Overall Progress
          </h2>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {readPages} of {totalPages} pages
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${overallProgress}%`,
              backgroundColor: subjectColor,
            }}
          ></div>
        </div>
      </div>
      {/* PDFs List */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              PDFs in this subject
            </h2>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
              {filteredPdfs.length} {filteredPdfs.length === 1 ? "file" : "files"}
            </span>
          </div>

          {pdfs.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="text"
                  value={pdfSearchQuery}
                  onChange={(e) => setPdfSearchQuery(e.target.value)}
                  placeholder="Search PDFs..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                />
              </div>

              {/* Status Filter */}
              <div className="flex items-center space-x-1.5">
                <Filter size={15} className="text-gray-400" />
                <select
                  value={pdfFilter}
                  onChange={(e) => setPdfFilter(e.target.value)}
                  className="text-sm py-1.5 px-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">All Status</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="unread">Not Started</option>
                </select>
              </div>

              {/* Upload Button */}
              <button
                className="bg-primary-500 text-white px-3 py-1.5 rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium shadow-sm ml-auto"
                onClick={() => openUploadForm(subjectDetails.id)}
              >
                + Add PDF
              </button>
            </div>
          )}
        </div>

        <div className="p-6">
          {pdfs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No PDFs yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your first PDF to get started with this subject.
              </p>
              <button
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => openUploadForm(subjectDetails.id)}
              >
                Upload PDF
              </button>
            </div>
          ) : filteredPdfs.length === 0 ? (
            <div className="text-center py-8">
              <Search size={40} className="text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-1">
                No matching PDFs found
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Try adjusting your search query or status filter.
              </p>
              <button
                onClick={() => {
                  setPdfSearchQuery("");
                  setPdfFilter("all");
                }}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPdfs.map((pdf, index) => (
                <div
                  key={`${pdf.pdfId || pdf.id || "pdf"}-${index}`}
                  className="group relative border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/40 rounded-xl p-5 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Title + Action buttons */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <Link
                        to={`/pdf/${pdf.pdfId || pdf.id}`}
                        state={{ pdf }}
                        className="flex items-center space-x-3 flex-1 min-w-0"
                      >
                        <div
                          className="p-2.5 rounded-lg text-white flex-shrink-0"
                          style={{ backgroundColor: subjectColor }}
                        >
                          <FileText size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 truncate text-base"
                            title={pdf.title}
                          >
                            {pdf.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            {pdf.page_count || 0} pages
                          </p>
                        </div>
                      </Link>

                      {/* PDF Card Actions */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          onClick={(e) => handleEditPdf(e, pdf)}
                          title="Edit PDF (Title, Move Subject, Replace File, Reset Progress)"
                          className="p-1.5 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-md transition-colors"
                        >
                          <Edit size={16} />
                        </button>
                        {pdf.file && (
                          <button
                            onClick={(e) => handleDownloadPdf(e, pdf)}
                            title="Download PDF"
                            className="p-1.5 text-gray-500 hover:text-green-600 dark:text-gray-400 dark:hover:text-green-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-md transition-colors"
                          >
                            <Download size={16} />
                          </button>
                        )}
                        <button
                          onClick={(e) => handleDeletePdf(e, pdf.pdfId || pdf.id)}
                          title="Delete PDF"
                          className="p-1.5 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 rounded-md transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    {/* Progress Link */}
                    <Link
                      to={`/pdf/${pdf.pdfId || pdf.id}`}
                      state={{ pdf }}
                      className="block mt-4"
                    >
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">
                          {pdf.read_percentage === 100
                            ? "Completed"
                            : pdf.read_percentage > 0
                            ? "In progress"
                            : "Not started"}
                        </span>
                        <span className="font-semibold text-gray-900 dark:text-gray-100">
                          {pdf.read_percentage}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${pdf.read_percentage}%`,
                            backgroundColor: subjectColor,
                          }}
                        ></div>
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
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

      {isEditing && (
        <AddSubjectForm
          subject={subjectDetails}
          onClose={() => {
            setIsEditing(false);
            fetchSubDetailsById();
          }}
        />
      )}

      {editingPdf && (
        <EditPdfModal
          pdf={editingPdf}
          currentSubjectId={subjectDetails.id}
          onClose={() => setEditingPdf(null)}
          onUpdated={() => {
            setEditingPdf(null);
            fetchSubDetailsById();
          }}
        />
      )}
    </div>
  );
};

export default SubjectView;
