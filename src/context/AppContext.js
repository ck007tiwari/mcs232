import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import api from "./api";
import {
  dummySubjects,
  dummyPdfs,
  dummyProgress,
  dummyQuestions,
  dummyChartData,
} from "../data/dummyData";
import API_BASE_URL from "./envVariables";
import {
  createSubject,
  getSubjects,
  deleteSubjectApi,
  updateSubject,
  uploadPdfToSubject,
  getSubjectById,
} from "./subjectApi";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || {},
  );
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );
  const [subjects, setSubjects] = useState(dummySubjects);
  const [pdfs, setPdfs] = useState(dummyPdfs);
  const [progress, setProgress] = useState(dummyProgress);
  const [questions, setQuestions] = useState(dummyQuestions);
  const [chartData] = useState(dummyChartData);
  const [currentPdf, setCurrentPdf] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isUploadFormOpen, setUploadFormOpen] = useState(false);
  const [isAddSubjectFormOpen, setAddSubjectFormOpen] = useState(false);
  const [uploadSubjectId, setUploadSubjectId] = useState(null);
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "info",
  });

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
  };

  const hideToast = () => {
    setToast({ show: false, message: "", type: "info" });
  };

  const openUploadForm = (subjectId = null) => {
    setUploadSubjectId(subjectId);
    setUploadFormOpen(true);
  };
  const closeUploadForm = () => {
    setUploadFormOpen(false);
    setUploadSubjectId(null);
  };
  const openAddSubjectForm = () => setAddSubjectFormOpen(true);
  const closeAddSubjectForm = () => setAddSubjectFormOpen(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (isAuthenticated) {
        try {
          const data = await getSubjects();
          setSubjects(data);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      }
    };
    fetchSubjects();
  }, [isAuthenticated]);

  //signup function
  const signup = async (user) => {
    const { name, email, password, role } = user;
    try {
      const { data } = await api.post("/users/register/", {
        username: name,
        email,
        password,
        role,
      });
      console.log("response from backend:", data);
      if (!data || !data.access) {
        throw new Error("Invalid response from server");
      }
      const updatedUser = { ...data.user, name: data.user.username };
      delete updatedUser.username;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      localStorage.setItem("token", data.access);
      localStorage.setItem("refresh", data.refresh);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Signup failed:", error);
      setIsAuthenticated(false);
      return false;
    }
  };

  // Authentication functions
  const login = async (email, password) => {
    if (email && password) {
      try {
        const { data } = await api.post("/users/login/", {
          email,
          password,
        });
        if (!data || !data.access) {
          throw new Error("Invalid response from server");
        }

        const updatedUser = { ...data.user, name: data.user.username };
        delete updatedUser.username;

        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        localStorage.setItem("token", data.access);
        localStorage.setItem("refresh", data.refresh);
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        setIsAuthenticated(false);
        return false;
      }
    }
    return false;
  };

  // update user profile email and name function
  const updateProfile = async (email, username) => {
    if (email && username) {
      try {
        const { data } = await api.put("/users/profile/", {
          email,
          username,
        });

        if (!data) {
          throw new Error("Invalid response from server");
        }

        const updatedUser = { ...data, name: data.username };
        delete updatedUser.username;
        showToast("Profile updated successfully", "success");
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } catch (error) {
        console.error("Update profile failed:", error);
        showToast("Failed to update profile", "error");
      }
    }
  };

  // Change password function
  const changePassword = async (oldPassword, newPassword) => {
    try {
      await api.put("/users/change-password/", {
        old_password: oldPassword,
        new_password: newPassword,
      });
      showToast("Password changed successfully", "success");
      // it should return to login page after password change and logout user
      logout();
      return true;
    } catch (error) {
      console.error("Change password failed:", error);
      showToast(
        error.response?.data?.message || "Failed to change password",
        "error",
      );
      return false;
    }
  };

  const logout = () => {
    toast.info("You have been logged out. See you soon!", {
      icon: "👋",
    });
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  };

  // PDF functions
  const getPdfsBySubject = (subjectId) => {
    return pdfs.filter((pdf) => pdf.subjectId === subjectId);
  };

  const getProgressByPdf = (pdfId) => {
    return progress.find((p) => p.pdfId === pdfId);
  };

  const getQuestionsByPdf = (pdfId) => {
    return questions.filter((q) => q.pdfId === pdfId);
  };

  const addPdf = (pdf) => {
    setPdfs((prev) => [...prev, pdf]);
  };

  const deletePdf = (pdfId) => {
    setPdfs((prev) => prev.filter((p) => p.pdfId !== pdfId));
  };

  const addSubject = async (subject) => {
    try {
      const data = await createSubject(subject);

      setSubjects((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error("Error adding subject:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add subject",
      };
    }
  };

  const editSubject = async (subjectId, updatedSubject) => {
    try {
      const data = await updateSubject(subjectId, updatedSubject);
      setSubjects((prev) => prev.map((s) => (s.id === subjectId ? data : s)));
      return { success: true };
    } catch (error) {
      console.error("Error updating subject:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to update subject",
      };
    }
  };

  const deleteSubject = async (subjectId) => {
    try {
      console.log(subjectId);
      await deleteSubjectApi(subjectId);
      setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  const uploadPdf = async (pdfData) => {
    try {
      const data = await uploadPdfToSubject(pdfData);
      setPdfs((prev) => [...prev, data]);
      return { success: true };
    } catch (error) {
      console.error("Error uploading PDF:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to upload PDF",
      };
    }
  };

  const getSubjectDetails = async (subjectId) => {
    try {
      const data = await getSubjectById(subjectId);
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch subject",
      };
    }
  };

  // Progress functions
  const updateProgress = (pdfId, newProgress) => {
    setProgress((prev) =>
      prev.map((p) => (p.pdfId === pdfId ? { ...p, ...newProgress } : p)),
    );
  };

  // Question functions
  const askQuestion = async (pdfId, questionText, pageContext) => {
    const newQuestion = {
      questionId: `q_${Date.now()}`,
      userId: user.userId,
      pdfId,
      questionText,
      answerText:
        "This is a simulated AI response. In the real application, this would be generated by the AI service based on the PDF content and context.",
      pageContext,
      confidenceScore: 0.85 + Math.random() * 0.15,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post("http://localhost:5000/api/qa", {
        pdfId,
        questionText,
        pageContext,
      });
      newQuestion.answerText = res.data.answerText;
      newQuestion.confidenceScore = res.data.confidenceScore;
    } catch (error) {
      console.error("Error asking question:", error);
      newQuestion.answerText =
        "Sorry, I encountered an error trying to answer your question.";
    }

    setQuestions((prev) => [newQuestion, ...prev]);
    return newQuestion;
  };

  // Helper function to check admin permissions
  const isAdmin = () => user?.role === "admin";

  // Get all PDFs for admin (used in admin dashboard)
  const getAllPdfs = () => {
    return pdfs;
  };

  const value = {
    // State
    user,
    isAuthenticated,
    subjects,
    pdfs,
    progress,
    questions,
    chartData,
    currentPdf,
    sidebarOpen,
    isUploadFormOpen,
    isAddSubjectFormOpen,
    uploadSubjectId,
    toast,
    //files
    uploadPdf,

    // Setters
    setCurrentPdf,
    setSidebarOpen,

    // users
    login,
    signup,
    logout,
    updateProfile,
    changePassword,

    // Functions
    showToast,
    hideToast,
    openUploadForm,
    closeUploadForm,
    openAddSubjectForm,
    closeAddSubjectForm,

    // PDFs
    getPdfsBySubject,
    getProgressByPdf,
    getQuestionsByPdf,
    getSubjectDetails,
    addPdf,
    deletePdf,
    addSubject,
    editSubject,
    deleteSubject,
    updateProgress,
    askQuestion,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
