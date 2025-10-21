import { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import {
  getAllRegistrations,
  getRegistrationsByStatus,
} from "../../services/sellerRegistrationApi";

const VendorApprovals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch registrations from backend
  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError(null);

      try {
        let data;
        if (statusFilter === "all") {
          data = await getAllRegistrations();
        } else {
          // Map frontend status to backend status
          const statusMap = {
            pending: "Pending",
            approved: "Approved",
            rejected: "Canceled",
          };
          data = await getRegistrationsByStatus(statusMap[statusFilter]);
        }

        // Transform backend data to frontend format
        const transformedData = data.map((reg) => {
          // Handle the actual status value from API (approvalStatus field)
          // Backend statuses: Pending, Approved, Canceled
          const actualStatus = reg.approvalStatus || "Pending";
          const statusLower = actualStatus.toLowerCase();

          return {
            id: reg.registrationId || reg.id,
            name: reg.companyName || "N/A",
            description: reg.companyAddress || "Chưa có mô tả",
            email: reg.user?.email || reg.licenseId || "N/A",
            phone: reg.companyPhone || "N/A",
            // Map backend status to frontend status
            status:
              statusLower === "pending"
                ? "pending"
                : statusLower === "approved"
                ? "approved"
                : statusLower === "canceled"
                ? "rejected"
                : "rejected", // fallback
            statusLabel:
              statusLower === "pending"
                ? "Đang chờ"
                : statusLower === "approved"
                ? "Đã phê duyệt"
                : statusLower === "canceled"
                ? "Bị từ chối"
                : "Bị từ chối", // fallback
            date: reg.requestedDate
              ? new Date(reg.requestedDate).toLocaleDateString("vi-VN")
              : "N/A",
          };
        });

        setVendors(transformedData);
      } catch (err) {
        console.error("Error fetching registrations:", err);
        setError("Không thể tải danh sách đăng ký");
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [statusFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Phê Duyệt Đăng Ký Bán Hàng
        </h1>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-6 flex items-center gap-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
            <svg
              className="w-3 h-3 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-blue-700 text-sm">
            Vui lòng kiểm tra nguồn gốc và tài liệu để đảm bảo tính minh bạch và
            eco-friendly.
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white border border-gray-200 rounded-md p-4 mb-6">
          <div className="flex gap-3 items-center">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên cửa hàng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 min-w-[180px]"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Đang chờ</option>
              <option value="approved">Đã phê duyệt</option>
              <option value="rejected">Bị từ chối</option>
            </select>

            <button className="px-6 py-2 bg-emerald-600 text-white rounded-md text-sm font-medium hover:bg-emerald-700 flex items-center gap-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Lọc
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Table */}
        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-md overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Tên Cửa Hàng
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Số Điện Thoại
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Trạng Thái
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Ngày Đăng Ký
                  </th>
                  <th className="text-left px-6 py-3 text-sm font-semibold text-gray-700">
                    Hành Động
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVendors.map((vendor, index) => (
                  <tr
                    key={vendor.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 ${
                      index === filteredVendors.length - 1 ? "border-b-0" : ""
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0">
                          <svg
                            className="w-5 h-5 text-emerald-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                          </svg>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 text-sm">
                            {vendor.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {vendor.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vendor.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vendor.phone}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          vendor.status
                        )}`}
                      >
                        {vendor.statusLabel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {vendor.date}
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/admin/approvals/${vendor.id}`}>
                        <button className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100">
                          Chi tiết
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
              <span className="text-sm text-gray-600">
                Hiển thị 1 đến 3 trong tổng số 65 kết quả
              </span>
              <div className="flex items-center gap-1">
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  ‹
                </button>
                <button className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  2
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  3
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">
                  ›
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredVendors.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-md p-8 text-center">
            <p className="text-gray-600">Không tìm thấy đơn đăng ký nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorApprovals;
