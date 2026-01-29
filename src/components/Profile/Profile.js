import React, { useEffect, useState, useMemo } from "react";
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Clock,
  Trophy,
  Edit,
  Save,
  X,
  ArrowLeft,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, subjects, updateProfile, changePassword, showToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    console.log("user", user);
  }, [user]);

  useEffect(() => {
    setImgError(false);
  }, [user?.avatar]);

  // Calculate stats per subject
  const subjectStats = useMemo(() => {
    if (!subjects) return [];
    return subjects.map((subject) => {
      const files = subject.files || [];
      const totalPdfs = files.length;
      const completedPdfs = files.filter(
        (f) => Number(f.read_percentage) === 100,
      ).length;
      const readPages = files.reduce(
        (acc, f) => acc + (Number(f.page_read) || 0),
        0,
      );
      const totalPages = files.reduce(
        (acc, f) => acc + (Number(f.page_count) || 0),
        0,
      );
      const timeSpent = files.reduce(
        (acc, f) => acc + (Number(f.total_time_spent) || 0),
        0,
      );

      return {
        ...subject,
        calculatedStats: {
          totalPdfs,
          completedPdfs,
          readPages,
          totalPages,
          timeSpent,
          progress: totalPages > 0 ? (readPages / totalPages) * 100 : 0,
        },
      };
    });
  }, [subjects]);

  // Calculate global stats
  const globalStats = useMemo(() => {
    return subjectStats.reduce(
      (acc, subject) => {
        const stats = subject.calculatedStats;
        return {
          totalPdfs: acc.totalPdfs + stats.totalPdfs,
          completedPdfs: acc.completedPdfs + stats.completedPdfs,
          readPages: acc.readPages + stats.readPages,
          timeSpent: acc.timeSpent + stats.timeSpent,
        };
      },
      { totalPdfs: 0, completedPdfs: 0, readPages: 0, timeSpent: 0 },
    );
  }, [subjectStats]);

  const handleSave = () => {
    updateProfile(formData.email, formData.name);
    setIsEditing(false);
  };

  const handleChangePassword = async () => {
    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      showToast("Please fill all password fields", "error");
      return;
    }

    // check old password and new password are not the same
    if (passwordData.currentPassword === passwordData.newPassword) {
      showToast("New password cannot be the same as current password", "error");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }

    const success = await changePassword(
      passwordData.currentPassword,
      passwordData.newPassword,
    );
    if (success) {
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
    });
    setIsEditing(false);
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">
            Manage your account and view your learning progress
          </p>
        </div>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-6 py-8">
          <div className="flex items-center space-x-4">
            {user?.avatar && !imgError ? (
              <img
                src={user?.avatar}
                alt={user?.name}
                className="w-20 h-20 rounded-full border-4 border-white object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-20 h-20 rounded-full border-4 border-white bg-white/20 flex items-center justify-center text-white">
                {user?.name ? (
                  <span className="text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                ) : (
                  <User size={40} />
                )}
              </div>
            )}
            <div className="text-white">
              <h2 className="text-2xl font-bold">{user?.name}</h2>
              <p className="text-primary-100">{user?.email}</p>
              <p className="text-primary-100 text-sm mt-1">
                Member since:{" "}
                {user?.created_at || user?.createdAt
                  ? new Date(
                      user?.created_at || user?.createdAt,
                    ).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h3>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
              >
                <Edit size={16} />
                <span>Edit</span>
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600"
                >
                  <Save size={14} />
                  <span>Save</span>
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 px-3 py-1"
                >
                  <X size={14} />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <User size={16} className="text-gray-500" />
                  <span className="text-gray-900">{user?.name}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                  <Mail size={16} className="text-gray-500" />
                  <span className="text-gray-900">{user?.email}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Trophy size={16} className="text-gray-500" />
                <span className="text-gray-900 capitalize">{user?.role}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Join Date
              </label>
              <div className="flex items-center space-x-2 px-3 py-2 bg-gray-50 rounded-lg">
                <Calendar size={16} className="text-gray-500" />
                <span className="text-gray-900">
                  {new Date(user?.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              {!isChangingPassword ? (
                <button
                  onClick={() => setIsChangingPassword(true)}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Lock size={16} />
                  <span>Change Password</span>
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleChangePassword}
                    className="flex items-center space-x-1 bg-primary-500 text-white px-3 py-1 rounded-lg hover:bg-primary-600"
                  >
                    <Save size={14} />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsChangingPassword(false);
                      setPasswordData({
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      });
                    }}
                    className="flex items-center space-x-1 text-gray-600 hover:text-gray-700 px-3 py-1"
                  >
                    <X size={14} />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>

            {isChangingPassword && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          currentPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("current")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.current ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          newPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("new")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.new ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) =>
                        setPasswordData({
                          ...passwordData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => togglePasswordVisibility("confirm")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPasswords.confirm ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Stats */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Learning Statistics
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-blue-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats.totalPdfs}
              </p>
              <p className="text-sm text-gray-600">Total PDFs</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trophy size={24} className="text-green-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats.completedPdfs}
              </p>
              <p className="text-sm text-gray-600">Completed</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-purple-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(globalStats.timeSpent / 60)}
              </p>
              <p className="text-sm text-gray-600">Hours Studied</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-orange-600" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {globalStats.readPages}
              </p>
              <p className="text-sm text-gray-600">Pages Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subject Progress */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Subject Progress
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {subjectStats.map((subject) => {
              const stats = subject.calculatedStats;
              return (
                <div key={subject.id || subject.subjectId}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: subject.color || "#4f46e5" }}
                      ></div>
                      <span className="font-medium text-gray-900">
                        {subject.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {Math.round(stats.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${stats.progress}%`,
                        backgroundColor: subject.color || "#4f46e5",
                      }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>
                      {stats.completedPdfs}/{stats.totalPdfs} PDFs
                    </span>
                    <span>
                      {stats.readPages}/{stats.totalPages} pages
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
