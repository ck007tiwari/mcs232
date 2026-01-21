import React from "react";
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
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import ProgressChart from "./ProgressChart";
import SubjectProgress from "./SubjectProgress";

const Dashboard = () => {
  const { user, subjects, progress, chartData } = useApp();

  // Calculate stats
  const totalPdfs = subjects.reduce(
    (sum, subject) => sum + subject.totalPdfs,
    0,
  );
  const completedPdfs = subjects.reduce(
    (sum, subject) => sum + subject.completedPdfs,
    0,
  );
  const totalPages = subjects.reduce(
    (sum, subject) => sum + subject.totalPages,
    0,
  );
  const readPages = subjects.reduce(
    (sum, subject) => sum + subject.readPages,
    0,
  );
  const totalHours = Math.round(
    progress.reduce((sum, p) => sum + p.totalTimeSpent, 0) / 3600,
  );
  const averageProgress = Math.round((readPages / totalPages) * 100);

  const stats = [
    {
      title: "Total PDFs",
      value: totalPdfs,
      change: "+12%",
      changeType: "positive",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Completed",
      value: completedPdfs,
      change: "+8%",
      changeType: "positive",
      icon: CheckCircle,
      color: "bg-green-500",
    },
    {
      title: "Study Hours",
      value: totalHours,
      change: "+15%",
      changeType: "positive",
      icon: Clock,
      color: "bg-purple-500",
    },
    {
      title: "Progress",
      value: `${averageProgress}%`,
      change: "+5%",
      changeType: "positive",
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
              You've completed {completedPdfs} out of {totalPdfs} PDFs. Keep up
              the great work!
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
                <p
                  className={`text-sm mt-1 ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change} from last week
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
        <ProgressChart
          data={chartData.weeklyProgress}
          title="Weekly Reading Progress"
        />
        <SubjectProgress data={chartData.subjectProgress} />
      </div>

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
              {subjects.map((subject) => (
                <Link
                  key={subject.id}
                  to={`/subject/${subject.id}`}
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
                      {subject.completedPdfs}/{subject.totalPdfs} PDFs
                    </span>
                    <span className="text-gray-500">
                      {Math.round(
                        (subject.readPages / subject.totalPages) * 100,
                      )}
                      % complete
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${
                          (subject.readPages / subject.totalPages) * 100
                        }%`,
                        backgroundColor: subject.color,
                      }}
                    ></div>
                  </div>
                </Link>
              ))}
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
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all group">
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
