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
  Select,
  SelectItem,
} from "@heroui/react";
import {
  Plus,
  Download,
  Search,
  MapPin,
  Phone,
  Building,
  AlertTriangle,
} from "lucide-react";
import { warehouseApi } from "../../services";

const WarehouseManagement = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isLoading, setIsLoading] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);
  const [formData, setFormData] = useState({
    warehouseName: "",
    address: "",
    phoneNumber: "",
    provinceId: "",
    districtId: "",
    wardId: "",
  });
  const [errors, setErrors] = useState({});

  // Mock data for locations (for form dropdowns)
  const provinces = [
    { id: "Ha Noi", name: "Hà Nội" },
    { id: "TP. Ho Chi Minh", name: "TP. Hồ Chí Minh" },
    { id: "Da Nang", name: "Đà Nẵng" },
    { id: "Can Tho", name: "Cần Thơ" },
    { id: "Hai Phong", name: "Hải Phòng" },
    { id: "Lam Dong", name: "Lâm Đồng" },
  ];

  const districts = [
    { id: "Dong Da", name: "Đống Đa", provinceId: "Ha Noi" },
    { id: "Quan 5", name: "Quận 5", provinceId: "TP. Ho Chi Minh" },
    { id: "Hai Chau", name: "Hải Châu", provinceId: "Da Nang" },
    { id: "Ninh Kieu", name: "Ninh Kiều", provinceId: "Can Tho" },
    { id: "Ngo Quyen", name: "Ngô Quyền", provinceId: "Hai Phong" },
    { id: "Da Lat", name: "Đà Lạt", provinceId: "Lam Dong" },
    { id: "Yen Lang", name: "Yên Lãng", provinceId: "Ha Noi" },
  ];

  const wards = [
    { id: "Lang Thuong", name: "Láng Thượng", districtId: "Dong Da" },
    { id: "Phuong 4", name: "Phường 4", districtId: "Quan 5" },
    { id: "Hai Chau I", name: "Hải Châu I", districtId: "Hai Chau" },
    { id: "Hung Loi", name: "Hưng Lợi", districtId: "Ninh Kieu" },
    { id: "May Chai", name: "Máy Chai", districtId: "Ngo Quyen" },
    { id: "Phuong 1", name: "Phường 1", districtId: "Da Lat" },
    { id: "An Lieng", name: "An Liêng", districtId: "Yen Lang" },
  ];

  // Fetch warehouses from API
  const fetchWarehouses = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const response = await warehouseApi.getWarehouses();
      setWarehouses(response);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
      setDataError("Không thể tải danh sách kho hàng. Vui lòng thử lại.");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initialize warehouses with API data
  React.useEffect(() => {
    fetchWarehouses();
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

  // Get filtered districts and wards based on selected province/district
  const filteredDistricts = districts.filter(
    (district) => district.provinceId === formData.provinceId
  );
  const filteredWards = wards.filter(
    (ward) => ward.districtId === formData.districtId
  );

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
    if (!formData.provinceId) {
      newErrors.provinceId = "Vui lòng chọn tỉnh/thành phố";
    }
    if (!formData.districtId) {
      newErrors.districtId = "Vui lòng chọn quận/huyện";
    }
    if (!formData.wardId) {
      newErrors.wardId = "Vui lòng chọn phường/xã";
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
    // Reset dependent fields when province or district changes
    if (field === "provinceId") {
      setFormData((prev) => ({
        ...prev,
        districtId: "",
        wardId: "",
      }));
    }
    if (field === "districtId") {
      setFormData((prev) => ({
        ...prev,
        wardId: "",
      }));
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      warehouseName: "",
      address: "",
      phoneNumber: "",
      provinceId: "",
      districtId: "",
      wardId: "",
    });
    setErrors({});
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredWarehouses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWarehouses = filteredWarehouses.slice(startIndex, endIndex);

  const handleAddWarehouse = () => {
    resetForm();
    onOpen();
  };

  const handleSubmitForm = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onOpenChange();
    onConfirmOpen();
  };

  const handleConfirmCreate = async () => {
    setIsLoading(true);
    try {
      // Prepare data for API
      const warehouseData = {
        warehouseName: formData.warehouseName,
        address: formData.address,
        phoneNumber: formData.phoneNumber,
        provinceId: formData.provinceId,
        districtId: formData.districtId,
        wardId: formData.wardId,
      };

      // Call API to create warehouse
      await warehouseApi.createWarehouse(warehouseData);

      // Refresh the warehouses list from API
      await fetchWarehouses();

      // Close modals and reset form
      onConfirmOpenChange();
      resetForm();

      // Show success message (you can add a toast notification here)
      alert("Tạo kho hàng thành công!");
    } catch (error) {
      console.error("Error creating warehouse:", error);
      alert("Có lỗi xảy ra khi tạo kho hàng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadReport = () => {
    // Implement download report functionality
    console.log("Downloading warehouse report...");
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
              <TableRow key={warehouse.id}>
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
        size="3xl"
        scrollBehavior="inside"
        classNames={{
          base: "max-h-[90vh]",
          body: "py-6",
          header: "pb-2",
          footer: "pt-2",
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Thêm Kho Hàng Mới</h2>
                <p className="text-sm text-gray-500">
                  Điền thông tin chi tiết về kho hàng
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Tên Kho Hàng */}
                  <div className="space-y-2">
                    <Input
                      label="Tên Kho Hàng"
                      placeholder="Nhập tên kho hàng"
                      variant="bordered"
                      value={formData.warehouseName}
                      onChange={(e) =>
                        handleInputChange("warehouseName", e.target.value)
                      }
                      isInvalid={!!errors.warehouseName}
                      errorMessage={errors.warehouseName}
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-gray-700",
                        input: "text-sm",
                      }}
                    />
                  </div>

                  {/* Địa Chỉ */}
                  <div className="space-y-2">
                    <Input
                      label="Địa Chỉ"
                      placeholder="Nhập địa chỉ chi tiết"
                      variant="bordered"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      isInvalid={!!errors.address}
                      errorMessage={errors.address}
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-gray-700",
                        input: "text-sm",
                      }}
                    />
                  </div>

                  {/* Số Điện Thoại */}
                  <div className="space-y-2">
                    <Input
                      label="Số Điện Thoại"
                      placeholder="Nhập số điện thoại"
                      variant="bordered"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        handleInputChange("phoneNumber", e.target.value)
                      }
                      isInvalid={!!errors.phoneNumber}
                      errorMessage={errors.phoneNumber}
                      isRequired
                      classNames={{
                        label: "text-sm font-medium text-gray-700",
                        input: "text-sm",
                      }}
                    />
                  </div>

                  {/* Vị trí địa lý */}
                  <div className="space-y-4">
                    <h3 className="text-sm font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Vị trí địa lý
                    </h3>

                    {/* Tỉnh/Thành Phố */}
                    <div className="space-y-2">
                      <Select
                        label="Tỉnh/Thành Phố"
                        placeholder="Chọn tỉnh/thành phố"
                        variant="bordered"
                        selectedKeys={
                          formData.provinceId ? [formData.provinceId] : []
                        }
                        onSelectionChange={(keys) =>
                          handleInputChange(
                            "provinceId",
                            Array.from(keys)[0] || ""
                          )
                        }
                        isInvalid={!!errors.provinceId}
                        errorMessage={errors.provinceId}
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-gray-700",
                          trigger: "text-sm",
                        }}
                      >
                        {provinces.map((province) => (
                          <SelectItem key={province.id} value={province.id}>
                            {province.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Quận/Huyện */}
                    <div className="space-y-2">
                      <Select
                        label="Quận/Huyện"
                        placeholder="Chọn quận/huyện"
                        variant="bordered"
                        selectedKeys={
                          formData.districtId ? [formData.districtId] : []
                        }
                        onSelectionChange={(keys) =>
                          handleInputChange(
                            "districtId",
                            Array.from(keys)[0] || ""
                          )
                        }
                        isInvalid={!!errors.districtId}
                        errorMessage={errors.districtId}
                        isDisabled={!formData.provinceId}
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-gray-700",
                          trigger: "text-sm",
                        }}
                      >
                        {filteredDistricts.map((district) => (
                          <SelectItem key={district.id} value={district.id}>
                            {district.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    {/* Phường/Xã */}
                    <div className="space-y-2">
                      <Select
                        label="Phường/Xã"
                        placeholder="Chọn phường/xã"
                        variant="bordered"
                        selectedKeys={formData.wardId ? [formData.wardId] : []}
                        onSelectionChange={(keys) =>
                          handleInputChange("wardId", Array.from(keys)[0] || "")
                        }
                        isInvalid={!!errors.wardId}
                        errorMessage={errors.wardId}
                        isDisabled={!formData.districtId}
                        isRequired
                        classNames={{
                          label: "text-sm font-medium text-gray-700",
                          trigger: "text-sm",
                        }}
                      >
                        {filteredWards.map((ward) => (
                          <SelectItem key={ward.id} value={ward.id}>
                            {ward.name}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  className="px-6"
                >
                  Hủy
                </Button>
                <Button
                  color="success"
                  onPress={handleSubmitForm}
                  className="px-6"
                >
                  Tiếp Tục
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        size="md"
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
                      {
                        provinces.find((p) => p.id === formData.provinceId)
                          ?.name
                      }{" "}
                      -{" "}
                      {
                        districts.find((d) => d.id === formData.districtId)
                          ?.name
                      }{" "}
                      - {wards.find((w) => w.id === formData.wardId)?.name}
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
    </div>
  );
};

export default WarehouseManagement;
