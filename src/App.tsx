import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { AuthProvider } from './core/AuthProvider';
import { LoginPage } from './pages/Login';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { DashboardPage } from './pages/DashboardPage';
import { RemindersPage } from './pages/RemindersPage';
import { TransactionsPage } from './pages/transactionsPage';
import { TriggerRemindersPage } from './core/TriggerReminders';
import { BudgetSetupPage } from './components/BudgetSetupModal';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage/>} />
              <Route path="/reminders" element={<RemindersPage />} />
              <Route path="/trigger-reminders" element={<TriggerRemindersPage />} />
              <Route path="/budget-setup" element={<BudgetSetupPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}