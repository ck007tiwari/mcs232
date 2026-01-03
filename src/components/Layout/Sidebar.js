import React from "react";
import { NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  BarChart3,
  MessageCircle,
  User,
  Upload,
  GraduationCap,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const { sidebarOpen, subjects } = useApp();

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/qa-history", icon: MessageCircle, label: "Q&A History" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
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

      <nav className="mt-8">
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
          <>
            <div className="px-4 mt-8">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Subjects
              </h3>
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

            <div className="px-4 mt-8">
              <button className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors">
                <Upload size={16} />
                <span className="text-sm font-medium">Upload PDF</span>
              </button>
            </div>
          </>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
