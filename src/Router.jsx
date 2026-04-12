import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import Profile from './dashboard/Profile';
import ProtectedRoute from './components/ProtectedRoute';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            fontFamily: "'Inter', sans-serif",
          },
        }}
      />
    </BrowserRouter>
  );
}
