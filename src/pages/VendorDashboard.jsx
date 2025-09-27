import {
  DollarSign,
  Package,
  BarChart3,
  Leaf,
  TrendingUp,
  Recycle,
  Droplets,
} from "lucide-react";

const VendorDashboard = () => {
  const stats = [
    {
      title: "Tổng Doanh Thu",
      value: "₫125,890,000",
      change: "+12.5%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Đơn Hàng Tháng",
      value: "2,847",
      change: "+8.2%",
      icon: Package,
      trend: "up",
    },
    {
      title: "Sản Phẩm Bán",
      value: "15,234",
      change: "+15.3%",
      icon: BarChart3,
      trend: "up",
    },
    {
      title: "Tác Động Xanh",
      value: "1,250kg CO2",
      change: "Tiết kiệm",
      icon: Leaf,
      trend: "eco",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Chào mừng trở lại! 👋</h1>
        <p className="text-emerald-100">
          Theo dõi hiệu suất bán hàng và tác động môi trường của bạn
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p
                  className={`text-sm mt-1 ${
                    stat.trend === "up"
                      ? "text-emerald-600"
                      : stat.trend === "eco"
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.change}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Đơn Hàng Gần Đây
          </h3>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-emerald-600 text-sm">📦</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Đơn hàng #{1000 + item}
                    </p>
                    <p className="text-sm text-gray-500">Túi giấy cao cấp</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    ₫{(item * 125000).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">2 giờ trước</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Environmental Impact */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Tác Động Môi Trường
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Chất liệu tái chế</p>
                  <p className="text-sm text-gray-600">85% sản phẩm</p>
                </div>
              </div>
              <div className="text-emerald-600 font-semibold">Xuất sắc</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Droplets className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Tiết kiệm nước</p>
                  <p className="text-sm text-gray-600">2,340 lít/tháng</p>
                </div>
              </div>
              <div className="text-blue-600 font-semibold">Tốt</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Carbon footprint</p>
                  <p className="text-sm text-gray-600">Giảm 1,250kg CO2</p>
                </div>
              </div>
              <div className="text-green-600 font-semibold">Ưu việt</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
