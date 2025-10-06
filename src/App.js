import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AppProvider, useApp } from './context/AppContext';
import RouteProtection from './components/Layout/RouteProtection';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import SubjectView from './components/Subject/SubjectView';
import PdfViewer from './components/PDF/PdfViewer';
import Profile from './components/Profile/Profile';
import QAHistory from './components/QA/QAHistory';
import AdminDashboard from './components/Admin/AdminDashboard';
import NotFound from './components/Error/NotFound';
import Unauthorized from './components/Error/Unauthorized';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return isAuthenticated ? children : <Navigate to="/unauthorized" replace />;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useApp();
  
  if (!isAuthenticated) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

const AuthRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <RouteProtection>
        <Routes>
          {/* Public Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          
          {/* Auth Routes (redirect to dashboard if already logged in) */}
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
          
          {/* Protected Routes */}
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="subject/:subjectId" element={<SubjectView />} />
            <Route path="pdf/:pdfId" element={<PdfViewer />} />
            <Route path="profile" element={<Profile />} />
            <Route path="qa-history" element={<QAHistory />} />
            
            {/* Admin Only Routes */}
            <Route 
              path="admin/users" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
            <Route 
              path="admin/system" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />
          </Route>
          
          {/* 404 Route - Must be last */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </RouteProtection>
    </Router>
  );
};

function App() {
  return (
    <AppProvider>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
      />
    </AppProvider>
  );
}

export default App;