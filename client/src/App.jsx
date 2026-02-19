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

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="planning-etudiant" element={<PlanningEtudiant />} />
        <Route path="budget" element={<Budget />} />
        <Route path="cuisine" element={<Cuisine />} />
        <Route path="sport" element={<Sport />} />
        <Route path="projets" element={<Projets />} />
        <Route path="ai-advisor" element={<AIAdvisor />} />
        <Route path="admin" element={<Admin />} />
      </Route>
    </Routes>
  );
}
