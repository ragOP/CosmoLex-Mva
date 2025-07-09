import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const LoadingPage = lazy(() => import('./pages/LoadingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const TwoFactorPage = lazy(() => import('./pages/TwoFactorPage'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gradient-mesh-1"><span className="text-lg font-medium text-gray-dark">Loading...</span></div>}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/2fa" element={<TwoFactorPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
