import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";
import { pdfjs } from "react-pdf";

// Configure the PDF worker to allow page counting
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export const getPdfPageCount = async (file) => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
};

const UploadForm = () => {
  const {
    closeUploadForm,
    subjects,
    addPdf,
    uploadSubjectId,
    showToast,
    uploadPdf,
  } = useApp();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (uploadSubjectId) {
      setSubject(uploadSubjectId);
    } else {
      setSubject("");
    }
  }, [uploadSubjectId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Captures the file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !subject) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const pageCount = await getPdfPageCount(file).catch((err) => {
        console.error("Failed to calculate page count", err);
        return 0; // Fallback if PDF parsing fails
      });

      console.log("pageCount", pageCount);
      const formData = new FormData();
      formData.append("file", file); // 'pdf' in binary upload API
      formData.append("title", title);
      formData.append("page_count", pageCount);
      formData.append("subject_id", subject);

      const result = await uploadPdf(formData);
      console.log("result", result);
      if (result.success) {
        showToast("PDF uploaded successfully", "success");
        closeUploadForm();
      } else {
        showToast(result.message || "Upload failed", "error");
      }
    } catch (error) {
      console.error("Upload error:", error);
      showToast("An error occurred during upload", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={closeUploadForm}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Upload PDF</h2>
          <button
            onClick={closeUploadForm}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="title"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              placeholder="PDF Title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="subject"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Subject
            </label>
            <select
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="" disabled>
                Select a subject
              </option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="pdf-upload"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              PDF File
            </label>
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              onChange={handleFileChange}
              className="w-full text-gray-700 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none
                         file:bg-primary-50 file:text-primary-700 file:text-sm file:font-semibold
                         file:py-2 file:px-4 file:border-0 file:mr-4
                         hover:file:bg-primary-100"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!file || !title || !subject || isSubmitting}
          >
            {isSubmitting ? "Uploading..." : "Upload PDF"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
