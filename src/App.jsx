// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";
import {
  Home,
  About,
  Login,
  Unauthorized,
  Register,
  Products,
  ProductDetail,
  VendorApprovals,
  VendorApprovalDetail,
  UserManagement,
  OrderManagement,
  OrderDetailAdmin,
  CategoryManagement,
  FeedbackManagement,
  MyFeedback,
} from "./pages";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorProfile from "./pages/vendor/VendorProfile";
import WarehouseManagement from "./pages/vendor/WarehouseManagement";
import VendorProductDetail from "./pages/vendor/VendorProductDetail";
import AddProduct from "./pages/vendor/AddProduct";
import ProductManagement from "./pages/vendor/ProductManagement";
import InventoryManagement from "./pages/vendor/InventoryManagement";
import InventoryDetail from "./pages/vendor/InventoryDetail";
import AddInventory from "./pages/vendor/AddInventory";
import Profile from "./pages/customer/Profile";
import OrdersPage from "./pages/customer/OrdersPage";
import OrderDetailPage from "./pages/customer/OrderDetailPage";
import VendorRegistration from "./pages/VendorRegistration";
import VendorRegistrationSuccess from "./pages/VendorRegistrationSuccess";
import { ProtectedRoute } from "./routes";
import MinimalDebugTest from "./pages/Test";
import "./App.css";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import Pagetest from "./pages/Pagetest";
import BankTransferPage from "./pages/bank-tranfer";
import PaymentReturnPage from "./pages/PaymentReturnPage";
import OrderSuccessPage from "./pages/order/OrderSuccessPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import React from "react";
import GeminiChatButton from "./components/chat/GeminiChatButton";
import GeminiChatWidget from "./components/chat/GeminiChatWidget";
import ResetPasswordWizard from "./components/auth/ResetPasswordWizard";
import ConversationsPage from "./pages/ConversationsPage";
import ChatPage from "./pages/ChatPage";
import MessagesLayout from "./pages/MessagesLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import StorePage from "./pages/StorePage";

// This component now acts as the main layout wrapper.
// It uses the location to decide which layout to render.
function AppLayout() {
  const [open, setOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);

  const location = useLocation();
  const isMessages = location.pathname.startsWith("/messages");

  // If it's a messages page, render a special full-screen layout
  if (isMessages) {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 min-h-0">
          {/* The MessagesLayout component is now the element of the route */}
          <MessagesLayout />
        </main>
      </div>
    );
  }

  // Otherwise, render the standard layout with Header and Footer
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* All other pages will be rendered here by their routes */}
        <AppRoutes />
      </main>
      <Footer />

      {/* Gemini Chat Widget logic remains the same */}
      {!open && (
        <GeminiChatButton
          onOpen={() => {
            setOpen(true);
            setUnread(0);
          }}
          unread={unread}
        />
      )}
      {open && <GeminiChatWidget open={open} onClose={() => setOpen(false)} />}
    </div>
  );
}

// All your route definitions are now in this clean component.
function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/store/:sellerId" element={<StorePage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/bank-transfer" element={<BankTransferPage />} />
      <Route path="/payment/return" element={<PaymentReturnPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/verify-otp" element={<VerifyOtpPage />} />
      <Route path="/vendor-registration" element={<VendorRegistration />} />
      <Route
        path="/vendor-registration-success"
        element={<VendorRegistrationSuccess />}
      />
      <Route path="/reset-password" element={<ResetPasswordWizard />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/test" element={<MinimalDebugTest />} />
      <Route path="/testpage" element={<Pagetest />} />

      {/* Old chat routes (if still needed) */}
      <Route path="/conversations" element={<ConversationsPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />

      {/* Note: The /messages routes are handled separately now */}
      {/* Note: Dashboard routes are now handled separately in main Router */}
    </Routes>
  );
}

// The main App component is now extremely simple
function App() {
  return (
    <Router>
      <Routes>
        {/* The new messages route uses the special full-screen layout directly */}
        <Route path="/messages" element={<AppLayout />} />
        <Route path="/messages/:id" element={<AppLayout />} />

        {/* Dashboard routes with their own layout - no Header/Footer */}
        <Route
          path="/account/*"
          element={
            <ProtectedRoute>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="feedback" element={<MyFeedback />} />
          {/* Add other nested account routes here */}
        </Route>
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute>
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="profile" element={<Profile />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="orders/:orderId" element={<OrderDetailPage />} />
          <Route path="feedback" element={<MyFeedback />} />
          {/* Add other nested customer routes here */}
        </Route>
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="Admin">
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="settings" element={<Profile />} />
          <Route path="approvals" element={<VendorApprovals />} />
          <Route path="approvals/:id" element={<VendorApprovalDetail />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="orders" element={<OrderManagement />} />
          <Route path="orders/:orderId" element={<OrderDetailAdmin />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="feedback" element={<FeedbackManagement />} />
          {/* Add other nested admin routes here */}
        </Route>
        <Route
          path="/vendor/*"
          element={
            <ProtectedRoute requiredRole="Seller">
              <RoleBasedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<VendorDashboard />} />
          <Route path="dashboard" element={<VendorDashboard />} />
          <Route path="profile" element={<VendorProfile />} />
          <Route path="warehouses" element={<WarehouseManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/new" element={<AddProduct />} />
          <Route path="inventory" element={<InventoryManagement />} />
          <Route path="inventory/new" element={<AddInventory />} />
          <Route path="inventory/:id" element={<InventoryDetail />} />
          <Route path="products/:id" element={<VendorProductDetail />} />
          {/* Add other nested vendor routes here */}
        </Route>

        {/* All other routes use the standard layout */}
        <Route path="*" element={<AppLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
