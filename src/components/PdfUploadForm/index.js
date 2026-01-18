import { useState, useEffect } from "react";
import axios from "axios";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";

const UploadForm = () => {
  const { closeUploadForm, subjects, addPdf, uploadSubjectId, showToast } =
    useApp();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");

  useEffect(() => {
    if (uploadSubjectId) {
      setSubject(uploadSubjectId);
    }
  }, [uploadSubjectId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Captures the file object
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Create a FormData object (Required for files)
    const formData = new FormData();
    formData.append("pdf", file); // 'pdf' must match upload.single('pdf') in backend
    formData.append("title", title);
    formData.append("subject", subject);

    try {
      // 2. Send to your running backend
      const res = await axios.post(
        "http://localhost:5001/api/pdfs/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Crucial header
          },
        }
      );
      addPdf(res.data);
      showToast("Upload Successful!", "success");
      console.log(res.data);
      closeUploadForm();
    } catch (err) {
      console.error(err);
      showToast("Upload Failed", "error");
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
                <option key={s.subjectId} value={s.subjectId}>
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
            className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400"
            disabled={!file || !title || !subject}
          >
            Upload PDF
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadForm;
