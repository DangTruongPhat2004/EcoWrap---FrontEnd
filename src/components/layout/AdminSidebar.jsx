import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Tag,
  CheckCircle,
  Users,
  Settings,
  BarChart3,
  Shield,
  LogOut,
  User,
} from "lucide-react";
import logo from "../../assets/logo.png";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/admin/dashboard",
    },
    {
      id: "orders",
      label: "Quản lí đơn hàng",
      icon: ShoppingBag,
      path: "/admin/orders",
    },
    {
      id: "categories",
      label: "Quản lí danh mục",
      icon: Tag,
      path: "/admin/categories",
    },
    {
      id: "approvals",
      label: "Phê duyệt",
      icon: CheckCircle,
      path: "/admin/approvals",
    },
    {
      id: "users",
      label: "Quản lí người dùng",
      icon: Users,
      path: "/admin/users",
    },
    {
      id: "settings",
      label: "Cài Đặt",
      icon: Settings,
      path: "/admin/settings",
    },
  ];

  const analyticsItems = [
    {
      id: "reports",
      label: "Báo Cáo Thống Kê",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      id: "security",
      label: "Bảo Mật Hệ Thống",
      icon: Shield,
      path: "/admin/security",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-emerald-50 to-green-100 shadow-lg border-r border-green-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-green-200">
        <button
          onClick={handleLogoClick}
          className="flex items-center space-x-3 w-full hover:opacity-80 transition-opacity"
        >
          <div className="w-14 h-14 rounded-lg overflow-hidden">
            <img
              src={logo}
              alt="EcoWrap Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <h2 className="font-bold text-sm text-green-800">EcoWrap</h2>
            <p className="text-xs text-green-600">Admin Dashboard</p>
          </div>
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <div key={item.id}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-green-700 hover:bg-green-200 hover:text-green-800"
                  }`
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </div>
          ))}
        </div>

        {/* Analytics Section */}
        <div className="mt-8 pt-6 border-t border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3 px-3">
            📊 Phân Tích & Bảo Mật
          </h3>
          <div className="space-y-2">
            {analyticsItems.map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md"
                      : "text-green-700 hover:bg-green-200 hover:text-green-800"
                  }`
                }
              >
                <item.icon className="w-4 h-4" />
                <span className="font-medium text-sm">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile Section - Fixed at bottom */}
      <div className="mt-auto p-4 border-t border-green-200 bg-white/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-green-800 text-sm">
              {user.name || "Admin"}
            </p>
            <p className="text-xs text-green-600">Quản trị viên</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center space-x-2 p-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
        >
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
