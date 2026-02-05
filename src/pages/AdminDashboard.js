import React, { useState, useMemo } from "react";
import {
  Users,
  FileText,
  MessageCircle,
  BookOpen,
  ArrowRight,
  Activity,
  Shield
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/Admin/StatsCard";

const AdminDashboard = () => {
  const {
    allUsers,
    getAllUsers,
    getDashboardStats,
    subjects,
    isAdmin,
    isSuperAdmin,
  } = useApp();
  const navigate = useNavigate();
  const [dashboardStats, setDashboardStats] = useState(null);

  React.useEffect(() => {
    const fetchStats = async () => {
      if (isAdmin) {
        const stats = await getDashboardStats();
        if (stats) {
          setDashboardStats(stats.overview);
        }
      }
    };
    fetchStats();
  }, [isAdmin, getDashboardStats]);

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-full mb-4">
          <Shield size={48} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Access Denied</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-2 max-w-md">
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

  // Aggregate stats
  const totalUsers = allUsers.length;
  // If stats are fetched from backend use those, otherwise fallback to local calculation
  const totalPdfs = dashboardStats?.total_files ?? subjects.reduce((acc, sub) => acc + (sub.files?.length || 0), 0);
  const totalQuestions = dashboardStats?.total_questions ?? 0;
  const totalSubjects = subjects.length;

  return (
    <div className="space-y-6 p-4 max-w-full mx-auto animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
             Admin Dashboard
             {isSuperAdmin && <span className="ml-3 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-medium">Super Admin</span>}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Overview of system performance and content management
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/subjects")}
            className="flex items-center space-x-2 bg-white dark:bg-dark-secondary border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
          >
            <BookOpen size={16} />
            <span>Manage Subjects</span>
          </button>
           <button
            onClick={() => navigate("/users")}
            className="flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white px-3 py-1.5 rounded-lg transition-colors text-sm shadow-sm"
          >
            <Users size={16} />
            <span>Manage Users</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Quick Actions / Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
        {/* User Management Card */}
        <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
                    <Users size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">User Management</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    View, manage, and update user roles. Monitor detailed statistics per user.
                </p>
            </div>
            <button 
                onClick={() => navigate('/users')}
                className="w-full py-2 px-4 bg-gray-50 dark:bg-dark-primary border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors flex items-center justify-center group"
            >
                View All Users <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
            </button>
        </div>

         {/* System Health / Activity (Placeholder for future) */}
         <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mb-4 text-green-600 dark:text-green-400">
                    <Activity size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">System Activity</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    Review recent system logs, performance metrics, and activity reports.
                </p>
            </div>
             <button 
                className="w-full py-2 px-4 bg-gray-50 dark:bg-dark-primary border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium text-gray-400 cursor-not-allowed flex items-center justify-center"
            >
                Coming Soon
            </button>
        </div>

        {/* Recent Uploads (Right Column) */}
        <div className="space-y-4">
          <div className="bg-white dark:bg-dark-secondary rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden h-full">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-md font-semibold text-gray-900 dark:text-gray-100">
                Recent Uploads (All Users)
              </h2>
            </div>
            {/* Logic for recent uploads would ideally need to be fetched separately or assume 'subjects' contains everything if admin fetches all subjects. 
                For now we keep the existing logic if 'allPdfs' was available, but we removed it from hook destructuring above. 
                Let's assume we want to keep it simple or re-add logic if needed. 
                Since we extracted user table, let's keep this clean.
            */}
             <div className="p-6 text-center text-gray-500 dark:text-gray-400 text-sm">
                  View 'Manage Subjects' to see all files.
            </div>
             <div className="p-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center mt-auto">
              <button
                onClick={() => navigate("/subjects")}
                className="text-sm text-primary-600 dark:text-primary-400 font-medium hover:text-primary-700 dark:hover:text-primary-300 flex items-center justify-center mx-auto"
              >
                View All Files <ArrowRight size={14} className="ml-1" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
