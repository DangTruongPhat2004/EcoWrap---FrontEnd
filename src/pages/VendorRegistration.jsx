import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Upload,
  ChevronRight,
  ChevronLeft,
  AlertCircle,
  HelpCircle,
  MessageCircle,
} from "lucide-react";
import { submitSellerRegistration } from "../services/sellerRegistrationApi";

const VendorRegistration = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Shop Info
    shopName: "",
    email: "",
    phone: "",

    // Step 2: Identity Verification
    cccdFile: null,
    cccdFileName: "",

    // Step 3: Business Info
    businessAddress: "",
    businessLicenseFile: null,
    businessLicenseFileName: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e, fieldName, fileNameField) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = [
        "application/pdf",
        "image/jpeg",
        "image/jpg",
        "image/png",
      ];
      if (!validTypes.includes(file.type)) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Chỉ chấp nhận file PDF, JPEG, JPG hoặc PNG",
        }));
        return;
      }
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: "Kích thước file không được vượt quá 5MB",
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [fieldName]: file,
        [fileNameField]: file.name,
      }));
      setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.shopName.trim()) {
      newErrors.shopName = "Vui lòng nhập tên shop";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.cccdFile) {
      newErrors.cccdFile = "Vui lòng tải lên CCCD/CMND";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    if (!formData.businessAddress.trim()) {
      newErrors.businessAddress = "Vui lòng nhập địa chỉ kinh doanh";
    }
    if (!formData.businessLicenseFile) {
      newErrors.businessLicenseFile = "Vui lòng tải lên giấy phép kinh doanh";
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Vui lòng đồng ý với chính sách và điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === 1) {
      isValid = validateStep1();
    } else if (currentStep === 2) {
      isValid = validateStep2();
    }

    if (isValid && currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep3()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Create FormData to send to backend
      const apiFormData = new FormData();
      apiFormData.append("CompanyName", formData.shopName || "");
      apiFormData.append("CompanyAddress", formData.businessAddress || "");
      apiFormData.append("CompanyPhone", formData.phone || "");
      apiFormData.append("LicenseId", formData.email || ""); // Using email as license ID temporarily

      if (formData.cccdFile) {
        apiFormData.append("PersonalIdImage", formData.cccdFile);
      }

      if (formData.businessLicenseFile) {
        apiFormData.append("BusinessLicenseFile", formData.businessLicenseFile);
      }

      // Submit the registration
      const response = await submitSellerRegistration(apiFormData);

      // Navigate to success page
      navigate("/vendor-registration-success", {
        state: {
          shopName: formData.shopName,
          email: formData.email,
          phone: formData.phone,
          message: response?.message || "Đơn đăng ký đã được gửi thành công!",
        },
      });
    } catch (error) {
      console.error("Error submitting registration:", error);

      // Handle different error types
      let errorMessage = "Đã xảy ra lỗi khi gửi đơn đăng ký. Vui lòng thử lại.";

      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = "Bạn cần đăng nhập để đăng ký làm người bán.";
          // Optionally redirect to login
          setTimeout(() => navigate("/login"), 2000);
        } else if (error.response.status === 409) {
          errorMessage =
            error.response.data?.message || "Bạn đã có đơn đăng ký trước đó.";
        } else if (error.response.status === 400) {
          errorMessage =
            error.response.data?.message || "Thông tin đăng ký không hợp lệ.";
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      }

      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, label: "Thông tin shop" },
      { number: 2, label: "Thông tin định danh" },
      { number: 3, label: "Thông tin kinh doanh" },
    ];

    return (
      <div className="flex items-center justify-center mb-10 px-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-semibold transition-all duration-300 shadow-sm ${
                  currentStep >= step.number
                    ? "bg-emerald-600 text-white shadow-emerald-200"
                    : "bg-gray-200 text-gray-500"
                } ${
                  currentStep === step.number
                    ? "ring-4 ring-emerald-100 scale-110"
                    : ""
                }`}
              >
                {currentStep > step.number ? (
                  <CheckCircle2 className="w-7 h-7" />
                ) : (
                  <span className="text-lg">{step.number}</span>
                )}
              </div>
              <span
                className={`mt-3 text-sm font-medium transition-all ${
                  currentStep >= step.number
                    ? "text-emerald-600"
                    : "text-gray-500"
                } ${currentStep === step.number ? "font-semibold" : ""}`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`w-16 md:w-24 h-1 mx-3 md:mx-6 transition-all duration-500 rounded-full ${
                  currentStep > step.number ? "bg-emerald-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderFileUpload = (fieldName, fileNameField, label, error) => {
    const fileName = formData[fileNameField];

    return (
      <div className="space-y-2">
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
            <span className="text-red-500">*</span>
          </label>
        )}
        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            fileName
              ? "border-emerald-500 bg-emerald-50"
              : error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-emerald-400 hover:bg-emerald-50/30"
          }`}
        >
          <input
            type="file"
            id={fieldName}
            className="hidden"
            accept=".pdf,.jpeg,.jpg,.png"
            onChange={(e) => handleFileChange(e, fieldName, fileNameField)}
          />
          <label htmlFor={fieldName} className="cursor-pointer">
            <div className="flex flex-col items-center">
              <div
                className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-all ${
                  fileName
                    ? "bg-emerald-500 shadow-lg shadow-emerald-200"
                    : "bg-emerald-100"
                }`}
              >
                {fileName ? (
                  <CheckCircle2 className="w-8 h-8 text-white" />
                ) : (
                  <Upload className="w-8 h-8 text-emerald-600" />
                )}
              </div>
              {fileName ? (
                <div className="space-y-2">
                  <p className="text-emerald-700 font-semibold text-lg">
                    ✓ Đã tải lên thành công
                  </p>
                  <p className="text-gray-700 font-medium">{fileName}</p>
                  <button
                    type="button"
                    className="text-emerald-600 text-sm hover:text-emerald-700 underline mt-2"
                  >
                    Thay đổi tệp
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-gray-700 font-medium mb-2 text-lg">
                    Kéo và thả tệp vào đây hoặc
                  </p>
                  <button
                    type="button"
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm"
                  >
                    Chọn tệp
                  </button>
                  <p className="text-xs text-gray-500 mt-4">
                    Hỗ trợ định dạng: PDF, JPEG, PNG (tối đa 5MB)
                  </p>
                </>
              )}
            </div>
          </label>
        </div>
        {error && (
          <p className="text-red-500 text-sm flex items-center gap-1 bg-red-50 p-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-[#8B6F47] mb-4">
            Đăng Ký Trở Thành Nhà Cung Cấp
          </h1>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Hoàn tất các bước dưới đây để tạo cửa hàng của bạn trên EcoWrap và
            bắt đầu bán các sản phẩm bao bì thân thiện với môi trường.
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Tiến độ hoàn thành</span>
            <span className="font-semibold text-emerald-600">
              {Math.round((currentStep / 3) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 md:p-10">
          {/* Step 1: Shop Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#8B6F47] mb-6">
                Bước 1: Thông tin shop
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tên shop<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.shopName
                      ? "border-red-500 bg-red-50"
                      : formData.shopName
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="VD: Cửa hàng Xanh Sạch"
                />
                {errors.shopName && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.shopName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.email
                      ? "border-red-500 bg-red-50"
                      : formData.email
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="VD: cuahangxanh@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Số điện thoại<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.phone
                      ? "border-red-500 bg-red-50"
                      : formData.phone
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="VD: 0909 123 456"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Identity Verification */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#8B6F47] mb-4">
                Bước 2: Thông tin định danh
              </h2>
              <p className="text-gray-600 mb-6">
                Vui lòng tải lên bản sao CCCD/CMND của bạn để xác minh danh
                tính.
              </p>

              {renderFileUpload(
                "cccdFile",
                "cccdFileName",
                "CCCD/CMND",
                errors.cccdFile
              )}

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Đảm bảo tài liệu rõ ràng, cây số không bị mờ và trong danh
                  định dạng hỗ trợ.
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Business Info */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#8B6F47] mb-6">
                Bước 3: Thông tin kinh doanh
              </h2>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Địa chỉ kinh doanh<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  type="text"
                  name="businessAddress"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3.5 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all ${
                    errors.businessAddress
                      ? "border-red-500 bg-red-50"
                      : formData.businessAddress
                      ? "border-emerald-500 bg-emerald-50/30"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  placeholder="VD: 456 Đường Lê, Quận 2, TP.HCM"
                />
                {errors.businessAddress && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1 bg-red-50 p-2 rounded-lg">
                    <AlertCircle className="w-4 h-4" />
                    {errors.businessAddress}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giấy phép kinh doanh
                </label>
                <p className="text-sm text-gray-500 mb-3">
                  Vui lòng tải lên bản sao giấy phép kinh doanh của bạn để xác
                  minh hoạt động kinh doanh.
                </p>
                {renderFileUpload(
                  "businessLicenseFile",
                  "businessLicenseFileName",
                  "",
                  errors.businessLicenseFile
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                  Đảm bảo tài liệu giấy phép kinh doanh còn hiệu lực và rõ ràng.
                </p>
              </div>

              <div className="flex items-start gap-3 pt-4">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleInputChange}
                  className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-700">
                  Tôi xác nhận rằng những thông tin trên là chính xác và đồng ý
                  với{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    điều khoản xác minh
                  </a>{" "}
                  và{" "}
                  <a
                    href="#"
                    className="text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    điều khoản sử dụng
                  </a>{" "}
                  của EcoWrap
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.agreeTerms}
                </p>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between items-center mt-10 pt-8 border-t-2 border-gray-100">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all font-medium shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
                Quay lại
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all ml-auto font-semibold"
              >
                Tiếp theo
                <ChevronRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all ml-auto font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Đang gửi..." : "Hoàn tất đăng ký"}
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-800 font-medium">Lỗi</p>
                <p className="text-sm text-red-600 mt-1">{errors.submit}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Chính sách
            </a>{" "}
            và{" "}
            <a
              href="#"
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              Điều khoản sử dụng
            </a>{" "}
            của EcoWrap.
          </p>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h3 className="text-center text-lg font-semibold text-gray-800 mb-2">
            Cần hỗ trợ?
          </h3>
          <p className="text-center text-gray-600 mb-6">
            Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group">
              <HelpCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  Câu hỏi thường gặp
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Xem các câu hỏi và câu trả lời phổ biến
                </p>
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                >
                  Xem FAQ
                </a>
              </div>
            </div>

            <div className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-emerald-500 hover:shadow-sm transition-all cursor-pointer group">
              <MessageCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors">
                  Liên hệ hỗ trợ
                </h4>
                <p className="text-sm text-gray-600 mb-2">
                  Gặp khó khăn? Liên hệ đội ngũ hỗ trợ
                </p>
                <a
                  href="#"
                  className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold"
                >
                  Liên hệ ngay
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorRegistration;
