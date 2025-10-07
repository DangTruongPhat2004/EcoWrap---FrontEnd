import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const VendorApprovalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isApproving, setIsApproving] = useState(false);

  // Mock data - in real app, fetch based on id
  const vendor = {
    id: id,
    name: "GreenPack Solutions",
    email: "greenpack@example.com",
    phone: "0909 888 777",
    address: "123 Đường Xanh, Quận 1, TP.HCM",
    registrationDate: "01/10/2025 14:20 PM",
    supplier: "GreenSource Materials",
    businessLicense: {
      name: "Giấy Phép Kinh Doanh",
      files: [
        { id: 1, name: "business-license-1.pdf", url: "#" },
        { id: 2, name: "business-license-2.pdf", url: "#" },
      ],
    },
    cccd: {
      name: "CCCD",
      files: [
        { id: 1, name: "cccd-front.jpg", url: "#", preview: true },
        { id: 2, name: "cccd-back.jpg", url: "#", preview: true },
      ],
    },
  };

  const handleApprove = () => {
    setIsApproving(true);
    // Add approval logic here
    setTimeout(() => {
      setIsApproving(false);
      navigate("/admin/approvals");
    }, 1000);
  };

  const handleReject = () => {
    // Add rejection logic here
    navigate("/admin/approvals");
  };

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
            onClick={handleReject}
            className="px-8 py-2.5 border-2 border-amber-600 text-amber-700 rounded-md font-semibold hover:bg-amber-50 flex items-center gap-2"
          >
            <XMarkIcon className="w-5 h-5" />
            Từ Chối
          </button>
          <button
            onClick={handleApprove}
            disabled={isApproving}
            className="px-8 py-2.5 bg-emerald-600 text-white rounded-md font-semibold hover:bg-emerald-700 flex items-center gap-2 disabled:opacity-50"
          >
            <CheckIcon className="w-5 h-5" />
            {isApproving ? "Đang xử lý..." : "Phê Duyệt"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorApprovalDetail;
