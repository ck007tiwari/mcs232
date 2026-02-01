import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AppProvider, useApp } from "./context/AppContext";
import Layout from "./components/Layout/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import Toast from "./components/Layout/Toast";
import SubjectDetails from "./pages/SubjectDetails";
import PdfView from "./pages/PdfView";
import Profile from "./pages/Profile";
import Subjects from "./pages/Subjects";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import QAHistory from "./pages/QAHistory";
import ThemeContext from "./context/ThemeContext";

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
  const { theme } = useContext(ThemeContext);

  return (
    <div className={theme}>
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
            <Route path="subject/:subjectId" element={<SubjectDetails />} />
            <Route path="pdf/:pdfId" element={<PdfView />} />
            <Route path="profile" element={<Profile />} />
            <Route path="subjects" element={<Subjects />} />
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
    </div>
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
