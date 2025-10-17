import React, { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useAppContext } from './context/AppContext'

const LoginPage = lazy(() => import('./pages/LoginPage'))
const MainPage = lazy(() => import('./pages/MainPage'))
const AdminPage = lazy(() => import('./pages/AdminPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext()
  if (loading) return <div className="p-6">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="p-6  ">Loading…</div>}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MainPage />
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
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
