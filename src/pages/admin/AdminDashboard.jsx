import React, { useState, useEffect } from "react";
import {
  Users,
  Star,
  TrendingUp,
  DollarSign,
  Calendar,
  UserPlus,
  ShoppingBag,
  Filter,
} from "lucide-react";
import {
  getAdminDashboardStats,
  getUsersStats,
  getRevenueStats,
  getTopSellers,
  getActiveUsers,
  getNewProducts,
  getDashboardMetrics,
} from "../../services/adminApi";

const AdminDashboard = () => {
  const [timeRange, setTimeRange] = useState("month"); // day, week, month, year
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSellers: 0,
    totalCustomers: 0,
    platformRating: 0,
    totalRevenue: 0,
    commission: 0,
    avgDailyTransactions: 0,
    avgWeeklyTransactions: 0,
    totalFeedbacks: 0,
    totalSuccessfulTransactions: 0,
  });
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);
  const [newProducts, setNewProducts] = useState([]);
  const [userActivity, setUserActivity] = useState({
    active: 65,
    inactive: 35,
  });

  useEffect(() => {
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [
        dashboardMetrics,
        statsData,
        usersData,
        revenueStatsData,
        topSellersData,
        activeUsersData,
        newProductsData,
      ] = await Promise.all([
        getDashboardMetrics(),
        getAdminDashboardStats(timeRange),
        getUsersStats(timeRange),
        getRevenueStats(timeRange),
        getTopSellers(),
        getActiveUsers(),
        getNewProducts(),
      ]);

      // Merge backend metrics with mock data
      const mergedStats = {
        ...statsData,
        totalUsers: dashboardMetrics.totalVerifiedUsers || statsData.totalUsers,
        totalCustomers:
          dashboardMetrics.totalCustomer || statsData.totalCustomers,
        totalSellers: dashboardMetrics.totalSeller || statsData.totalSellers,
        platformRating:
          dashboardMetrics.averageRating || statsData.platformRating,
        totalRevenue: dashboardMetrics.totalRevenue || statsData.totalRevenue,
        totalFeedbacks: dashboardMetrics.totalFeedbacks,
        totalSuccessfulTransactions:
          dashboardMetrics.totalSuccessfulTransactions,
      };

      setStats(mergedStats);
      setRevenueData(revenueStatsData.revenue);
      setOrderData(revenueStatsData.orders);
      setTopSellers(topSellersData);
      setActiveUsers(activeUsersData);
      setNewProducts(newProductsData);
      setUserActivity(usersData.activity);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const timeRangeOptions = [
    { value: "day", label: "Hôm nay" },
    { value: "week", label: "Tuần này" },
    { value: "month", label: "Tháng này" },
    { value: "year", label: "Năm này" },
  ];

  const StatCard = ({ icon: Icon, label, value, subValue, color, trend }) => {
    const IconComponent = Icon;
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-lg ${color}`}>
                <IconComponent size={20} className="text-white" />
              </div>
              <span className="text-sm text-gray-600">{label}</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            {subValue && (
              <div className="text-sm text-gray-500">{subValue}</div>
            )}
          </div>
          {trend && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                trend > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              <TrendingUp size={12} className={trend < 0 ? "rotate-180" : ""} />
              {Math.abs(trend)}%
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard Quản Trị
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Tổng quan thống kê và hoạt động hệ thống
              </p>
            </div>

            {/* Time Range Filter */}
            <div className="flex items-center gap-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {timeRangeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center gap-2">
                <Filter size={16} />
                Xuất báo cáo
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <StatCard
            icon={Users}
            label="Tổng người dùng"
            value={formatNumber(stats.totalUsers)}
            subValue={`${formatNumber(
              stats.totalSellers
            )} Seller | ${formatNumber(stats.totalCustomers)} Customer`}
            color="bg-blue-600"
            trend={12}
          />
          <StatCard
            icon={Star}
            label="Đánh giá nền tảng"
            value={stats.platformRating.toFixed(1)}
            subValue={`${formatNumber(stats.totalFeedbacks)} đánh giá`}
            color="bg-yellow-500"
            trend={5}
          />
          <StatCard
            icon={DollarSign}
            label="Doanh thu"
            value={formatCurrency(stats.totalRevenue)}
            subValue="Tổng doanh thu hệ thống"
            color="bg-green-600"
            trend={18}
          />
          <StatCard
            icon={ShoppingBag}
            label="Giao dịch thành công"
            value={formatNumber(stats.totalSuccessfulTransactions)}
            subValue="Tổng số giao dịch"
            color="bg-purple-600"
            trend={8}
          />
          <StatCard
            icon={UserPlus}
            label="Người dùng đã xác thực"
            value={formatNumber(stats.totalUsers)}
            subValue="Đã xác thực email"
            color="bg-indigo-600"
            trend={15}
          />
          <StatCard
            icon={Calendar}
            label="Giao dịch TB"
            value={formatNumber(stats.avgDailyTransactions)}
            subValue={`${formatNumber(stats.avgWeeklyTransactions)}/tuần`}
            color="bg-red-600"
            trend={6}
          />
        </div>

        {/* Charts Section - MOVED TO TOP */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                📊 Doanh Thu Theo Thời Gian
              </h2>
              <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500">
                <option value="month">Tháng 10/2025</option>
                <option value="last-month">Tháng 9/2025</option>
                <option value="year">Năm 2025</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {revenueData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-green-600 to-green-400 rounded-t-lg relative group hover:from-green-700 hover:to-green-500 transition-all cursor-pointer shadow-md"
                    style={{
                      height: `${
                        (data.value /
                          Math.max(...revenueData.map((d) => d.value))) *
                        100
                      }%`,
                      minHeight: "20px",
                    }}
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                      {formatCurrency(data.value)}
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {data.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Doanh thu</span>
                </div>
                <span className="text-sm font-semibold text-green-600">
                  {formatCurrency(
                    revenueData.reduce((sum, d) => sum + d.value, 0)
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Orders Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              📦 Tổng Số Đơn Hàng
            </h2>
            <div className="h-64 flex items-end justify-between gap-2">
              {orderData.map((data, index) => (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div
                    className="w-full bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-lg relative group hover:from-amber-700 hover:to-amber-500 transition-all cursor-pointer shadow-md"
                    style={{
                      height: `${
                        (data.value /
                          Math.max(...orderData.map((d) => d.value))) *
                        100
                      }%`,
                      minHeight: "20px",
                    }}
                  >
                    <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg z-10">
                      {formatNumber(data.value)} đơn
                    </div>
                  </div>
                  <span className="text-xs text-gray-600 font-medium">
                    {data.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
                  <span className="text-sm text-gray-600">Đơn hàng</span>
                </div>
                <span className="text-sm font-semibold text-amber-600">
                  {formatNumber(orderData.reduce((sum, d) => sum + d.value, 0))}{" "}
                  đơn
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Sellers Donut Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              🏆 Top Seller Theo Doanh Số
            </h2>
            <div className="flex items-center justify-center mb-6">
              <svg width="180" height="180" viewBox="0 0 200 200">
                {/* Donut chart with shadow effect */}
                <defs>
                  <filter id="shadow">
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="#10B981"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                <path
                  d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 Z"
                  fill="#8B4513"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                <path
                  d="M 100 100 L 180 100 A 80 80 0 0 1 140 170 Z"
                  fill="#6B7280"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                <path
                  d="M 100 100 L 140 170 A 80 80 0 0 1 60 170 Z"
                  fill="#A0522D"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow)"
                />
                {/* Center hole for donut effect */}
                <circle cx="100" cy="100" r="45" fill="white" />
              </svg>
            </div>
            <div className="space-y-3">
              {topSellers.map((seller, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full shadow-sm`}
                      style={{ backgroundColor: seller.color }}
                    ></div>
                    <span className="text-sm text-gray-700 font-medium">
                      {seller.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">
                    {seller.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* User Activity Pie Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              👥 Người Dùng Hoạt Động
            </h2>
            <div className="flex items-center justify-center mb-6">
              <svg width="180" height="180" viewBox="0 0 200 200">
                <defs>
                  <filter id="shadow2">
                    <feDropShadow
                      dx="0"
                      dy="2"
                      stdDeviation="3"
                      floodOpacity="0.3"
                    />
                  </filter>
                </defs>
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  fill="#10B981"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow2)"
                />
                <path
                  d="M 100 100 L 100 20 A 80 80 0 0 1 180 100 L 100 100 Z"
                  fill="#8B4513"
                  stroke="white"
                  strokeWidth="3"
                  filter="url(#shadow2)"
                />
                <circle cx="100" cy="100" r="45" fill="white" />
                <text
                  x="100"
                  y="105"
                  textAnchor="middle"
                  className="text-2xl font-bold"
                  fill="#1F2937"
                >
                  {userActivity.active}%
                </text>
              </svg>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">
                    Hoạt động
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {userActivity.active}%
                </span>
              </div>
              <div className="flex items-center justify-between hover:bg-gray-50 p-2 rounded transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded-full bg-amber-700 shadow-sm"></div>
                  <span className="text-sm text-gray-700 font-medium">
                    Không hoạt động
                  </span>
                </div>
                <span className="text-sm font-bold text-gray-900">
                  {userActivity.inactive}%
                </span>
              </div>
            </div>
          </div>

          {/* Growth Rate Chart */}
          <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              📈 Tốc Độ Tăng Trưởng
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Người dùng mới</span>
                  <span className="text-sm font-bold text-green-600">+12%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full shadow-sm"
                    style={{ width: "75%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Doanh số</span>
                  <span className="text-sm font-bold text-blue-600">+18%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full shadow-sm"
                    style={{ width: "90%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Sản phẩm mới</span>
                  <span className="text-sm font-bold text-purple-600">+8%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full shadow-sm"
                    style={{ width: "60%" }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    Đánh giá tích cực
                  </span>
                  <span className="text-sm font-bold text-yellow-600">+5%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-3 rounded-full shadow-sm"
                    style={{ width: "85%" }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Management Section - MOVED BELOW CHARTS */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              Quản Lý Người Dùng
            </h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center gap-1 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors">
              Xem tất cả
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          {/* Active Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Tên
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ngày tham gia
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {activeUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-medium text-gray-600">
                              {user.name.charAt(0)}
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          user.status === "active"
                            ? "bg-green-100 text-green-700"
                            : user.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.status === "active" && "Đã xác nhận"}
                        {user.status === "pending" && "Chờ phê duyệt"}
                        {user.status === "blocked" && "Bị khóa"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {user.joinDate}
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Products Section */}
        <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-orange-600" />
              Phê Duyệt Sản Phẩm Mới
            </h2>
            <button className="text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 hover:bg-orange-50 px-3 py-2 rounded-lg transition-colors">
              5 sản phẩm chờ duyệt
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Nhà cung cấp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Ngày nộp
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Carbon Footprint
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {newProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product.sku}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-900 rounded flex items-center justify-center text-white text-xs">
                          {product.supplier.charAt(0)}
                        </div>
                        <span className="text-sm text-gray-900">
                          {product.supplier}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {product.submitDate}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-green-600">
                        {product.carbonFootprint}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button className="text-green-600 hover:text-green-700 text-sm font-medium hover:bg-green-50 px-3 py-1 rounded transition-colors">
                        Chi tiết
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
