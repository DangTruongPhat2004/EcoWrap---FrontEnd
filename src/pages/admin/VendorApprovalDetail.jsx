import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  getRegistrationById,
  approveRegistration,
  adminRejectRegistration,
} from "../../services/sellerRegistrationApi";

const VendorApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  // Fetch registration details
  useEffect(() => {
    const fetchRegistration = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getRegistrationById(id);

        // Transform backend data to frontend format
        const transformedVendor = {
          id: data.registrationId || data.id,
          name: data.companyName,
          email: data.licenseId || "N/A",
          phone: data.companyPhone,
          address: data.companyAddress,
          registrationDate: data.submittedAt
            ? new Date(data.submittedAt).toLocaleString("vi-VN")
            : "N/A",
          status: data.status,
          businessLicense: {
            name: "Giấy Phép Kinh Doanh",
            url: data.businessLicenseFileUrl || "#",
          },
          cccd: {
            name: "CCCD/CMND",
            url: data.personalIdImageUrl || "#",
          },
        };

        setVendor(transformedVendor);
      } catch (err) {
        console.error("Error fetching registration:", err);
        setError("Không thể tải thông tin đăng ký");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRegistration();
    }
  }, [id]);

  const handleApprove = async () => {
    setIsApproving(true);
    setError(null);

    try {
      await approveRegistration(id);
      alert("Đã phê duyệt đơn đăng ký thành công!");
      navigate("/admin/approvals");
    } catch (err) {
      console.error("Error approving registration:", err);
      setError(
        err.response?.data?.message || "Không thể phê duyệt đơn đăng ký"
      );
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      alert("Vui lòng nhập lý do từ chối");
      return;
    }

    setIsRejecting(true);
    setError(null);

    try {
      await adminRejectRegistration(id, rejectReason);
      alert("Đã từ chối đơn đăng ký");
      navigate("/admin/approvals");
    } catch (err) {
      console.error("Error rejecting registration:", err);
      setError(err.response?.data?.message || "Không thể từ chối đơn đăng ký");
    } finally {
      setIsRejecting(false);
      setShowRejectModal(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !vendor) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <div className="max-w-[1200px] mx-auto">
          <button
            onClick={() => navigate("/admin/approvals")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="text-sm">Quay lại</span>
          </button>
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-[1200px] mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate("/admin/approvals")}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="text-sm">Quay lại</span>
        </button>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          Chi Tiết Đăng Ký - {vendor?.name}
        </h1>
        <p className="text-gray-600 text-sm mb-6">
          Xem xét thông tin đăng ký nhà cung cấp bảo bì thân thiện môi trường
        </p>

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
            Vui lòng kiểm tra trạng kỳ thông tin và tài liệu để đảm bảo tính
            minh bạch và eco-friendly.
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Thông Tin Cơ Bản
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tên Cửa Hàng
              </label>
              <input
                type="text"
                value={vendor.name}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Địa Chỉ
              </label>
              <input
                type="text"
                value={vendor.address}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="text"
                value={vendor.email}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngày Đăng Ký
              </label>
              <input
                type="text"
                value={vendor.registrationDate}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số Điện Thoại
              </label>
              <input
                type="text"
                value={vendor.phone}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhà Cung Cấp
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md bg-gray-50">
                <svg
                  className="w-4 h-4 text-emerald-600"
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
                <span className="text-sm text-gray-900">{vendor.supplier}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Tài Liệu Xác Minh
            </h2>
          </div>

          {/* Business License */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              {vendor.businessLicense.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {vendor.businessLicense.files.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="bg-white rounded-md p-8 border border-gray-200 mb-3 flex items-center justify-center h-32">
                    <svg
                      className="w-12 h-12 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 flex items-center justify-center gap-2">
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
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CCCD */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              {vendor.cccd.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {vendor.cccd.files.map((file) => (
                <div
                  key={file.id}
                  className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                >
                  <div className="bg-white rounded-md overflow-hidden border border-gray-200 mb-3">
                    <img
                      src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop"
                      alt="CCCD Preview"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <button className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 flex items-center justify-center gap-2">
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
                    Tải xuống
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={() => setShowRejectModal(true)}
            disabled={isRejecting || vendor?.status !== "Pending"}
            className="px-8 py-2.5 border-2 border-amber-600 text-amber-700 rounded-md font-semibold hover:bg-amber-50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <XMarkIcon className="w-5 h-5" />
            Từ Chối
          </button>
          <button
            onClick={handleApprove}
            disabled={isApproving || vendor?.status !== "Pending"}
            className="px-8 py-2.5 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CheckIcon className="w-5 h-5" />
            {isApproving ? "Đang xử lý..." : "Phê Duyệt"}
          </button>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Từ chối đơn đăng ký
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Vui lòng nhập lý do từ chối đơn đăng ký này:
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Nhập lý do từ chối..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[100px]"
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectReason("");
                  }}
                  disabled={isRejecting}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleReject}
                  disabled={isRejecting || !rejectReason.trim()}
                  className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-md font-medium hover:bg-amber-700 disabled:opacity-50"
                >
                  {isRejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorApprovalDetail;
