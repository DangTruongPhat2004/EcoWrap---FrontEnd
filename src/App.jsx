import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
import RoleBasedLayout from "./components/layout/RoleBasedLayout";
import {
  Home,
  About,
  Login,
  Unauthorized,
  Register,
  Products,
  ProductDetail,
} from "./pages";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import Profile from "./pages/customer/Profile";
import VendorRegistration from "./pages/VendorRegistration";
import VendorRegistrationSuccess from "./pages/VendorRegistrationSuccess";
import { ProtectedRoute } from "./routes";
import MinimalDebugTest from "./pages/Test";
import "./App.css";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import Pagetest from "./pages/Pagetest";
import BankTransferPage from "./pages/bank-tranfer";
import OrderSuccessPage from "./pages/order/OrderSuccessPage";
import VerifyOtpPage from "./pages/VerifyOtpPage";
import React from "react";
import GeminiChatButton from "./components/chat/GeminiChatButton";
import GeminiChatWidget from "./components/chat/GeminiChatWidget";
import ResetPasswordWizard from "./components/auth/ResetPasswordWizard";

function App() {
  const [open, setOpen] = React.useState(false);
  const [unread, setUnread] = React.useState(0);
  return (
    <Router>
      <Routes>
        {/* Customer Dashboard Routes - Role-dependent layout */}
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
          <Route
            path="orders"
            element={
              <div className="p-8 text-center text-gray-500">
                <h1 className="text-2xl">Lịch Sử Đơn Hàng</h1>
                <p>Đang phát triển...</p>
              </div>
            }
          />
        </Route>

        {/* Account Routes - Role-dependent layout */}
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
          <Route
            path="orders"
            element={
              <div className="p-8 text-center text-gray-500">
                <h1 className="text-2xl">Lịch Sử Đơn Hàng</h1>
                <p>Đang phát triển...</p>
              </div>
            }
          />
          <Route
            path="wishlist"
            element={
              <div className="p-8 text-center text-gray-500">
                <h1 className="text-2xl">Danh Sách Yêu Thích</h1>
                <p>Đang phát triển...</p>
              </div>
            }
          />
          <Route
            path="payments"
            element={
              <div className="p-8 text-center text-gray-500">
                <h1 className="text-2xl">Phương Thức Thanh Toán</h1>
                <p>Đang phát triển...</p>
              </div>
            }
          />
        </Route>

        {/* Vendor Dashboard Routes - No Header/Footer */}
        <Route
          path="/vendor/*"
          element={
            <ProtectedRoute requiredRole="vendor">
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="profile" element={<Profile />} />
                  <Route
                    path="purchase-history"
                    element={
                      <div className="p-6 text-center text-gray-500">
                        Lịch Sử Mua Hàng - Đang phát triển
                      </div>
                    }
                  />
                  <Route
                    path="inventory"
                    element={
                      <div className="p-6 text-center text-gray-500">
                        Quản Lý Kho Hàng - Đang phát triển
                      </div>
                    }
                  />
                  <Route
                    path="reports"
                    element={
                      <div className="p-6 text-center text-gray-500">
                        Báo Cáo Thống Kê - Đang phát triển
                      </div>
                    }
                  />
                  <Route
                    path="eco-tracking"
                    element={
                      <div className="p-6 text-center text-gray-500">
                        Tác Động Sinh Thái - Đang phát triển
                      </div>
                    }
                  />
                  <Route
                    path="carbon-offset"
                    element={
                      <div className="p-6 text-center text-gray-500">
                        Giảm Thiểu CO2 - Đang phát triển
                      </div>
                    }
                  />
                  <Route index element={<VendorDashboard />} />
                </Route>
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Public Routes - With Header/Footer */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/test" element={<MinimalDebugTest />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/products/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/testpage" element={<Pagetest />} />
                  <Route path="/bank-transfer" element={<BankTransferPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/verify-otp" element={<VerifyOtpPage />} />
                  <Route
                    path="/vendor-registration"
                    element={<VendorRegistration />}
                  />
                  <Route
                    path="/vendor-registration-success"
                    element={<VendorRegistrationSuccess />}
                  />
                  <Route
                    path="/reset-password"
                    element={<ResetPasswordWizard />}
                  />

                  {/* Protected Routes - Examples */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <div className="p-8 text-center">
                          <h1 className="text-2xl">
                            Dashboard - Người dùng đã đăng nhập
                          </h1>
                        </div>
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <div className="p-8 text-center">
                          <h1 className="text-2xl">
                            Admin Panel - Chỉ admin mới truy cập được
                          </h1>
                        </div>
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Footer />
              <GeminiChatButton
                onOpen={() => {
                  setOpen(true);
                  setUnread(0);
                }}
                unread={unread}
              />
              <GeminiChatWidget open={open} onClose={() => setOpen(false)} />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
