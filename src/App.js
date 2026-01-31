import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout/Layout";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

import Unauthorized from "./components/Layout/Unauthorized";
import NotFound from "./components/Layout/NotFound";
import Toast from "./components/Layout/Toast";
import SubjectView from "./components/Subject/SubjectView";
import PdfViewer from "./components/PDF/PdfViewer";
import Profile from "./components/Profile/Profile";
import SubjectListPage from "./components/Subject/SubjectListPage";
import Dashboard from "./components/Dashboard/Dashboard";
import AdminDashboard from "./components/Admin/AdminDashboard";
import QAHistory from "./components/QA/QAHistory";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (isAuthenticated) {
    return <Navigate to={"/dashboard"} replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { isAdmin } = useApp();
  return (
    <Router>
      <Toast />
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/404" element={<NotFound />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route
            path="dashboard"
            element={isAdmin ? <AdminDashboard /> : <Dashboard />}
          />
          <Route path="subject/:subjectId" element={<SubjectView />} />
          <Route path="pdf/:pdfId" element={<PdfViewer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subjects" element={<SubjectListPage />} />
          <Route path="qa" element={<QAHistory />} />
          <Route
            path="admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
