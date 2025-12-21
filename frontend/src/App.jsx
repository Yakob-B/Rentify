import React, { lazy, Suspense, useMemo } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import PageTransition from './components/PageTransition'
import FloatingThemeToggle from './components/FloatingThemeToggle'
import LoadingSpinner from './components/LoadingSpinner'
import { ThemeProvider } from './contexts/ThemeContext'
import AIChatWidget from './components/AIChatWidget'

// Lazy load pages
const HomePage = lazy(() => import('./pages/HomePage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const RegisterPage = lazy(() => import('./pages/RegisterPage'))
const AdminRegisterPage = lazy(() => import('./pages/AdminRegisterPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))
const ListingForm = lazy(() => import('./pages/ListingForm'))
const BookingPage = lazy(() => import('./pages/BookingPage'))
const AdminPanel = lazy(() => import('./pages/AdminPanel'))
const NotFound = lazy(() => import('./pages/NotFound'))
const ListingsPage = lazy(() => import('./pages/ListingsPage'))
const ListingDetails = lazy(() => import('./pages/ListingDetails'))
const About = lazy(() => import('./pages/About'))
const MessagesPage = lazy(() => import('./pages/MessagesPage'))
const FavoritesPage = lazy(() => import('./pages/FavoritesPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'))
const SitemapPage = lazy(() => import('./pages/SitemapPage'))

// Legal Pages
const PrivacyPolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.PrivacyPolicy })))
const TermsOfService = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.TermsOfService })))
const CookiePolicy = lazy(() => import('./pages/LegalPages').then(m => ({ default: m.CookiePolicy })))

// Support Pages
const FAQPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.FAQPage })))
const ContactPage = lazy(() => import('./pages/SupportPages').then(m => ({ default: m.ContactPage })))

const ProtectedRoute = ({ children, roles }) => {
  const authData = useMemo(() => {
    const token = localStorage.getItem('token')
    const user = JSON.parse(localStorage.getItem('user') || 'null')
    return { token, user }
  }, [])

  if (!authData.token || !authData.user) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !roles.includes(authData.user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  return (
    <ThemeProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <PageTransition>
              <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/listings" element={<ListingsPage />} />
                  <Route path="/listings/:id" element={<ListingDetails />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/admin/register/:token" element={<AdminRegisterPage />} />
                  <Route path="/admin/register" element={<AdminRegisterPage />} />
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <MessagesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/messages/:conversationId"
                    element={
                      <ProtectedRoute>
                        <MessagesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/favorites"
                    element={
                      <ProtectedRoute>
                        <FavoritesPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/listings/new"
                    element={
                      <ProtectedRoute roles={["owner", "admin"]}>
                        <ListingForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/listings/:id/edit"
                    element={
                      <ProtectedRoute roles={["owner", "admin"]}>
                        <ListingForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/bookings/:id"
                    element={
                      <ProtectedRoute>
                        <BookingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/admin" element={<ProtectedRoute roles={["admin"]}><AdminPanel /></ProtectedRoute>} />

                  {/* Footer Pages */}
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/faq" element={<FAQPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/support" element={<ContactPage />} />
                  <Route path="/cookies" element={<CookiePolicy />} />
                  <Route path="/sitemap" element={<SitemapPage />} />

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </PageTransition>
          </main>
          <Footer />
          <FloatingThemeToggle />
          <AIChatWidget />
          <Toaster
            position="top-right"
            toastOptions={{
              style: { background: '#111827', color: '#F9FAFB' },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } }
            }}
          />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
