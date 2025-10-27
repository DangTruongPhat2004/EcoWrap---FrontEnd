import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
} from "@heroui/react";
import { Plus, Search, AlertTriangle, Warehouse, Package } from "lucide-react";
import inventoryApi from "../../services/inventoryApi";

const InventoryManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [inventoryItems, setInventoryItems] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Fetch inventory from API
  const fetchInventory = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const response = await inventoryApi.getMyInventory();
      setInventoryItems(response);
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setDataError("Không thể tải danh sách tồn kho. Vui lòng thử lại.");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initialize inventory with API data
  useEffect(() => {
    fetchInventory();
  }, []);

  // Filter inventory based on search term
  const filteredInventory = inventoryItems.filter(
    (item) =>
      item.product?.productName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.warehouse?.warehouseName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.warehouse?.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentInventory = filteredInventory.slice(startIndex, endIndex);

  const handleAddInventory = () => {
    navigate("/vendor/inventory/new");
  };

  const handleViewInventory = (item) => {
    navigate(`/vendor/inventory/${item.inventoryId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("vi-VN");
  };

  // Loading state
  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách tồn kho...</p>
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
        <Button color="primary" onPress={fetchInventory}>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Tồn Kho</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi số lượng sản phẩm trong các kho hàng của bạn
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <Button
              color="success"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleAddInventory}
              className="font-medium"
            >
              Nhập Kho
            </Button>
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm kiếm theo sản phẩm, kho..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table aria-label="Inventory management table">
          <TableHeader>
            <TableColumn className="text-gray-700 font-semibold">
              ID Tồn Kho
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold w-[100px]">
              Hình Ảnh
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Tên Sản Phẩm
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Tên Kho Hàng
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Địa chỉ
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Số Lượng
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Cập nhật lần cuối
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="p-8 text-center text-gray-500">
                Chưa có sản phẩm nào trong kho.
              </div>
            }
          >
            {currentInventory.map((item) => (
              <TableRow
                key={item.inventoryId}
                onClick={() => handleViewInventory(item)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <span className="text-sm font-mono text-gray-600">
                    #{item.inventoryId}
                  </span>
                </TableCell>
                <TableCell>
                  <img
                    src={
                      item.product?.imageFile ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product?.productName}
                    width={64}
                    height={64}
                    className="object-cover rounded-md aspect-square"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-blue-500" />
                    <span className="font-medium text-gray-900">
                      {item.product?.productName || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Warehouse className="w-4 h-4 text-green-500" />
                    <span className="text-gray-700">
                      {item.warehouse?.warehouseName || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-600">
                    {`${item.warehouse?.address}, ${item.warehouse?.provinceId}, ${item.warehouse?.districtId}, ${item.warehouse?.wardId}`}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-bold text-lg text-gray-800">
                    {item.stockQuantity}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-500">
                    {formatDate(item.lastUpdated)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600">
            Hiển thị {startIndex + 1}-
            {Math.min(endIndex, filteredInventory.length)} trong tổng số{" "}
            {filteredInventory.length} mục
          </p>
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
            color="success"
          />
        </div>
      )}
    </div>
  );
};

export default InventoryManagement;
