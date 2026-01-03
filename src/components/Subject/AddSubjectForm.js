import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";

const AddSubjectForm = () => {
  const { closeAddSubjectForm, addSubject, showToast } = useApp();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Feature coming soon!", "info");
    // if (!name.trim()) return;

    // const newSubject = {
    //   subjectId: `s_${Date.now()}`,
    //   name,
    //   color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
    // };

    // addSubject(newSubject);
    // closeAddSubjectForm();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      onClick={closeAddSubjectForm}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Subject</h2>
          <button
            onClick={closeAddSubjectForm}
            className="text-gray-500 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="subject-name"
              className="block text-gray-700 text-sm font-medium mb-2"
            >
              Subject Name
            </label>
            <input
              type="text"
              id="subject-name"
              placeholder="Enter subject name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors disabled:bg-gray-400"
            disabled={!name.trim()}
          >
            Add Subject
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;
