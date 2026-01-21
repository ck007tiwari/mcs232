import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useApp } from "../../context/AppContext";
import PdfUploadForm from "../PdfUploadForm";
import AddSubjectForm from "../Subject/AddSubjectForm";

const Layout = () => {
  const { sidebarOpen, isUploadFormOpen, isAddSubjectFormOpen } = useApp();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col overflow-hidden ${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}
      >
        <Header />
        <main className="flex-1 overflow-auto p-6 custom-scrollbar">
          <Outlet />
        </main>
      </div>
      {isUploadFormOpen && <PdfUploadForm />}
      {isAddSubjectFormOpen && <AddSubjectForm />}
    </div>
  );
};

export default Layout;
