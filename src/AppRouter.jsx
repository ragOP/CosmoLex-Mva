import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import PageLoading from './components/PageLoading';

const LoginPage = lazy(() => import('./pages/Login'));
const SignupPage = lazy(() => import('./pages/signup'));
const VerificationPage = lazy(() => import('./pages/verification'));
const TwoFactorPage = lazy(() => import('./pages/two-factor'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ForgotPasswordPage = lazy(() => import('./pages/forget-password'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password'));
const EmailVerifyPage = lazy(() => import('./pages/email-verify'));

const DashboardHome = lazy(() => import('./components/dashboard/Dashboard'));
const DashboardForm = lazy(() =>
  import('./components/dashboard/DashboardForm')
);
const MatterPage = () => <div>Matter Page</div>;
const UserManagementPage = () => <div>User Management Page</div>;
const BulkImportPage = () => <div>Bulk Import Page</div>;
const CalendarPage = lazy(() => import('./pages/calendar'));
const TasksPage = lazy(() => import('./pages/tasks'));
const MatterIntakePage = lazy(() => import('./pages/matter/intake'));

const AppRouter = () => (
  <Router>
    <Suspense fallback={<PageLoading />}>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/email-verify" element={<EmailVerifyPage />} />
        <Route path="/dashboard/*" element={<DashboardPage />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard-form" element={<DashboardForm />} />
          <Route path="matter" element={<MatterPage />} />
          <Route path="user-management" element={<UserManagementPage />} />
          <Route path="bulk-import" element={<BulkImportPage />} />
          <Route path="calendar/:id" element={<CalendarPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="matter-intake" element={<MatterIntakePage />} />
        </Route>
        <Route path="/2fa" element={<TwoFactorPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  </Router>
);

export default AppRouter;
