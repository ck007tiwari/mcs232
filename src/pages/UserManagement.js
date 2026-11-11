import React, { useState } from "react";
import {
  Search,
  Trash2,
  ChevronRight,
  ChevronDown,
  Loader,
  User,
  Shield,
  ArrowLeft
} from "lucide-react";
import { useApp } from "../context/AppContext";
import ConfirmationDialog from "../components/Layout/ConfirmationDialog";
import { Link, useNavigate } from "react-router-dom";

const UserManagement = () => {
  const {
    allUsers,
    deleteUser,
    isSuperAdmin,
    updateUserRole,
    getUserStats
  } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUsers, setExpandedUsers] = useState({});
  const [loadingExpanded, setLoadingExpanded] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const filteredUsers = (allUsers || []).filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteUser = (userId, name) => {
    setUserToDelete({ id: userId, name });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteUser = async () => {
    if (userToDelete) {
      await deleteUser(userToDelete.id);
      setShowDeleteConfirm(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6 p-4 max-w-7xl mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-2 transition-colors"
            >
                <ArrowLeft size={16} className="mr-1" /> Back to Dashboard
            </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">User Management</h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Manage users, roles, and view individual statistics.
          </p>
        </div>
      </div>

       {/* Search & Content */}
       <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-md font-semibold text-gray-900 dark:text-gray-100 flex items-center ">
                <User size={18} className="mr-2 text-primary-500"/>
                All Users ({filteredUsers.length})
              </h2>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full sm:w-64 bg-white dark:bg-dark-primary dark:text-gray-200"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
                <thead className="bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 font-medium border-b border-gray-200 dark:border-gray-600">
                  <tr>
                    <th className="px-4 py-3 w-8"></th>
                    <th className="px-4 py-3">User</th>
                    <th className="px-4 py-3">Role</th>
                    <th className="px-4 py-3">Joined</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <React.Fragment key={user.id}>
                        <tr
                          className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer ${
                            expandedUsers[user.id] ? "bg-gray-50 dark:bg-gray-700" : ""
                          }`}
                          onClick={() => toggleUserRow(user.id)}
                        >
                          <td className="px-4 py-3">
                            {loadingExpanded[user.id] ? (
                              <Loader size={14} className="animate-spin" />
                            ) : expandedUsers[user.id] ? (
                              <ChevronDown size={14} />
                            ) : (
                              <ChevronRight size={14} />
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-xs">
                                {(user.username || "U").charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {user.username}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  {user.email}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            {isSuperAdmin && user.role !== "super_admin" ? (
                              <div className="relative inline-block">
                                <select
                                  value={user.role}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => {
                                    e.stopPropagation();
                                    updateUserRole(user.id, e.target.value);
                                  }}
                                  className={`text-xs font-medium pl-2 pr-6 py-1 rounded-full border-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-gray-800 outline-none cursor-pointer appearance-none ${
                                    user.role === "admin"
                                      ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 focus:ring-purple-500"
                                      : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 focus:ring-blue-500"
                                  }`}
                                >
                                  <option value="student">Student</option>
                                  <option value="admin">Admin</option>
                                </select>
                                <ChevronDown 
                                  size={12} 
                                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none ${
                                     user.role === "admin"
                                      ? "text-purple-800 dark:text-purple-200"
                                      : "text-blue-800 dark:text-blue-200"
                                  }`}
                                />
                              </div>
                            ) : (
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user.role === "admin"
                                    ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                                    : user.role === "super_admin"
                                    ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200"
                                    : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                }`}
                              >
                                {user.role === "super_admin" ? "Super Admin" : user.role}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteUser(user.id, user.username);
                              }}
                              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                              title="Delete User"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                        {expandedUsers[user.id] && (
                          <tr className="bg-gray-50 dark:bg-gray-700">
                            <td colSpan="5" className="px-4 py-3">
                              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                                <div className="bg-white dark:bg-dark-primary p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                                    Documents
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                    {expandedUsers[user.id].documentCount}
                                  </p>
                                </div>
                                <div className="bg-white dark:bg-dark-primary p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                                    Pages
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                    {expandedUsers[user.id].totalPageCount}
                                  </p>
                                </div>
                                <div className="bg-white dark:bg-dark-primary p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                                    Subjects
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                    {expandedUsers[user.id].subjectCount}
                                  </p>
                                </div>
                                <div className="bg-white dark:bg-dark-primary p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                                    Storage
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                    {expandedUsers[user.id].storageUsed}
                                  </p>
                                </div>
                                <div className="bg-white dark:bg-dark-primary p-2 rounded-lg border border-gray-200 dark:border-gray-600">
                                  <p className="text-gray-500 dark:text-gray-400 text-[10px]">
                                    Sessions
                                  </p>
                                  <p className="font-semibold text-gray-900 dark:text-gray-100 text-base">
                                    {expandedUsers[user.id].sessionCount || 0}
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
                        className="px-6 py-8 text-center text-gray-500 dark:text-gray-400"
                      >
                        No users found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredUsers.length > 10 && (
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 text-center">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Showing top results
                </span>
              </div>
            )}
          </div>
          
      {showDeleteConfirm && (
        <ConfirmationDialog
          message={`Are you sure you want to delete user "${userToDelete?.name}"? This action cannot be undone.`}
          onConfirm={confirmDeleteUser}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </div>
  );
};

export default UserManagement;
