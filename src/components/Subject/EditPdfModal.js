import React, { useState, useEffect } from "react";
import { X, FileText, Upload, RefreshCw, Folder } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { getPdfPageCount } from "../PdfUploadForm";

const EditPdfModal = ({ pdf, currentSubjectId, onClose, onUpdated }) => {
  const { editPdf, subjects } = useApp();
  const [title, setTitle] = useState(pdf?.title || "");
  const [targetSubjectId, setTargetSubjectId] = useState(
    pdf?.subject || currentSubjectId || ""
  );
  const [replacementFile, setReplacementFile] = useState(null);
  const [resetProgress, setResetProgress] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setTitle(pdf?.title || "");
    setTargetSubjectId(pdf?.subject || currentSubjectId || "");
  }, [pdf, currentSubjectId]);

  // Handle ESC key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type !== "application/pdf") {
        setErrors((prev) => ({ ...prev, file: "Please select a valid PDF file" }));
        return;
      }
      setReplacementFile(selected);
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy.file;
        return copy;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    const trimmedTitle = title.trim();
    if (!trimmedTitle || trimmedTitle.length < 2) {
      newErrors.title = "PDF title must be at least 2 characters";
    } else if (trimmedTitle.length > 150) {
      newErrors.title = "PDF title cannot exceed 150 characters";
    }

    if (!targetSubjectId) {
      newErrors.subject = "Please select a valid subject";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      let result;
      if (replacementFile) {
        // Multipart Form-Data
        const formData = new FormData();
        formData.append("title", trimmedTitle);
        formData.append("subject_id", targetSubjectId);
        formData.append("file", replacementFile);

        const pageCount = await getPdfPageCount(replacementFile).catch(() => 0);
        if (pageCount > 0) {
          formData.append("page_count", pageCount);
        }

        if (resetProgress) {
          formData.append("reset_progress", "true");
        }

        result = await editPdf(pdf.id || pdf.pdfId, formData);
      } else {
        // JSON Payload
        const payload = {
          title: trimmedTitle,
          subject_id: targetSubjectId,
          reset_progress: resetProgress,
        };
        result = await editPdf(pdf.id || pdf.pdfId, payload);
      }

      if (result?.success) {
        if (onUpdated) onUpdated();
        onClose();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-secondary shadow-2xl animate-in fade-in zoom-in duration-200 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 flex items-center justify-center">
              <FileText size={18} />
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Edit PDF Document
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:text-gray-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Document Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 1 - Algorithms"
              maxLength={150}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition bg-white dark:bg-dark-primary dark:text-gray-200
                ${
                  errors.title
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                    : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                }`}
            />
            {errors.title && (
              <p className="text-xs text-red-500 mt-1">{errors.title}</p>
            )}
          </div>

          {/* Move to another Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Folder size={14} className="text-gray-500" />
              <span>Assigned Subject</span>
            </label>
            <select
              value={targetSubjectId}
              onChange={(e) => setTargetSubjectId(e.target.value)}
              className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-dark-primary dark:text-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.user_name ? `(${s.user_name})` : ""}
                </option>
              ))}
            </select>
            {errors.subject && (
              <p className="text-xs text-red-500 mt-1">{errors.subject}</p>
            )}
          </div>

          {/* Replace PDF file (optional) */}
          <div className="bg-gray-50 dark:bg-dark-primary/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase text-gray-600 dark:text-gray-300 tracking-wider flex items-center gap-1.5">
                <Upload size={14} />
                <span>Replace PDF File (Optional)</span>
              </span>
              <span className="text-[11px] text-gray-400">
                {pdf?.page_count || 0} pages
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Upload a new version to replace the existing document content.
            </p>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-secondary rounded-lg border border-gray-300 dark:border-gray-600 cursor-pointer focus:outline-none file:bg-primary-50 file:text-primary-700 file:dark:bg-primary-900/50 file:dark:text-primary-300 file:text-xs file:font-semibold file:py-1.5 file:px-3 file:border-0 file:mr-3 hover:file:bg-primary-100"
            />
            {replacementFile && (
              <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                Selected: {replacementFile.name} ({(replacementFile.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
            {errors.file && (
              <p className="text-xs text-red-500">{errors.file}</p>
            )}
          </div>

          {/* Progress Stats & Reset */}
          <div className="bg-blue-50/60 dark:bg-blue-900/20 p-3.5 rounded-xl border border-blue-200/60 dark:border-blue-800/40 space-y-2">
            <div className="flex items-center justify-between text-xs text-blue-900 dark:text-blue-200 font-medium">
              <span>Current Progress</span>
              <span>
                {pdf?.read_percentage || 0}% ({pdf?.page_read || 0}/{pdf?.page_count || 0} pages)
              </span>
            </div>
            <label className="flex items-center space-x-2 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={resetProgress}
                onChange={(e) => setResetProgress(e.target.checked)}
                className="rounded border-blue-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-700 dark:text-gray-300 flex items-center gap-1">
                <RefreshCw size={12} className="text-blue-500" />
                <span>Reset reading progress back to 0%</span>
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting || !title.trim()}
              className="flex-1 rounded-xl bg-primary-500 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPdfModal;

