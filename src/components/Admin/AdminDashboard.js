import React, { useState, useMemo } from "react";
import {
  Users,
  FileText,
  MessageCircle,
  Shield,
  Trash2,
  Search,
  ArrowRight,
  BookOpen,
  ChevronDown,
  ChevronRight,
  Loader,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { subjects, questions, isAdmin, allUsers, deleteUser, getUserStats } =
    useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUsers, setExpandedUsers] = useState({});
  const [loadingExpanded, setLoadingExpanded] = useState({});

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-gray-100 p-4 rounded-full mb-4">
          <Shield size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Access Denied</h2>
        <p className="text-gray-600 mt-2 max-w-md">
          You need administrator privileges to view this page. Please contact
          support if you believe this is an error.
        </p>
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-6 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Flatten all PDFs from subjects
  const allPdfs = useMemo(() => {
    return subjects.flatMap((subject) =>
      (subject.files || []).map((file) => ({
        ...file,
        subjectName: subject.name,
        subjectColor: subject.color || "#6366f1",
        subjectId: subject.id,
        // Normalize fields
        title: file.title || file.filename || "Untitled",
        pageCount: file.page_count || file.totalPages || 0,
        fileSize: file.fileSize || 0,
        readPercentage: file.read_percentage || 0,
        isPublic: file.isPublic || false, // Assuming default
      })),
    );
  }, [subjects]);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return allUsers.filter(
      (user) =>
        (user.username || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term) ||
        (user.role || "").toLowerCase().includes(term),
    );
  }, [allUsers, searchTerm]);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      await deleteUser(userId);
    }
  };

  const toggleUserRow = async (userId) => {
    if (expandedUsers[userId]) {
      const newExpanded = { ...expandedUsers };
      delete newExpanded[userId];
      setExpandedUsers(newExpanded);
    } else {
      setLoadingExpanded((prev) => ({ ...prev, [userId]: true }));
      const stats = await getUserStats(userId);
      setLoadingExpanded((prev) => ({ ...prev, [userId]: false }));
      if (stats) {
        setExpandedUsers((prev) => ({ ...prev, [userId]: stats }));
      }
    }
  };

  const totalUsers = allUsers.length;
  const totalPdfs = allPdfs.length;
  const totalQuestions = questions.length;
  const totalSubjects = subjects.length;

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Overview of system performance and content management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/subjects")}
            className="flex items-center space-x-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BookOpen size={18} />
            <span>Manage Subjects</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          icon={Users}
          label="Total Users"
          value={totalUsers}
          color="blue"
        />
        <StatsCard
          icon={FileText}
          label="Total PDFs"
          value={totalPdfs}
          color="green"
        />
        <StatsCard
          icon={MessageCircle}
          label="Q&A Sessions"
          value={totalQuestions}
          color="purple"
        />
        <StatsCard
          icon={BookOpen}
          label="Total Subjects"
          value={totalSubjects}
          color="orange"
        />
      </div>

      {/* Content Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* User Management (Left 2/3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-semibold text-gray-900">Users</h2>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600">
                <thead className="bg-gray-50 text-gray-900 font-medium border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 w-10"></th>
                    <th className="px-6 py-3">User</th>
                    <th className="px-6 py-3">Role</th>
                    <th className="px-6 py-3">Joined</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr
                          className={`hover:bg-gray-50 transition-colors cursor-pointer ${
                            expandedUsers[user.id] ? "bg-gray-50" : ""
                          }`}
                          onClick={() => toggleUserRow(user.id)}
                        >
                          <td className="px-6 py-4">
                            {loadingExpanded[user.id] ? (
                              <Loader size={16} className="animate-spin" />
                            ) : expandedUsers[user.id] ? (
                              <ChevronDown size={16} />
                            ) : (
                              <ChevronRight size={16} />
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold">
                                {(user.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">
                                  {user.username}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                user.role === "admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id, user.username);
                              }}
                              className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              title="Delete User"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                        {expandedUsers[user.id] && (
                          <tr className="bg-gray-50">
                            <td colSpan="5" className="px-6 py-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-gray-500 text-xs">
                                    Total Documents
                                  </p>
                                  <p className="font-semibold text-gray-900 text-lg">
                                    {expandedUsers[user.id].documentCount}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-gray-500 text-xs">
                                    Total Pages
                                  </p>
                                  <p className="font-semibold text-gray-900 text-lg">
                                    {expandedUsers[user.id].totalPageCount}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-gray-500 text-xs">
                                    Subjects
                                  </p>
                                  <p className="font-semibold text-gray-900 text-lg">
                                    {expandedUsers[user.id].subjectCount}
                                  </p>
                                </div>
                                <div className="bg-white p-3 rounded-lg border border-gray-200">
                                  <p className="text-gray-500 text-xs">
                                    Storage Used
                                  </p>
                                  <p className="font-semibold text-gray-900 text-lg">
                                    {expandedUsers[user.id].storageUsed}
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > 10 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 text-center">
                <span className="text-xs text-gray-500">
                  Showing top results
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity (Right 1/3) */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Q&A
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {questions.length > 0 ? (
                questions.slice(0, 5).map((q, idx) => (
                  <div
                    key={q.questionId || idx}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                      "{q.questionText}"
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                      <span>
                        Confidence: {Math.round(q.confidenceScore * 100)}%
                      </span>
                      <span>{new Date(q.timestamp).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 text-sm">
                  No recent questions asked.
                </div>
              )}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-200 text-center">
              <button className="text-sm text-primary-600 font-medium hover:text-primary-700 flex items-center justify-center mx-auto">
                View All Activity <ArrowRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon: Icon, label, value, color }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}
      >
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-600">{label}</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
