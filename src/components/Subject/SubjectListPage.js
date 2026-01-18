import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import { Eye, Edit, Trash2, PlusCircle, Search, X } from "lucide-react";

const SubjectListPage = () => {
  const { subjects, openAddSubjectForm, deleteSubject } = useApp();
  const navigate = useNavigate();
  const [editingSubject, setEditingSubject] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEdit = (subject) => {
    setEditingSubject(subject);
  };

  const closeEditForm = () => {
    setEditingSubject(null);
  };

  const filteredSubjects = useMemo(() => {
    if (!searchQuery) {
      return subjects;
    }
    return subjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [subjects, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Subjects</h1>
        <div className="flex items-center space-x-4">
          <div className="relative w-full max-w-xs">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects..."
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X size={18} className="text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
          <button
            onClick={openAddSubjectForm}
            className="flex items-center space-x-2 w-60 bg-primary-500 text-white px-4 py-2 rounded-lg hover:bg-primary-600 transition-colors"
          >
            <PlusCircle size={20} />
            <span>Create Subject</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubjects.map((subject) => (
              <div
                key={subject.subjectId}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: subject.color }}
                    ></div>
                    <h2 className="text-lg font-semibold">{subject.name}</h2>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigate(`/subject/${subject.subjectId}`)}
                      className="p-2 text-gray-500 hover:text-primary-500"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => handleEdit(subject)}
                      className="p-2 text-gray-500 hover:text-yellow-500"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => deleteSubject(subject.subjectId)}
                      className="p-2 text-gray-500 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredSubjects.length === 0 && (
              <p className="text-gray-500">No subjects found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectListPage;
