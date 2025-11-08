import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import { createProduct } from "../../services/productApi";
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
  AlertTriangle,
  FileText,
  ImageIcon,
  Save,
} from "lucide-react";

const DetailItem = ({ label, children }) => (
  <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {children}
    </dd>
  </div>
);

const AddProduct = () => {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    productId: "",
    productName: "",
    productDescription: "",
    unit: "",
    size: "",
    inkType: "",
    printProcess: "",
    productPrice: 0,
    weightGram: 0,
    materialType: "",
    categoryId: "",
  });
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onOpenChange: onConfirmOpenChange,
  } = useDisclosure();
  const [errors, setErrors] = useState({});
  const [imageFile, setImageFile] = useState(null);
  const [certificateFile, setCertificateFile] = useState(null);
  const [designFile, setDesignFile] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        // Handle both response formats: array or {success, data}
        if (Array.isArray(response)) {
          setCategories(response);
        } else if (response.success && response.data) {
          setCategories(response.data);
        } else if (response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const getFileName = (file) => {
    if (!file) return "Chưa có file";
    return file.name;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const validateForm = () => {
    const newErrors = {};
    if (!formData.productId?.trim())
      newErrors.productId = "ID sản phẩm là bắt buộc";
    if (!formData.categoryId?.toString().trim())
      newErrors.categoryId = "Loại sản phẩm (ID) là bắt buộc";
    if (!formData.productName?.trim())
      newErrors.productName = "Tên sản phẩm là bắt buộc";
    if (!formData.productPrice || formData.productPrice <= 0)
      newErrors.productPrice = "Giá sản phẩm phải là số dương";
    if (!formData.weightGram || formData.weightGram <= 0)
      newErrors.weightGram = "Cân nặng phải là số dương";
    if (!formData.unit?.trim()) newErrors.unit = "Đơn vị là bắt buộc";
    if (!formData.size?.trim()) newErrors.size = "Kích cỡ là bắt buộc";
    if (!formData.inkType?.trim()) newErrors.inkType = "Loại mực là bắt buộc";
    if (!formData.printProcess?.trim())
      newErrors.printProcess = "Quy trình in là bắt buộc";
    if (!formData.materialType?.trim())
      newErrors.materialType = "Chất liệu là bắt buộc";
    if (!imageFile) newErrors.imageFile = "Hình ảnh sản phẩm là bắt buộc";
    return newErrors;
  };

  const handleCreateClick = () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const errorMessages = Object.values(validationErrors);
      message.error({
        content: (
          <div>
            <div className="font-semibold mb-2">Vui lòng sửa các lỗi sau:</div>
            <ul className="text-sm list-disc ml-4 space-y-1">
              {errorMessages.map((msg, idx) => (
                <li key={idx}>{msg}</li>
              ))}
            </ul>
          </div>
        ),
        duration: 5,
      });
      return;
    }
    onConfirmOpen();
  };

  const handleConfirmCreate = async () => {
    setIsCreating(true);
    const createFormData = new FormData();

    // Append all fields with PascalCase for backend (C# convention)
    createFormData.append("ProductId", formData.productId);
    createFormData.append("ProductName", formData.productName);
    createFormData.append(
      "ProductDescription",
      formData.productDescription || ""
    );
    createFormData.append("Unit", formData.unit);
    createFormData.append("Size", formData.size);
    createFormData.append("InkType", formData.inkType);
    createFormData.append("PrintProcess", formData.printProcess);
    createFormData.append("ProductPrice", formData.productPrice);
    createFormData.append("WeightGram", formData.weightGram);
    createFormData.append("MaterialType", formData.materialType);
    createFormData.append("CategoryId", formData.categoryId);

    if (imageFile) createFormData.append("ImageFile", imageFile);
    if (certificateFile)
      createFormData.append("CertificateFile", certificateFile);
    if (designFile) createFormData.append("DesignFile", designFile);

    try {
      await createProduct(createFormData);
      message.success("Thêm sản phẩm mới thành công!");
      navigate("/vendor/products");
    } catch (err) {
      console.error("Failed to create product:", err);
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.[0]?.message ||
        err.message ||
        "Thêm sản phẩm thất bại";
      const statusCode = err.response?.status;

      message.error(
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsCreating(false);
      onConfirmOpenChange();
    }
  };

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
            Quay lại danh sách
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">
            Thêm Sản Phẩm Mới
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            color="success"
            onPress={handleCreateClick}
            isLoading={isCreating}
            startContent={<Save className="w-4 h-4" />}
            className="font-medium"
          >
            Thêm Sản Phẩm
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Image and Files */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3">Hình ảnh *</h3>
            <div>
              <img
                src={
                  imageFile
                    ? URL.createObjectURL(imageFile)
                    : "https://via.placeholder.com/400"
                }
                alt="Xem trước"
                className="w-full h-auto object-cover rounded-md aspect-square mb-3"
              />
              <Input
                type="file"
                name="imageFile"
                onChange={handleFileChange}
                accept="image/*"
                isInvalid={!!errors.imageFile}
                errorMessage={errors.imageFile}
              />
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Tài liệu</h3>
            <div className="space-y-3">
              <div className="block p-3 rounded-md bg-blue-50">
                <div className="flex items-start gap-3">
                  <FileText className="w-5 h-5 flex-shrink-0 mt-1 text-blue-700" />
                  <div className="flex-grow">
                    <p className="font-medium text-blue-700">File chứng nhận</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {getFileName(certificateFile)}
                    </p>
                    <Input
                      type="file"
                      name="certificateFile"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
              <div className="block p-3 rounded-md bg-purple-50">
                <div className="flex items-start gap-3">
                  <ImageIcon className="w-5 h-5 flex-shrink-0 mt-1 text-purple-700" />
                  <div className="flex-grow">
                    <p className="font-medium text-purple-700">File thiết kế</p>
                    <p className="text-xs text-gray-500 truncate max-w-xs">
                      {getFileName(designFile)}
                    </p>
                    <Input
                      type="file"
                      name="designFile"
                      onChange={handleFileChange}
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
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
            <DetailItem label="ID sản phẩm *">
              <Input
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.productId}
                errorMessage={errors.productId}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Tên sản phẩm *">
              <Input
                name="productName"
                value={formData.productName}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.productName}
                errorMessage={errors.productName}
                classNames={{
                  inputWrapper: "border border-gray-400",
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
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Giá *">
              <Input
                name="productPrice"
                type="number"
                value={formData.productPrice}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.productPrice}
                errorMessage={errors.productPrice}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Đơn vị *">
              <Input
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.unit}
                errorMessage={errors.unit}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Kích cỡ *">
              <Input
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.size}
                errorMessage={errors.size}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Loại mực *">
              <Input
                name="inkType"
                value={formData.inkType}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.inkType}
                errorMessage={errors.inkType}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Quy trình in *">
              <Input
                name="printProcess"
                value={formData.printProcess}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.printProcess}
                errorMessage={errors.printProcess}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Chất liệu *">
              <Input
                name="materialType"
                value={formData.materialType}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.materialType}
                errorMessage={errors.materialType}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
            <DetailItem label="Loại sản phẩm *">
              <Select
                name="categoryId"
                selectedKeys={
                  formData.categoryId
                    ? new Set([formData.categoryId.toString()])
                    : new Set()
                }
                onSelectionChange={(keys) => {
                  const selectedId = Array.from(keys)[0];
                  setFormData((prev) => ({
                    ...prev,
                    categoryId: parseInt(selectedId),
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
                  trigger: "border border-gray-400 bg-white",
                  value: "text-gray-900",
                }}
                items={categories}
              >
                {(cat) => (
                  <SelectItem key={cat.categoryId} textValue={cat.categoryName}>
                    {cat.categoryName}
                  </SelectItem>
                )}
              </Select>
            </DetailItem>
            <DetailItem label="Cân nặng (gram) *">
              <Input
                name="weightGram"
                type="number"
                value={formData.weightGram}
                onChange={handleInputChange}
                variant="bordered"
                isInvalid={!!errors.weightGram}
                errorMessage={errors.weightGram}
                classNames={{
                  inputWrapper: "border border-gray-400",
                }}
              />
            </DetailItem>
          </div>
        </div>
      </div>

      {/* Create Confirmation Modal */}
      <Modal
        isOpen={isConfirmOpen}
        onOpenChange={onConfirmOpenChange}
        size="md"
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <span>Xác nhận thêm sản phẩm</span>
                </div>
              </ModalHeader>
              <ModalBody>
                <p>
                  Bạn có chắc chắn muốn thêm sản phẩm mới với thông tin đã nhập
                  không?
                </p>
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
                  loadingText="Đang thêm..."
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

export default AddProduct;
