import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Clock,
  FileText,
  Play,
  Trash2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import ConfirmationDialog from "../Layout/ConfirmationDialog";

const SubjectView = () => {
  const { subjectId } = useParams();
  const { deletePdf, openUploadForm, getSubjectDetails, subjectUpdateTrigger } =
    useApp();

  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pdfToDelete, setPdfToDelete] = useState(null);
  const [subjectDetails, setSubjectDetails] = useState(null);
  const [loading, setLoading] = useState(true);

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
    const readPages = Math.round(
      files.reduce(
        (sum, file) =>
          sum +
          (Number(file.page_count) || 0) *
            ((Number(file.read_percentage) || 0) / 100),
        0,
      ),
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

  if (loading) {
    return (
      <div className="text-center py-12">
        <p>Loading subject details...</p>
      </div>
    );
  }

  if (!subjectDetails) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Subject not found</h2>
        <button
          onClick={() => navigate("/dashboard")}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors mt-4"
        >
          Go Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4 justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-700" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {subjectDetails.name}
          </h1>
        </div>

        <button
          className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          onClick={() => openUploadForm(subjectDetails.id)}
        >
          Upload PDF
        </button>
      </div>
      {/* Subject Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <FileText size={24} className="text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalPdfs}</p>
            <p className="text-sm text-gray-600">Total PDFs</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen size={24} className="text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{completedPdfs}</p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Clock size={24} className="text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalPages}</p>
            <p className="text-sm text-gray-600">Total Pages</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <Play size={24} className="text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {Math.round(overallProgress)}%
            </p>
            <p className="text-sm text-gray-600">Progress</p>
          </div>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900">
            Overall Progress
          </h2>
          <span className="text-sm text-gray-600">
            {readPages} of {totalPages} pages
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full transition-all"
            style={{
              width: `${overallProgress}%`,
            }}
          ></div>
        </div>
      </div>
      {/* PDFs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            PDFs in this subject
          </h2>
        </div>
        <div className="p-6">
          {pdfs.length === 0 ? (
            <div className="text-center py-8">
              <FileText size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No PDFs yet
              </h3>
              <p className="text-gray-600 mb-4">
                Upload your first PDF to get started with this subject.
              </p>
              <button
                className="bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
                onClick={() => openUploadForm(subjectDetails.id)}
              >
                Upload PDF
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pdfs.map((pdf, index) => (
                <div
                  key={`${pdf.pdfId || pdf.id || "pdf"}-${index}`}
                  className="group border border-gray-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <Link
                      to={`/pdf/${pdf.pdfId || pdf.id}`}
                      state={{ pdf }}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600 truncate">
                          {pdf.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {pdf.page_count} pages
                        </p>

                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium text-gray-900">
                              {pdf.read_percentage}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${pdf.read_percentage}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => handleDelete(pdf.pdfId || pdf.id)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
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
    </div>
  );
};

export default SubjectView;
