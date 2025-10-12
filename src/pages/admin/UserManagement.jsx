import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data based on the image
  const users = [
    {
      id: "USER001",
      name: "Nguyen Van A",
      avatar: null,
      type: "buyer",
      typeLabel: "Người Mua",
      email: "vana@example.com",
      status: "active",
      statusLabel: "Đang hoạt động",
      joinDate: "15/03/2024",
      ecoImpact: "30kg CO2",
    },
    {
      id: "USER002",
      name: "Tran Thi B",
      avatar: null,
      type: "seller",
      typeLabel: "Người Bán",
      email: "tranthib@example.com",
      status: "pending",
      statusLabel: "Đang chờ phê duyệt",
      joinDate: "20/03/2024",
      ecoImpact: "45kg CO2",
    },
    {
      id: "USER003",
      name: "Le Van C",
      avatar: null,
      type: "buyer",
      typeLabel: "Người Mua",
      email: "levanc@example.com",
      status: "active",
      statusLabel: "Đang hoạt động",
      joinDate: "18/03/2024",
      ecoImpact: "22kg CO2",
    },
    {
      id: "USER004",
      name: "Pham Van D",
      avatar: null,
      type: "seller",
      typeLabel: "Người Bán",
      email: "phamvand@example.com",
      status: "blocked",
      statusLabel: "Bị khóa",
      joinDate: "10/03/2024",
      ecoImpact: "15kg CO2",
    },
  ];

  const getTypeColor = (type) => {
    return type === "buyer"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "blocked":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || user.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Quản Lý Người Dùng
        </h1>
        <p className="text-gray-600 mb-6 text-sm">
          Quản lý và theo dõi tất cả người dùng trên nền tảng EcoWrap
        </p>

        {/* Info Banner */}
        <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-green-700 text-sm">
            Vui lòng xác minh đề đảm bảo tính minh bạch và eco-friendly.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex gap-3 items-center">
            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm min-w-[120px]"
            >
              <option value="all">Loại</option>
              <option value="buyer">Người Mua</option>
              <option value="seller">Người Bán</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer text-gray-700 text-sm min-w-[160px]"
            >
              <option value="all">Trạng Thái</option>
              <option value="active">Đang hoạt động</option>
              <option value="pending">Đang chờ phê duyệt</option>
              <option value="blocked">Bị khóa</option>
            </select>

            {/* Search Input */}
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Loại
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Trạng Thái
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Ngày Tham Gia
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Tác Động Eco
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Thao Tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">
                          {user.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: #{user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                        user.type
                      )}`}
                    >
                      {user.typeLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 text-sm">
                    {user.email}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        user.status
                      )}`}
                    >
                      {user.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-700 text-sm">
                    {user.joinDate}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {user.ecoImpact}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button className="px-4 py-1.5 bg-green-50 text-green-700 rounded-md text-sm font-medium hover:bg-green-100 transition-colors">
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex justify-between items-center px-4 py-3 border-t border-gray-200 bg-gray-50">
            <span className="text-sm text-gray-600">
              Hiển thị 1-{filteredUsers.length} trong tổng số{" "}
              {filteredUsers.length} người dùng
            </span>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 bg-green-600 text-white rounded-md text-sm font-medium">
                1
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                2
              </button>
              <button className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                3
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
