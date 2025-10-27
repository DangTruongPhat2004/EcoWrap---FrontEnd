import React, { useState, useEffect } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryApi";

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      toast.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle open add modal
  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setFormData({ categoryId: "", categoryName: "" });
    onOpen();
  };

  // Handle open edit modal
  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
    });
    onOpen();
  };

  // Handle open delete modal
  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    onDeleteOpen();
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.categoryName) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      if (selectedCategory) {
        // Update
        await updateCategory(formData);
        toast.success("Cập nhật danh mục thành công");
      } else {
        // Create
        await createCategory(formData);
        toast.success("Thêm danh mục thành công");
      }
      fetchCategories();
      onClose();
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      toast.error(errorMessage);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteCategory(selectedCategory.categoryId);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
      onDeleteClose();
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Không thể xóa danh mục";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Quản lý danh mục
            </h1>
            <p className="text-gray-600 mt-1">
              Quản lý danh mục sản phẩm của hệ thống
            </p>
          </div>
          <Button
            color="success"
            startContent={<Plus size={20} />}
            onPress={handleOpenAdd}
            className="bg-emerald-600 text-white"
          >
            Thêm danh mục
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner size="lg" color="success" />
          </div>
        ) : (
          <Table aria-label="Categories table" className="min-h-[400px]">
            <TableHeader>
              <TableColumn>ID</TableColumn>
              <TableColumn>TÊN DANH MỤC</TableColumn>
              <TableColumn>THAO TÁC</TableColumn>
            </TableHeader>
            <TableBody emptyContent="Chưa có danh mục nào">
              {categories.map((category) => (
                <TableRow key={category.categoryId}>
                  <TableCell>{category.categoryId}</TableCell>
                  <TableCell className="font-medium">
                    {category.categoryName}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        isIconOnly
                        size="sm"
                        color="warning"
                        variant="flat"
                        onPress={() => handleOpenEdit(category)}
                      >
                        <Pencil size={16} />
                      </Button>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="flat"
                        onPress={() => handleOpenDelete(category)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          <ModalHeader className="text-xl font-bold">
            {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
          </ModalHeader>
          <ModalBody className="gap-4">
            <Input
              label="ID danh mục"
              labelPlacement="outside"
              placeholder="Nhập ID (số nguyên)"
              type="number"
              value={formData.categoryId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  categoryId: parseInt(e.target.value) || "",
                })
              }
              isDisabled={!!selectedCategory}
              variant="bordered"
              required
            />
            <Input
              label="Tên danh mục"
              labelPlacement="outside"
              placeholder="Nhập tên danh mục"
              value={formData.categoryName}
              onChange={(e) =>
                setFormData({ ...formData, categoryName: e.target.value })
              }
              variant="bordered"
              required
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Hủy
            </Button>
            <Button
              color="success"
              onPress={handleSubmit}
              className="bg-emerald-600 text-white"
            >
              {selectedCategory ? "Cập nhật" : "Thêm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalContent>
          <ModalHeader className="text-xl font-bold">Xác nhận xóa</ModalHeader>
          <ModalBody>
            <p>
              Bạn có chắc chắn muốn xóa danh mục{" "}
              <strong>{selectedCategory?.categoryName}</strong>?
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Lưu ý: Không thể xóa danh mục nếu có sản phẩm liên kết.
            </p>
          </ModalBody>
          <ModalFooter>
            <Button color="default" variant="light" onPress={onDeleteClose}>
              Hủy
            </Button>
            <Button color="danger" onPress={handleDelete}>
              Xóa
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CategoryManagement;
