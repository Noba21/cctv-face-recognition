import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import LandingPage from '../pages/LandingPage/LandingPage';
import Login from '../pages/Login/Login';
import Dashboard from '../pages/Dashboard/Dashboard';
import UserManagement from '../pages/UserManagement/UserManagement';
import UserDetails from '../pages/UserManagement/UserDetails';
import FaceRecognition from '../pages/FaceRecognition/FaceRecognition';
import Reports from '../pages/Reports/Reports';
import ReportViewer from '../pages/Reports/ReportViewer';

// Layout
import Layout from '../components/Layout/Layout';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, user, hasRole } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route 
        path="/login" 
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <Layout>
              <UserManagement />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/users/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <UserDetails />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/recognition"
        element={
          <ProtectedRoute>
            <Layout>
              <FaceRecognition />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <Layout>
              <Reports />
            </Layout>
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/reports/:id"
        element={
          <ProtectedRoute>
            <Layout>
              <ReportViewer />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Only Routes */}
      <Route
        path="/settings"
        element={
          <ProtectedRoute requiredRole={['super_admin', 'admin']}>
            <Layout>
              <div>Settings Page (Coming Soon)</div>
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;