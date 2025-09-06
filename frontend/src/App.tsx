import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import SystemAdminDashboard from './pages/SystemAdminDashboard';
import { NormalUserDashboard } from './pages/NormalUserDashboard';
import { StoreOwnerDashboard } from './pages/StoreOwnerDashboard';
import { LoadingSpinner } from './components/common/LoadingSpinner';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  console.log('AppRoutes render:', { user, loading });

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    console.log('No user, redirecting to login');
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const roleRoute = user.role.toLowerCase().replace('_', '-');
  console.log('User authenticated, role route:', roleRoute);

  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/${roleRoute}`} replace />} />
      
      <Route
        path="/system-admin/*"
        element={
          <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
            <SystemAdminDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/normal-user/*"
        element={
          <ProtectedRoute allowedRoles={['NORMAL_USER']}>
            <NormalUserDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/store-owner/*"
        element={
          <ProtectedRoute allowedRoles={['STORE_OWNER']}>
            <StoreOwnerDashboard />
          </ProtectedRoute>
        }
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-luxury">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <AppRoutes />
            </motion.div>
          </AnimatePresence>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
