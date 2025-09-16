import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import { Home, About, Login, Unauthorized } from "./pages";
import { ProtectedRoute } from "./routes";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

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

            <Route
              path="/vendor"
              element={
                <ProtectedRoute requiredRole="vendor">
                  <div className="p-8 text-center">
                    <h1 className="text-2xl">
                      Vendor Dashboard - Chỉ nhà cung cấp mới truy cập được
                    </h1>
                  </div>
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
