import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { App } from "antd";
import { messageHelper } from "../utils/messageHelper";
import { getAllProducts } from "../services/productApi";
import { getAllCategories } from "../services/categoryApi";
import { addCartItem } from "../services/cartApi";
import { getSellerById } from "../services/sellerApi";
import { priceRanges, materials, tags } from "../services/productService";

const Products = () => {
  const { message } = App.useApp();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sellers, setSellers] = useState({});
  const [categories, setCategories] = useState([
    { categoryId: "all", categoryName: "Tất cả" },
  ]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "Tất cả",
    priceRange: "all",
    material: "all",
    tags: [],
    sortBy: "popular",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  const productsPerPage = 12;

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories([
          { categoryId: "all", categoryName: "Tất cả" },
          ...categoriesData,
        ]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch seller information when products change
  useEffect(() => {
    const fetchSellers = async () => {
      if (allProducts.length === 0) return;

      const sellerIds = [
        ...new Set(allProducts.map((p) => p.sellerId).filter(Boolean)),
      ];

      const sellerPromises = sellerIds.map(async (sellerId) => {
        if (sellers[sellerId]) return null;

        try {
          const sellerData = await getSellerById(sellerId);
          return { sellerId, data: sellerData };
        } catch (error) {
          console.error(`Error fetching seller ${sellerId}:`, error);
          return null;
        }
      });

      const sellerResults = await Promise.all(sellerPromises);

      const sellersMap = { ...sellers };
      sellerResults.forEach((result) => {
        if (result && result.data) {
          sellersMap[result.sellerId] = result.data;
        }
      });

      setSellers(sellersMap);
    };

    fetchSellers();
  }, [allProducts]);

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getAllProducts();
        setAllProducts(result);

        let filteredResult = result;

        if (filters.category !== "Tất cả" && filters.category !== "all") {
          filteredResult = filteredResult.filter(
            (product) => product.categoryName === filters.category
          );
        }

        if (filters.material !== "all") {
          filteredResult = filteredResult.filter((product) => {
            const productMaterial =
              product.material?.toLowerCase() ||
              product.materialType?.toLowerCase() ||
              "";
            const filterMaterial = filters.material.toLowerCase();

            const materialMap = {
              kraft: ["kraft", "giấy kraft"],
              "white-paper": ["white", "giấy trắng", "trắng", "giấy"],
              bagasse: ["bagasse", "bã mía", "mía"],
              bamboo: ["bamboo", "tre"],
              recycled: ["recycled", "tái chế", "tai che", "giấy tái chế"],
            };

            if (materialMap[filterMaterial]) {
              return materialMap[filterMaterial].some((mat) =>
                productMaterial.includes(mat)
              );
            }

            return productMaterial.includes(filterMaterial);
          });
        }

        if (filters.priceRange !== "all") {
          const range = priceRanges.find((r) => r.id === filters.priceRange);
          if (range) {
            filteredResult = filteredResult.filter((product) => {
              const price = product.price || 0;
              if (range.max === Infinity) {
                return price >= range.min;
              }
              return price >= range.min && price <= range.max;
            });
          }
        }

        if (filters.tags.length > 0) {
          filteredResult = filteredResult.filter((product) =>
            filters.tags.some((tag) => product.tags?.includes(tag))
          );
        }

        if (searchTerm) {
          filteredResult = filteredResult.filter(
            (product) =>
              product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description
                ?.toLowerCase()
                .includes(searchTerm.toLowerCase())
          );
        }

        if (filters.sortBy === "price-low") {
          filteredResult.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (filters.sortBy === "price-high") {
          filteredResult.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else if (filters.sortBy === "rating") {
          filteredResult.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        setProducts(filteredResult);
        setCurrentPage(1);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [filters, searchTerm]);

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setOpenDropdown(null);
  };

  const handleTagFilter = (tag) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const getCategoryCount = (categoryName) => {
    if (categoryName === "Tất cả") {
      return allProducts.length;
    }
    return allProducts.filter((p) => p.categoryName === categoryName).length;
  };

  const getMaterialCount = (materialId) => {
    if (materialId === "all") {
      return allProducts.length;
    }

    const materialMap = {
      kraft: ["kraft", "giấy kraft"],
      "white-paper": ["white", "giấy trắng", "trắng", "giấy"],
      bagasse: ["bagasse", "bã mía", "mía"],
      bamboo: ["bamboo", "tre"],
      recycled: ["recycled", "tái chế", "tai che", "giấy tái chế"],
    };

    return allProducts.filter((p) => {
      const productMaterial =
        p.material?.toLowerCase() || p.materialType?.toLowerCase() || "";
      const filterMaterial = materialId.toLowerCase();

      if (materialMap[filterMaterial]) {
        return materialMap[filterMaterial].some((mat) =>
          productMaterial.includes(mat)
        );
      }

      return productMaterial.includes(filterMaterial);
    }).length;
  };

  const getPriceRangeCount = (rangeId) => {
    if (rangeId === "all") {
      return allProducts.length;
    }
    const range = priceRanges.find((r) => r.id === rangeId);
    if (!range) return 0;
    return allProducts.filter((p) => {
      const price = p.price || 0;
      if (range.max === Infinity) {
        return price >= range.min;
      }
      return price >= range.min && price <= range.max;
    }).length;
  };

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const handleAddToCart = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        messageHelper.warning(
          message,
          "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng"
        );
        return;
      }

      await addCartItem({
        productId: product.productId,
        quantity: 1,
      });

      messageHelper.success(message, `Đã thêm "${product.name}" vào giỏ hàng!`);
      window.dispatchEvent(new Event("cart:updated"));
    } catch (error) {
      console.error("Error adding to cart:", error);
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data ||
        "Không thể thêm sản phẩm vào giỏ hàng";
      const statusCode = error?.response?.status;
      messageHelper.error(
        message,
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    }
  };

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-sm">
          ★
        </span>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <span key="half" className="text-yellow-400 text-sm">
          ★
        </span>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-sm">
          ★
        </span>
      );
    }

    return stars;
  };

  const clearAllFilters = () => {
    setFilters({
      category: "Tất cả",
      priceRange: "all",
      material: "all",
      tags: [],
      sortBy: "popular",
    });
    setSearchTerm("");
  };

  const activeFiltersCount =
    (filters.category !== "Tất cả" && filters.category !== "all" ? 1 : 0) +
    (filters.priceRange !== "all" ? 1 : 0) +
    (filters.material !== "all" ? 1 : 0) +
    filters.tags.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30">
      <div className="max-w-[1400px] mx-auto px-6 py-10">
        {/* Modern Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">
                Sản Phẩm Bao Bì
                <span className="text-green-600"> Xanh</span>
              </h1>
              <p className="text-gray-600 text-lg">
                Giải pháp bao bì thân thiện môi trường cho doanh nghiệp
              </p>
            </div>

            {/* Stats Cards */}
            {/* <div className="flex gap-4">
              <div className="bg-white rounded-xl shadow-sm px-6 py-3 border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">
                  {allProducts.length}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Sản phẩm
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-sm px-6 py-3 border border-gray-100">
                <div className="text-2xl font-bold text-green-600">
                  {categories.length - 1}
                </div>
                <div className="text-xs text-gray-500 uppercase tracking-wide">
                  Danh mục
                </div>
              </div>
            </div> */}
          </div>

          {/* Search Bar - Modern Design */}
          <div className="relative max-w-2xl">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm theo tên, danh mục..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-14 pl-14 pr-6 text-base border-2 border-gray-200 rounded-2xl 
                       focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100
                       transition-all duration-200 bg-white shadow-sm"
            />
            <svg
              className="w-6 h-6 text-gray-400 absolute left-5 top-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-5 top-4 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex gap-8">
          {/* Modern Sidebar */}
          <div className="w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-green-600 hover:text-green-700 font-medium"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Danh mục
                </h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label
                      key={category.categoryId}
                      className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          name="category"
                          value={category.categoryName}
                          checked={filters.category === category.categoryName}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          {category.categoryName}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {getCategoryCount(category.categoryName)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Khoảng giá
                </h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <label
                      key={range.id}
                      className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.id}
                          checked={filters.priceRange === range.id}
                          onChange={(e) =>
                            handleFilterChange("priceRange", e.target.value)
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          {range.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {getPriceRangeCount(range.id)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Material */}
              <div className="mb-6 pb-6 border-b border-gray-100">
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Chất liệu
                </h4>
                <div className="space-y-2">
                  {materials.map((material) => (
                    <label
                      key={material.id}
                      className="flex items-center justify-between cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center flex-1">
                        <input
                          type="radio"
                          name="material"
                          value={material.id}
                          checked={filters.material === material.id}
                          onChange={(e) =>
                            handleFilterChange("material", e.target.value)
                          }
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                          {material.name}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                        {getMaterialCount(material.id)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                  Nhà cung cấp
                </h4>
                <div className="space-y-2">
                  {tags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center cursor-pointer group p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.tags.includes(tag)}
                        onChange={() => handleTagFilter(tag)}
                        className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                        {tag}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                      {paginatedProducts.length}
                    </span>{" "}
                    trong tổng số{" "}
                    <span className="font-semibold text-gray-900">
                      {products.length}
                    </span>{" "}
                    sản phẩm
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  {/* View Mode Toggle */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === "grid"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`p-2 rounded-md transition-all ${
                        viewMode === "list"
                          ? "bg-white text-green-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => toggleDropdown("sort")}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg hover:border-green-500 hover:bg-gray-50 transition-all text-sm font-medium text-gray-700"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
                        />
                      </svg>
                      <span>
                        {filters.sortBy === "popular" && "Phổ biến"}
                        {filters.sortBy === "price-low" && "Giá thấp"}
                        {filters.sortBy === "price-high" && "Giá cao"}
                        {filters.sortBy === "rating" && "Đánh giá"}
                        {filters.sortBy === "newest" && "Mới nhất"}
                      </span>
                      <svg
                        className={`w-4 h-4 transition-transform ${
                          openDropdown === "sort" ? "rotate-180" : ""
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>

                    {openDropdown === "sort" && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="py-2">
                          {[
                            {
                              value: "popular",
                              label: "Phổ biến nhất",
                              icon: "🔥",
                            },
                            {
                              value: "price-low",
                              label: "Giá: Thấp → Cao",
                              icon: "⬆️",
                            },
                            {
                              value: "price-high",
                              label: "Giá: Cao → Thấp",
                              icon: "⬇️",
                            },
                            {
                              value: "rating",
                              label: "Đánh giá cao nhất",
                              icon: "⭐",
                            },
                            { value: "newest", label: "Mới nhất", icon: "🆕" },
                          ].map((option) => (
                            <button
                              key={option.value}
                              onClick={() =>
                                handleFilterChange("sortBy", option.value)
                              }
                              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                                filters.sortBy === option.value
                                  ? "text-green-600 bg-green-50 font-medium"
                                  : "text-gray-700"
                              }`}
                            >
                              <span className="text-lg">{option.icon}</span>
                              <span>{option.label}</span>
                              {filters.sortBy === option.value && (
                                <svg
                                  className="w-4 h-4 ml-auto"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                  {filters.category !== "all" &&
                    filters.category !== "Tất cả" && (
                      <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
                        {
                          categories.find(
                            (c) => c.categoryName === filters.category
                          )?.categoryName
                        }
                        <button
                          onClick={() =>
                            handleFilterChange("category", "Tất cả")
                          }
                          className="text-green-600 hover:text-green-800 ml-1"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </span>
                    )}

                  {filters.priceRange !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
                      {
                        priceRanges.find((p) => p.id === filters.priceRange)
                          ?.name
                      }
                      <button
                        onClick={() => handleFilterChange("priceRange", "all")}
                        className="text-green-600 hover:text-green-800 ml-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  )}

                  {filters.material !== "all" && (
                    <span className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200">
                      {materials.find((m) => m.id === filters.material)?.name}
                      <button
                        onClick={() => handleFilterChange("material", "all")}
                        className="text-green-600 hover:text-green-800 ml-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  )}

                  {filters.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-green-200"
                    >
                      {tag}
                      <button
                        onClick={() => handleTagFilter(tag)}
                        className="text-green-600 hover:text-green-800 ml-1"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col justify-center items-center h-96">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent"></div>
                <p className="mt-4 text-gray-600">Đang tải sản phẩm...</p>
              </div>
            ) : paginatedProducts.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <svg
                  className="w-24 h-24 mx-auto text-gray-300 mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Không tìm thấy sản phẩm
                </h3>
                <p className="text-gray-600 mb-6">
                  Thử điều chỉnh bộ lọc hoặc tìm kiếm khác
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            ) : (
              <>
                {/* Products Grid */}
                <div
                  className={`grid ${
                    viewMode === "grid" ? "grid-cols-3" : "grid-cols-1"
                  } gap-6 mb-8`}
                >
                  {paginatedProducts.map((product) => (
                    <Link
                      key={product.id}
                      to={`/products/${product.id}`}
                      className={`group bg-white rounded-2xl shadow-sm hover:shadow-2xl 
                                transition-all duration-300 overflow-hidden border border-transparent hover:border-green-100 ${
                                  viewMode === "grid" ? "flex-col" : "flex"
                                }`}
                    >
                      {/* Image Section */}
                      <div
                        className={`relative ${
                          viewMode === "grid" ? "w-full h-64" : "w-64 h-64"
                        } bg-gradient-to-br from-gray-50 to-green-50/30 overflow-hidden flex-shrink-0`}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDIwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTEySDgwVjgwWiIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K";
                          }}
                        />

                        {/* Gradient Overlay on Hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                        {/* Category Badge - Top Left */}
                        <div className="absolute top-3 left-3">
                          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-green-100">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 12 13"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-shrink-0"
                            >
                              <path
                                d="M6.375 2.75C4.533 2.75 2.974 3.957 2.445 5.621C3.232 5.223 4.12 5 5.063 5H7.125C7.331 5 7.5 5.169 7.5 5.375C7.5 5.581 7.331 5.75 7.125 5.75H5.063C4.673 5.75 4.296 5.795 3.933 5.877C3.326 6.015 2.761 6.261 2.259 6.596C0.898 7.503 0 9.052 0 10.813V11.188C0 11.499 0.251 11.75 0.563 11.75C0.874 11.75 1.125 11.499 1.125 11.188V10.813C1.125 9.671 1.61 8.645 2.386 7.925C2.85 9.695 4.46 11 6.375 11H6.398C9.495 10.984 12 7.932 12 4.17C12 3.172 11.824 2.223 11.506 1.367C11.445 1.205 11.208 1.212 11.126 1.365C10.685 2.19 9.813 2.75 8.813 2.75H6.375Z"
                                fill="#059669"
                              />
                            </svg>
                            <span className="text-xs font-semibold text-gray-700">
                              {product.categoryName || "Eco"}
                            </span>
                          </div>
                        </div>

                        {/* Quick Action - Top Right */}
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          className="absolute top-3 right-3 w-10 h-10 bg-white/95 backdrop-blur-md rounded-full shadow-lg flex items-center justify-center
                                   opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300
                                   hover:bg-green-600 hover:scale-110 border border-green-100"
                        >
                          <svg
                            className="w-5 h-5 text-green-600 hover:text-white transition-colors"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                          </svg>
                        </button>
                      </div>

                      {/* Content Section */}
                      <div className="p-5 flex flex-col flex-1">
                        {/* Product Name */}
                        <h3 className="text-base font-bold text-gray-900 mb-3 line-clamp-2 leading-snug group-hover:text-green-600 transition-colors min-h-[3rem]">
                          {product.name}
                        </h3>

                        {/* Store Info - Beautiful Card */}
                        <div className="flex items-center gap-2.5 mb-4 p-2.5 bg-gradient-to-r from-gray-50 to-green-50/50 rounded-lg border border-gray-100">
                          {/* Store Icon */}
                          <div className="flex-shrink-0 w-9 h-9 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-sm">
                            <svg
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-.293.707L13 10.414V15a1 1 0 01-.293.707l-2 2A1 1 0 019 17v-6.586L5.293 6.707A1 1 0 015 6V4zm9 6.414l2.707-2.707A1 1 0 0016 7V5h-5v2a1 1 0 00.293.707L12 8.414z"
                                clipRule="evenodd"
                              />
                              <path d="M11 2a1 1 0 011 1v1H8V3a1 1 0 011-1h2z" />
                            </svg>
                          </div>

                          {/* Store Name */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-500 font-medium mb-0.5">
                              Nhà cung cấp
                            </p>
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {sellers[product.sellerId]?.companyName ||
                                product.supplier ||
                                "Xưởng EcoPack"}
                            </p>
                          </div>

                          {/* Verified Badge */}
                          <div className="flex-shrink-0">
                            <div
                              className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                              title="Đã xác thực"
                            >
                              <svg
                                className="w-3.5 h-3.5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        {/* Price Section */}
                        <div className="mb-4">
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-bold text-green-600">
                              {formatPrice(product.price)}
                            </span>
                            <span className="text-sm text-gray-500 font-medium">
                              /chiếc
                            </span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              <svg
                                className="w-4 h-4 text-green-500"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-semibold text-gray-700">
                                4.8
                              </span>
                            </div>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              Đã bán 500+
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <button
                            className="flex-1 px-4 py-2.5 bg-white border-2 border-green-600 text-green-600 rounded-xl font-semibold 
                                     hover:bg-green-50 transition-all duration-200 text-sm flex items-center justify-center gap-2
                                     active:scale-95"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                              />
                            </svg>
                            Xem
                          </button>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl font-semibold 
                                     hover:from-green-700 hover:to-green-600 hover:shadow-lg transition-all duration-200 text-sm 
                                     flex items-center justify-center gap-2 active:scale-95"
                          >
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                              />
                            </svg>
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Modern Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>

                    {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                      let pageNum = i + 1;
                      if (totalPages > 7) {
                        if (currentPage <= 4) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 3) {
                          pageNum = totalPages - 6 + i;
                        } else {
                          pageNum = currentPage - 3 + i;
                        }
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setCurrentPage(pageNum)}
                          className={`w-10 h-10 flex items-center justify-center rounded-lg font-semibold transition-all ${
                            currentPage === pageNum
                              ? "bg-green-600 text-white shadow-lg scale-110"
                              : "border-2 border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 7 && currentPage < totalPages - 3 && (
                      <>
                        <span className="text-gray-400 px-2">...</span>
                        <button
                          onClick={() => setCurrentPage(totalPages)}
                          className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 font-semibold transition-all"
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 flex items-center justify-center rounded-lg border-2 border-gray-200 text-gray-600 hover:border-green-500 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:text-gray-600 transition-all"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
