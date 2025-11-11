import React, { useState, useEffect } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Plus, Pencil, Trash2, Tag, X, Save } from "lucide-react";
import { App } from "antd";
import {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../services/categoryApi";

const CategoryManagement = () => {
  const { message } = App.useApp();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: "",
    categoryName: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch {
      message.error("Không thể tải danh sách danh mục");
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
    setIsModalOpen(true);
  };

  // Handle open edit modal
  const handleOpenEdit = (category) => {
    setSelectedCategory(category);
    setFormData({
      categoryId: category.categoryId,
      categoryName: category.categoryName,
    });
    setIsModalOpen(true);
  };

  // Handle open delete modal
  const handleOpenDelete = (category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  // Handle form submit
  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.categoryName) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Validation: Check for duplicate ID or Name
    const duplicateId = categories.find(
      (cat) =>
        cat.categoryId === formData.categoryId &&
        (!selectedCategory || cat.categoryId !== selectedCategory.categoryId)
    );

    const duplicateName = categories.find(
      (cat) =>
        cat.categoryName.toLowerCase() ===
          formData.categoryName.toLowerCase() &&
        (!selectedCategory || cat.categoryId !== selectedCategory.categoryId)
    );

    if (duplicateId) {
      message.error(
        `ID ${formData.categoryId} đã tồn tại. Vui lòng chọn ID khác.`
      );
      return;
    }

    if (duplicateName) {
      message.error(
        `Tên danh mục "${formData.categoryName}" đã tồn tại. Vui lòng chọn tên khác.`
      );
      return;
    }

    try {
      setIsSaving(true);
      if (selectedCategory) {
        // Update
        await updateCategory(formData);
        message.success("Cập nhật danh mục thành công");
      } else {
        // Create
        await createCategory(formData);
        message.success("Thêm danh mục thành công");
      }
      fetchCategories();
      setIsModalOpen(false);
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Có lỗi xảy ra";
      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      setIsSaving(true);
      await deleteCategory(selectedCategory.categoryId);
      message.success("Xóa danh mục thành công");
      fetchCategories();
      setIsDeleteModalOpen(false);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Không thể xóa danh mục";
      message.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(
    (category) =>
      category.categoryName
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      category.categoryId?.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Quản lý danh mục
              </h1>
              <p className="mt-2 text-gray-600">
                Quản lý danh mục sản phẩm của hệ thống
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              <span>Thêm danh mục</span>
            </button>
          </div>
        </div>

        {/* Stats Card */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tổng danh mục</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 bg-white rounded-lg shadow-sm p-4 border border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm danh mục theo ID hoặc tên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-4"></div>
            <p className="text-gray-600">Đang tải danh mục...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <Tag size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? "Không tìm thấy danh mục" : "Chưa có danh mục nào"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Không tìm thấy danh mục phù hợp với từ khóa tìm kiếm"
                : "Bắt đầu bằng cách thêm danh mục mới"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleOpenAdd}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus size={20} />
                <span>Thêm danh mục đầu tiên</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tên danh mục
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCategories.map((category) => (
                    <tr
                      key={category.categoryId}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {category.categoryId}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Tag size={16} className="text-emerald-600" />
                          <span className="text-sm font-medium text-gray-900">
                            {category.categoryName}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(category)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-xs font-medium"
                          >
                            <Pencil size={14} />
                            Sửa
                          </button>
                          <button
                            onClick={() => handleOpenDelete(category)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium"
                          >
                            <Trash2 size={14} />
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-lg w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ID danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="Nhập ID (số nguyên)"
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      categoryId: parseInt(e.target.value) || "",
                    })
                  }
                  disabled={!!selectedCategory}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên danh mục <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên danh mục"
                  value={formData.categoryName}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryName: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xử lý...</span>
                  </>
                ) : (
                  <>
                    <Save size={16} />
                    <span>{selectedCategory ? "Cập nhật" : "Thêm"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-bold text-gray-900">Xác nhận xóa</h3>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn xóa danh mục{" "}
                <strong className="text-gray-900">
                  {selectedCategory?.categoryName}
                </strong>
                ?
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-800">
                  <strong>Lưu ý:</strong> Không thể xóa danh mục nếu có sản phẩm
                  liên kết.
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isSaving}
                className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Hủy
              </button>
              <button
                onClick={handleDelete}
                disabled={isSaving}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang xóa...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={16} />
                    <span>Xóa</span>
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

export default CategoryManagement;
