import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageLoading from './components/PageLoading';

const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const TwoFactorPage = lazy(() => import('./pages/TwoFactorPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));

const DashboardHome = lazy(() => import('./components/dashboard/Dashboard'));
const DashboardForm = lazy(() => import('./components/dashboard/DashboardForm'));
const MatterPage = () => <div>Matter Page</div>;
const UserManagementPage = () => <div>User Management Page</div>;
const BulkImportPage = () => <div>Bulk Import Page</div>;

const AppRouter = () => (
  <Router>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard-form" element={<DashboardForm />} />
          <Route path="matter" element={<MatterPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="bulk-import" element={<BulkImportPage />} />
        </Route>
        <Route path="/2fa" element={<TwoFactorPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
