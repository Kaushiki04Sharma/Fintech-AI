import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import ErrorBoundary from './components/common/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import MyGoals from './pages/MyGoals';
import AIAdvisor from './pages/AIAdvisor';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatWidget from './components/chat/ChatWidget';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from './components/common/Loader';

// This component protects routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

// This component handles routes that should only be accessible when logged OUT (like login/signup)
const AuthLayout = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return user ? <Navigate to="/" replace /> : children;
};

// This component manages all the page routing and animations
const PageRoutes = () => {
  const location = useLocation();
  const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
  };
  const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.4 };

  const protectedPages = [
    { path: '/', element: <Dashboard /> },
    { path: '/goals', element: <MyGoals /> },
    { path: '/advisor', element: <AIAdvisor /> },
    { path: '/reports', element: <Reports /> },
    { path: '/settings', element: <Settings /> },
  ];

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Auth routes that redirect if the user is already logged in */}
        <Route path="/login" element={<AuthLayout><Login /></AuthLayout>} />
        <Route path="/signup" element={<AuthLayout><Signup /></AuthLayout>} />

        {/* Protected routes wrapped in the ProtectedRoute component */}
        {protectedPages.map(({ path, element }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute>
                <motion.div
                  initial="initial"
                  animate="in"
                  exit="out"
                  variants={pageVariants}
                  transition={pageTransition}
                >
                  {element}
                </motion.div>
              </ProtectedRoute>
            }
          />
        ))}
      </Routes>
    </AnimatePresence>
  );
};

// Main App component that sets up providers and the main layout
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Renders the main content based on authentication state
const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();

  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  // Show a global loader while checking initial authentication
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // Render the full dashboard layout only for authenticated users on non-auth pages
  if (user && !isAuthPage) {
    return (
      <div className="flex h-screen bg-background-light dark:bg-background-dark text-text-primary-light dark:text-text-primary-dark">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
          )}
        </AnimatePresence>
        <div className="flex-1 flex flex-col overflow-hidden">
          <Navbar setSidebarOpen={setSidebarOpen} />
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            <div className="w-full max-w-7xl mx-auto">
              <PageRoutes />
            </div>
          </main>
        </div>
        <ChatWidget />
      </div>
    );
  }

  // Otherwise, just render the routes (which will handle auth logic)
  return <PageRoutes />;
};

export default App;