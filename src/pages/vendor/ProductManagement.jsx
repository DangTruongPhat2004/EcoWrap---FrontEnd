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
import { Plus, Search, AlertTriangle } from "lucide-react";
import { getMyProducts } from "../../services/productApi";

const ProductManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [products, setProducts] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  // Fetch products from API
  const fetchProducts = async () => {
    setIsDataLoading(true);
    setDataError(null);
    try {
      const productsResponse = await getMyProducts();
      setProducts(productsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
      setDataError("Không thể tải danh sách sản phẩm. Vui lòng thử lại.");
    } finally {
      setIsDataLoading(false);
    }
  };

  // Initialize products with API data
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredProducts = products.filter((product) => {
    const searchLower = searchTerm.toLowerCase();
    const productName = (
      product.productName ||
      product.name ||
      ""
    ).toLowerCase();
    const categoryName = (product.categoryName || "").toLowerCase();
    const materialType = (
      product.materialType ||
      product.material ||
      ""
    ).toLowerCase();

    return (
      productName.includes(searchLower) ||
      categoryName.includes(searchLower) ||
      materialType.includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddProduct = () => {
    navigate("/vendor/products/new");
  };

  const handleViewProduct = (product) => {
    navigate(`/vendor/products/${product.productId}`);
  };

  // Loading state
  if (isDataLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải danh sách sản phẩm...</p>
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
        <Button color="primary" onPress={fetchProducts}>
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
          <h1 className="text-3xl font-bold text-gray-900">Quản Lý Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">
            Theo dõi và quản lý các sản phẩm bạn đang bán
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <Button
              color="success"
              startContent={<Plus className="w-4 h-4" />}
              onPress={handleAddProduct}
              className="font-medium"
            >
              Thêm Sản Phẩm Mới
            </Button>
          </div>

          <div className="w-full sm:w-80">
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              startContent={<Search className="w-4 h-4 text-gray-400" />}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <Table aria-label="Product management table">
          <TableHeader>
            <TableColumn className="text-gray-700 font-semibold">
              ID
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold w-[120px]">
              Hình Ảnh
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Tên Sản Phẩm
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Loại
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Nguyên Liệu
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Giá
            </TableColumn>
            <TableColumn className="text-gray-700 font-semibold">
              Hoạt Động
            </TableColumn>
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="p-8 text-center text-gray-500">
                Bạn chưa có sản phẩm nào.
              </div>
            }
          >
            {currentProducts.map((product) => (
              <TableRow
                key={product.productId}
                onClick={() => handleViewProduct(product)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell>
                  <span className="text-sm font-mono text-gray-600">
                    #{product.productId}
                  </span>
                </TableCell>
                <TableCell>
                  <img
                    src={
                      product.imageFile
                      // ? product.imageFile
                      // : "https://via.placeholder.com/80"
                    }
                    alt={product.productName}
                    width={80}
                    height={80}
                    className="object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="font-medium text-gray-900">
                        {product.productName}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {product.categoryName || "Chưa phân loại"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {product.materialType || product.material || "Chưa có"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-gray-700">
                    {(
                      product.productPrice ||
                      product.price ||
                      0
                    ).toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 text-sm font-medium rounded-full ${
                      product.isActive ?? true
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {product.isActive ?? true ? "Đang mở bán" : "Đã đóng"}
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
            {Math.min(endIndex, filteredProducts.length)} trong tổng số{" "}
            {filteredProducts.length} sản phẩm
          </p>
          <Pagination
            total={totalPages}
            page={currentPage}
            onChange={setCurrentPage}
            showControls
            showShadow
            color="success"
            classNames={{
              wrapper:
                "gap-0 overflow-visible h-8 rounded border border-divider",
              item: "w-8 h-8 text-small rounded-none bg-transparent",
              cursor:
                "bg-gradient-to-b shadow-lg from-default-500 to-default-800 dark:from-default-500 dark:to-default-800 text-white font-bold",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
