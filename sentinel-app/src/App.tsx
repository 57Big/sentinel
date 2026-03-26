import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

// Pages
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Home from './pages/Home/Home';
import About from './pages/About/About';
import Check from './pages/Check/Check';
import Moderation from './pages/Moderation/Moderation';
import Results from './pages/Results/Results';
import Admin from './pages/Admin/Admin';
import DangerousContent from './pages/Admin/DangerousContent';

// Components
import LoginRequired from './components/LoginRequired';
import MainLayout from './components/MainLayout';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }: { children: JSX.Element; requiredRole?: string }) => {
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');

  // Agar login qilinmagan bo'lsa, LoginRequired komponentini ko'rsat
  if (!token) {
    return (
      <MainLayout>
        <LoginRequired />
      </MainLayout>
    );
  }

  // Role-based access control
  if (requiredRole && userStr) {
    const user = JSON.parse(userStr);
    if (user.role !== requiredRole && requiredRole === 'admin') {
      return (
        <MainLayout>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-6xl">
                  block
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Ruxsat yo'q
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Bu sahifaga faqat admin foydalanuvchilari kira oladi.
              </p>
            </div>
          </div>
        </MainLayout>
      );
    }
    if (requiredRole === 'moderator' && user.role !== 'moderator' && user.role !== 'admin') {
      return (
        <MainLayout>
          <div className="min-h-[60vh] flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
              <div className="mb-6">
                <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-6xl">
                  block
                </span>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                Ruxsat yo'q
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Bu sahifaga faqat moderator va admin foydalanuvchilari kira oladi.
              </p>
            </div>
          </div>
        </MainLayout>
      );
    }
  }

  return children;
};

// Public Route Component (redirect if already logged in)
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('token');

  if (token) {
    return <Navigate to="/home" replace />;
  }

  return children;
};

// Scroll to top on route change
const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return null;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="app">
        <Routes>
          {/* Public Routes */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/about"
            element={
              <ProtectedRoute>
                <About />
              </ProtectedRoute>
            }
          />
          <Route
            path="/check"
            element={
              <ProtectedRoute>
                <Check />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/moderation"
            element={
              <ProtectedRoute requiredRole="moderator">
                <Moderation />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dangerous-content"
            element={
              <ProtectedRoute requiredRole="admin">
                <DangerousContent />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />

          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
