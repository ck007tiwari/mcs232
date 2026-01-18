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

import Toast from "./components/Layout/Toast";
import SubjectView from "./components/Subject/SubjectView";
import PdfViewer from "./components/PDF/PdfViewer";
import Profile from "./components/Profile/Profile";
import SubjectListPage from "./components/Subject/SubjectListPage";
import Dashboard from "./components/Dashboard/Dashboard";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
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
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="subject/:subjectId" element={<SubjectView />} />
          <Route path="pdf/:pdfId" element={<PdfViewer />} />
          <Route path="profile" element={<Profile />} />
          <Route path="subjects" element={<SubjectListPage />} />
        </Route>
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
