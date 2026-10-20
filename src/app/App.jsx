import { lazy, Suspense, useEffect, useRef } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { LoadingState } from '../components/ui/States';
import { ToastProvider } from '../components/ui/ToastProvider';
import { ErrorBoundary } from './ErrorBoundary';
import { refreshSession } from '../lib/api/auth';

const HomePage = lazy(() => import('../pages/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
const AuthCallbackPage = lazy(() => import('../pages/AuthCallbackPage'));
const SearchPage = lazy(() => import('../pages/SearchPage'));
const MyProfilePage = lazy(() => import('../pages/MyProfilePage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const EditProfilePage = lazy(() => import('../pages/EditProfilePage'));
const AboutPage = lazy(() => import('../pages/AboutPage'));
const ContactPage = lazy(() => import('../pages/ContactPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Suspense
        fallback={
          <div className="container page">
            <LoadingState label="Loading…" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/myprofile" element={<MyProfilePage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/edit-myprofile" element={<EditProfilePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  const sessionRefreshed = useRef(false);

  useEffect(() => {
    if (sessionRefreshed.current) return;
    sessionRefreshed.current = true;
    void refreshSession();
  }, []);

  return (
    <ErrorBoundary>
      <ToastProvider>
        <BrowserRouter basename={basename}>
          <a className="skip-link" href="#main-content">
            Skip to content
          </a>
          <Navbar />
          <main className="app-main" id="main-content">
            <AppRoutes />
          </main>
        </BrowserRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App;
