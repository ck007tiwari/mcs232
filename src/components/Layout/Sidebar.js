import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  BookOpen,
  MessageCircle,
  User,
  Upload,
  GraduationCap,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const { sidebarOpen, subjects, openUploadForm, openAddSubjectForm, logout } =
    useApp();
  const navigate = useNavigate();

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/subjects", icon: BookOpen, label: "Subjects" },
    { to: "/qa", icon: MessageCircle, label: "Q&A" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 flex flex-col ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={20} className="text-white" />
          </div>
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-900">ELearn</h1>
          )}
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <div className="px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-100"
                } ${sidebarOpen ? "px-3" : "justify-center"}`
              }
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {sidebarOpen && (
          <div className="px-4 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Subjects
              </h3>
              <button
                onClick={openAddSubjectForm}
                className="text-gray-500 hover:text-primary-500"
              >
                <PlusCircle size={16} />
              </button>
            </div>
            {subjects.map((subject) => (
              <NavLink
                key={subject.subjectId}
                to={`/subject/${subject.subjectId}`}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                    isActive
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50"
                  }`
                }
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: subject.color }}
                ></div>
                <span className="text-sm">{subject.name}</span>
              </NavLink>
            ))}
          </div>
        )}
      </nav>

      <div className="p-4">
        {sidebarOpen && (
          <div className="px-4 mt-8">
            <button
              onClick={openUploadForm}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mb-4"
            >
              <Upload size={16} />
              <span className="text-sm font-medium">Upload PDF</span>
            </button>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors ${
            sidebarOpen ? "px-3" : "justify-center"
          }`}
        >
          <LogOut size={20} />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};


export default Sidebar;
