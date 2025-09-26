import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  getProducts,
  categories,
  priceRanges,
  materials,
  tags,
} from "../services/productService";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    priceRange: "all",
    material: "all",
    tags: [],
    sortBy: "popular",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);

  const productsPerPage = 8;

  // Fetch products when filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const result = await getProducts(filters);
        // Filter by search term if provided
        const filteredResult = searchTerm
          ? result.filter(
              (product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                product.description
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
            )
          : result;
        setProducts(filteredResult);
        setCurrentPage(1); // Reset to first page when filters change
      } catch (error) {
        console.error("Error fetching products:", error);
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

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  // Pagination
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

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-black mb-2">
          Danh Sách Sản Phẩm Bao Bì Thân Thiện Môi Trường
        </h1>
        <p className="text-gray-600">
          Khám phá các giải pháp bao bì tốt và tiết kiệm chi phí cho doanh
          nghiệp của bạn
        </p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <div className="w-64 flex-shrink-0">
          {/* Categories */}
          <div className="mb-6">
            <h3 className="text-[16px] font-medium text-black mb-3">Bộ lọc</h3>
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </div>
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category.id}
                    checked={filters.category === category.id}
                    onChange={(e) =>
                      handleFilterChange("category", e.target.value)
                    }
                    className="mr-2 text-green-600"
                  />
                  <span className="text-sm text-gray-700">{category.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    ({category.count})
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Khoảng giá
            </div>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <label
                  key={range.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    value={range.id}
                    checked={filters.priceRange === range.id}
                    onChange={(e) =>
                      handleFilterChange("priceRange", e.target.value)
                    }
                    className="mr-2 text-green-600"
                  />
                  <span className="text-sm text-gray-700">{range.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Chất liệu
            </div>
            <div className="space-y-2">
              {materials.map((material) => (
                <label
                  key={material.id}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    type="radio"
                    name="material"
                    value={material.id}
                    checked={filters.material === material.id}
                    onChange={(e) =>
                      handleFilterChange("material", e.target.value)
                    }
                    className="mr-2 text-green-600"
                  />
                  <span className="text-sm text-gray-700">{material.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <div className="text-sm font-medium text-gray-700 mb-2">
              Nhà cung cấp
            </div>
            <div className="space-y-2">
              {tags.map((tag) => (
                <label key={tag} className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.tags.includes(tag)}
                    onChange={() => handleTagFilter(tag)}
                    className="mr-2 text-green-600"
                  />
                  <span className="text-sm text-gray-700">{tag}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Apply Filters Button */}
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
            Áp dụng
          </button>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Search Bar & Sort */}
          <div className="flex justify-end items-center mb-4">
            <div className="flex items-center gap-4">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[45rem] pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <div className="absolute right-3 top-2.5">
                  <svg
                    className="w-5 h-5 text-gray-400"
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
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  Sắp xếp:
                </span>
                <div className="relative dropdown-container">
                  <button
                    onClick={() => toggleDropdown("sort")}
                    className="flex items-center gap-2 px-4 py-2 !bg-white border border-gray-300 rounded-lg hover:border-green-500 !text-gray-700"
                  >
                    <span className="text-sm">
                      {filters.sortBy === "popular" && "Phổ biến nhất"}
                      {filters.sortBy === "price-low" && "Giá: Thấp → Cao"}
                      {filters.sortBy === "price-high" && "Giá: Cao → Thấp"}
                      {filters.sortBy === "rating" && "Đánh giá cao"}
                      {filters.sortBy === "newest" && "Mới nhất"}
                    </span>
                    <svg
                      className={`w-4 h-4 transform transition-transform ${
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
                    <div className="absolute right-0 top-full mt-1 w-48 !bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      <div className="py-1">
                        {[
                          { value: "popular", label: "Phổ biến nhất" },
                          { value: "price-low", label: "Giá: Thấp → Cao" },
                          { value: "price-high", label: "Giá: Cao → Thấp" },
                          { value: "rating", label: "Đánh giá cao" },
                          { value: "newest", label: "Mới nhất" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() =>
                              handleFilterChange("sortBy", option.value)
                            }
                            className={`w-full text-left px-4 py-2 text-sm hover:!bg-gray-50 transition-colors !border-0 !rounded-none ${
                              filters.sortBy === option.value
                                ? "!text-green-600 !bg-green-50"
                                : "!text-gray-700 !bg-white"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {/* Category filter pill */}
            {filters.category !== "all" && (
              <span className="!bg-green-100 !text-green-700 px-3 py-1 rounded-full text-sm flex items-center border-0">
                {categories.find((c) => c.id === filters.category)?.name}
                <button
                  onClick={() => handleFilterChange("category", "all")}
                  className="ml-2 !text-green-600 hover:!text-green-800 !bg-transparent !border-0 !p-0 !rounded-none text-lg leading-none"
                >
                  ×
                </button>
              </span>
            )}

            {/* Price range filter pill */}
            {filters.priceRange !== "all" && (
              <span className="!bg-green-100 !text-green-700 px-3 py-1 rounded-full text-sm flex items-center border-0">
                {priceRanges.find((p) => p.id === filters.priceRange)?.name}
                <button
                  onClick={() => handleFilterChange("priceRange", "all")}
                  className="ml-2 !text-green-600 hover:!text-green-800 !bg-transparent !border-0 !p-0 !rounded-none text-lg leading-none"
                >
                  ×
                </button>
              </span>
            )}

            {/* Material filter pill */}
            {filters.material !== "all" && (
              <span className="!bg-green-100 !text-green-700 px-3 py-1 rounded-full text-sm flex items-center border-0">
                {materials.find((m) => m.id === filters.material)?.name}
                <button
                  onClick={() => handleFilterChange("material", "all")}
                  className="ml-2 !text-green-600 hover:!text-green-800 !bg-transparent !border-0 !p-0 !rounded-none text-lg leading-none"
                >
                  ×
                </button>
              </span>
            )}

            {/* Tag filter pills */}
            {filters.tags.map((tag) => (
              <span
                key={tag}
                className="!bg-green-100 !text-green-700 px-3 py-1 rounded-full text-sm flex items-center border-0"
              >
                {tag}
                <button
                  onClick={() => handleTagFilter(tag)}
                  className="ml-2 !text-green-600 hover:!text-green-800 !bg-transparent !border-0 !p-0 !rounded-none text-lg leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-4 gap-6 mb-8">
                {paginatedProducts.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.id}`}
                    className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group overflow-hidden"
                  >
                    <div className="relative">
                      <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE5MiIgdmlld0JveD0iMCAwIDIwMCAxOTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTkyIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik04MCA4MEgxMjBWMTEySDgwVjgwWiIgZmlsbD0iI0QxRDVEQiIvPgo8L3N2Zz4K";
                          }}
                        />
                      </div>
                    </div>

                    <div className="p-4">
                      {/* Category label above product name */}
                      <div className="flex items-center gap-1 mb-2">
                        <svg
                          width="12"
                          height="13"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_442_715)">
                            <path d="M12 12.5H0V0.5H12V12.5Z" />
                            <path
                              d="M6.375 2.74999C4.53281 2.74999 2.97422 3.95703 2.44453 5.62109C3.23203 5.22265 4.12031 4.99999 5.0625 4.99999H7.125C7.33125 4.99999 7.5 5.16874 7.5 5.37499C7.5 5.58124 7.33125 5.74999 7.125 5.74999H6.75H5.0625C4.67344 5.74999 4.29609 5.79453 3.93281 5.87656C3.32578 6.01484 2.76094 6.26093 2.25938 6.59609C0.897656 7.50312 0 9.05234 0 10.8125V11.1875C0 11.4992 0.250781 11.75 0.5625 11.75C0.874219 11.75 1.125 11.4992 1.125 11.1875V10.8125C1.125 9.67109 1.61016 8.64453 2.38594 7.92499C2.85 9.69453 4.46016 11 6.375 11H6.39844C9.49453 10.9836 12 7.93203 12 4.17031C12 3.17187 11.8242 2.22265 11.5055 1.36718C11.4445 1.20546 11.2078 1.21249 11.1258 1.36484C10.6852 2.18984 9.81328 2.74999 8.8125 2.74999H6.375Z"
                              fill="#027534"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_442_715">
                              <rect
                                width="12"
                                height="12"
                                fill="white"
                                transform="translate(0 0.5)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <span className="text-xs text-green-600 font-medium">
                          {product.category || "Túi giấy"}
                        </span>
                      </div>

                      <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                        {product.name}
                      </h3>

                      <div className="flex items-center mb-2">
                        <div className="text-xs text-gray-600">
                          {product.supplier || "Xưởng EcoPack"}
                        </div>
                        <div className="w-px h-3 bg-gray-300 mx-2"></div>
                        <div className="flex items-center">
                          <div className="flex items-center mr-1">
                            {renderStars(product.rating)}
                          </div>
                          <span className="text-xs text-gray-600 font-medium">
                            {product.rating || "4.8"}
                          </span>
                        </div>
                      </div>

                      <div className="mb-3">
                        <div className="text-base font-bold text-green-600 mb-1">
                          {formatPrice(product.price)}/chiếc
                        </div>
                        <div className="text-xs text-gray-500">
                          MOQ: {product.minQuantity || 100} chiếc
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 bg-white border border-green-600 text-green-600 py-2 px-2 rounded text-xs font-medium hover:bg-green-50 transition-colors whitespace-nowrap">
                          Xem chi tiết
                        </button>
                        <button className="flex-1 bg-green-600 text-white py-2 px-2 rounded text-xs font-medium hover:bg-green-700 transition-colors whitespace-nowrap">
                          Thêm vào giỏ
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ‹
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
                        className={`w-8 h-8 flex items-center justify-center text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-green-600 text-white rounded-md"
                            : "text-gray-700 hover:text-green-600"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  {totalPages > 7 && currentPage < totalPages - 3 && (
                    <>
                      <span className="text-gray-400 px-1">...</span>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        className="w-8 h-8 flex items-center justify-center text-sm font-medium text-gray-700 hover:text-green-600 transition-colors"
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
                    className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-green-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    ›
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
