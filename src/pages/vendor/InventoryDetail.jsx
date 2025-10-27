import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import inventoryApi from "../../services/inventoryApi";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
} from "@heroui/react";
import {
  ArrowLeft,
  AlertTriangle,
  Package,
  Warehouse,
  Info,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Ruler,
  Palette,
  Printer,
  Box,
  Hash,
  Tag,
  Scale,
  Edit,
  Save,
  Trash2,
} from "lucide-react";

// Reusable component for displaying detail items
const DetailItem = ({ icon, label, value, children }) => (
  <div className="flex items-start gap-4 py-3">
    <div className="flex-shrink-0 w-8 text-center pt-1 text-gray-400">
      {icon}
    </div>
    <div className="flex-grow">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium text-gray-800 break-words">
        {children || value || <span className="text-gray-400">Chưa có</span>}
      </p>
    </div>
  </div>
);

const InventoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    isOpen: isUpdateModalOpen,
    onOpen: onUpdateModalOpen,
    onOpenChange: onUpdateModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isConfirmModalOpen,
    onOpen: onConfirmModalOpen,
    onOpenChange: onConfirmModalOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onOpenChange: onDeleteModalOpenChange,
  } = useDisclosure();
  const [newQuantity, setNewQuantity] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updateError, setUpdateError] = useState("");

  useEffect(() => {
    const fetchInventoryDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await inventoryApi.getInventoryById(id);
        setItem(data);
        setNewQuantity(data.stockQuantity.toString());
      } catch (err) {
        setError(
          err.response?.data?.message || "Không thể tải chi tiết tồn kho."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchInventoryDetail();
  }, [id]);

  const formatPrice = (price) => {
    if (typeof price !== "number") return "N/A";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  const handleOpenUpdateModal = () => {
    setNewQuantity(item?.stockQuantity.toString() || "0");
    setUpdateError("");
    onUpdateModalOpen();
  };

  const handleUpdateClick = () => {
    const quantity = parseInt(newQuantity, 10);
    if (isNaN(quantity) || quantity < 0) {
      setUpdateError("Số lượng phải là một số không âm.");
      return;
    }
    setUpdateError("");
    onUpdateModalOpenChange(); // Close input modal
    onConfirmModalOpen(); // Open confirmation modal
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    try {
      const quantity = parseInt(newQuantity, 10);
      await inventoryApi.updateInventory(id, { stockQuantity: quantity });
      // Refetch data to show the latest update
      const updatedItem = await inventoryApi.getInventoryById(id);
      setItem(updatedItem);
      onConfirmModalOpenChange(); // Close confirmation modal
      alert("Cập nhật số lượng thành công!");
    } catch (err) {
      onConfirmModalOpenChange(); // Close confirmation modal on error too
      alert(err.response?.data?.message || "Cập nhật thất bại.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await inventoryApi.deleteInventory(id);
      alert("Xóa mục tồn kho thành công!");
      navigate("/vendor/inventory");
    } catch (err) {
      alert("Xóa thất bại: " + (err.response?.data?.message || err.message));
      console.error("Failed to delete inventory:", err);
    } finally {
      setIsDeleting(false);
      onDeleteModalOpenChange();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-96 text-red-600 bg-red-50 rounded-lg p-8">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <p className="text-lg font-semibold mb-4">{error}</p>
        <Button color="danger" onPress={() => navigate("/vendor/inventory")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (!item) return null;

  const { product, warehouse, stockQuantity, lastUpdated } = item;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="light"
            onPress={() => navigate("/vendor/inventory")}
            className="mb-2 -ml-3"
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Quay lại danh sách tồn kho
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Chi Tiết Tồn Kho #{item.inventoryId}
          </h1>
          <p className="text-gray-500 mt-1">
            Cập nhật lần cuối: {formatDate(lastUpdated)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            color="danger"
            variant="flat"
            onPress={onDeleteModalOpen}
            startContent={<Trash2 className="w-4 h-4" />}
          >
            Xóa Tồn Kho
          </Button>
          <Button
            color="primary"
            onPress={handleOpenUpdateModal}
            startContent={<Edit className="w-4 h-4" />}
          >
            Cập nhật số lượng
          </Button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center gap-4">
            <Package className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Thông Tin Sản Phẩm
            </h2>
          </div>
          <div className="p-6">
            <div className="flex justify-center mb-6">
              <img
                src={product?.imageFile || "https://via.placeholder.com/200"}
                alt={product?.productName}
                className="w-48 h-48 object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="divide-y divide-gray-100">
              <DetailItem
                icon={<Hash className="w-5 h-5" />}
                label="ID Sản phẩm"
                value={product?.productId}
              />
              <DetailItem
                icon={<Info className="w-5 h-5" />}
                label="Tên sản phẩm"
                value={product?.productName}
              />
              <DetailItem
                icon={<DollarSign className="w-5 h-5" />}
                label="Giá"
                value={formatPrice(product?.productPrice)}
              />
              <DetailItem
                icon={<Ruler className="w-5 h-5" />}
                label="Kích cỡ"
                value={product?.size}
              />
              <DetailItem
                icon={<Box className="w-5 h-5" />}
                label="Chất liệu"
                value={product?.materialType}
              />
              <DetailItem
                icon={<Palette className="w-5 h-5" />}
                label="Loại mực"
                value={product?.inkType}
              />
              <DetailItem
                icon={<Printer className="w-5 h-5" />}
                label="Quy trình in"
                value={product?.printProcess}
              />
              <DetailItem
                icon={<Tag className="w-5 h-5" />}
                label="Loại"
                value={product?.category?.categoryName || product?.categoryId}
              />
              <DetailItem
                icon={<Scale className="w-5 h-5" />}
                label="Cân nặng"
                value={`${product?.weightGram} gram`}
              />
              <DetailItem
                icon={<Info className="w-5 h-5" />}
                label="Trạng thái"
              >
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    product?.productStatus === "In stock"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product?.productStatus === "In stock"
                    ? "Còn hàng"
                    : "Hết hàng"}
                </span>
              </DetailItem>
            </div>
          </div>
        </div>

        {/* Warehouse Information Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center gap-4">
            <Warehouse className="w-6 h-6 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-800">
              Thông Tin Kho Hàng
            </h2>
          </div>
          <div className="p-6 divide-y divide-gray-100">
            <DetailItem
              icon={<Info className="w-5 h-5" />}
              label="Tên kho hàng"
              value={warehouse?.warehouseName}
            />
            <DetailItem
              icon={<MapPin className="w-5 h-5" />}
              label="Địa chỉ"
              value={`${warehouse?.address}, ${warehouse?.wardId}, ${warehouse?.districtId}, ${warehouse?.provinceId}`}
            />
            <DetailItem
              icon={<Phone className="w-5 h-5" />}
              label="Số điện thoại"
              value={warehouse?.phoneNumber}
            />
            <DetailItem
              icon={<Package className="w-5 h-5" />}
              label="Số lượng tồn kho"
            >
              <span className="font-bold text-2xl text-emerald-600">
                {stockQuantity}
              </span>
              <span className="ml-2 text-gray-600">{product?.unit}</span>
            </DetailItem>
          </div>
        </div>
      </div>

      {/* Update Quantity Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onOpenChange={onUpdateModalOpenChange}
        size="xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Edit className="w-5 h-5 text-blue-500" />
                  <span>Cập nhật số lượng tồn kho</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  Nhập số lượng tồn kho mới cho sản phẩm{" "}
                  <strong className="text-gray-800">
                    {product?.productName}
                  </strong>{" "}
                  tại kho{" "}
                  <strong className="text-gray-800">
                    {warehouse?.warehouseName}
                  </strong>
                  .
                </p>
                <Input
                  type="number"
                  placeholder="Nhập số lượng"
                  value={newQuantity}
                  onValueChange={setNewQuantity}
                  isInvalid={!!updateError}
                  errorMessage={updateError}
                  min={0}
                  variant="bordered"
                  autoFocus
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Hủy
                </Button>
                <Button
                  color="primary"
                  onPress={handleUpdateClick}
                  isLoading={isUpdating}
                  startContent={!isUpdating && <Save className="w-4 h-4" />}
                >
                  {isUpdating ? "Đang cập nhật..." : "Lưu thay đổi"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Final Confirmation Modal */}
      <Modal
        isOpen={isConfirmModalOpen}
        onOpenChange={onConfirmModalOpenChange}
        size="md"
        backdrop="blur"
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
                <p>
                  Bạn có chắc chắn muốn cập nhật số lượng tồn kho của sản phẩm{" "}
                  <strong>{product?.productName}</strong> thành{" "}
                  <strong className="text-blue-600">{newQuantity}</strong>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isUpdating}
                >
                  Hủy
                </Button>
                <Button
                  color="success"
                  onPress={handleConfirmUpdate}
                  isLoading={isUpdating}
                >
                  {isUpdating ? "Đang cập nhật..." : "Xác nhận"}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onOpenChange={onDeleteModalOpenChange}
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700">Xác nhận xóa tồn kho</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn xóa vĩnh viễn mục tồn kho này không?
                  Hành động này không thể hoàn tác.
                </p>
                <div className="bg-red-50 p-3 rounded-lg border border-red-200 text-sm">
                  <p>
                    <strong>Sản phẩm:</strong> {product?.productName}
                  </p>
                  <p>
                    <strong>Kho hàng:</strong> {warehouse?.warehouseName}
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isDeleting}
                >
                  Hủy
                </Button>
                <Button
                  color="danger"
                  onPress={handleConfirmDelete}
                  isLoading={isDeleting}
                  loadingText="Đang xóa..."
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

export default InventoryDetail;
