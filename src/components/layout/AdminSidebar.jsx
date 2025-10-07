import {
  HomeIcon,
  CheckCircleIcon,
  UsersIcon,
  CogIcon,
  ChartBarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router-dom";
import { Card, CardBody } from "@heroui/react";

const AdminSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: HomeIcon, label: "Hồ sơ" },
    { path: "/admin/approvals", icon: CheckCircleIcon, label: "Phê duyệt" },
    { path: "/admin/users", icon: UsersIcon, label: "Quản lí người dùng" },
    { path: "/admin/settings", icon: CogIcon, label: "Cài Đặt" },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="w-64 bg-gradient-to-b from-emerald-50 to-emerald-100 min-h-screen p-4 flex flex-col">
      {/* Logo Section */}
      <div className="mb-8 flex items-center gap-3 p-4">
        <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
          <SparklesIcon className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-emerald-800">Eco</h1>
          <h2 className="text-lg font-semibold text-emerald-700">Wrap</h2>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "bg-white text-emerald-700 shadow-md font-semibold"
                      : "text-emerald-800 hover:bg-emerald-200/50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* THÔNG BÁO Section */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-emerald-700 mb-3 px-4">
          THÔNG BÁO
        </h3>

        <Card className="bg-white shadow-sm">
          <CardBody className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm font-semibold text-emerald-800">
                Tác Động Sinh Thái
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Tiết kiệm</span>
                </div>
                <span className="font-semibold text-gray-900">35kg nhựa</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-gray-700">Giảm</span>
                </div>
                <span className="font-semibold text-gray-900">12kg CO2</span>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </aside>
  );
};

export default AdminSidebar;
