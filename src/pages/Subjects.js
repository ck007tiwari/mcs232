import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { Eye, Edit, Trash2, PlusCircle, FileText, Clock, Users, Shield } from "lucide-react";
import AddSubjectForm from "../components/Subject/AddSubjectForm";
import ConfirmationDialog from "../components/Layout/ConfirmationDialog";

const SubjectListPage = () => {
  const {
    subjects,
    openAddSubjectForm,
    deleteSubject,
    searchQuery,
    isAdmin,
    isSuperAdmin,
    allUsers,
  } = useApp();

  const navigate = useNavigate();
  const [editingSubject, setEditingSubject] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);
  const [deleteAllCopies, setDeleteAllCopies] = useState(false);
  const [selectedStudentFilter, setSelectedStudentFilter] = useState("all");

  const studentUsers = useMemo(
    () => (allUsers || []).filter((u) => u.role === "student"),
    [allUsers]
  );

  const handleEdit = (subject) => {
    setEditingSubject(subject);
  };

  const closeEditForm = () => {
    setEditingSubject(null);
  };

  const handleDeleteClick = (subject) => {
    setSubjectToDelete(subject);
    setDeleteAllCopies(false);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSubject = async () => {
    if (subjectToDelete) {
      await deleteSubject(subjectToDelete.id, { deleteAll: deleteAllCopies });
      setSubjectToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteSubject = () => {
    setSubjectToDelete(null);
    setDeleteAllCopies(false);
    setShowDeleteConfirmation(false);
  };

  const filteredSubjects = useMemo(() => {
    return subjects.filter((subject) => {
      // Filter by student if selected
      if (
        isAdmin &&
        selectedStudentFilter !== "all" &&
        String(subject.user) !== String(selectedStudentFilter)
      ) {
        return false;
      }

      // Filter by search query
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      const matchName = subject.name?.toLowerCase().includes(q);
      const matchDesc = subject.description?.toLowerCase().includes(q);
      const matchUser =
        subject.user_email?.toLowerCase().includes(q) ||
        subject.user_name?.toLowerCase().includes(q);

      return matchName || matchDesc || matchUser;
    });
  }, [subjects, searchQuery, isAdmin, selectedStudentFilter]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 max-w-full space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Subjects Management
            </h1>
            {isSuperAdmin && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold">
                Super Admin
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {isAdmin
              ? "View, create, edit titles and colors, manage PDFs, and organize subjects across all students."
              : "Access your enrolled subjects and track learning progress."}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isAdmin && studentUsers.length > 0 && (
            <div className="flex items-center gap-2">
              <Users size={16} className="text-gray-500 dark:text-gray-400" />
              <select
                value={selectedStudentFilter}
                onChange={(e) => setSelectedStudentFilter(e.target.value)}
                className="rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-secondary text-sm px-3 py-2 text-gray-700 dark:text-gray-200 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Students ({studentUsers.length})</option>
                {studentUsers.map((stu) => (
                  <option key={stu.id} value={stu.id}>
                    {stu.username} ({stu.email})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={openAddSubjectForm}
            className="flex items-center space-x-2 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors shadow-sm text-sm font-medium"
          >
            <PlusCircle size={18} />
            <span>Create Subject</span>
          </button>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const files = subject.files || [];
              const fileCount = subject.file_count || files.length || 0;
              const totalProgress = files.reduce(
                (sum, file) => sum + (Number(file.read_percentage) || 0),
                0
              );
              const avgProgress =
                files.length > 0 ? Math.round(totalProgress / files.length) : 0;
              const subjectColor = subject.color || "#6366f1";

              return (
                <div
                  key={subject.id}
                  className="border border-gray-200 dark:border-gray-700 border-l-4 rounded-xl p-5 hover:shadow-md transition-all bg-white dark:bg-dark-primary flex flex-col justify-between"
                  style={{ borderLeftColor: subjectColor }}
                >
                  <div>
                    {/* Header: Title and Actions */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: subjectColor }}
                          />
                          <h2
                            className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate"
                            title={subject.name}
                          >
                            {subject.name}
                          </h2>
                        </div>

                        {isAdmin && subject.user_email && (
                          <div className="mt-1">
                            <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                              Student: {subject.user_name || subject.user_email}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          onClick={() => navigate(`/subject/${subject.id}`)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title="View Details & PDFs"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(subject)}
                          className="p-1.5 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title="Edit Title, Description & Color"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(subject)}
                          className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                          title="Delete Subject"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-4 mt-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 min-h-[2.5rem]">
                        {subject.description || "No description provided."}
                      </p>
                    </div>
                  </div>

                  {/* Progress & Stats Footer */}
                  <div className="space-y-3 pt-3 border-t border-gray-100 dark:border-gray-700 mt-auto">
                    <div>
                      <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                        <span>Progress</span>
                        <span>{avgProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${avgProgress}%`,
                            backgroundColor: subjectColor,
                          }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center space-x-1.5">
                        <FileText size={14} />
                        <span>{fileCount} Files</span>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <Clock size={14} />
                        <span>{formatDate(subject.updated_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredSubjects.length === 0 && (
              <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
                No subjects found matching your criteria. Click "Create Subject" to add one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Subject Modal */}
      {editingSubject && (
        <AddSubjectForm subject={editingSubject} onClose={closeEditForm} />
      )}

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          message={`Are you sure you want to delete "${subjectToDelete?.name}"? All associated files and progress will be permanently removed.`}
          onConfirm={confirmDeleteSubject}
          onCancel={cancelDeleteSubject}
        />
      )}
    </div>
  );
};

export default SubjectListPage;
