import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProductById,
  updateProduct,
  deleteProduct,
} from "../../services/productApi";
import { getAllCategories } from "../../services/categoryApi";
import {
  Button,
  Input,
  Textarea,
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
  ArrowLeft,
  Edit,
  AlertTriangle,
  FileText,
  ImageIcon,
  Save,
  X,
  Trash2,
} from "lucide-react";

const DetailItem = ({ label, value, className, children }) => (
  <div className={`py-4 sm:grid sm:grid-cols-3 sm:gap-4 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {children || value || <span className="text-gray-400">Chưa có</span>}
    </dd>
  </div>
);

const VendorProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({});
  const [categories, setCategories] = useState([]);
  const {
    isOpen: isUpdateConfirmOpen,
    onOpenChange: onUpdateConfirmOpenChange,
  } = useDisclosure();
  const {
    isOpen: isDeleteConfirmOpen,
    onOpen: onDeleteConfirmOpen,
    onOpenChange: onDeleteConfirmOpenChange,
  } = useDisclosure();
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [designFile, setDesignFile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [productData, categoriesResponse] = await Promise.all([
          getProductById(id),
          getAllCategories(),
        ]);

        setProduct(productData);

        // Handle both response formats: array or {success, data}
        if (Array.isArray(categoriesResponse)) {
          setCategories(categoriesResponse);
        } else if (categoriesResponse.success && categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        } else if (categoriesResponse.data) {
          setCategories(categoriesResponse.data);
        }

        // Initialize form data for editing
        setFormData({
          productId: productData.productId || "",
          productName: productData.productName || "",
          productDescription: productData.productDescription || "",
          unit: productData.unit || "",
          size: productData.size || "",
          inkType: productData.inkType || "",
          printProcess: productData.printProcess || "",
          productPrice: productData.productPrice || 0,
          weightGram: productData.weightGram || 0,
          materialType: productData.materialType || "",
          categoryId:
            productData.category?.categoryId || productData.categoryId || "",
          // Files are handled separately
        });
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Không thể tải sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getFileNameFromUrl = (url) => {
    if (!url || typeof url !== "string") return "Không có file";
    try {
      // Tách chuỗi URL bằng dấu '/' và lấy phần cuối cùng
      const parts = url.split("/");
      return decodeURIComponent(parts[parts.length - 1]);
    } catch (e) {
      return "Không thể đọc tên file";
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files[0]) {
      if (name === "imageFile") setImageFile(files[0]);
      if (name === "certificateFile") setCertificateFile(files[0]);
      if (name === "designFile") setDesignFile(files[0]);
    }
  };

  const handleToggleEdit = () => {
    if (isEditing) {
      // If canceling, reset form data to original product data
      setFormData({
        productId: product.productId || "",
        productName: product.productName || "",
        productDescription: product.productDescription || "",
        unit: product.unit || "",
        size: product.size || "",
        inkType: product.inkType || "",
        printProcess: product.printProcess || "",
        productPrice: product.productPrice || 0,
        weightGram: product.weightGram || 0,
        materialType: product.materialType || "",
        categoryId: product.category?.categoryId || product.categoryId || "",
      });
      // Reset file states
      setImageFile(null);
      setCertificateFile(null);
      setDesignFile(null);
      setErrors({}); // Clear errors
    }
    setIsEditing(!isEditing);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId?.trim()) {
      newErrors.productId = "ID sản phẩm là bắt buộc";
    }
    if (!formData.categoryId?.toString().trim()) {
      newErrors.categoryId = "Loại sản phẩm (ID) là bắt buộc";
    }
    if (!formData.productName?.trim()) {
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    }
    if (!formData.productPrice || formData.productPrice <= 0) {
      newErrors.productPrice = "Giá sản phẩm phải là số dương";
    }
    if (!formData.weightGram || formData.weightGram <= 0) {
      newErrors.weightGram = "Cân nặng phải là số dương";
    }
    if (!formData.unit?.trim()) {
      newErrors.unit = "Đơn vị là bắt buộc";
    }
    if (!formData.size?.trim()) {
      newErrors.size = "Kích cỡ là bắt buộc";
    }
    if (!formData.inkType?.trim()) {
      newErrors.inkType = "Loại mực là bắt buộc";
    }
    if (!formData.printProcess?.trim()) {
      newErrors.printProcess = "Quy trình in là bắt buộc";
    }
    if (!formData.materialType?.trim()) {
      newErrors.materialType = "Chất liệu là bắt buộc";
    }
    if (!product.imageFile && !imageFile) {
      newErrors.imageFile = "Hình ảnh sản phẩm là bắt buộc";
    }
    return newErrors;
  };

  const handleSaveChanges = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors).map(
        (msg) => `- ${msg}`
      );
      alert(`Vui lòng sửa các lỗi sau:\n\n${errorMessages.join("\n")}`);
      return;
    }
    onUpdateConfirmOpenChange(); // Mở modal xác nhận
  };

  const handleConfirmUpdate = async () => {
    setIsUpdating(true);
    const updateFormData = new FormData();

    // Append all fields with PascalCase for backend (C# convention)
    updateFormData.append("ProductId", formData.productId);
    updateFormData.append("ProductName", formData.productName);
    updateFormData.append(
      "ProductDescription",
      formData.productDescription || ""
    );
    updateFormData.append("Unit", formData.unit);
    updateFormData.append("Size", formData.size);
    updateFormData.append("InkType", formData.inkType);
    updateFormData.append("PrintProcess", formData.printProcess);
    updateFormData.append("ProductPrice", formData.productPrice);
    updateFormData.append("WeightGram", formData.weightGram);
    updateFormData.append("MaterialType", formData.materialType);
    updateFormData.append("CategoryId", formData.categoryId);

    // Append files if they have been changed
    if (imageFile) updateFormData.append("ImageFile", imageFile);
    if (certificateFile)
      updateFormData.append("CertificateFile", certificateFile);
    if (designFile) updateFormData.append("DesignFile", designFile);

    try {
      onUpdateConfirmOpenChange(); // Đóng modal xác nhận
      await updateProduct(id, updateFormData);
      // Sau khi cập nhật thành công, gọi lại API để lấy dữ liệu mới nhất
      const refreshedProduct = await getProductById(id);
      setProduct(refreshedProduct); // Cập nhật state với dữ liệu mới
      setIsEditing(false);
      setErrors({});
      alert("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Failed to update product:", err);
      alert(
        "Cập nhật thất bại: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(id);
      alert("Xóa sản phẩm thành công!");
      navigate("/vendor/products");
    } catch (err) {
      console.error("Failed to delete product:", err);
      alert(
        "Xóa sản phẩm thất bại: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsDeleting(false);
      onDeleteConfirmOpenChange();
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
        <Button color="danger" onPress={() => navigate("/vendor/products")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Button
            variant="light"
            onPress={() => navigate("/vendor/products")}
            className="mb-2 -ml-3"
            startContent={<ArrowLeft className="w-4 h-4" />}
          >
            Quay lại danh sách sản phẩm
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            {product.productName}
          </h1>
          <p className="text-gray-500 mt-1">
            ID sản phẩm: #{product.productId}
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="light"
                color="danger"
                onPress={handleToggleEdit}
                startContent={<X className="w-4 h-4" />}
                className="font-medium"
              >
                Hủy
              </Button>
              <Button
                color="success"
                onPress={handleSaveChanges}
                isLoading={isUpdating}
                startContent={<Save className="w-4 h-4" />}
                className="font-medium"
              >
                Lưu thay đổi
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="flat"
                color="danger"
                onPress={onDeleteConfirmOpen}
                startContent={<Trash2 className="w-4 h-4" />}
              >
                Xóa sản phẩm
              </Button>
              <Button
                color="primary"
                onPress={handleToggleEdit}
                startContent={<Edit className="w-4 h-4" />}
                className="font-medium"
              >
                Chỉnh sửa sản phẩm
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Files */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh</h3>
            {isEditing ? (
              <div>
                <img
                  src={
                    imageFile
                      ? URL.createObjectURL(imageFile)
                      : product.imageFile || "https://via.placeholder.com/400"
                  }
                  alt="Xem trước"
                  className="w-full h-auto object-cover rounded-md aspect-square mb-3"
                />
                <Input
                  type="file"
                  name="imageFile"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                <p className="text-xs text-gray-500 mt-2 truncate">
                  File hiện tại:{" "}
                  {imageFile
                    ? imageFile.name
                    : getFileNameFromUrl(product.imageFile)}
                </p>
              </div>
            ) : (
              <>
                <img
                  src={product.imageFile || "https://via.placeholder.com/400"}
                  alt={product.productName}
                  className="w-full h-auto object-cover rounded-md aspect-square"
                />
                <p className="text-xs text-gray-500 mt-2 truncate">
                  File: {getFileNameFromUrl(product.imageFile)}
                </p>
              </>
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Tài liệu</h3>
            <div className="space-y-3">
              <a
                href={!isEditing ? product.certificateFile : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-3 rounded-md transition-colors ${
                  product.certificateFile
                    ? "bg-blue-50 hover:bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="font-medium">File chứng nhận</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {certificateFile
                        ? certificateFile.name
                        : getFileNameFromUrl(product.certificateFile)}
                    </p>
                    {isEditing && (
                      <Input
                        type="file"
                        name="certificateFile"
                        onChange={handleFileChange}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </a>
              <a
                href={!isEditing ? product.designFile : undefined}
                target="_blank"
                rel="noopener noreferrer"
                className={`block p-3 rounded-md transition-colors ${
                  product.designFile
                    ? "bg-purple-50 hover:bg-purple-100 text-purple-700"
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                }`}
              >
                <div className="flex items-start gap-3">
                  <ImageIcon className="w-5 h-5 flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p className="font-medium">File thiết kế</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {designFile
                        ? designFile.name
                        : getFileNameFromUrl(product.designFile)}
                    </p>
                    {isEditing && (
                      <Input
                        type="file"
                        name="designFile"
                        onChange={handleFileChange}
                        className="mt-2"
                      />
                    )}
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">
              Thông tin chi tiết
            </h3>
          </div>
          <div className="px-6 divide-y divide-gray-200">
            {isEditing ? (
              <>
                <DetailItem label="ID sản phẩm">
                  <Input
                    name="productId"
                    value={formData.productId}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.productId}
                    errorMessage={errors.productId}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Tên sản phẩm">
                  <Input
                    name="productName"
                    value={formData.productName}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.productName}
                    errorMessage={errors.productName}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Mô tả">
                  <Textarea
                    name="productDescription"
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    variant="bordered"
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Giá">
                  <Input
                    name="productPrice"
                    type="number"
                    value={formData.productPrice}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.productPrice}
                    errorMessage={errors.productPrice}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Đơn vị">
                  <Input
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.unit}
                    errorMessage={errors.unit}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Kích cỡ">
                  <Input
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.size}
                    errorMessage={errors.size}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Loại mực">
                  <Input
                    name="inkType"
                    value={formData.inkType}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.inkType}
                    errorMessage={errors.inkType}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Quy trình in">
                  <Input
                    name="printProcess"
                    value={formData.printProcess}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.printProcess}
                    errorMessage={errors.printProcess}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Chất liệu">
                  <Input
                    name="materialType"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.materialType}
                    errorMessage={errors.materialType}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
                <DetailItem label="Loại sản phẩm">
                  <Select
                    name="categoryId"
                    selectedKeys={
                      formData.categoryId
                        ? [formData.categoryId.toString()]
                        : []
                    }
                    onSelectionChange={(keys) => {
                      const selectedId = Array.from(keys)[0];
                      setFormData((prev) => ({
                        ...prev,
                        categoryId: selectedId,
                      }));
                      if (errors.categoryId) {
                        setErrors((prev) => {
                          const newErrors = { ...prev };
                          delete newErrors.categoryId;
                          return newErrors;
                        });
                      }
                    }}
                    variant="bordered"
                    isInvalid={!!errors.categoryId}
                    errorMessage={errors.categoryId}
                    placeholder="Chọn loại sản phẩm"
                    classNames={{
                      trigger: "border border-gray-200",
                    }}
                  >
                    {categories.map((cat) => (
                      <SelectItem key={cat.categoryId} value={cat.categoryId}>
                        {cat.categoryName}
                      </SelectItem>
                    ))}
                  </Select>
                </DetailItem>
                <DetailItem label="Cân nặng (gram)">
                  <Input
                    name="weightGram"
                    type="number"
                    value={formData.weightGram}
                    onChange={handleInputChange}
                    variant="bordered"
                    isInvalid={!!errors.weightGram}
                    errorMessage={errors.weightGram}
                    classNames={{
                      inputWrapper: "border border-gray-200",
                    }}
                  />
                </DetailItem>
              </>
            ) : (
              <>
                <DetailItem label="Mô tả" value={product.productDescription} />
                <DetailItem
                  label="Giá"
                  value={formatPrice(product.productPrice)}
                />
              </>
            )}

            <DetailItem label="Trạng thái">
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  product.productStatus === "In stock"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {product.productStatus === "In stock" ? "Còn hàng" : "Hết hàng"}
              </span>
            </DetailItem>

            {!isEditing && (
              <>
                <DetailItem label="Đơn vị" value={product.unit} />
                <DetailItem label="Kích cỡ" value={product.size} />
                <DetailItem label="Loại mực" value={product.inkType} />
                <DetailItem label="Quy trình in" value={product.printProcess} />
                <DetailItem label="Chất liệu" value={product.materialType} />
                <DetailItem label="Loại sản phẩm" value={product.category} />
                <DetailItem
                  label="Cân nặng (gram)"
                  value={product.weightGram}
                />
              </>
            )}
            <DetailItem
              label="Ngày tạo"
              value={formatDate(product.createdDate)}
            />
          </div>
        </div>
      </div>

      {/* Update Confirmation Modal */}
      <Modal
        isOpen={isUpdateConfirmOpen}
        onOpenChange={onUpdateConfirmOpenChange}
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
                <div className="space-y-3">
                  <p className="text-gray-600">
                    Bạn có chắc chắn muốn lưu các thay đổi cho sản phẩm này
                    không?
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                    <div>
                      <span className="font-medium">ID:</span>{" "}
                      {formData.productId}
                    </div>
                    <div>
                      <span className="font-medium">Tên:</span>{" "}
                      {formData.productName}
                    </div>
                    <div>
                      <span className="font-medium">Giá:</span>{" "}
                      {formatPrice(formData.productPrice)}
                    </div>
                  </div>
                </div>
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
                  <span className="text-red-700">Xác nhận xóa sản phẩm</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p className="text-gray-600">
                  Bạn có chắc chắn muốn xóa vĩnh viễn sản phẩm "
                  <span className="font-bold">{product?.productName}</span>"?
                  Hành động này không thể hoàn tác.
                </p>
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

export default VendorProductDetail;
