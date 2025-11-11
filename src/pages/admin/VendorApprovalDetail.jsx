import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";
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
  const { message } = App.useApp();
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
        console.log("Registration data:", data); // Debug log

        // Transform backend data to frontend format
        const transformedVendor = {
          id: data.registrationId || data.id,
          name: data.companyName || "N/A",
          email: data.user?.email || data.licenseId || "N/A",
          phone: data.companyPhone || "N/A",
          address: data.companyAddress || "Chưa có địa chỉ",
          registrationDate:
            data.requestedDate || data.submittedAt
              ? new Date(data.requestedDate || data.submittedAt).toLocaleString(
                  "vi-VN"
                )
              : "N/A",
          status: data.approvalStatus || "Pending",
          userId: data.user?.userId || data.userId,
          userName: data.user?.fullName || data.user?.username || "N/A",
          fullName: data.user?.fullName || "N/A",
          profileImage: data.user?.profileImage || null,
          businessLicense: {
            name: "Giấy Phép Kinh Doanh",
            url: data.documentPath || null,
          },
          cccd: {
            name: "CCCD/CMND",
            url: data.personalIdImage || null,
          },
          licenseId: data.licenseId || "N/A",
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
      messageHelper.success(message, "Đã phê duyệt đơn đăng ký thành công!");
      navigate("/admin/approvals");
    } catch (err) {
      console.error("Error approving registration:", err);
      const errorMessage =
        err.response?.data?.message || "Không thể phê duyệt đơn đăng ký";
      const statusCode = err.response?.status;

      setError(errorMessage);
      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      messageHelper.warning(message, "Vui lòng nhập lý do từ chối");
      return;
    }

    setIsRejecting(true);
    setError(null);

    try {
      await adminRejectRegistration(id, rejectReason);
      messageHelper.success(message, "Đã từ chối đơn đăng ký");
      navigate("/admin/approvals");
    } catch (err) {
      console.error("Error rejecting registration:", err);
      const errorMessage =
        err.response?.data?.message || "Không thể từ chối đơn đăng ký";
      const statusCode = err.response?.status;

      setError(errorMessage);
      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsRejecting(false);
      setShowRejectModal(false);
    }
  };

  // Loading state
  if (loading || !vendor) {
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
          Chi Tiết Đăng Ký - {vendor.name}
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
            Vui lòng kiểm tra kỹ thông tin và tài liệu để đảm bảo tính minh bạch
            và eco-friendly.
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-white border border-gray-200 rounded-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center overflow-hidden">
              {vendor.profileImage ? (
                <img
                  src={vendor.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
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
              )}
            </div>
            <h2 className="text-lg font-bold text-gray-900">
              Thông Tin Cơ Bản
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và Tên
              </label>
              <input
                type="text"
                value={vendor.fullName}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
            </div>

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
                Mã giấy phép
              </label>
              <input
                type="text"
                value={vendor.licenseId}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm bg-gray-50"
              />
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
              {vendor.businessLicense.url ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="bg-white rounded-md p-8 border border-gray-200 mb-3 flex items-center justify-center h-32">
                    {vendor.businessLicense.url.match(
                      /\.(jpg|jpeg|png|gif)$/i
                    ) ? (
                      <img
                        src={vendor.businessLicense.url}
                        alt="Business License"
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
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
                    )}
                  </div>
                  <a
                    href={vendor.businessLicense.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 flex items-center justify-center gap-2"
                  >
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
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-2 text-center text-gray-500">
                  Chưa có tài liệu
                </div>
              )}
            </div>
          </div>

          {/* CCCD */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">
              {vendor.cccd.name}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {vendor.cccd.url ? (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="bg-white rounded-md overflow-hidden border border-gray-200 mb-3">
                    {vendor.cccd.url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                      <img
                        src={vendor.cccd.url}
                        alt="CCCD"
                        className="w-full h-48 object-contain"
                      />
                    ) : (
                      <div className="w-full h-48 flex items-center justify-center">
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
                    )}
                  </div>
                  <a
                    href={vendor.cccd.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-md text-sm font-medium hover:bg-emerald-100 flex items-center justify-center gap-2"
                  >
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
                  </a>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 col-span-2 text-center text-gray-500">
                  Chưa có tài liệu
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white border border-gray-200 rounded-md p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Trạng thái:{" "}
                <span
                  className={`${
                    vendor.status === "Pending"
                      ? "text-yellow-600"
                      : vendor.status === "Approved"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {vendor.status}
                </span>
              </h3>
              <p className="text-sm text-gray-600">
                Xem xét và quyết định phê duyệt nhà cung cấp
              </p>
            </div>
            <div className="flex gap-3">
              {vendor.status === "Pending" && (
                <>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    disabled={isRejecting}
                    className="px-6 py-2 bg-white border-2 border-red-600 text-red-600 rounded-md font-medium hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <XMarkIcon className="w-5 h-5" />
                    {isRejecting ? "Đang xử lý..." : "Từ chối"}
                  </button>

                  <button
                    onClick={handleApprove}
                    disabled={isApproving}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-md font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <CheckIcon className="w-5 h-5" />
                    {isApproving ? "Đang xử lý..." : "Phê duyệt"}
                  </button>
                </>
              )}
              {vendor.status !== "Pending" && (
                <p className="text-sm text-gray-500">
                  Đơn đăng ký đã được xử lý
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Xác nhận từ chối
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Vui lòng nhập lý do từ chối đơn đăng ký:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[100px]"
              placeholder="Nhập lý do từ chối..."
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md font-medium hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleReject}
                disabled={isRejecting || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isRejecting ? "Đang xử lý..." : "Xác nhận từ chối"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorApprovalDetail;
