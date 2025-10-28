import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { User, Users, ShoppingBag, CheckCircle } from "lucide-react";
import { getAllUsers } from "../../services/userApi";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const getRoleLabel = (roleId) => {
    const roleMap = {
      1: "Admin",
      2: "Người Bán",
      3: "Người Mua",
    };
    return roleMap[roleId] || "Không rõ";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      roleFilter === "all" || user.roleId === parseInt(roleFilter);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "verified" && user.isVerified) ||
      (statusFilter === "unverified" && !user.isVerified);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalUsers = users.length;
  const totalSellers = users.filter((u) => u.roleId === 2).length;
  const totalBuyers = users.filter((u) => u.roleId === 3).length;
  const verifiedUsers = users.filter((u) => u.isVerified).length;

  const roleCounts = {
    all: totalUsers,
    1: users.filter((u) => u.roleId === 1).length,
    2: totalSellers,
    3: totalBuyers,
  };

  const statusCounts = {
    all: totalUsers,
    verified: verifiedUsers,
    unverified: totalUsers - verifiedUsers,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý người dùng
          </h1>
          <p className="mt-2 text-gray-600">
            Quản lý tất cả người dùng trong hệ thống
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Người bán</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalSellers}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Người mua</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {totalBuyers}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đã xác thực</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {verifiedUsers}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Role Filter Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setRoleFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Tất cả vai trò ({roleCounts.all})
          </button>
          <button
            onClick={() => setRoleFilter("1")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === "1"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Admin ({roleCounts[1]})
          </button>
          <button
            onClick={() => setRoleFilter("2")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === "2"
                ? "bg-orange-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Người Bán ({roleCounts[2]})
          </button>
          <button
            onClick={() => setRoleFilter("3")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              roleFilter === "3"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Người Mua ({roleCounts[3]})
          </button>
        </div>

        {/* Status Filter Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setStatusFilter("all")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Tất cả ({statusCounts.all})
          </button>
          <button
            onClick={() => setStatusFilter("verified")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "verified"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Đã xác thực ({statusCounts.verified})
          </button>
          <button
            onClick={() => setStatusFilter("unverified")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              statusFilter === "unverified"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Chưa xác thực ({statusCounts.unverified})
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600">Đang tải người dùng...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Không tìm thấy người dùng
            </h3>
            <p className="text-gray-500">
              {searchQuery
                ? "Không tìm thấy người dùng phù hợp với từ khóa tìm kiếm"
                : "Không có người dùng nào phù hợp với bộ lọc"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Người dùng
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số điện thoại
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vai trò
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày đăng ký
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.userId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {(user.fullName ||
                              user.username)?.[0]?.toUpperCase() || "U"}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {user.fullName || user.username}
                            </p>
                            <p className="text-sm text-gray-500">
                              @{user.username}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {user.email}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {user.phoneNumber || "N/A"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.roleId === 1
                              ? "bg-red-100 text-red-800"
                              : user.roleId === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {getRoleLabel(user.roleId)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            user.isVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {user.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-700">
                          {formatDate(user.registrationDate)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
