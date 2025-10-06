import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  ShoppingBag,
  Package,
  BarChart3,
  Settings,
  Leaf,
  Globe,
  LogOut,
  User,
} from "lucide-react";
import logo from "../../assets/logo.png";

const VendorSidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "home",
      label: "HQ số",
      icon: Home,
      path: "/vendor/dashboard",
      submenu: [],
    },
    {
      id: "history",
      label: "Lịch Sử Mua Hàng",
      icon: ShoppingBag,
      path: "/vendor/purchase-history",
      submenu: [],
    },
    {
      id: "management",
      label: "Quản Lý Kho Hàng",
      icon: Package,
      path: "/vendor/inventory",
      submenu: [],
    },
    {
      id: "reports",
      label: "Báo Cáo Thống Kê",
      icon: BarChart3,
      path: "/vendor/reports",
      submenu: [],
    },
    {
      id: "profile",
      label: "Cài Đặt",
      icon: Settings,
      path: "/vendor/profile",
      submenu: [],
    },
  ];

  const sustainabilityItems = [
    {
      id: "eco-tracking",
      label: "Tác Động Sinh Thái",
      icon: Leaf,
      path: "/vendor/eco-tracking",
    },
    {
      id: "carbon-offset",
      label: "Giảm Thiểu CO2",
      icon: Globe,
      path: "/vendor/carbon-offset",
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-emerald-50 to-green-100 shadow-lg border-r border-green-200 flex flex-col">
      {/* Logo and Brand */}
      <div className="p-6 border-b border-green-200">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-lg overflow-hidden">
            <img
              src={logo}
              alt="EcoWrap Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-sm text-green-800">EcoWrap</h2>
            <p className="text-xs text-green-600">Vendor Dashboard</p>
          </div>
        </div>
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

        {/* Sustainability Section */}
        <div className="mt-8 pt-6 border-t border-green-200">
          <h3 className="text-sm font-semibold text-green-800 mb-3 px-3">
            🌱 Tác Động Sinh Thái
          </h3>
          <div className="space-y-2">
            {sustainabilityItems.map((item) => (
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
              {user.name || "Tài Khoản"}
            </p>
            <p className="text-xs text-green-600">Nhà cung cấp</p>
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

export default VendorSidebar;
