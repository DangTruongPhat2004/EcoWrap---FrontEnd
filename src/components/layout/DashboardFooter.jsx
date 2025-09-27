import { Phone, Mail, Globe, Leaf } from "lucide-react";

const DashboardFooter = () => {
  return (
    <footer className="bg-white border-t border-gray-200 px-6 py-4">
      <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Leaf className="w-5 h-5 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">EcoWrap</span>
          </div>
          <span className="text-gray-400">|</span>
          <p className="text-sm text-gray-600">
            Giải pháp bao bì sinh thái và môi trường
          </p>
        </div>

        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-4">
            <a
              href="#"
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>
          <span className="text-gray-400">|</span>
          <div className="text-right">
            <p className="text-gray-500">Email: support@ecowrap.com</p>
            <p className="text-gray-500">Hotline: 0123 456 789</p>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 text-center">
        <p className="text-xs text-gray-400">
          © 2024 EcoWrap. Tất cả quyền được bảo lưu. |
          <span className="ml-1">Liên hệ Hỗ trợ Khách hàng</span>
        </p>
      </div>
    </footer>
  );
};

export default DashboardFooter;
