import { NavLink, useNavigate } from "react-router-dom";
import { User, History, ClipboardList, LogOut } from "lucide-react";
import logo from "../../assets/logo.png";

const CustomerSidebar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const menuItems = [
    {
      id: "profile",
      label: "Hồ Sơ",
      icon: User,
      path: "/customer/profile",
    },
    {
      id: "orders",
      label: "Đơn Hàng Của Tôi",
      icon: ClipboardList,
      path: "/customer/orders",
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
            <p className="text-xs text-green-600">Customer Dashboard</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.id}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md"
                    : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-700"
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* User Profile Section - Fixed at bottom */}
      <div className="p-4 border-t border-green-200">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium text-gray-900 truncate">
              {user?.fullName || "Người dùng"}
            </p>
            <p className="text-sm text-gray-500 truncate">
              {user?.email || ""}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-medium">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default CustomerSidebar;
