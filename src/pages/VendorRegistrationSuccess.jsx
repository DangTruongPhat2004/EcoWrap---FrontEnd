import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Mail,
  Phone,
  User,
  ArrowRight,
  HelpCircle,
  MessageCircle,
} from "lucide-react";

const VendorRegistrationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { shopName, email, phone, vendorId } = location.state || {
    shopName: "Cửa hàng Xanh Sạch",
    email: "cuahangxanh@example.com",
    phone: "0909 123 456",
    vendorId: "ECW-2023-0015",
  };

  const nextSteps = [
    {
      number: 1,
      text: "Kiểm tra email của bạn để nhận báo xác nhận.",
    },
    {
      number: 2,
      text: "Chuẩn bị thêm tài liệu nếu được yêu cầu.",
    },
    {
      number: 3,
      text: "Bắt đầu quản lý cửa hàng sau khi được phê duyệt.",
    },
  ];

  const contactOptions = [
    {
      icon: Mail,
      title: "Gửi Email",
    },
    {
      icon: Phone,
      title: "Gọi Hotline",
    },
    {
      icon: MessageCircle,
      title: "Live Chat",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Card */}
        <div className="bg-white rounded-lg shadow-md p-8 md:p-12">
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-3">
            Chúc Mừng! Đăng Ký Thành Công!
          </h1>

          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Cảm ơn bạn đã đăng ký trở thành nhà cung cấp trên EcoWrap. Đội ngũ
            của chúng tôi sẽ xem xét hồ sơ của bạn trong vòng 24 giờ và thông
            báo qua email.
          </p>

          {/* Next Steps */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6rounded flex items-center justify-center">
                <svg
                  width="20"
                  height="21"
                  viewBox="0 0 20 21"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_686_2928)">
                    <g clip-path="url(#clip1_686_2928)">
                      <path
                        d="M5.94141 1.99253C6.32813 2.34018 6.35938 2.93003 6.01172 3.31675L3.19922 6.44175C3.02734 6.63315 2.78516 6.74643 2.52734 6.75034C2.26953 6.75425 2.02344 6.65659 1.83984 6.4769L0.273438 4.9144C-0.0898438 4.54721 -0.0898438 3.95346 0.273438 3.58628C0.636719 3.21909 1.23438 3.21909 1.59766 3.58628L2.46094 4.44956L4.61328 2.05893C4.96094 1.67221 5.55078 1.64096 5.9375 1.98862L5.94141 1.99253ZM5.94141 8.24253C6.32813 8.59018 6.35938 9.18003 6.01172 9.56675L3.19922 12.6917C3.02734 12.8832 2.78516 12.9964 2.52734 13.0003C2.26953 13.0042 2.02344 12.9066 1.83984 12.7269L0.273438 11.1644C-0.09375 10.7972 -0.09375 10.2035 0.273438 9.84018C0.640625 9.4769 1.23438 9.473 1.59766 9.84018L2.46094 10.7035L4.61328 8.31284C4.96094 7.92612 5.55078 7.89487 5.9375 8.24253H5.94141ZM8.75 4.25034C8.75 3.55893 9.30859 3.00034 10 3.00034H18.75C19.4414 3.00034 20 3.55893 20 4.25034C20 4.94175 19.4414 5.50034 18.75 5.50034H10C9.30859 5.50034 8.75 4.94175 8.75 4.25034ZM8.75 10.5003C8.75 9.80893 9.30859 9.25034 10 9.25034H18.75C19.4414 9.25034 20 9.80893 20 10.5003C20 11.1917 19.4414 11.7503 18.75 11.7503H10C9.30859 11.7503 8.75 11.1917 8.75 10.5003ZM6.25 16.7503C6.25 16.0589 6.80859 15.5003 7.5 15.5003H18.75C19.4414 15.5003 20 16.0589 20 16.7503C20 17.4417 19.4414 18.0003 18.75 18.0003H7.5C6.80859 18.0003 6.25 17.4417 6.25 16.7503ZM1.875 14.8753C2.37228 14.8753 2.84919 15.0729 3.20083 15.4245C3.55246 15.7761 3.75 16.2531 3.75 16.7503C3.75 17.2476 3.55246 17.7245 3.20083 18.0762C2.84919 18.4278 2.37228 18.6253 1.875 18.6253C1.37772 18.6253 0.900805 18.4278 0.549175 18.0762C0.197544 17.7245 -1.11759e-08 17.2476 -1.11759e-08 16.7503C-1.11759e-08 16.2531 0.197544 15.7761 0.549175 15.4245C0.900805 15.0729 1.37772 14.8753 1.875 14.8753Z"
                        fill="#8B6F47"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_686_2928">
                      <rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                    <clipPath id="clip1_686_2928">
                      <path d="M0 0.5H20V20.5H0V0.5Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-[#8B6F47]">
                Các bước tiếp theo
              </h2>
            </div>

            <div className="space-y-3">
              {nextSteps.map((step) => (
                <div key={step.number} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {step.number}
                  </div>
                  <p className="text-gray-700">{step.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Account Info */}
          <div className="border-t border-b border-gray-200 py-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[#8B6F47]" />
              <h3 className="font-semibold text-[#8B6F47]">
                Thông tin tài khoản
              </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tên cửa hàng</p>
                <p className="font-medium text-gray-800">{shopName}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Email</p>
                <p className="font-medium text-gray-800">{email}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Số điện thoại</p>
                <p className="font-medium text-gray-800">{phone}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Mã số đăng ký</p>
                <p className="font-medium text-[#8B6F47]">{vendorId}</p>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="text-center">
            <button
              onClick={() => navigate("/products")}
              className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
            >
              Đi Tới Trang Bán Hàng
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Help Section */}

        <h3 className="text-center text-lg font-semibold text-gray-800 mb-2 mt-18">
          Bạn cần hỗ trợ?
        </h3>
        <p className="text-center text-gray-600 mb-6">
          Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn
        </p>

        <div className="flex justify-center gap-8">
          {contactOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center gap-2 text-[#8B6F47] hover:text-emerald-600 transition-colors cursor-pointer"
            >
              <option.icon className="w-5 h-5" />
              <span className="font-medium">{option.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorRegistrationSuccess;
