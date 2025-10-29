import { useState, useEffect } from "react";
import {
  Edit3,
  Save,
  X,
  Eye,
  EyeOff,
  User,
  Camera,
  TrendingUp,
  Package,
  Recycle,
  Key,
  Lock,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { getUserIdFromToken } from "../../utils/jwt";
import {
  getUserById,
  updateUser,
  changePassword,
} from "../../services/userApi";
import toast from "react-hot-toast";

const Profile = () => {
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
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [resetPasswordData, setResetPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Hydrate from localStorage immediately, then fetch fresh data by ID
  useEffect(() => {
    // 1) Prefill from localStorage for instant UI across all roles
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

    // 2) Resolve userId from store, localStorage, or token then fetch
    const resolveAndFetch = async () => {
      try {
        setLoading(true);
        let userId = user?.userId;
        if (!userId) {
          const raw = localStorage.getItem("user");
          if (raw) {
            const parsed = JSON.parse(raw);
            userId = parsed?.userId;
          }
        }
        if (!userId) {
          const token = localStorage.getItem("token");
          userId = getUserIdFromToken(token);
        }

        if (!userId) {
          setLoading(false);
          return;
        }

        const response = await getUserById(userId);
        const r = response?.data ?? response; // accept plain object or {data}
        if (r) {
          const userData = {
            username: r.userName || r.username || "",
            fullName: r.fullName || "",
            phone: r.phoneNumber || r.phone || "",
            email: r.email || "",
          };
          setFormData(userData);
          setOriginalData(userData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    resolveAndFetch();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!user?.userId) {
      toast.error("Không tìm thấy thông tin người dùng");
      return;
    }

    try {
      setIsSaving(true);
      const updateData = {
        userName: formData.username,
        fullName: formData.fullName,
        phoneNumber: formData.phone,
        email: formData.email,
      };

      const response = await updateUser(user.userId, updateData);

      if (response.success) {
        toast.success("Cập nhật thông tin thành công!");
        setOriginalData(formData);
        setIsEditing(false);
      } else {
        toast.error(response.message || "Không thể cập nhật thông tin");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData);
    setIsEditing(false);
  };

  const handleResetPasswordChange = (e) => {
    const { name, value } = e.target;
    setResetPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async () => {
    // Validation
    if (
      !resetPasswordData.oldPassword ||
      !resetPasswordData.newPassword ||
      !resetPasswordData.confirmPassword
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (resetPasswordData.newPassword !== resetPasswordData.confirmPassword) {
      toast.error("Mật khẩu mới không khớp!");
      return;
    }

    if (resetPasswordData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    try {
      setIsChangingPassword(true);
      const response = await changePassword(
        resetPasswordData.oldPassword,
        resetPasswordData.newPassword
      );

      if (response.success) {
        toast.success("Đổi mật khẩu thành công!");
        setShowForgotPasswordModal(false);
        setResetPasswordData({
          oldPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(response.message || "Không thể đổi mật khẩu");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error("Đã xảy ra lỗi khi đổi mật khẩu");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleCloseForgotPasswordModal = () => {
    setShowForgotPasswordModal(false);
    setResetPasswordData({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Thông Tin Cá Nhân
        </h1>
        <p className="text-gray-600">Quản lý thông tin cá nhân của bạn</p>
      </div>

      {loading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Information Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Edit3 className="w-5 h-5 mr-2 text-emerald-600" />
                  Chỉnh Sửa Thông Tin
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isEditing
                        ? "border-gray-300 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder="Username của bạn để sử dụ trong"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và Tên*
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isEditing
                        ? "border-gray-300 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số Điện Thoại*
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm rounded-l-lg">
                      +84
                    </span>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`flex-1 px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                        isEditing
                          ? "border-gray-300 bg-white"
                          : "border-gray-200 bg-gray-50"
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent ${
                      isEditing
                        ? "border-gray-300 bg-white"
                        : "border-gray-200 bg-gray-50"
                    }`}
                    placeholder="email@example.com"
                  />
                </div>

                {/* Password Change Button */}
                <div className="pt-2 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowForgotPasswordModal(true)}
                    className="text-sm text-emerald-600 hover:text-emerald-700 flex items-center space-x-1 font-medium"
                  >
                    <Key className="w-4 h-4" />
                    <span>Đổi mật khẩu</span>
                  </button>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <X className="w-4 h-4" />
                    <span>Hủy</span>
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Đang lưu...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Lưu Thay Đổi</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Profile Avatar & Stats */}
          <div className="space-y-6">
            {/* Avatar Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ảnh Đại Diện
              </h3>

              <div className="w-24 h-24 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-12 h-12 text-white" />
              </div>

              <div className="mb-4">
                <p className="font-medium text-gray-900 flex items-center justify-center">
                  <User className="w-4 h-4 mr-2" />
                  {formData.fullName}
                </p>
                <p className="text-sm text-gray-500 text-center">
                  Thành viên EcoWrap
                </p>
              </div>

              <button className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm flex items-center justify-center space-x-2">
                <Camera className="w-4 h-4" />
                <span>Xem Chi Tiết Tên Đăng</span>
              </button>
            </div>

            {/* Activity Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-emerald-600" />
                Hoạt Động
              </h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                      <Package className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Đơn hàng đã mua</p>
                      <p className="font-semibold text-emerald-600">25</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      +12%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <Recycle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Điểm tích lũy</p>
                      <p className="font-semibold text-emerald-600">1,250</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
                      Điểm thưởng
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Lock className="w-5 h-5 mr-2 text-emerald-600" />
                Đặt Lại Mật Khẩu
              </h3>
              <button
                onClick={handleCloseForgotPasswordModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu cũ*
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={resetPasswordData.oldPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showOldPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới*
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={resetPasswordData.newPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu mới*
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={resetPasswordData.confirmPassword}
                    onChange={handleResetPasswordChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={handleCloseForgotPasswordModal}
                disabled={isChangingPassword}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <X className="w-4 h-4" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleResetPassword}
                disabled={isChangingPassword}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isChangingPassword ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Đặt Lại Mật Khẩu</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
