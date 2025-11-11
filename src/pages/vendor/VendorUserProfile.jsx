import { useState, useEffect } from "react";
import { Edit3, Save, X, Eye, EyeOff, User, Lock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getUserIdFromToken } from "../../utils/jwt";
import {
  getUserById,
  updateUser,
  changePassword,
} from "../../services/userApi";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";

const VendorUserProfile = () => {
  const { message } = App.useApp();
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    phone: "",
    email: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch user data
  useEffect(() => {
    // Prefill from localStorage for instant UI
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const localData = {
          username: u?.userName || u?.username || "",
          fullName: u?.fullName || "",
          phone: u?.phoneNumber || u?.phone || "",
          email: u?.email || "",
        };
        setFormData(localData);
        setOriginalData(localData);
      }
    } catch {}

    // Fetch fresh data
    const fetchProfile = async () => {
      try {
        setLoading(true);

        // Resolve userId from multiple sources
        let userId = user?.userId;
        if (!userId) {
          try {
            const raw = localStorage.getItem("user");
            if (raw) {
              userId = JSON.parse(raw)?.userId;
            }
          } catch {}
        }
        if (!userId) {
          const token = localStorage.getItem("token");
          if (token) {
            userId = getUserIdFromToken(token);
          }
        }

        if (!userId) {
          console.error("Could not resolve userId");
          setLoading(false);
          return;
        }

        const response = await getUserById(userId);
        const r = response?.data || response?.Data || response;

        if (r) {
          const userData = {
            username: r.userName || r.username || "",
            fullName: r.fullName || "",
            phone: r.phoneNumber || r.phone || "",
            email: r.email || "",
          };
          setFormData(userData);
          setOriginalData(userData);

          // Update localStorage
          try {
            const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
            localStorage.setItem(
              "user",
              JSON.stringify({
                ...storedUser,
                userId: r.userId || storedUser.userId,
                userName: userData.username,
                username: userData.username,
                fullName: userData.fullName,
                phoneNumber: userData.phone,
                email: userData.email,
              })
            );
          } catch (e) {
            console.error("Failed to update localStorage:", e);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        messageHelper.error(message, "Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      let userId = user?.userId;
      if (!userId) {
        const raw = localStorage.getItem("user");
        if (raw) userId = JSON.parse(raw)?.userId;
      }
      if (!userId) {
        const token = localStorage.getItem("token");
        if (token) userId = getUserIdFromToken(token);
      }

      if (!userId) {
        messageHelper.error(message, "Không thể xác định người dùng");
        return;
      }

      const updateData = {
        userName: formData.username,
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        email: formData.email,
      };

      await updateUser(userId, updateData);
      messageHelper.success(message, "Cập nhật thông tin thành công!");
      setOriginalData(formData);
      setIsEditing(false);

      // Update localStorage
      try {
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...storedUser,
            userName: formData.username,
            username: formData.username,
            fullName: formData.fullName,
            phoneNumber: formData.phone,
            email: formData.email,
          })
        );
      } catch (e) {
        console.error("Failed to update localStorage:", e);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      messageHelper.error(
        message,
        error?.response?.data?.message || "Không thể cập nhật thông tin"
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handlePasswordChange = async () => {
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      messageHelper.error(message, "Vui lòng điền đầy đủ thông tin");
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      messageHelper.error(message, "Mật khẩu mới không khớp");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      messageHelper.error(message, "Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsChangingPassword(true);
      const res = await changePassword(
        passwordData.oldPassword,
        passwordData.newPassword
      );
      if (res?.success || res?.Success) {
        messageHelper.success(message, "Đổi mật khẩu thành công");
        setShowPasswordModal(false);
        setPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        messageHelper.error(
          message,
          res?.message || res?.Message || "Không thể đổi mật khẩu"
        );
      }
    } catch (e) {
      messageHelper.error(
        message,
        e?.response?.data?.message || "Có lỗi khi đổi mật khẩu"
      );
      console.error(e);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (loading && !formData.username) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        <p className="ml-4 text-gray-600">Đang tải...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {formData.fullName || formData.username || "Tài khoản"}
              </h2>
              <p className="text-gray-500">{formData.email}</p>
            </div>
          </div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <Edit3 size={18} />
              Chỉnh sửa
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <X size={18} />
                Hủy
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                <Save size={18} />
                {isSaving ? "Đang lưu..." : "Lưu"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin cá nhân
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên đăng nhập
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số điện thoại
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Password Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Bảo mật</h2>
        <button
          onClick={() => setShowPasswordModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Lock size={18} />
          Đổi mật khẩu
        </button>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Đổi mật khẩu
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu cũ
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        oldPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        newPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({
                    oldPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  });
                }}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {isChangingPassword ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorUserProfile;
