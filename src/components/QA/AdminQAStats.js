import React, { useState } from "react";
import { Search, Users, HelpCircle, BookOpen } from "lucide-react";

const AdminQAStats = ({ stats, onUserSelect }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const users = stats?.users_qa_stats || [];
  const filteredUsers = users.filter(
    (user) =>
      user.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.user_email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="admin-stats-grid">
        <div className="stat-card">
          <div className="icon users">
            <Users size={24} />
          </div>
          <div className="stat-card-info">
            <h2 className="dark:text-gray-100">{stats?.total_users || 0}</h2>
            <p className="dark:text-gray-400">Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon questions">
            <HelpCircle size={24} />
          </div>
          <div className="stat-card-info">
            <h2 className="dark:text-gray-100">{stats?.total_questions || 0}</h2>
            <p className="dark:text-gray-400">Total Questions</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="icon subjects">
            <BookOpen size={24} />
          </div>
          <div className="stat-card-info">
            <h2 className="dark:text-gray-100">{stats?.total_subjects || 0}</h2>
            <p className="dark:text-gray-400">Total Subjects</p>
          </div>
        </div>
      </div>

      <div className="user-qa-table-container">
        <div className="user-qa-table-header">
          <h2 className="dark:text-gray-100">User Q&A Activity</h2>
        </div>
        <div className="user-qa-table-filters">
          <div className="search-input">
            <Search size={18} className="icon" />
            <input
              type="text"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-dark-primary dark:text-gray-200"
            />
          </div>
        </div>
        <table className="user-qa-table">
          <thead>
            <tr>
              <th className="dark:text-gray-300">User</th>
              <th className="questions-count dark:text-gray-300">Questions</th>
              <th className="subjects-count dark:text-gray-300">Subjects</th>
              <th className="last-active dark:text-gray-300">Last Active</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.user_id}>
                <td>
                  <div className="user-info">
                    <img
                      src={`https://ui-avatars.com/api/?name=${user.user_name}&background=random`}
                      alt={user.user_name}
                    />
                    <div className="dark:text-gray-200">
                      {user.user_name}
                      <br />
                      <span className="dark:text-gray-400">{user.user_email}</span>
                    </div>
                  </div>
                </td>
                <td className="questions-count dark:text-gray-200">{user.questions_count}</td>
                <td className="subjects-count dark:text-gray-200">{user.subjects_count}</td>
                <td className="last-active dark:text-gray-400">{formatDate(user.last_active)}</td>
                <td>
                  <span
                    className="view-details-btn"
                    onClick={() => onUserSelect(user.user_id)}
                  >
                    View Details
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminQAStats;
