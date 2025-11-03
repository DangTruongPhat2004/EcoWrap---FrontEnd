import { useState } from "react";
import { Building2, User } from "lucide-react";
import VendorProfile from "./VendorProfile";
import VendorUserProfile from "./VendorUserProfile";

const VendorSettings = () => {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Cài Đặt</h1>
        <p className="text-gray-600">
          Quản lý thông tin cửa hàng và thông tin cá nhân
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab("company")}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "company"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span>Thông Tin Công Ty</span>
            </button>
            <button
              onClick={() => setActiveTab("personal")}
              className={`flex items-center space-x-2 px-6 py-4 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "personal"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <User className="w-5 h-5" />
              <span>Thông Tin Cá Nhân</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === "company" ? <VendorProfile /> : <VendorUserProfile />}
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;
