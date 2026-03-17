import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import AppShell from '../components/layout/AppShell';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import LessonsPage from '../pages/LessonsPage';
import ExercisePage from '../pages/ExercisePage';
import MultipleChoicePage from '../pages/MultipleChoicePage';
import VocabularyPage from '../pages/VocabularyPage';
import ReadingPage from '../pages/ReadingPage';
import ListeningPage from '../pages/ListeningPage';
import WritingPage from '../pages/WritingPage';
import MistakeTrackerPage from '../pages/MistakeTrackerPage';
import LevelTestPage from '../pages/LevelTestPage';
import ProgressPage from '../pages/ProgressPage';
import AdminPage from '../pages/AdminPage';

function Protected({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  if (user?.role !== 'admin') return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<Protected><HomePage /></Protected>} />
      <Route path="/lessons" element={<Protected><LessonsPage /></Protected>} />
      <Route path="/exercises" element={<Protected><ExercisePage /></Protected>} />
      <Route path="/quiz" element={<Protected><MultipleChoicePage /></Protected>} />
      <Route path="/vocabulary" element={<Protected><VocabularyPage /></Protected>} />
      <Route path="/reading" element={<Protected><ReadingPage /></Protected>} />
      <Route path="/listening" element={<Protected><ListeningPage /></Protected>} />
      <Route path="/writing" element={<Protected><WritingPage /></Protected>} />
      <Route path="/mistakes" element={<Protected><MistakeTrackerPage /></Protected>} />
      <Route path="/level-test" element={<Protected><LevelTestPage /></Protected>} />
      <Route path="/progress" element={<Protected><ProgressPage /></Protected>} />
      <Route path="/admin" element={<Protected><AdminRoute><AdminPage /></AdminRoute></Protected>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
