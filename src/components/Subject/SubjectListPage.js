import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Eye, Edit, Trash2, PlusCircle, FileText, Clock } from "lucide-react";
import AddSubjectForm from "./AddSubjectForm";
import ConfirmationDialog from "../Layout/ConfirmationDialog";

const SubjectListPage = () => {
  const { subjects, openAddSubjectForm, deleteSubject, searchQuery } = useApp();
  const navigate = useNavigate();
  const [editingSubject, setEditingSubject] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const handleEdit = (subject) => {
    setEditingSubject(subject);
  };

  const closeEditForm = () => {
    setEditingSubject(null);
  };

  const handleDeleteClick = (subjectId) => {
    setSubjectToDelete(subjectId);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteSubject = async () => {
    if (subjectToDelete) {
      await deleteSubject(subjectToDelete);
      setSubjectToDelete(null);
    }
    setShowDeleteConfirmation(false);
  };

  const cancelDeleteSubject = () => {
    setSubjectToDelete(null);
    setShowDeleteConfirmation(false);
  };

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) {
      return subjects;
    }
    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [subjects, searchQuery]);

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold dark:text-gray-100">Subjects</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={openAddSubjectForm}
            className="flex items-center space-x-2 w-60 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Subject</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => {
              const files = subject.files || [];
              const fileCount = subject.file_count || files.length || 0;
              const totalProgress = files.reduce(
                (sum, file) => sum + (Number(file.read_percentage) || 0),
                0,
              );
              const avgProgress =
                files.length > 0 ? Math.round(totalProgress / files.length) : 0;
              const subjectColor = subject.color || "#6366f1";

              return (
                <div
                  key={subject.id}
                  className="border border-gray-200 dark:border-gray-700 border-l-4 rounded-lg p-5 hover:shadow-md transition-all bg-white dark:bg-dark-primary flex flex-col"
                  style={{ borderLeftColor: subjectColor }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <h2
                        className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate"
                        title={subject.name}
                      >
                        {subject.name}
                      </h2>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/subject/${subject.id}`)}
                        className="p-1.5 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => handleEdit(subject)}
                        className="p-1.5 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Edit Subject"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(subject.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-gray-700 rounded-md transition-colors"
                        title="Delete Subject"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4 flex-grow">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 h-10">
                      {subject.description || "No description provided."}
                    </p>
                  </div>

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
                No subjects found matching your search.
              </div>
            )}
          </div>
        </div>
      </div>
      {editingSubject && (
        <AddSubjectForm subject={editingSubject} onClose={closeEditForm} />
      )}
      {showDeleteConfirmation && (
        <ConfirmationDialog
          message="Are you sure you want to delete this subject? All associated files will also be deleted."
          onConfirm={confirmDeleteSubject}
          onCancel={cancelDeleteSubject}
        />
      )}
    </div>
  );
};

export default SubjectListPage;
