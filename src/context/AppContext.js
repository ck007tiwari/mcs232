import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import api from "./api";

import {
  createSubject,
  getSubjects,
  deleteSubjectApi,
  updateSubject,
  uploadPdfToSubject,
  getSubjectById,
  updatePdfProgress,
  getPdfProgress,
  deletePdfFromSubject,
  updateSubjectFile,
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
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
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
  const [subjectUpdateTrigger, setSubjectUpdateTrigger] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast({ show: false, message: "", type: "info" });
  }, []);

  const openUploadForm = useCallback((subjectId = null) => {
    setUploadSubjectId(subjectId);
    setUploadFormOpen(true);
  }, []);

  const closeUploadForm = useCallback(() => {
    setUploadFormOpen(false);
    setUploadSubjectId(null);
  }, []);

  const openAddSubjectForm = useCallback(() => setAddSubjectFormOpen(true), []);
  const closeAddSubjectForm = useCallback(
    () => setAddSubjectFormOpen(false),
    [],
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refresh");
  }, []);

  // Fetch subjects from backend
  const fetchSubjects = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const { data } = await getSubjects();
        setSubjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching subjects:", error);
      }
    }
  }, [isAuthenticated]);

  const getAllUsers = useCallback(async () => {
    if (user?.role === "admin" || user?.role === "super_admin") {
      try {
        const { data } = await api.get("/users/");
        setAllUsers(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    }
  }, [user]);

  useEffect(() => {
    if (isAuthenticated && fetchSubjects) {
      fetchSubjects();
    }
  }, [fetchSubjects, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && (user?.role === "admin" || user?.role === "super_admin")) {
      getAllUsers();
    }
  }, [isAuthenticated, user, getAllUsers]);

  //signup function
  const signup = useCallback(async (user) => {
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
  }, []);

  // Authentication functions
  const login = useCallback(async (email, password) => {
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
        return { success: true };
      } catch (error) {
        console.error("Login failed:", error);
        setIsAuthenticated(false);
        return {
          success: false,
          message:
            error.response?.data?.detail ||
            error.response?.data?.message ||
            "Invalid email or password",
        };
      }
    }
    return { success: false, message: "Email and password are required" };
  }, []);

  // update user profile email and name function
  const updateProfile = useCallback(
    async (email, username) => {
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
    },
    [showToast],
  );

  // Change password function
  const changePassword = useCallback(
    async (oldPassword, newPassword) => {
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
    },
    [logout, showToast],
  );

  const addSubject = useCallback(
    async (subject) => {
      try {
        const { data, status } = await createSubject(subject);
        if (status !== 201 && status !== 200) {
          showToast("Failed to add subject", "error");
          return { success: false, message: "Failed to add subject" };
        }
        await fetchSubjects();
        showToast(data?.message || "Subject added successfully", "success");
        return { success: true, data };
      } catch (error) {
        console.error("Error adding subject:", error);
        const errMsg =
          error.response?.data?.name?.[0] ||
          error.response?.data?.color?.[0] ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to add subject";
        showToast(errMsg, "error");
        return {
          success: false,
          message: errMsg,
        };
      }
    },
    [fetchSubjects, showToast],
  );

  const editSubject = useCallback(
    async (subjectId, updatedSubject) => {
      try {
        const { data, status } = await updateSubject(subjectId, updatedSubject);
        if (status !== 200 && status !== 201) {
          showToast("Failed to update subject", "error");
          return { success: false, message: "Failed to update subject" };
        }
        await fetchSubjects();
        showToast("Subject updated successfully", "success");
        return { success: true, data };
      } catch (error) {
        console.error("Error updating subject:", error);
        const errMsg =
          error.response?.data?.name?.[0] ||
          error.response?.data?.color?.[0] ||
          error.response?.data?.message ||
          error.response?.data?.detail ||
          "Failed to update subject";
        showToast(errMsg, "error");
        return {
          success: false,
          message: errMsg,
        };
      }
    },
    [fetchSubjects, showToast],
  );

  const deleteSubject = useCallback(
    async (subjectId, options = {}) => {
      try {
        const { status } = await deleteSubjectApi(subjectId, options?.deleteAll);
        if (status !== 204 && status !== 200) {
          showToast("Failed to delete subject", "error");
          return { success: false };
        }
        showToast("Subject deleted successfully", "success");
        await fetchSubjects();
        return { success: true };
      } catch (error) {
        console.error("Error deleting subject:", error);
        showToast(error.response?.data?.detail || "Failed to delete subject", "error");
        return { success: false };
      }
    },
    [fetchSubjects, showToast],
  );

  const getSubjectDetails = useCallback(async (subjectId) => {
    try {
      const { data, status } = await getSubjectById(subjectId);
      if (status !== 200) {
        return showToast("Failed to fetch subject details", "error");
      }
      return { success: true, data };
    } catch (error) {
      console.error("Error fetching subject details:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Failed to fetch subject",
      };
    }
  }, []);

  const uploadPdf = useCallback(
    async (pdfData) => {
      try {
        const { status } = await uploadPdfToSubject(pdfData);
        if (status !== 201) {
          return showToast("Failed to upload PDF", "error");
        }
        showToast("PDF uploaded successfully", "success");
        setSubjectUpdateTrigger((prev) => prev + 1);
        return { success: true };
      } catch (error) {
        console.error("Error uploading PDF:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to upload PDF",
        };
      }
    },
    [fetchSubjects, showToast],
  );

  const deletePdf = useCallback(
    async (pdfId, subjectId) => {
      try {
        const { status } = await deletePdfFromSubject(pdfId);
        if (status !== 204) {
          return showToast("Failed to delete PDF", "error");
        }
        showToast("PDF deleted successfully", "success");
        fetchSubjects();
        return { success: true };
      } catch (error) {
        console.error("Error deleting PDF:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to delete PDF",
        };
      }
    },
    [fetchSubjects, showToast],
  );

  const editPdf = useCallback(
    async (pdfId, pdfData) => {
      try {
        const { status, data } = await updateSubjectFile(pdfId, pdfData);
        if (status !== 200 && status !== 201) {
          showToast("Failed to update PDF", "error");
          return { success: false, message: "Failed to update PDF" };
        }
        showToast("PDF updated successfully", "success");
        fetchSubjects();
        setSubjectUpdateTrigger((prev) => prev + 1);
        return { success: true, data };
      } catch (error) {
        console.error("Error updating PDF:", error);
        const errMsg =
          error.response?.data?.error ||
          error.response?.data?.title?.[0] ||
          error.response?.data?.detail ||
          "Failed to update PDF";
        showToast(errMsg, "error");
        return { success: false, message: errMsg };
      }
    },
    [fetchSubjects, showToast],
  );

  const deleteUser = useCallback(
    async (userId) => {
      try {
        await api.delete(`/users/${userId}/`);
        showToast("User deleted successfully", "success");
        if (userId === user?.id) {
          logout();
        } else {
          getAllUsers();
        }
        return { success: true };
      } catch (error) {
        console.error("Error deleting user:", error);
        const errMsg =
          error.response?.data?.error ||
          error.response?.data?.detail ||
          "Failed to delete user";
        showToast(errMsg, "error");
        return { success: false, message: errMsg };
      }
    },
    [getAllUsers, showToast, user, logout],
  );

  const getUserStats = useCallback(async (userId) => {
    try {
      const { data } = await api.get(`/users/${userId}/stats/`);
      return data;
    } catch (error) {
      console.error("Error fetching user stats:", error);
      return null;
    }
  }, []);

  const getDashboardStats = useCallback(async () => {
    try {
      const { data } = await api.get("/users/dashboard/stats/");
      return data;
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return null;
    }
  }, []);

  // Progress functions
  const updateProgress = useCallback(async (pdfId, newProgress) => {
    try {
      const { status } = await updatePdfProgress(pdfId, newProgress);

      if (status !== 200) {
        return showToast("Failed to update progress", "error");
      }
      fetchSubjects();
    } catch (error) {
      console.error("Error saving progress:", error);
    }
  }, []);

  // get file progress function
  const getFileProgress = useCallback(async (pdfId) => {
    try {
      return await getPdfProgress(pdfId);
    } catch (error) {
      console.error("Error fetching file progress:", error);
      return null;
    }
  }, []);

  // Question functions
  const askQuestion = useCallback(
    async (pdfId, questionText, pageContext) => {
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
        const res = await api.post("/users/qa/", {
          pdfId,
          pdfID: pdfId,
          questionText,
          question: questionText,
          pageContext,
          pageNumber: pageContext,
        });
        newQuestion.answerText = res.data.answerText || res.data.answer;
        newQuestion.confidenceScore = res.data.confidenceScore ?? res.data.confidence ?? 0.95;
      } catch (error) {
        console.error("Error asking question:", error);
        const serverError = error.response?.data?.error || error.response?.data?.answerText;
        newQuestion.answerText = serverError
          ? `Error: ${serverError}`
          : "Sorry, I encountered an error trying to answer your question.";
      }

      setQuestions((prev) => [newQuestion, ...prev]);
      return newQuestion;
    },
    [user],
  );

  const updateUserRole = useCallback(
    async (userId, newRole) => {
      try {
        await api.put(`/users/${userId}/role/`, { role: newRole });
        showToast("User role updated successfully", "success");
        getAllUsers();
        return { success: true };
      } catch (error) {
        console.error("Error updating user role:", error);
        showToast(error.response?.data?.error || "Failed to update user role", "error");
        return { success: false };
      }
    },
    [getAllUsers, showToast]
  );

  const isAdmin = useMemo(() => user?.role === "admin" || user?.role === "super_admin", [user]);
  const isSuperAdmin = useMemo(() => user?.role === "super_admin", [user]);

  const value = useMemo(
    () => ({
      // State
      user,
      isAuthenticated,
      subjects,
      isAdmin,
      isSuperAdmin,
      questions,
      currentPdf,
      sidebarOpen,
      isUploadFormOpen,
      isAddSubjectFormOpen,
      uploadSubjectId,
      toast,
      subjectUpdateTrigger,
      searchQuery,
      setSearchQuery,
      allUsers,
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
      updateUserRole,

      // Functions
      showToast,
      hideToast,
      openUploadForm,
      closeUploadForm,
      openAddSubjectForm,
      closeAddSubjectForm,

      // PDFs
      getSubjectDetails,
      addSubject,
      editSubject,
      deleteSubject,
      deletePdf,
      editPdf,
      updateProgress,
      getAllUsers,
      deleteUser,
      getUserStats,
      getDashboardStats,
      getFileProgress,
      askQuestion,
    }),
    [
      user,
      isAuthenticated,
      subjects,
      isAdmin,
      isSuperAdmin,
      questions,
      currentPdf,
      sidebarOpen,
      isUploadFormOpen,
      isAddSubjectFormOpen,
      uploadSubjectId,
      toast,
      subjectUpdateTrigger,
      searchQuery,
      uploadPdf,
      allUsers,
      setCurrentPdf,
      setSidebarOpen,
      login,
      signup,
      logout,
      updateProfile,
      changePassword,
      updateUserRole,
      showToast,
      hideToast,
      openUploadForm,
      closeUploadForm,
      openAddSubjectForm,
      closeAddSubjectForm,
      getSubjectDetails,
      addSubject,
      editSubject,
      deleteSubject,
      updateProgress,
      askQuestion,
      getFileProgress,
      deletePdf,
      editPdf,
      getAllUsers,
      deleteUser,
      getUserStats,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
