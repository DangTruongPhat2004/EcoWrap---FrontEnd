import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import {
  ArrowLeft,
  AlertTriangle,
  Save,
  Package,
  Warehouse,
} from "lucide-react";
import { message } from "antd";
import { getMyProducts } from "../../services/productApi";
import warehouseApi from "../../services/warehouseApi";
import inventoryApi from "../../services/inventoryApi";

const AddInventory = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [formError, setFormError] = useState("");

  const [isCreating, setIsCreating] = useState(false);
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productsData, warehousesData] = await Promise.all([
          getMyProducts(),
          warehouseApi.getMyWarehouses(),
        ]);
        setProducts(productsData);
        setWarehouses(warehousesData);
      } catch (err) {
        setError("Không thể tải dữ liệu sản phẩm hoặc kho hàng.");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreateClick = () => {
    const numQuantity = parseInt(quantity, 10);
    if (!selectedProduct) {
      setFormError("Vui lòng chọn một sản phẩm.");
      return;
    }
    if (!selectedWarehouse) {
      setFormError("Vui lòng chọn một kho hàng.");
      return;
    }
    if (isNaN(numQuantity) || numQuantity <= 0) {
      setFormError("Số lượng phải là một số lớn hơn 0.");
      return;
    }
    setFormError("");
    onConfirmOpen();
  };

  const handleConfirmCreate = async () => {
    setIsCreating(true);
    try {
      const inventoryData = {
        productId: selectedProduct.productId,
        warehouseId: selectedWarehouse.warehouseId,
        stockQuantity: parseInt(quantity, 10),
      };
      await inventoryApi.addInventory(inventoryData);
      message.success("Nhập kho thành công!");
      navigate("/vendor/inventory");
    } catch (err) {
      console.error("Failed to add inventory:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Nhập kho thất bại";
      const statusCode = err.response?.status;

      message.error(
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsCreating(false);
      onConfirmOpenChange();
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
      <div className="text-center text-red-500 p-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
        <p>{error}</p>
      </div>
    );
  }

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
            Quay lại danh sách
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Nhập Kho Sản Phẩm
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Products Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Package className="w-6 h-6 text-blue-600" />
            1. Chọn sản phẩm
          </h2>
          <div className="max-h-[400px] overflow-y-auto border rounded-lg">
            <Table aria-label="Products table" selectionMode="single">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Hình Ảnh</TableColumn>
                <TableColumn>Tên Sản Phẩm</TableColumn>
                <TableColumn>Phân Loại</TableColumn>
                <TableColumn>Kích Cỡ</TableColumn>
                <TableColumn>Chất Liệu</TableColumn>
                <TableColumn>Cân Nặng</TableColumn>
              </TableHeader>
              <TableBody items={products}>
                {(item) => (
                  <TableRow
                    key={item.productId}
                    onClick={() => setSelectedProduct(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedProduct?.productId === item.productId
                        ? "bg-blue-300 hover:bg-blue-400 font-semibold text-blue-900"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <TableCell className="text-sm font-mono">
                      {item.productId}
                    </TableCell>
                    <TableCell>
                      <img
                        src={item.imageFile || "https://via.placeholder.com/64"}
                        alt={item.productName}
                        width={48}
                        height={48}
                        className="object-cover rounded-md"
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {item.productName}
                    </TableCell>
                    <TableCell>
                      {item.category?.categoryName || item.categoryId}
                    </TableCell>
                    <TableCell>{item.size || "N/A"}</TableCell>
                    <TableCell>{item.materialType || "N/A"}</TableCell>
                    <TableCell>
                      {item.weightGram ? `${item.weightGram}g` : "N/A"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Warehouses Table */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Warehouse className="w-6 h-6 text-green-600" />
            2. Chọn kho hàng
          </h2>
          <div className="max-h-[400px] overflow-y-auto border rounded-lg">
            <Table aria-label="Warehouses table" selectionMode="single">
              <TableHeader>
                <TableColumn>ID</TableColumn>
                <TableColumn>Tên Kho</TableColumn>
                <TableColumn>Địa Chỉ</TableColumn>
              </TableHeader>
              <TableBody items={warehouses}>
                {(item) => (
                  <TableRow
                    key={item.warehouseId}
                    onClick={() => setSelectedWarehouse(item)}
                    className={`cursor-pointer transition-colors ${
                      selectedWarehouse?.warehouseId === item.warehouseId
                        ? "bg-green-300 hover:bg-green-400 font-semibold text-green-900"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <TableCell>{item.warehouseId}</TableCell>
                    <TableCell>{item.warehouseName}</TableCell>
                    <TableCell>
                      {`${item.address}, ${item.wardId}, ${item.districtId}, ${item.provinceId}`}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Action Area */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          3. Nhập số lượng và xác nhận
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <div className="md:col-span-1">
            <Input
              type="number"
              placeholder="Nhập số lượng"
              value={quantity}
              onValueChange={setQuantity}
              isInvalid={!!formError && formError.includes("Số lượng")}
              errorMessage={formError.includes("Số lượng") ? formError : ""}
              min={1}
              variant="bordered"
            />
          </div>
          <div className="md:col-span-2 flex flex-col items-start">
            {formError && !formError.includes("Số lượng") && (
              <p className="text-red-500 text-sm mb-2">{formError}</p>
            )}
            <Button
              color="success"
              onPress={handleCreateClick}
              startContent={<Save className="w-4 h-4" />}
              className="font-medium"
              isDisabled={!selectedProduct || !selectedWarehouse || !quantity}
            >
              Nhập Kho
            </Button>
          </div>
        </div>
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border text-sm space-y-2">
          <h3 className="font-semibold">Thông tin đã chọn:</h3>
          <p>
            <strong>Sản phẩm:</strong>{" "}
            {selectedProduct ? (
              <span className="text-blue-600">
                {selectedProduct.productName}
              </span>
            ) : (
              "Chưa chọn"
            )}
          </p>
          <p>
            <strong>Kho hàng:</strong>{" "}
            {selectedWarehouse ? (
              <span className="text-green-600">
                {selectedWarehouse.warehouseName}
              </span>
            ) : (
              "Chưa chọn"
            )}
          </p>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        size="xl"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Xác nhận nhập kho</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>Bạn có chắc chắn muốn thực hiện thao tác nhập kho sau?</p>
                <div className="bg-gray-50 p-4 rounded-lg space-y-2 border">
                  <p>
                    <strong>Sản phẩm:</strong>{" "}
                    <span className="text-blue-700 font-medium">
                      {selectedProduct?.productName}
                    </span>
                  </p>
                  <p>
                    <strong>Kho hàng:</strong>{" "}
                    <span className="text-green-700 font-medium">
                      {selectedWarehouse?.warehouseName}
                    </span>
                  </p>
                  <p>
                    <strong>Số lượng:</strong>{" "}
                    <span className="text-xl font-bold text-gray-800">
                      {quantity}
                    </span>
                  </p>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                  isDisabled={isCreating}
                >
                  Hủy
                </Button>
                <Button
                  color="success"
                  onPress={handleConfirmCreate}
                  isLoading={isCreating}
                  loadingText="Đang xử lý..."
                >
                  Xác nhận
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AddInventory;
