import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  Plus,
  Search,
  MapPin,
  Phone,
  Building,
  AlertTriangle,
} from "lucide-react";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";
import warehouseApi from "../../services/warehouseApi";
import { getUserById } from "../../services/userApi";

const WarehouseManagement = () => {
  const { message } = App.useApp();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const {
    isOpen: isUpdateConfirmOpen,
    onOpen: onUpdateConfirmOpen,
    onOpenChange: onUpdateConfirmOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onOpenChange: onDeleteConfirmOpenChange,
  } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    warehouseName: "",
    address: "",
    phoneNumber: "",
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
  });
  const [errors, setErrors] = useState({});

  // Location dropdowns state
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [locationLoading, setLocationLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const response = await warehouseApi.getMyWarehouses();
      setWarehouses(response);

      // Extract phone number from first warehouse's seller.user if available
      if (
        response &&
        response.length > 0 &&
        response[0].seller?.user?.phoneNumber
      ) {
        const userPhoneNumber = response[0].seller.user.phoneNumber;
        setUserInfo({ phoneNumber: userPhoneNumber });
        console.log("Extracted phone number from warehouse:", userPhoneNumber);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setDataError("Không thể tải danh sách kho hàng. Vui lòng thử lại.");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initialize warehouses with API data
  React.useEffect(() => {
    const fetchInitialData = async () => {
      try {
        // Lấy thông tin user (chứa SĐT) từ localStorage hoặc API
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser && localUser.userId) {
          const userData = await getUserById(localUser.userId);
          console.log("User data fetched for warehouse:", userData);
          // API returns { success, data: {...}, message }, extract the actual user data
          const actualUserData = userData.data || userData;
          setUserInfo(actualUserData);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        // Có thể hiển thị thông báo lỗi nếu cần
      }
    };
    fetchWarehouses();
    fetchInitialData();
  }, []);

  // Filter warehouses based on search term
  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.warehouseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      warehouse.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.provinceId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.districtId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Districts and wards are already filtered by the useEffect hooks
  // No need to filter them again here

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.warehouseName.trim()) {
      newErrors.warehouseName = "Tên kho hàng là bắt buộc";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Địa chỉ là bắt buộc";
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = "Số điện thoại là bắt buộc";
    }
    if (!formData.provinceCode) {
      newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    }
    if (!formData.districtCode) {
      newErrors.district = "Vui lòng chọn quận/huyện";
    }
    if (!formData.wardCode) {
      newErrors.ward = "Vui lòng chọn phường/xã";
    }
    return newErrors;
  };

  // Handle form input changes
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Fetch provinces on component mount
  React.useEffect(() => {
    const loadProvinces = async () => {
      setLocationLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const response = await fetch("https://provinces.open-api.vn/api/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      } finally {
        setLocationLoading((prev) => ({ ...prev, provinces: false }));
      }
    };
    loadProvinces();
  }, []);

  // Fetch districts when province changes
  React.useEffect(() => {
    if (!formData.provinceCode) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const loadDistricts = async () => {
      setLocationLoading((prev) => ({ ...prev, districts: true }));
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/p/${formData.provinceCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
      } finally {
        setLocationLoading((prev) => ({ ...prev, districts: false }));
      }
    };
    loadDistricts();
  }, [formData.provinceCode]);

  // Fetch wards when district changes
  React.useEffect(() => {
    if (!formData.districtCode) {
      setWards([]);
      return;
    }

    const loadWards = async () => {
      setLocationLoading((prev) => ({ ...prev, wards: true }));
      try {
        const response = await fetch(
          `https://provinces.open-api.vn/api/d/${formData.districtCode}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
      } finally {
        setLocationLoading((prev) => ({ ...prev, wards: false }));
      }
    };
    loadWards();
  }, [formData.districtCode]);

  // Handle province selection
  const handleProvinceChange = (e) => {
    const code = e.target.value;
    const province = provinces.find((p) => p.code === Number(code));
    setFormData((prev) => ({
      ...prev,
      provinceCode: code,
      provinceName: province?.name || "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.province;
      delete newErrors.district;
      delete newErrors.ward;
      return newErrors;
    });
  };

  // Handle district selection
  const handleDistrictChange = (e) => {
    const code = e.target.value;
    const district = districts.find((d) => d.code === Number(code));
    setFormData((prev) => ({
      ...prev,
      districtCode: code,
      districtName: district?.name || "",
      wardCode: "",
      wardName: "",
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.district;
      delete newErrors.ward;
      return newErrors;
    });
  };

  // Handle ward selection
  const handleWardChange = (e) => {
    const code = e.target.value;
    const ward = wards.find((w) => w.code === Number(code));
    setFormData((prev) => ({
      ...prev,
      wardCode: code,
      wardName: ward?.name || "",
    }));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.ward;
      return newErrors;
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      warehouseName: "",
      address: "",
      phoneNumber: "",
      provinceCode: "",
      provinceName: "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    });
    setErrors({});
    setEditingWarehouse(null);
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWarehouses = filteredWarehouses.slice(startIndex, endIndex);

  const handleAddWarehouse = () => {
    setModalMode("add");

    // Try multiple sources for phone number
    let phoneNumber = "";

    // First try: userInfo from API
    if (userInfo?.phoneNumber) {
      phoneNumber = userInfo.phoneNumber;
    }
    // Second try: existing warehouses (from seller.user.phoneNumber)
    else if (
      warehouses &&
      warehouses.length > 0 &&
      warehouses[0].seller?.user?.phoneNumber
    ) {
      phoneNumber = warehouses[0].seller.user.phoneNumber;
    }
    // Third try: localStorage user object
    else {
      try {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser?.phoneNumber) {
          phoneNumber = localUser.phoneNumber;
        }
      } catch (e) {
        console.error("Error reading user from localStorage:", e);
      }
    }

    console.log(
      "Auto-filling phone number:",
      phoneNumber,
      "from userInfo:",
      userInfo,
      "from warehouses:",
      warehouses
    );

    setFormData({
      warehouseName: "",
      address: "",
      phoneNumber: phoneNumber, // Tự động điền SĐT của user
      provinceCode: "",
      provinceName: "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    });
    setErrors({});
    onOpen();
  };

  const handleEditWarehouse = (warehouse) => {
    setModalMode("edit");
    setEditingWarehouse(warehouse);
    setFormData({
      warehouseName: warehouse.warehouseName,
      address: warehouse.address,
      phoneNumber: warehouse.phoneNumber,
      provinceCode: warehouse.provinceId,
      provinceName: warehouse.provinceId, // Will be loaded from API
      districtCode: warehouse.districtId,
      districtName: warehouse.districtId,
      wardCode: warehouse.wardId,
      wardName: warehouse.wardId,
    });
    setErrors({});
    onOpen();
  };

  const handleSubmitForm = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    // Đóng modal chính và mở modal xác nhận tương ứng
    onOpenChange();
    if (modalMode === "add") {
      onConfirmOpen();
    } else {
      onUpdateConfirmOpen();
    }
  };

  const handleConfirmCreate = async () => {
    setIsLoading(true);
    try {
      // Prepare data for API
      const warehouseData = {
        warehouseName: formData.warehouseName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        provinceId: formData.provinceName,
        districtId: formData.districtName,
        wardId: formData.wardName,
      };

      // Call API to create warehouse
      await warehouseApi.createWarehouse(warehouseData);

      // Refresh the warehouses list from API
      await fetchWarehouses();

      // Close modals and reset form
      onConfirmOpenChange();
      resetForm();

      // Show success message
      messageHelper.success(message, "Tạo kho hàng thành công!");
    } catch (error) {
      console.error("Error creating warehouse:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Có lỗi xảy ra khi tạo kho hàng. Vui lòng thử lại.";
      const statusCode = error.response?.status;

      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!editingWarehouse) return;
    setIsLoading(true);
    try {
      const warehouseData = {
        warehouseName: formData.warehouseName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        provinceId: formData.provinceName,
        districtId: formData.districtName,
        wardId: formData.wardName,
      };

      await warehouseApi.updateWarehouse(
        editingWarehouse.warehouseId,
        warehouseData
      );

      // Refresh the warehouses list
      await fetchWarehouses();

      // Close modals and reset form
      onUpdateConfirmOpenChange();
      resetForm();

      // Show success message
      messageHelper.success(message, "Cập nhật kho hàng thành công!");
    } catch (error) {
      console.error("Error updating warehouse:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Có lỗi xảy ra khi cập nhật kho hàng. Vui lòng thử lại.";
      const statusCode = error.response?.status;

      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = () => {
    // Đóng modal chính và mở modal xác nhận xóa
    onOpenChange();
    onDeleteConfirmOpen();
  };

  const handleConfirmDelete = async () => {
    if (!editingWarehouse) return;
    setIsLoading(true);
    try {
      await warehouseApi.deleteWarehouse(editingWarehouse.warehouseId);

      // Refresh the warehouses list
      await fetchWarehouses();

      // Close modals and reset form
      onDeleteConfirmOpenChange();
      resetForm();

      // Show success message
      messageHelper.success(message, "Xóa kho hàng thành công!");
    } catch (error) {
      console.error("Error deleting warehouse:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.[0]?.message ||
        "Có lỗi xảy ra khi xóa kho hàng. Kho hàng có thể đang được sử dụng.";
      const statusCode = error.response?.status;

      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsLoading(false);
      // Đảm bảo editingWarehouse được reset
      setEditingWarehouse(null);
    }
  };

  // Loading state
  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách kho hàng...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (dataError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-red-600">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg mb-4">{dataError}</p>
        <Button color="primary" onPress={fetchWarehouses}>
          Thử lại
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Global styles for dropdown z-index */}
      <style jsx global>{`
        .heroui-select-popover {
          z-index: 10000 !important;
        }
        .heroui-select-popover-content {
          background: white !important;
          border: 1px solid #e5e7eb !important;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
            0 4px 6px -2px rgba(0, 0, 0, 0.05) !important;
        }
        .heroui-select-listbox {
          background: white !important;
        }
        .heroui-select-listbox-wrapper {
          background: white !important;
        }
      `}</style>

      {/* Header Section */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Kho Hàng</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý thông tin các kho hàng của bạn
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <Button
              color="success"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleAddWarehouse}
              className="font-medium"
            >
              Thêm Kho Hàng Mới
            </Button>
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm kiếm kho hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Warehouse Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table aria-label="Warehouse management table">
          <TableHeader>
            <TableColumn className="text-gray-700 font-semibold">
              Tên Kho
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Địa Chỉ
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Số Điện Thoại
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Tỉnh/Thành Phố
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Quận/Huyện
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Phường/Xã
            </TableColumn>
          </TableHeader>
          <TableBody>
            {currentWarehouses.map((warehouse) => (
              <TableRow
                key={warehouse.warehouseId}
                onClick={() => handleEditWarehouse(warehouse)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Building className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {warehouse.warehouseName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">
                      {warehouse.address}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700">
                      {warehouse.phoneNumber}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {warehouse.provinceId}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {warehouse.districtId}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {warehouse.wardId}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          Hiển thị {startIndex + 1}-
          {Math.min(endIndex, filteredWarehouses.length)} trong tổng số{" "}
          {filteredWarehouses.length} kho hàng
        </p>
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
          showControls
          showShadow
          color="success"
          classNames={{
            wrapper: "gap-0 overflow-visible h-8 rounded border border-divider",
            item: "w-8 h-8 text-small rounded-none bg-transparent",
            cursor:
              "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-500 dark:to-default-800 text-white font-bold",
          }}
        />
      </div>

      {/* Add Warehouse Modal */}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="4xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[95vh] bg-gradient-to-br from-white to-gray-50 z-50",
          body: "py-6 max-h-[70vh] overflow-y-auto",
          header:
            "pb-2 bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200",
          footer:
            "pt-2 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200",
        }}
        backdrop="blur"
        style={{ zIndex: 9999 }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalMode === "add" ? (
                  <h2 className="text-xl font-semibold text-green-800">
                    Thêm Kho Hàng Mới
                  </h2>
                ) : (
                  <h2 className="text-xl font-semibold text-green-800">
                    Cập nhật thông tin kho hàng
                  </h2>
                )}
                <p className="text-sm text-green-600">
                  Điền thông tin chi tiết về kho hàng
                </p>
              </ModalHeader>
              <ModalBody className="bg-gradient-to-b from-white to-gray-50">
                <div className="space-y-4">
                  {/* Tên Kho Hàng */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Tên Kho Hàng <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập tên kho hàng"
                        variant="bordered"
                        value={formData.warehouseName}
                        onChange={(e) =>
                          handleInputChange("warehouseName", e.target.value)
                        }
                        isInvalid={!!errors.warehouseName}
                        errorMessage={errors.warehouseName}
                        classNames={{
                          input: "text-sm",
                        }}
                      />
                    </div>
                  </div>

                  {/* Địa Chỉ */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Địa Chỉ <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập địa chỉ chi tiết"
                        variant="bordered"
                        value={formData.address}
                        onChange={(e) =>
                          handleInputChange("address", e.target.value)
                        }
                        isInvalid={!!errors.address}
                        errorMessage={errors.address}
                        classNames={{
                          input: "text-sm",
                        }}
                      />
                    </div>
                  </div>

                  {/* Số Điện Thoại */}
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 block">
                        Số Điện Thoại <span className="text-red-500">*</span>
                      </label>
                      <Input
                        placeholder="Nhập số điện thoại"
                        variant="bordered"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleInputChange("phoneNumber", e.target.value)
                        }
                        isInvalid={!!errors.phoneNumber}
                        errorMessage={errors.phoneNumber}
                        classNames={{
                          input: "text-sm",
                        }}
                        disabled={true}
                      />
                    </div>
                  </div>

                  {/* Vị trí địa lý */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                    <h3 className="text-sm font-semibold text-green-800 border-b border-green-300 pb-2 mb-4">
                      📍 Vị trí địa lý
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Province Select */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Tỉnh/Thành phố <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.provinceCode || ""}
                          onChange={handleProvinceChange}
                          disabled={locationLoading.provinces}
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.province
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Chọn tỉnh/thành phố</option>
                          {provinces.map((province) => (
                            <option key={province.code} value={province.code}>
                              {province.name}
                            </option>
                          ))}
                        </select>
                        {errors.province && (
                          <span className="text-sm text-red-600">
                            {errors.province}
                          </span>
                        )}
                      </div>

                      {/* District Select */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Quận/Huyện <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.districtCode || ""}
                          onChange={handleDistrictChange}
                          disabled={
                            !formData.provinceCode || locationLoading.districts
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.district
                              ? "border-red-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="">Chọn quận/huyện</option>
                          {districts.map((district) => (
                            <option key={district.code} value={district.code}>
                              {district.name}
                            </option>
                          ))}
                        </select>
                        {errors.district && (
                          <span className="text-sm text-red-600">
                            {errors.district}
                          </span>
                        )}
                      </div>

                      {/* Ward Select */}
                      <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">
                          Phường/Xã <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.wardCode || ""}
                          onChange={handleWardChange}
                          disabled={
                            !formData.districtCode || locationLoading.wards
                          }
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                            errors.ward ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          <option value="">Chọn phường/xã</option>
                          {wards.map((ward) => (
                            <option key={ward.code} value={ward.code}>
                              {ward.name}
                            </option>
                          ))}
                        </select>
                        {errors.ward && (
                          <span className="text-sm text-red-600">
                            {errors.ward}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-between items-center pt-4 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
                <div>
                  {modalMode === "edit" && (
                    <Button
                      color="danger"
                      variant="flat"
                      onPress={handleDeleteClick}
                      className="hover:bg-red-100"
                    >
                      Xóa Kho Hàng
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button color="default" variant="light" onPress={onClose}>
                    Hủy
                  </Button>
                  <Button
                    color="success"
                    onPress={handleSubmitForm}
                    className="px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    {modalMode === "add" ? "Tiếp Tục" : "Cập nhật"}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Add Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        size="md"
        backdrop="blur"
        style={{ zIndex: 9999 }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Xác nhận tạo kho hàng</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Bạn có chắc chắn muốn tạo kho hàng mới với thông tin sau?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="font-medium">Tên kho:</span>{" "}
                      {formData.warehouseName}
                    </div>
                    <div>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {formData.address}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {formData.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Vị trí:</span>{" "}
                      {formData.provinceName} - {formData.districtName} -{" "}
                      {formData.wardName}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  color="success"
                  onPress={handleConfirmCreate}
                  isLoading={isLoading}
                  loadingText="Đang tạo..."
                >
                  Xác nhận tạo
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Update Confirmation Modal */}
      <Modal
        isOpen={isUpdateConfirmOpen}
        onOpenChange={onUpdateConfirmOpenChange}
        size="md"
        backdrop="blur"
        style={{ zIndex: 9999 }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Xác nhận cập nhật</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Bạn có chắc chắn muốn cập nhật kho hàng với thông tin mới?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div>
                      <span className="font-medium">Tên kho:</span>{" "}
                      {formData.warehouseName}
                    </div>
                    <div>
                      <span className="font-medium">Địa chỉ:</span>{" "}
                      {formData.address}
                    </div>
                    <div>
                      <span className="font-medium">Số điện thoại:</span>{" "}
                      {formData.phoneNumber}
                    </div>
                    <div>
                      <span className="font-medium">Vị trí:</span>{" "}
                      {formData.provinceName} - {formData.districtName} -{" "}
                      {formData.wardName}
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  color="success"
                  onPress={handleConfirmUpdate}
                  isLoading={isLoading}
                  loadingText="Đang cập nhật..."
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteConfirmOpen}
        onOpenChange={onDeleteConfirmOpenChange}
        size="md"
        backdrop="blur"
        style={{ zIndex: 9999 }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">Xác nhận xóa kho hàng</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Bạn có chắc chắn muốn xóa vĩnh viễn kho hàng này không? Hành
                    động này không thể hoàn tác.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <p className="font-medium text-red-800">
                      {editingWarehouse?.warehouseName}
                    </p>
                    <p className="text-sm text-red-700">
                      {editingWarehouse?.address}
                    </p>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isLoading}
                >
                  Hủy
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isLoading}
                  loadingText="Đang xóa..."
                  className="bg-red-600 hover:bg-red-700"
                >
                  Xác nhận xóa
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default WarehouseManagement;
