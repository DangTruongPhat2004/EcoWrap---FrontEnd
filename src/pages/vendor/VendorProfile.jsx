import { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Building2,
  CreditCard,
  User,
  Camera,
  MapPin,
  QrCode,
} from "lucide-react";
import { getMySellerInfo, updateSeller } from "../../services/sellerApi";

const VendorProfile = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    address: "",
    bankAccountNumber: "",
    bankName: "",
    accountHolderName: "",
    bankBranch: "",
    qrCodeImage: null,
    companyImage: null,
    companyBanner: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrPreview, setQrPreview] = useState(null);
  const [qrFile, setQrFile] = useState(null);
  const [companyImagePreview, setCompanyImagePreview] = useState(null);
  const [companyImageFile, setCompanyImageFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);

  // Fetch seller info on mount
  useEffect(() => {
    fetchSellerInfo();
  }, []);

  const fetchSellerInfo = async () => {
    try {
      setLoading(true);
      const response = await getMySellerInfo();
      console.log("Seller info:", response);

      const sellerData = response.data || response;
      setFormData({
        companyName: sellerData.companyName || "",
        address: sellerData.address || "",
        bankAccountNumber: sellerData.bankAccountNumber || "",
        bankName: sellerData.bankName || "",
        accountHolderName: sellerData.accountHolderName || "",
        bankBranch: sellerData.bankBranch || "",
        qrCodeImage: sellerData.qrcodeImage || null,
        companyImage: sellerData.companyImage || null,
        companyBanner: sellerData.companyBanner || null,
      });
      setQrPreview(sellerData.qrcodeImage);
      setCompanyImagePreview(sellerData.companyImage || null);
      setBannerPreview(sellerData.companyBanner || null);
    } catch (err) {
      console.error("Error fetching seller info:", err);
      setError("Không thể tải thông tin người bán");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQrCodeChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setQrFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setQrPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCompanyImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCompanyImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      // Add all form fields
      formDataToSend.append("CompanyName", formData.companyName);
      formDataToSend.append("Address", formData.address);
      formDataToSend.append("BankAccountNumber", formData.bankAccountNumber);
      formDataToSend.append("BankName", formData.bankName);
      formDataToSend.append("AccountHolderName", formData.accountHolderName);
      formDataToSend.append("BankBranch", formData.bankBranch);

      // Add QR code image if changed
      if (qrFile) {
        formDataToSend.append("QRCodeImage", qrFile);
      }

      // Add company avatar and banner if changed
      if (companyImageFile) {
        formDataToSend.append("CompanyImage", companyImageFile);
      }
      if (bannerFile) {
        formDataToSend.append("CompanyBanner", bannerFile);
      }

      await updateSeller(formDataToSend);
      alert("Cập nhật thông tin thành công!");
      setIsEditing(false);
      fetchSellerInfo(); // Refresh data
    } catch (err) {
      console.error("Error updating seller info:", err);
      alert(
        "Không thể cập nhật thông tin: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchSellerInfo(); // Reset to original data
    setQrFile(null);
    setCompanyImageFile(null);
    setBannerFile(null);
    setIsEditing(false);
  };

  if (loading && !formData.companyName) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="ml-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
          <p className="text-red-800">{error}</p>
          <button
            onClick={fetchSellerInfo}
            className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thông Tin Cửa Hàng
        </h1>
        <p className="text-gray-600">
          Quản lý thông tin cửa hàng và thông tin thanh toán
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Company Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                Thông Tin Công Ty
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center space-x-2"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Chỉnh sửa</span>
                </button>
              )}
            </div>

            <div className="space-y-4">
              {/* Banner uploader */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh Banner cửa hàng
                </label>
                <div className="w-full h-40 md:h-56 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
                  {bannerPreview ? (
                    <img
                      src={bannerPreview}
                      alt="Banner"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center text-gray-400 text-sm">
                      Chưa có banner
                    </div>
                  )}
                </div>
                {isEditing && (
                  <div className="mt-2">
                    <input
                      type="file"
                      id="bannerUpload"
                      accept="image/*"
                      onChange={handleBannerChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="bannerUpload"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer text-sm"
                    >
                      <Camera className="w-4 h-4" /> Tải banner
                    </label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Công Ty*
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Nhập tên công ty"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Địa Chỉ*
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Nhập địa chỉ công ty"
                />
              </div>

              {/* Company avatar uploader */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ảnh đại diện công ty
                </label>
                <div className="w-32 h-32 rounded-lg bg-gray-50 border-2 border-dashed border-gray-300 overflow-hidden flex items-center justify-center">
                  {companyImagePreview ? (
                    <img
                      src={companyImagePreview}
                      alt="Company"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                {isEditing && (
                  <div className="mt-2">
                    <input
                      type="file"
                      id="companyImageUpload"
                      accept="image/*"
                      onChange={handleCompanyImageChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="companyImageUpload"
                      className="inline-flex items-center gap-2 px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer text-sm"
                    >
                      <Camera className="w-4 h-4" /> Tải ảnh đại diện
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <CreditCard className="w-5 h-5 mr-2 text-emerald-600" />
              Thông Tin Thanh Toán
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số Tài Khoản*
                </label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Nhập số tài khoản ngân hàng"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Ngân Hàng*
                </label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Ví dụ: Vietcombank, BIDV, Techcombank..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên Chủ Tài Khoản*
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Nhập tên chủ tài khoản"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Chi Nhánh
                </label>
                <input
                  type="text"
                  name="bankBranch"
                  value={formData.bankBranch}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                    isEditing
                      ? "border-gray-300 bg-white"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  placeholder="Ví dụ: Chi nhánh Hà Nội, Chi nhánh TP.HCM..."
                />
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
              </button>
            </div>
          )}
        </div>

        {/* QR Code Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <QrCode className="w-5 h-5 mr-2 text-emerald-600" />
              Mã QR Thanh Toán
            </h3>

            <div className="space-y-4">
              {qrPreview ? (
                <div className="w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
                  <img
                    src={qrPreview}
                    alt="QR Code"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">Chưa có mã QR</p>
                  </div>
                </div>
              )}

              {isEditing && (
                <div>
                  <input
                    type="file"
                    id="qrCodeUpload"
                    accept="image/*"
                    onChange={handleQrCodeChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="qrCodeUpload"
                    className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    <span>Tải lên mã QR</span>
                  </label>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Định dạng: JPG, PNG, GIF
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2 text-sm">
              💡 Lưu ý quan trọng
            </h4>
            <ul className="text-xs text-blue-800 space-y-1">
              <li>• Thông tin ngân hàng được sử dụng để nhận thanh toán</li>
              <li>• Mã QR giúp khách hàng thanh toán nhanh chóng</li>
              <li>• Vui lòng kiểm tra kỹ thông tin trước khi lưu</li>
              <li>• Liên hệ hỗ trợ nếu gặp vấn đề</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
