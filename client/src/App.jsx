import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PlanningEtudiant from './pages/PlanningEtudiant';
import Budget from './pages/Budget';
import Cuisine from './pages/Cuisine';
import Sport from './pages/Sport';
import Projets from './pages/Projets';
import Admin from './pages/Admin';
import AIAdvisor from './pages/AIAdvisor';
import Calendar from './pages/Calendar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Verify2FA from './pages/Verify2FA';
import Profile from './pages/Profile';
import OAuthCallback from './pages/OAuthCallback';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/verify-2fa" element={<Verify2FA />} />
        <Route path="/auth/callback" element={<OAuthCallback />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="planning-etudiant" element={<PlanningEtudiant />} />
          <Route path="budget" element={<Budget />} />
          <Route path="cuisine" element={<Cuisine />} />
          <Route path="sport" element={<Sport />} />
          <Route path="projets" element={<Projets />} />
          <Route path="ai-advisor" element={<AIAdvisor />} />
          <Route path="admin" element={<Admin />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}
