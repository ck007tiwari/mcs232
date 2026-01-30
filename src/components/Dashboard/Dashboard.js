import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Clock,
  TrendingUp,
  Users,
  ArrowRight,
  Play,
  CheckCircle,
  MessageCircle,
  Upload,
  Loader,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import WeeklyProgressChart from "./WeeklyProgressChart";
import SubjectProgress from "./SubjectProgress";
import RecentFiles from "./RecentFiles";
import FileProgressChart from "./FileProgressChart";

const generateColors = (numColors) => {
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const hue = (i * 360) / numColors;
    colors.push(`hsl(${hue}, 70%, 50%)`);
  }
  return colors;
};

const Dashboard = () => {
  const { user, subjects, openUploadForm, getDashboardStats } = useApp();
  const [loading, setLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [weeklyProgress, setWeeklyProgress] = useState([]);
  const [subjectBreakdown, setSubjectBreakdown] = useState([]);
  const [subjectFiles, setSubjectFiles] = useState([]);
  const [maxMinutes, setMaxMinutes] = useState(60);

  const weeklyProgressChartConfig = useMemo(
    () => ({
      labels: Array.isArray(weeklyProgress)
        ? weeklyProgress.map((item) => item.day)
        : [],
      datasets: [
        {
          label: "Minutes",
          data: Array.isArray(weeklyProgress)
            ? weeklyProgress.map((item) => item.minutes)
            : [],
          backgroundColor: "rgba(99, 102, 241, 0.8)",
          borderColor: "rgb(99, 102, 241)",
          borderWidth: 1,
        },
      ],
    }),
    [weeklyProgress],
  );

  const subjectBreakdownChartConfig = useMemo(
    () => ({
      labels: Array.isArray(subjectBreakdown)
        ? subjectBreakdown.map((item) => item.name)
        : [],
      datasets: [
        {
          label: "Hours Read",
          data: Array.isArray(subjectBreakdown)
            ? subjectBreakdown.map((item) => item.hours_read)
            : [],
          backgroundColor: generateColors(subjectBreakdown.length),
        },
      ],
    }),
    [subjectBreakdown],
  );

  const filesWithSubjectNames = useMemo(() => {
    if (!subjectFiles.length || !subjects.length) {
      return [];
    }
    return subjectFiles.map(file => {
      const subject = subjects.find(s => s.id === file.subject);
      return {
        ...file,
        subjectName: subject ? subject.name : 'Unknown Subject',
      };
    });
  }, [subjectFiles, subjects]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const stats = await getDashboardStats();
        if (stats) {
          setDashboardStats(stats.overview);
          if (stats.weekly_progress && Array.isArray(stats.weekly_progress)) {
            setWeeklyProgress(stats.weekly_progress);
            const maxMinutes = Math.max(
              0,
              ...stats.weekly_progress.map((item) => item.minutes || 0),
            );
            setMaxMinutes(maxMinutes > 0 ? maxMinutes : 60);
          } else {
            setWeeklyProgress([]);
          }
          if (stats.subject_breakdown) {
            setSubjectBreakdown(stats.subject_breakdown);
          }
          if (stats.subject_files) {
            setSubjectFiles(stats.subject_files);
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [getDashboardStats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader className="animate-spin text-primary-600" size={48} />
      </div>
    );
  }

  const stats = [
    {
      title: "Total PDFs",
      value: dashboardStats?.total_files || 0,
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: dashboardStats?.total_completed_files || 0,
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Study Hours",
      value: dashboardStats?.total_hours_read?.toFixed(2) || 0,
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      title: "Progress",
      value: `${dashboardStats?.average_progress?.toFixed(2) || 0}%`,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100">
              You've completed {dashboardStats?.total_completed_files || 0} out
              of {dashboardStats?.total_files || 0} PDFs. Keep up the great
              work!
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <BookOpen size={40} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}
              >
                <stat.icon size={24} className="text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeeklyProgressChart
          data={weeklyProgressChartConfig}
          title="Weekly Reading Progress (minutes)"
          yAxisMax={maxMinutes}
        />
        <SubjectProgress data={subjectBreakdownChartConfig} />
      </div>

      {/* File Progress and Recent Files */}
      {subjectFiles.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <FileProgressChart files={filesWithSubjectNames} />
          <RecentFiles files={filesWithSubjectNames} />
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subjects Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Your Subjects
              </h2>
              <Link
                to="/subjects"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjects.map((subject, index) => {
                const files = subject.files || [];
                const totalPages =
                  Number(subject.totalPages) ||
                  files.reduce((acc, f) => acc + (f.page_count || 0), 0);
                const readPages =
                  Number(subject.readPages) ||
                  files.reduce((acc, f) => acc + (f.page_read || 0), 0);
                const totalPdfs =
                  subject.totalPdfs || subject.file_count || files.length || 0;
                const completedPdfs =
                  subject.completedPdfs ||
                  files.filter(
                    (f) => (f.read_percentage === 100),
                  ).length;

                const subjectProgress =
                  totalPages > 0
                    ? Math.round((readPages / totalPages) * 100)
                    : 0;
                const subjectId = subject.subjectId || subject.id;

                return (
                  <Link
                    key={`${subjectId || "sub"}-${index}`}
                    to={`/subject/${subjectId}`}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        ></div>
                        <h3 className="font-medium text-gray-900 group-hover:text-primary-600">
                          {subject.name}
                        </h3>
                      </div>
                      <Play
                        size={16}
                        className="text-gray-400 group-hover:text-primary-500"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {subject.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">
                        {completedPdfs}/{totalPdfs} PDFs
                      </span>
                      <span className="text-gray-500">
                        {subjectProgress}% complete
                      </span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="h-2 rounded-full transition-all"
                        style={{
                          width: `${subjectProgress}%`,
                          backgroundColor: subject.color,
                        }}
                      ></div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => openUploadForm(true)}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center group-hover:bg-primary-200">
              <Upload size={20} className="text-primary-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Upload PDF</h3>
              <p className="text-sm text-gray-600">Add new study material</p>
            </div>
          </button>

          <Link
            to="/qa-history"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200">
              <MessageCircle size={20} className="text-green-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">Ask Question</h3>
              <p className="text-sm text-gray-600">Get AI-powered answers</p>
            </div>
          </Link>

          <Link
            to="/profile"
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200">
              <Users size={20} className="text-purple-600" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-gray-900">View Profile</h3>
              <p className="text-sm text-gray-600">Manage your account</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
