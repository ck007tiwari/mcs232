import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BookOpen,
  MessageCircle,
  User,
  Users,
  Upload,
  GraduationCap,
  PlusCircle,
  LogOut,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

const Sidebar = () => {
  const {
    sidebarOpen,
    subjects,
    openUploadForm,
    openAddSubjectForm,
    logout,
    isAdmin,
  } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { to: "/dashboard", icon: Home, label: "Dashboard" },
    ...(isAdmin 
      ? [{ to: "/users", icon: Users, label: "Users" }] 
      : [{ to: "/qa", icon: MessageCircle, label: "Q&A" },
        { to: "/subjects", icon: BookOpen, label: "Subjects" },
        
      ]
    ),
    { to: "/profile", icon: User, label: "Profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const isSubjectActive = (subjectId, isActive) => {
    if (isActive) return true;
    
    if (location.pathname.startsWith('/pdf/')) {
      const pdfState = location.state?.pdf;
      const pdfSubjectId = pdfState?.subject || pdfState?.subjectId;
      return String(pdfSubjectId) === String(subjectId);
    }
    
    return false;
  };

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white dark:bg-dark-secondary shadow-lg border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 flex flex-col ${
        sidebarOpen ? "w-64" : "w-16"
      }`}
    >
      <div className={sidebarOpen ? "p-4" : "py-4 px-2"}>
        <div className={`flex items-center space-x-3 ${!sidebarOpen && "justify-center"}`}>
          <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
            <GraduationCap size={24} className="text-white" />
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">ELearn</h1>
              {isAdmin && (
                <span className="text-xs text-primary-600 dark:text-primary-400 font-medium">
                  Admin Panel
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="mt-8 flex-1">
        <div className={sidebarOpen ? "px-4" : "px-2"}>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center space-x-3 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? "bg-primary-50 dark:bg-primary-700 text-primary-700 dark:text-white border-r-2 border-primary-500"
                    : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                } ${sidebarOpen ? "px-3" : "justify-center"}`
              }
            >
              <item.icon size={24} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </NavLink>
          ))}
        </div>

        {sidebarOpen && (
          <div className="px-4 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Subjects
              </h3>
              <button
                onClick={openAddSubjectForm}
                className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
              >
                <PlusCircle size={16} />
              </button>
            </div>
            {subjects.map((subject) => (
              <NavLink
                key={subject.id}
                to={`/subject/${subject.id}`}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg mb-1 transition-colors ${
                    isSubjectActive(subject.id, isActive)
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
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
              onClick={() => openUploadForm()}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors mb-4"
            >
              <Upload size={16} />
              <span className="text-sm font-medium">Upload PDF</span>
            </button>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`w-full flex items-center space-x-3 py-3 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900 dark:hover:bg-opacity-20 transition-colors ${
            sidebarOpen ? "px-3" : "px-1 justify-center"
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
