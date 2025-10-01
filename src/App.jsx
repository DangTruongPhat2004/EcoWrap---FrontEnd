import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/layout/DashboardLayout";
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
import VendorProfile from "./pages/vendor/VendorProfile";
import { ProtectedRoute } from "./routes";
import MinimalDebugTest from "./pages/Test";
import "./App.css";
import CheckoutPage from "./pages/CheckoutPage";
import CartPage from "./pages/CartPage";
import Pagetest from "./pages/Pagetest";
import BankTransferPage from "./pages/bank-tranfer";
import OrderSuccessPage from "./pages/order/OrderSuccessPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Vendor Dashboard Routes - No Header/Footer */}
        <Route
          path="/vendor/*"
          element={
            <ProtectedRoute requiredRole="vendor">
              <Routes>
                <Route path="/" element={<DashboardLayout />}>
                  <Route path="dashboard" element={<VendorDashboard />} />
                  <Route path="profile" element={<VendorProfile />} />
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
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
