import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import PdfUpload from '../PDF/PdfUpload';
import {
  Home,
  BookOpen,
  BarChart3,
  MessageCircle,
  User,
  Upload,
  GraduationCap,
  Shield,
  Users,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const { sidebarOpen, subjects, user, isAdmin } = useApp();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    { to: "/qa-history", icon: MessageCircle, label: "Q&A History" },
    { to: "/profile", icon: User, label: "Profile" },
  ];

  // Add admin-specific navigation items
  if (isAdmin()) {
    navItems.push(
      { to: "/admin/users", icon: Users, label: "Manage Users" },
      { to: "/admin/system", icon: Shield, label: "System Admin" }
    );
  }

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white shadow-lg border-r border-gray-200 transition-all duration-300 z-40 ${
        sidebarOpen ? "w-64" : "w-18"
      }`}
    >
      <div className="p-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900">ELearn</h1>
              {isAdmin() && (
                <span className="text-xs text-primary-600 font-medium">
                  Admin Panel
                </span>
              )}
            </div>
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
                `flex items-center space-x-3 px-3 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-primary-50 text-primary-700 border-r-2 border-primary-500"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              <item.icon size={24} />
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
              <button 
                onClick={() => setShowUploadModal(true)}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Upload size={20} />
                <span className="text-sm font-medium">Upload PDF</span>
              </button>
            </div>
          </>
        )}
      </nav>
      
      <PdfUpload 
        isOpen={showUploadModal} 
        onClose={() => setShowUploadModal(false)} 
      />
    </div>
  );
};

export default Sidebar;
