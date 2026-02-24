import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import BusinessSignup from './pages/BusinessSignup';
import DeveloperSignup from './pages/DeveloperSignup';
import AdminSignup from './pages/AdminSignup';
import BusinessDashboard from './pages/BusinessDashboard';
import DeveloperDashboard from './pages/DeveloperDashboard';
import AdminDashboard from './pages/AdminDashboard';
import BusinessProfile from './pages/BusinessProfile';
import ImproveSkill from './pages/ImproveSkill';
import AdminProfessionManagement from './pages/AdminProfessionManagement';
import ProfessionContent from './pages/ProfessionContent';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup/business" element={<BusinessSignup />} />
          <Route path="/signup/developer" element={<DeveloperSignup />} />
          <Route path="/signup/admin" element={<AdminSignup />} />

          {/* Protected Routes - Business */}
          <Route
            path="/business-dashboard"
            element={
              <ProtectedRoute allowedRoles={['client']}>
                <BusinessDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Developer */}
          <Route
            path="/developer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <DeveloperDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/improve-skill"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <ImproveSkill />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profession-content"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <ProfessionContent />
              </ProtectedRoute>
            }
          />

          {/* Business Profile - Accessible by Developers */}
          <Route
            path="/business-profile/:id"
            element={
              <ProtectedRoute allowedRoles={['developer']}>
                <BusinessProfile />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/profession-management"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminProfessionManagement />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
