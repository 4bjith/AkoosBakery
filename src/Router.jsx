import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

import App from './App';
import Login from './auth/Login';
import Register from './auth/Register';
import ForgotPassword from './auth/ForgotPassword';
import Profile from './dashboard/Profile';
import ProtectedRoute from './components/ProtectedRoute';

// B2B Dashboard
import DashboardLayout from './dashboard/DashboardLayout';
import Products from './dashboard/Products';
import Cart from './dashboard/Cart';
import Orders from './dashboard/Orders';
import Invoice from './dashboard/Invoice';
import Support from './dashboard/Support';

// Super Admin
import AdminLayout from './admin/AdminLayout';
import AdminOverview from './admin/AdminOverview';
import AdminOrders from './admin/AdminOrders';
import AdminCategories from './admin/AdminCategories';
import AdminProducts from './admin/AdminProducts';
import AdminUsers from './admin/AdminUsers';
import AdminSales from './admin/AdminSales';
import AdminStaff from './admin/AdminStaff';

// Staff Dashboard
import StaffLayout from './staff/StaffLayout';
import StaffDashboard from './staff/StaffDashboard';
import CustomerList from './staff/customers/CustomerList';
import OrderList from './staff/orders/OrderList';
import PlaceOrder from './staff/orders/PlaceOrder';
import InvoiceManagement from './staff/invoices/InvoiceManagement';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Customer Profile */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Protected Super Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<AdminOverview />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="products" element={<AdminProducts />} />
          {/* placeholder for users management */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="staff" element={<AdminStaff />} />
          <Route path="sales" element={<AdminSales />} />
        </Route>

        {/* Protected Staff Dashboard Portal */}
        <Route
          path="/staff"
          element={
            <ProtectedRoute allowedRoles={['staff']}>
              <StaffLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<StaffDashboard />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/place" element={<PlaceOrder />} />
          <Route path="invoices" element={<InvoiceManagement />} />
        </Route>

        {/* Protected B2B Dashboard Portal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="products" replace />} />
          <Route path="products" element={<Products />} />
          <Route path="cart" element={<Cart />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id/invoice" element={<Invoice />} />
          <Route path="support" element={<Support />} />
        </Route>
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
