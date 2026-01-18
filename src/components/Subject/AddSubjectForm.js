import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";

const AddSubjectForm = () => {
  const { closeAddSubjectForm, showToast } = useApp();
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    showToast("Feature coming soon!", "info");
  };

  // Close on ESC key (UX win)
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && closeAddSubjectForm();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center
                 bg-black/40 backdrop-blur-sm"
      onClick={closeAddSubjectForm}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white shadow-2xl
                   animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Add Subject</h2>
          <button
            onClick={closeAddSubjectForm}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subject name
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5
                         text-sm focus:border-primary-500 focus:ring-2
                         focus:ring-primary-500/30 transition"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={closeAddSubjectForm}
              className="flex-1 rounded-xl border border-gray-300
                         py-2.5 text-sm font-medium text-gray-700
                         hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 rounded-xl bg-primary-500
                         py-2.5 text-sm font-semibold text-white
                         hover:bg-primary-600 transition
                         disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;
