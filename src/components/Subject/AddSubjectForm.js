import { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { X, Check } from "lucide-react";

const PRESET_COLORS = [
  "#D32F2F", // Red
  "#C2185B", // Pink
  "#7B1FA2", // Purple
  "#512DA8", // Deep Purple
  "#303F9F", // Indigo
  "#1976D2", // Blue
  "#0288D1", // Light Blue
  "#0097A7", // Cyan
  "#00796B", // Teal
  "#388E3C", // Green
  "#689F38", // Light Green
  "#FFA000", // Amber
  "#F57C00", // Orange
  "#E64A19", // Deep Orange
  "#5D4037", // Brown
  "#455A64", // Blue Gray
];

const AddSubjectForm = ({ subject, onClose }) => {
  const {
    closeAddSubjectForm,
    showToast,
    addSubject,
    editSubject,
    isAdmin,
    allUsers,
  } = useApp();

  const isEditMode = !!subject;
  const [name, setName] = useState(subject?.name || "");
  const [description, setDescription] = useState(subject?.description || "");
  const [color, setColor] = useState(subject?.color || PRESET_COLORS[0]);
  const [isPublic, setIsPublic] = useState(subject?.is_public ?? true);
  const [assignMode, setAssignMode] = useState(
    subject?.user ? "specific" : "public"
  );
  const [targetUserId, setTargetUserId] = useState(subject?.user || "");
  const [applyToAll, setApplyToAll] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const studentUsers = (allUsers || []).filter((u) => u.role === "student");

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
      newErrors.description = "Description contains invalid characters (< or >)";
    }

    if (
      !isEditMode &&
      isAdmin &&
      assignMode === "specific" &&
      !targetUserId
    ) {
      newErrors.targetUserId = "Please select a student";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    let result;
    if (isEditMode) {
      const payload = {
        name: trimmedName,
        description: description.trim(),
        color,
        apply_to_all: isAdmin ? applyToAll : false,
      };
      result = await editSubject(subject.id, payload);
    } else {
      const payload = {
        name: trimmedName,
        description: description.trim(),
        color,
        is_public: isAdmin ? assignMode === "public" : false,
        user_id:
          isAdmin && assignMode === "specific" ? targetUserId : undefined,
      };
      result = await addSubject(payload);
    }

    if (result?.success) {
      handleClose();
    }
    setIsSubmitting(false);
  };

  // Close on ESC key
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-dark-secondary shadow-2xl animate-in fade-in zoom-in duration-200 my-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {isEditMode ? "Edit Subject" : "Create Subject"}
            </h2>
            {isEditMode && isAdmin && subject?.user_email && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Assigned to: {subject.user_name || subject.user_email}
              </p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-600 dark:text-gray-300 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject Title / Name <span className="text-red-500">*</span>
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
              placeholder="Brief description of the subject..."
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

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-8 gap-2">
              {PRESET_COLORS.map((preset) => {
                const isSelected = color.toUpperCase() === preset.toUpperCase();
                return (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setColor(preset)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-sm border border-black/10 focus:outline-none"
                    style={{ backgroundColor: preset }}
                    title={preset}
                  >
                    {isSelected && <Check size={16} className="text-white drop-shadow" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Admin options for creation */}
          {!isEditMode && isAdmin && (
            <div className="bg-gray-50 dark:bg-dark-primary/60 p-3.5 rounded-xl border border-gray-200 dark:border-gray-700 space-y-3">
              <span className="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 tracking-wider">
                Distribution
              </span>
              <div className="space-y-2">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="assignMode"
                    value="public"
                    checked={assignMode === "public"}
                    onChange={() => setAssignMode("public")}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Available for all students (Public Subject)
                  </span>
                </label>
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="radio"
                    name="assignMode"
                    value="specific"
                    checked={assignMode === "specific"}
                    onChange={() => setAssignMode("specific")}
                    className="text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Assign to a specific student
                  </span>
                </label>
              </div>

              {assignMode === "specific" && (
                <div className="pt-2">
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                    Select Student
                  </label>
                  <select
                    value={targetUserId}
                    onChange={(e) => setTargetUserId(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-dark-secondary dark:text-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="">-- Choose a student --</option>
                    {studentUsers.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                  {errors.targetUserId && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.targetUserId}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Admin options for edit */}
          {isEditMode && isAdmin && (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3.5 rounded-xl border border-amber-200 dark:border-amber-800">
              <label className="flex items-start space-x-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={applyToAll}
                  onChange={(e) => setApplyToAll(e.target.checked)}
                  className="rounded border-amber-300 text-amber-600 focus:ring-amber-500 mt-0.5"
                />
                <span className="text-xs text-amber-900 dark:text-amber-200 leading-snug">
                  Apply title & description updates to all students who have this subject (synchronize across students)
                </span>
              </label>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 rounded-xl border border-gray-300 dark:border-gray-600 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="flex-1 rounded-xl bg-primary-500 py-2.5 text-sm font-semibold text-white hover:bg-primary-600 transition disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Creating..."
                : isEditMode
                ? "Save Changes"
                : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubjectForm;
