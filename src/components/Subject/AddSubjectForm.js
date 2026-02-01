import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X } from "lucide-react";

const AddSubjectForm = ({ subject, onClose }) => {
  const { closeAddSubjectForm, showToast, addSubject, editSubject, isAdmin } =
    useApp();
  const isEditMode = !!subject;
  const [name, setName] = useState(subject?.name || "");
  const [description, setDescription] = useState(subject?.description || "");
  const [isPublic, setIsPublic] = useState(subject?.is_public || false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      closeAddSubjectForm();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};
    const unsafePattern = /[<>]/;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      newErrors.name = "Subject name must be at least 2 characters";
    } else if (name.length > 125) {
      newErrors.name = "Subject name cannot exceed 125 characters";
    } else if (unsafePattern.test(name)) {
      newErrors.name = "Name contains invalid characters (< or >)";
    }

    if (description.length > 500) {
      newErrors.description = "Description cannot exceed 500 characters";
    } else if (unsafePattern.test(description)) {
      newErrors.description =
        "Description contains invalid characters (< or >)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    let result;
    const payload = {
      name: trimmedName,
      description: description.trim(),
      is_public: isAdmin ? isPublic : false,
    };

    if (isEditMode) {
      result = await editSubject(subject.id, payload);
    } else {
      result = await addSubject(payload);
    }

    if (result?.success) {
      showToast(
        isEditMode
          ? "Subject updated successfully!"
          : "Subject added successfully!",
        "success",
      );
      handleClose();
    }
    setIsSubmitting(false);
  };

  // Close on ESC key (UX win)
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center
                 bg-black/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-white dark:bg-dark-secondary shadow-2xl
                   animate-in fade-in zoom-in duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {isEditMode ? "Edit Subject" : "Add Subject"}
          </h2>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject name
            </label>
            <input
              type="text"
              placeholder="e.g. Mathematics"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={125}
              autoFocus
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition bg-white dark:bg-dark-primary dark:text-gray-200
                ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                    : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                }`}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Description
            </label>
            <textarea
              placeholder="e.g. Admin added Mechanics"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm transition resize-none bg-white dark:bg-dark-primary dark:text-gray-200
                ${
                  errors.description
                    ? "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30"
                    : "border-gray-300 dark:border-gray-600 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30"
                }`}
              rows={3}
            />
            <div className="flex justify-between items-start mt-1">
              {errors.description && (
                <p className="text-xs text-red-500">{errors.description}</p>
              )}
              <div className="text-xs text-gray-400 ml-auto">
                {description.length}/500
              </div>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="rounded border-gray-300 dark:border-gray-600 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="isPublic"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Available for all users
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600
                         py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200
                         hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex-1 rounded-xl bg-primary-500
                         py-2.5 text-sm font-semibold text-white
                         hover:bg-primary-600 transition
                         disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;
