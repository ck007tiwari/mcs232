import React, { createContext, useContext, useState } from "react";
import axios from "axios";
import {
  dummySubjects,
  dummyPdfs,
  dummyProgress,
  dummyQuestions,
  dummyChartData,
} from "../data/dummyData";
import API_BASE_URL from "./envVariables";

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

  //signup function
  const signup = async (user) => {
    const { name, email, password, role } = user;
    try {
      const { data } = await axios.post(API_BASE_URL + "/users/register/", {
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
        const { data } = await axios.post(API_BASE_URL + "/users/login/", {
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
        const token = localStorage.getItem("token");
        const { data } = await axios.put(
          API_BASE_URL + "/users/profile/",
          {
            email,
            username,
          },
          { headers: { Authorization: `Bearer ${token}` } },
        );

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
      const token = localStorage.getItem("token");
      await axios.put(
        API_BASE_URL + "/users/change-password/",
        {
          old_password: oldPassword,
          new_password: newPassword,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
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
      const res = await axios.post(
        "http://localhost:5001/api/subjects",
        subject,
      );
      setSubjects((prev) => [...prev, res.data]);
    } catch (error) {
      console.error("Error adding subject:", error);
    }
  };

  const editSubject = async (subjectId, updatedSubject) => {
    console.log("editSubject called but api is pending");
    // try {
    //   const res = await axios.put(
    //     `http://localhost:5001/api/subjects/${subjectId}`,
    //     updatedSubject
    //   );
    //   setSubjects((prev) =>
    //     prev.map((s) => (s.subjectId === subjectId ? res.data : s))
    //   );
    // } catch (error) {
    //   console.error("Error editing subject:", error);
    // }
  };

  const deleteSubject = async (subjectId) => {
    console.log("deleteSubject called but api is pending");
    // try {
    //   await axios.delete(`http://localhost:5001/api/subjects/${subjectId}`);
    //   setSubjects((prev) => prev.filter((s) => s.subjectId !== subjectId));
    // } catch (error) {
    //   console.error("Error deleting subject:", error);
    // }
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

    // Setters
    setCurrentPdf,
    setSidebarOpen,

    // Functions
    showToast,
    hideToast,
    openUploadForm,
    closeUploadForm,
    openAddSubjectForm,
    closeAddSubjectForm,
    signup,
    login,
    logout,
    updateProfile,
    changePassword,
    getPdfsBySubject,
    getProgressByPdf,
    getQuestionsByPdf,
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
