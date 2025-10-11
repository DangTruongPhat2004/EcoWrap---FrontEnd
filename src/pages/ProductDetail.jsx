import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductById } from "../services/productApi";
import { getAllProducts } from "../services/productApi";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(100);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product by ID from backend
        const productData = await getProductById(id);
        setProduct(productData);

        // Fetch related products (products in the same category)
        const allProducts = await getAllProducts();
        const related = allProducts
          .filter((p) => p.id !== id && p.category === productData.category)
          .slice(0, 4); // Limit to 4 related products
        setRelatedProducts(related);

        setSelectedImage(0);
      } catch (err) {
        setError(
          err.response?.data?.message || err.message || "Không thể tải sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN").format(price) + "₫";
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <span key={i} className="text-yellow-400 text-sm">
          ★
        </span>
      );
    }

    const emptyStars = 5 - fullStars;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <span key={`empty-${i}`} className="text-gray-300 text-sm">
          ★
        </span>
      );
    }

    return stars;
  };

  const handleQuantityChange = (newQty) => {
    const qty = Math.max(1, parseInt(newQty) || 1);
    setQuantity(qty);
  };

  // Price tiers based on quantity
  const getPriceByQuantity = (basePrice, qty) => {
    if (qty >= 2000) return Math.round(basePrice * 0.9); // 10% discount
    if (qty >= 1000) return Math.round(basePrice * 0.92); // 8% discount
    if (qty >= 500) return Math.round(basePrice * 0.95); // 5% discount
    if (qty >= 200) return Math.round(basePrice * 0.98); // 2% discount
    return basePrice;
  };

  if (loading) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sản phẩm không tồn tại
          </h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <button
            onClick={() => navigate("/products")}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Quay lại danh sách sản phẩm
          </button>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-[1080px] mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-green-600">
          Trang chủ
        </Link>
        <span>/</span>
        <Link to="/products" className="hover:text-green-600">
          Sản phẩm
        </Link>
        <span>/</span>
        {product.category && (
          <>
            <Link
              to={`/products?category=${
                typeof product.category === "string"
                  ? product.category.toLowerCase()
                  : product.category
              }`}
              className="hover:text-green-600"
            >
              {typeof product.category === "string"
                ? product.category
                : "Bao bì thân thiện môi trường"}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-gray-800">
          {product.name || product.productName}
        </span>
      </nav>

      <div className="grid grid-cols-12 gap-8">
        {/* Product Images - Left Side */}
        <div className="col-span-6">
          {/* Main Image */}
          <div className="mb-4">
            <div className="w-full h-[400px] bg-gray-100 rounded-lg overflow-hidden">
              <img
                src={
                  product.images?.[selectedImage] ||
                  product.imageFile ||
                  product.images?.[0]
                }
                alt={product.name || product.productName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDQwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xNTAgMTYwSDI1MFYyNDBIMTUwVjE2MFoiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";
                }}
              />
            </div>
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-4 gap-3">
            {(product.images || []).slice(0, 4).map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className="w-full aspect-[4/3] rounded-lg overflow-hidden transition-colors hover:opacity-80 border-none outline-none"
              >
                <img
                  src={image}
                  alt={`${product.name || product.productName} ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHZpZXdCb3g9IjAgMCA2NCA2NCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNCAyNkg0MFYzOEgyNFYyNloiIGZpbGw9IiNEMUQ1REIiLz4KPC9zdmc+";
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info - Right Side */}
        <div className="col-span-6">
          {/* Green badge and product name */}

          <div className="mb-4">
            <div className="flex items-center mb-3">
              <svg
                width="16"
                height="14"
                viewBox="0 0 16 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.5 2C6.04375 2 3.96563 3.60938 3.25938 5.82813C4.30937 5.29688 5.49375 5 6.75 5H9.5C9.775 5 10 5.225 10 5.5C10 5.775 9.775 6 9.5 6H9H6.75C6.23125 6 5.72813 6.05938 5.24375 6.16875C4.43438 6.35313 3.68125 6.68125 3.0125 7.12813C1.19688 8.3375 0 10.4031 0 12.75V13.25C0 13.6656 0.334375 14 0.75 14C1.16562 14 1.5 13.6656 1.5 13.25V12.75C1.5 11.2281 2.14688 9.85938 3.18125 8.9C3.8 11.2594 5.94688 13 8.5 13H8.53125C12.6594 12.9781 16 8.90938 16 3.89375C16 2.5625 15.7656 1.29688 15.3406 0.156253C15.2594 -0.0593724 14.9438 -0.0499973 14.8344 0.153128C14.2469 1.25313 13.0844 2 11.75 2H8.5Z"
                  fill="#027534"
                />
              </svg>
              <div className="inline-block text-green-800 text-sm px-2 py-1 rounded-full font-medium">
                Sản phẩm bền vững
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {product.name || product.productName}
            </h1>

            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center mr-2">
                {renderStars(product.rating || 0)}
              </div>
              <span className="text-sm font-medium mr-1">
                {product.rating || 0}/5
              </span>
              <span className="text-sm text-gray-500">
                ({product.reviewCount || product.reviews?.length || 0} đánh giá)
              </span>
            </div>
          </div>

          {/* Price and Stock Status */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.price || product.productPrice || 0)}
                </span>
                <span className="text-sm text-gray-500">
                  /{product.unit || "chiếc"}
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 13 13"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.77695 1.34961L0.390625 4.125H6.07812V0.625H2.95273C2.45508 0.625 2.00117 0.906641 1.77695 1.34961ZM6.95312 4.125H12.6406L11.2543 1.34961C11.0301 0.906641 10.5762 0.625 10.0785 0.625H6.95312V4.125ZM12.6406 5H0.390625V11.125C0.390625 12.0902 1.17539 12.875 2.14062 12.875H10.8906C11.8559 12.875 12.6406 12.0902 12.6406 11.125V5Z"
                    fill="#8D6F47"
                  />
                </svg>

                <span className="text-sm text-gray-600 ml-2">
                  {product.inStock || product.productStatus === "In stock"
                    ? "Còn hàng"
                    : "Hết hàng"}
                </span>
              </div>
            </div>
          </div>

          {/* Gray separator line */}
          <hr className="border-gray-200 my-6" />

          {/* Thông tin sản phẩm */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Thông tin sản phẩm
            </h3>

            <div className="grid grid-cols-3 gap-x-8 gap-y-4">
              {/* Column 1: Kích thước, Loại mực */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M5.55937 15.4406C4.975 16.025 4.025 16.025 3.4375 15.4406L0.559375 12.5594C-0.025 11.975 -0.025 11.025 0.559375 10.4375L2.14375 8.85311L3.64375 10.3531C3.8375 10.5469 4.15625 10.5469 4.35 10.3531C4.54375 10.1594 4.54375 9.84061 4.35 9.64686L2.85 8.14686L4.14375 6.85311L5.64375 8.35311C5.8375 8.54686 6.15625 8.54686 6.35 8.35311C6.54375 8.15936 6.54375 7.84061 6.35 7.64686L4.85 6.14686L6.14375 4.85311L7.64375 6.35311C7.8375 6.54686 8.15625 6.54686 8.35 6.35311C8.54375 6.15936 8.54375 5.84061 8.35 5.64686L6.85 4.14686L8.14375 2.85311L9.64375 4.35311C9.8375 4.54686 10.1562 4.54686 10.35 4.35311C10.5438 4.15936 10.5438 3.84061 10.35 3.64686L8.85 2.14686L10.4344 0.562488C11.0188 -0.0218872 11.9688 -0.0218872 12.5562 0.562488L15.4344 3.44061C16.0188 4.02499 16.0188 4.97499 15.4344 5.56249L5.55937 15.4406Z"
                        fill="#8D6F47"
                      />
                    </svg>

                    <span className="text-sm text-gray-600 ml-2">
                      Kích thước
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-6">
                    {product.size || "Chưa xác định"}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 0C0.446875 0 0 0.446875 0 1V8.5V10V12.5C0 13.3281 0.671875 14 1.5 14H14.5C15.3281 14 16 13.3281 16 12.5V8.5V3.75625C16 3.1875 15.3938 2.82813 14.8938 3.09688L10 5.73125V3.75625C10 3.1875 9.39375 2.82813 8.89375 3.09688L4 5.73125V1C4 0.446875 3.55312 0 3 0H1Z"
                        fill="#8D6F47"
                      />
                    </svg>

                    <span className="text-sm text-gray-600 ml-2">Loại mực</span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-6">
                    {product.inkType || "Chưa xác định"}
                  </div>
                </div>
              </div>

              {/* Column 2: Chất liệu, Kỹ thuật in */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg
                      width="17"
                      height="16"
                      viewBox="0 0 17 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7.33349 3C7.33349 2.73478 7.43884 2.48043 7.62638 2.29289C7.81392 2.10536 8.06827 2 8.33349 2C8.5987 2 8.85306 2.10536 9.04059 2.29289C9.22813 2.48043 9.33349 2.73478 9.33349 3C9.33349 3.26522 9.22813 3.51957 9.04059 3.70711C8.85306 3.89464 8.5987 4 8.33349 4C8.06827 4 7.81392 3.89464 7.62638 3.70711C7.43884 3.51957 7.33349 3.26522 7.33349 3ZM11.1616 4C11.271 3.6875 11.3335 3.35 11.3335 3C11.3335 1.34375 9.98974 0 8.33349 0C6.67724 0 5.33349 1.34375 5.33349 3C5.33349 3.35 5.39286 3.6875 5.50536 4H4.08349C3.39599 4 2.79599 4.46875 2.62724 5.1375L0.377236 14.1375C0.264736 14.5844 0.364736 15.0594 0.649111 15.425C0.933486 15.7906 1.37099 16 1.83349 16H14.8335C15.296 16 15.7304 15.7875 16.0147 15.4219C16.2991 15.0563 16.3991 14.5844 16.2866 14.1344L14.0366 5.13438C13.871 4.46875 13.271 4 12.5835 4H11.1616Z"
                        fill="#8D6F47"
                      />
                    </svg>

                    <span className="text-sm text-gray-600 ml-2">
                      Chất liệu
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-6">
                    {product.material ||
                      product.materialType ||
                      "Chưa xác định"}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center">
                    <svg
                      width="16"
                      height="14"
                      viewBox="0 0 16 14"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1 0C0.446875 0 0 0.446875 0 1V8.5V10V12.5C0 13.3281 0.671875 14 1.5 14H14.5C15.3281 14 16 13.3281 16 12.5V8.5V3.75625C16 3.1875 15.3938 2.82813 14.8938 3.09688L10 5.73125V3.75625C10 3.1875 9.39375 2.82813 8.89375 3.09688L4 5.73125V1C4 0.446875 3.55312 0 3 0H1Z"
                        fill="#8D6F47"
                      />
                    </svg>

                    <span className="text-sm text-gray-600 ml-2">
                      Kỹ thuật in
                    </span>
                  </div>
                  <div className="text-sm font-medium text-gray-900 ml-6">
                    {product.printProcess || "Chưa xác định"}
                  </div>
                </div>
              </div>

              {/* Column 3: Nhà cung cấp */}
              <div className="space-y-1">
                <div className="flex items-center">
                  <svg
                    width="16"
                    height="14"
                    viewBox="0 0 16 14"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 0C0.446875 0 0 0.446875 0 1V8.5V10V12.5C0 13.3281 0.671875 14 1.5 14H14.5C15.3281 14 16 13.3281 16 12.5V8.5V3.75625C16 3.1875 15.3938 2.82813 14.8938 3.09688L10 5.73125V3.75625C10 3.1875 9.39375 2.82813 8.89375 3.09688L4 5.73125V1C4 0.446875 3.55312 0 3 0H1Z"
                      fill="#8D6F47"
                    />
                  </svg>

                  <span className="text-sm text-gray-600 ml-2">
                    Nhà cung cấp
                  </span>
                </div>
                <div className="text-sm font-medium text-gray-900 ml-6">
                  Xưởng EcoPack
                </div>
              </div>
            </div>
          </div>

          {/* Mô tả */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-3 text-gray-900">
              Mô tả
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              {product.description ||
                product.productDescription ||
                "Chưa có mô tả cho sản phẩm này."}
            </p>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                100% phân hủy sinh học
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                An toàn thực phẩm
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-700">
                Thân thiện môi trường
              </span>
            </div>
          </div>

          {/* Chứng nhận */}
          <div
            className="mb-8 p-4 rounded-lg"
            style={{ backgroundColor: "#F5F1EA" }}
          >
            <h3 className="text-base font-semibold mb-3 text-gray-900">
              Chứng nhận
            </h3>
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <g clip-path="url(#clip0_466_899)">
                    <g clip-path="url(#clip1_466_899)">
                      <path
                        d="M6.59356 0.22812C6.40606 0.031245 6.12481 -0.043755 5.86231 0.024995C5.59981 0.093745 5.39669 0.30312 5.32794 0.56562L4.83419 2.51874L2.89669 1.97187C2.63419 1.89687 2.35294 1.97187 2.16231 2.16249C1.97169 2.35312 1.89669 2.63437 1.97169 2.89687L2.51856 4.83437L0.565437 5.33125C0.302937 5.39687 0.0966869 5.60312 0.0248119 5.86562C-0.0470631 6.12812 0.0310619 6.40625 0.227937 6.59375L1.67169 8L0.227937 9.40625C0.0310619 9.59375 -0.0439381 9.875 0.0248119 10.1375C0.0935619 10.4 0.302937 10.6031 0.565437 10.6719L2.51856 11.1656L1.97169 13.1031C1.89669 13.3656 1.97169 13.6469 2.16231 13.8375C2.35294 14.0281 2.63419 14.1031 2.89669 14.0281L4.83419 13.4812L5.32794 15.4344C5.39356 15.6969 5.59981 15.9031 5.86231 15.975C6.12481 16.0469 6.40294 15.9687 6.59356 15.775L7.99981 14.3312L9.40606 15.775C9.59669 15.9687 9.87481 16.0469 10.1373 15.975C10.3998 15.9031 10.6029 15.6969 10.6717 15.4344L11.1654 13.4812L13.1029 14.0281C13.3654 14.1031 13.6467 14.0281 13.8373 13.8375C14.0279 13.6469 14.1029 13.3656 14.0279 13.1031L13.4811 11.1656L15.4342 10.6719C15.6967 10.6062 15.9029 10.4 15.9748 10.1375C16.0467 9.875 15.9686 9.59687 15.7748 9.40625L14.3311 8L15.7748 6.59375C15.9686 6.40312 16.0467 6.125 15.9748 5.8625C15.9029 5.6 15.6967 5.39687 15.4342 5.32812L13.4811 4.83437L14.0279 2.89687C14.1029 2.63437 14.0279 2.35312 13.8373 2.16249C13.6467 1.97187 13.3654 1.89687 13.1029 1.97187L11.1654 2.51874L10.6686 0.56562C10.6029 0.30312 10.3967 0.09687 10.1342 0.024995C9.87169 -0.04688 9.59356 0.031245 9.40606 0.22812L7.99981 1.67187L6.59356 0.22812Z"
                        fill="#8D6F47"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_466_899">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                    <clipPath id="clip1_466_899">
                      <path d="M0 0H16V16H0V0Z" fill="white" />
                    </clipPath>
                  </defs>
                </svg>

                <span className="text-xs text-gray-700 font-medium">FSC</span>
              </div>
              <div className="flex items-center">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <path
                    d="M16.5 1C16.5 4.55 13.8562 7.48438 10.4312 7.9375C10.2094 6.26875 9.475 4.7625 8.39062 3.58437C9.5875 1.44687 11.875 0 14.5 0H15.5C16.0531 0 16.5 0.446875 16.5 1ZM0.5 3C0.5 2.44688 0.946875 2 1.5 2H2.5C6.36562 2 9.5 5.13438 9.5 9V10V15C9.5 15.5531 9.05313 16 8.5 16C7.94688 16 7.5 15.5531 7.5 15V10C3.63438 10 0.5 6.86562 0.5 3Z"
                    fill="#8D6F47"
                  />
                </svg>

                <span className="text-xs text-gray-700 font-medium">
                  OK Compost
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  width="17"
                  height="16"
                  viewBox="0 0 17 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-1"
                >
                  <g clip-path="url(#clip0_466_910)">
                    <path
                      d="M5.72505 1.40937C6.27192 0.53125 7.23442 0 8.26567 0C9.29692 0 10.2594 0.53125 10.8063 1.40937L12.0125 3.3375L12.8563 2.85C13.1188 2.69687 13.4469 2.71875 13.6875 2.90313C13.9282 3.0875 14.0344 3.4 13.9563 3.69375L13.225 6.425C13.1188 6.825 12.7063 7.0625 12.3063 6.95625L9.57505 6.225C9.2813 6.14687 9.06567 5.9 9.02505 5.6C8.98442 5.3 9.1313 5.00313 9.3938 4.85313L10.2813 4.34062L9.10942 2.46875C8.92817 2.17812 8.60942 2 8.26567 2C7.92192 2 7.60317 2.17812 7.42192 2.46875L6.87505 3.34375C6.58755 3.80625 5.9813 3.95312 5.51255 3.67188C5.03442 3.38438 4.8813 2.75937 5.17817 2.28437L5.72505 1.40937ZM13.6875 7.87187C14.1563 7.59062 14.7625 7.7375 15.05 8.2L15.8125 9.42188C16.1063 9.89375 16.2625 10.4344 16.2688 10.9906C16.2782 12.65 14.9344 14.0031 13.275 14.0031L10.2657 14V15C10.2657 15.3031 10.0844 15.5781 9.80317 15.6938C9.52192 15.8094 9.20005 15.7469 8.98442 15.5312L6.98442 13.5312C6.69067 13.2375 6.69067 12.7625 6.98442 12.4719L8.98442 10.4719C9.20005 10.2563 9.52192 10.1937 9.80317 10.3094C10.0844 10.425 10.2657 10.7 10.2657 11.0031V12.0031H13.2719C13.8219 12.0031 14.2688 11.5531 14.2657 11.0031C14.2657 10.8188 14.2125 10.6375 14.1157 10.4812L13.3532 9.25937C13.0563 8.78437 13.2063 8.15938 13.6875 7.87187ZM2.2938 6.90312L1.39067 6.38125C1.12817 6.22813 0.981299 5.93438 1.02192 5.63438C1.06255 5.33437 1.27817 5.0875 1.57192 5.00938L4.30317 4.27812C4.70317 4.17188 5.11567 4.40937 5.22192 4.80937L5.95317 7.5375C6.0313 7.83125 5.92505 8.14062 5.68442 8.32812C5.4438 8.51562 5.11567 8.53438 4.85317 8.38125L4.02505 7.90312L2.41567 10.4781C2.3188 10.6344 2.26567 10.8156 2.26567 11C2.26255 11.55 2.70942 12 3.25942 12H4.26567C4.8188 12 5.26567 12.4469 5.26567 13C5.26567 13.5531 4.8188 14 4.26567 14H3.25942C1.60005 14 0.256299 12.65 0.265674 10.9875C0.268799 10.4313 0.425049 9.89062 0.721924 9.41875L2.2938 6.90312Z"
                      fill="#8D6F47"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_466_910">
                      <path
                        d="M0.265625 0H16.2656V16H0.265625V0Z"
                        fill="white"
                      />
                    </clipPath>
                  </defs>
                </svg>

                <span className="text-xs text-gray-700 font-medium">
                  Tái chế được
                </span>
              </div>
            </div>
          </div>

          {/* Số lượng */}
          <div className="mb-6">
            <h3 className="text-base font-semibold mb-4 text-gray-900">
              Số lượng
            </h3>

            {/* Quantity Input */}
            <div className="flex items-center space-x-4 mb-6">
              {/* Decrement Buttons */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 100)}
                  className="px-2 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 bg-white border-0 text-sm font-medium transition-colors"
                  disabled={quantity <= 100}
                  title="Giảm 100"
                >
                  -100
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={() => handleQuantityChange(quantity - 10)}
                  className="px-2 py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 bg-white border-0 text-sm font-medium transition-colors"
                  disabled={quantity <= 100}
                  title="Giảm 10"
                >
                  -10
                </button>
              </div>

              {/* Quantity Input */}
              <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) =>
                    handleQuantityChange(parseInt(e.target.value) || 100)
                  }
                  className="w-20 px-3 py-2 text-center border-0 focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white font-semibold text-sm bg-transparent [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]"
                  min="100"
                  step="10"
                />
              </div>

              {/* Increment Buttons */}
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity + 10)}
                  className="px-2 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 bg-white border-0 text-sm font-medium transition-colors"
                  title="Tăng 10"
                >
                  +10
                </button>
                <div className="w-px h-6 bg-gray-300"></div>
                <button
                  onClick={() => handleQuantityChange(quantity + 100)}
                  className="px-2 py-2 text-gray-600 hover:bg-green-50 hover:text-green-600 bg-white border-0 text-sm font-medium transition-colors"
                  title="Tăng 100"
                >
                  +100
                </button>
              </div>

              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
                Tối thiểu: 100 chiếc
              </span>
            </div>

            {/* Price Table */}
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2">
                <div className="flex justify-between text-sm font-medium text-gray-700">
                  <span>Số lượng</span>
                  <span>Giá</span>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {[
                  { qty: 100, price: "3.000" },
                  { qty: 500, price: "2.800" },
                  { qty: 1000, price: "2.500" },
                  { qty: 3000, price: "2.300" },
                  { qty: 5000, price: "2.000" },
                ].map((tier) => (
                  <div
                    key={tier.qty}
                    className={`flex justify-between items-center px-4 py-3 ${
                      quantity >= tier.qty ? "bg-green-50" : ""
                    }`}
                  >
                    <span className="text-sm font-medium text-gray-700">
                      {tier.qty}
                    </span>
                    <span
                      className={`text-sm font-semibold ${
                        quantity >= tier.qty
                          ? "text-green-600"
                          : "text-gray-900"
                      }`}
                    >
                      {tier.price}₫ / chiếc
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 mb-8">
            <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center">
              <svg
                width="17"
                height="24"
                viewBox="0 0 17 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path d="M16.5312 24H0.53125V0H16.5312V24Z" />
                <g clip-path="url(#clip0_466_813)">
                  <path
                    d="M16.5312 12C16.5312 12.0281 16.5312 12.0563 16.5312 12.0844C16.5188 13.225 15.4812 14 14.3406 14H11.2812C10.4531 14 9.78125 14.6719 9.78125 15.5C9.78125 15.6062 9.79375 15.7094 9.8125 15.8094C9.87813 16.1281 10.0156 16.4344 10.15 16.7437C10.3406 17.175 10.5281 17.6031 10.5281 18.0562C10.5281 19.05 9.85312 19.9531 8.85938 19.9937C8.75 19.9969 8.64062 20 8.52812 20C4.1125 20 0.53125 16.4187 0.53125 12C0.53125 7.58125 4.1125 4 8.53125 4C12.95 4 16.5312 7.58125 16.5312 12ZM4.53125 13C4.53125 12.7348 4.42589 12.4804 4.23836 12.2929C4.05082 12.1054 3.79647 12 3.53125 12C3.26603 12 3.01168 12.1054 2.82414 12.2929C2.63661 12.4804 2.53125 12.7348 2.53125 13C2.53125 13.2652 2.63661 13.5196 2.82414 13.7071C3.01168 13.8946 3.26603 14 3.53125 14C3.79647 14 4.05082 13.8946 4.23836 13.7071C4.42589 13.5196 4.53125 13.2652 4.53125 13ZM4.53125 10C4.79647 10 5.05082 9.89464 5.23836 9.70711C5.42589 9.51957 5.53125 9.26522 5.53125 9C5.53125 8.73478 5.42589 8.48043 5.23836 8.29289C5.05082 8.10536 4.79647 8 4.53125 8C4.26603 8 4.01168 8.10536 3.82414 8.29289C3.63661 8.48043 3.53125 8.73478 3.53125 9C3.53125 9.26522 3.63661 9.51957 3.82414 9.70711C4.01168 9.89464 4.26603 10 4.53125 10ZM9.53125 7C9.53125 6.73478 9.42589 6.48043 9.23836 6.29289C9.05082 6.10536 8.79647 6 8.53125 6C8.26603 6 8.01168 6.10536 7.82414 6.29289C7.63661 6.48043 7.53125 6.73478 7.53125 7C7.53125 7.26522 7.63661 7.51957 7.82414 7.70711C8.01168 7.89464 8.26603 8 8.53125 8C8.79647 8 9.05082 7.89464 9.23836 7.70711C9.42589 7.51957 9.53125 7.26522 9.53125 7ZM12.5312 10C12.7965 10 13.0508 9.89464 13.2384 9.70711C13.4259 9.51957 13.5312 9.26522 13.5312 9C13.5312 8.73478 13.4259 8.48043 13.2384 8.29289C13.0508 8.10536 12.7965 8 12.5312 8C12.266 8 12.0117 8.10536 11.8241 8.29289C11.6366 8.48043 11.5312 8.73478 11.5312 9C11.5312 9.26522 11.6366 9.51957 11.8241 9.70711C12.0117 9.89464 12.266 10 12.5312 10Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_466_813">
                    <path d="M0.53125 4H16.5312V20H0.53125V4Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Thiết Kế Ngay
            </button>
            <button
              className="flex-1 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-700 transition-colors flex items-center justify-center"
              style={{ backgroundColor: "#8D6F47" }}
            >
              <svg
                width="18"
                height="24"
                viewBox="0 0 18 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-3"
              >
                <path d="M18 24H0V0H18V24Z" />
                <g clip-path="url(#clip0_466_816)">
                  <path
                    d="M0 4.75C0 4.33437 0.334375 4 0.75 4H2.17188C2.85938 4 3.46875 4.4 3.75312 5H16.5969C17.4187 5 18.0188 5.78125 17.8031 6.575L16.5219 11.3344C16.2563 12.3156 15.3656 13 14.35 13H5.33437L5.50313 13.8906C5.57188 14.2437 5.88125 14.5 6.24062 14.5H15.25C15.6656 14.5 16 14.8344 16 15.25C16 15.6656 15.6656 16 15.25 16H6.24062C5.15938 16 4.23125 15.2312 4.03125 14.1719L2.41875 5.70312C2.39688 5.58438 2.29375 5.5 2.17188 5.5H0.75C0.334375 5.5 0 5.16562 0 4.75ZM4 18.5C4 18.303 4.0388 18.108 4.11418 17.926C4.18956 17.744 4.30005 17.5786 4.43934 17.4393C4.57863 17.3001 4.74399 17.1896 4.92597 17.1142C5.10796 17.0388 5.30302 17 5.5 17C5.69698 17 5.89204 17.0388 6.07403 17.1142C6.25601 17.1896 6.42137 17.3001 6.56066 17.4393C6.69995 17.5786 6.81044 17.744 6.88582 17.926C6.9612 18.108 7 18.303 7 18.5C7 18.697 6.9612 18.892 6.88582 19.074C6.81044 19.256 6.69995 19.4214 6.56066 19.5607C6.42137 19.6999 6.25601 19.8104 6.07403 19.8858C5.89204 19.9612 5.69698 20 5.5 20C5.30302 20 5.10796 19.9612 4.92597 19.8858C4.74399 19.8104 4.57863 19.6999 4.43934 19.5607C4.30005 19.4214 4.18956 19.256 4.11418 19.074C4.0388 18.892 4 18.697 4 18.5ZM14.5 17C14.8978 17 15.2794 17.158 15.5607 17.4393C15.842 17.7206 16 18.1022 16 18.5C16 18.8978 15.842 19.2794 15.5607 19.5607C15.2794 19.842 14.8978 20 14.5 20C14.1022 20 13.7206 19.842 13.4393 19.5607C13.158 19.2794 13 18.8978 13 18.5C13 18.1022 13.158 17.7206 13.4393 17.4393C13.7206 17.158 14.1022 17 14.5 17ZM7.875 9C7.875 9.34375 8.15625 9.625 8.5 9.625H9.875V11C9.875 11.3438 10.1562 11.625 10.5 11.625C10.8438 11.625 11.125 11.3438 11.125 11V9.625H12.5C12.8438 9.625 13.125 9.34375 13.125 9C13.125 8.65625 12.8438 8.375 12.5 8.375H11.125V7C11.125 6.65625 10.8438 6.375 10.5 6.375C10.1562 6.375 9.875 6.65625 9.875 7V8.375H8.5C8.15625 8.375 7.875 8.65625 7.875 9Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_466_816">
                    <path d="M0 4H18V20H0V4Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Thêm Vào Giỏ Hàng
            </button>
          </div>
        </div>
      </div>

      {/* Company Information Section */}
      <div className="mt-8 mb-8 border border-gray-200 rounded-lg p-6">
        {/* Top Section: Logo and Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          {/* Company Logo and Info - Side by Side */}
          <div className="flex items-center space-x-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ backgroundColor: "#F5F1EA" }}
            >
              <svg
                width="20"
                height="24"
                viewBox="0 0 28 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3.5 4.5C2.67031 4.5 2 5.17031 2 6V17.25V19.5V23.25C2 24.4922 3.00781 25.5 4.25 25.5H23.75C24.9922 25.5 26 24.4922 26 23.25V17.25V10.1344C26 9.28125 25.0906 8.74219 24.3406 9.14531L17 13.0969V10.1344C17 9.28125 16.0906 8.74219 15.3406 9.14531L8 13.0969V6C8 5.17031 7.32969 4.5 6.5 4.5H3.5Z"
                  fill="#8D6F47"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Xưởng EcoPack
              </h3>
              <div className="flex items-center">
                {renderStars(4.8)}
                <span className="text-sm text-gray-500 ml-1">
                  (56 đánh giá)
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons - Right Side */}
          <div className="flex items-center space-x-3">
            <button className="bg-white border border-green-600 text-green-600 px-6 py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors flex items-center">
              <svg
                width="19"
                height="16"
                viewBox="0 0 19 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <g clipPath="url(#clip0_466_623)">
                  <g clipPath="url(#clip1_466_623)">
                    <path
                      d="M17.8624 3.24375L16.0718 0.409375C15.9124 0.15625 15.6281 0 15.3249 0H4.17493C3.87181 0 3.58743 0.15625 3.42806 0.409375L1.63431 3.24375C0.709306 4.70625 1.52806 6.74062 3.25618 6.975C3.38118 6.99062 3.50931 7 3.63431 7C4.44993 7 5.17493 6.64375 5.67181 6.09375C6.16868 6.64375 6.89368 7 7.70931 7C8.52493 7 9.24993 6.64375 9.74681 6.09375C10.2437 6.64375 10.9687 7 11.7843 7C12.6031 7 13.3249 6.64375 13.8218 6.09375C14.3218 6.64375 15.0437 7 15.8593 7C15.9874 7 16.1124 6.99062 16.2374 6.975C17.9718 6.74375 18.7937 4.70938 17.8656 3.24375H17.8624ZM16.3656 7.96562H16.3624C16.1968 7.9875 16.0281 8 15.8562 8C15.4687 8 15.0968 7.94062 14.7499 7.83437V12H4.74993V7.83125C4.39993 7.94063 4.02493 8 3.63743 8C3.46556 8 3.29368 7.9875 3.12806 7.96562H3.12493C2.99681 7.94687 2.87181 7.925 2.74993 7.89375V12V14C2.74993 15.1031 3.64681 16 4.74993 16H14.7499C15.8531 16 16.7499 15.1031 16.7499 14V12V7.89375C16.6249 7.925 16.4999 7.95 16.3656 7.96562Z"
                      fill="#027534"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_466_623">
                    <rect
                      width="18"
                      height="16"
                      fill="white"
                      transform="translate(0.75)"
                    />
                  </clipPath>
                  <clipPath id="clip1_466_623">
                    <path d="M0.75 0H18.75V16H0.75V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Xem cửa hàng
            </button>
            <button className="bg-white border border-gray-300 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center">
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
              >
                <g clipPath="url(#clip0_466_628)">
                  <g clipPath="url(#clip1_466_628)">
                    <path
                      d="M2.60938 0C1.50625 0 0.609375 0.896875 0.609375 2V11C0.609375 12.1031 1.50625 13 2.60938 13H5.60938V15.5C5.60938 15.6906 5.71563 15.8625 5.88438 15.9469C6.05312 16.0312 6.25625 16.0125 6.40938 15.9L10.275 13H14.6094C15.7125 13 16.6094 12.1031 16.6094 11V2C16.6094 0.896875 15.7125 0 14.6094 0H2.60938Z"
                      fill="#374151"
                    />
                  </g>
                </g>
                <defs>
                  <clipPath id="clip0_466_628">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.609375)"
                    />
                  </clipPath>
                  <clipPath id="clip1_466_628">
                    <path d="M0.609375 0H16.6094V16H0.609375V0Z" fill="white" />
                  </clipPath>
                </defs>
              </svg>
              Liên hệ
            </button>
          </div>
        </div>

        {/* Stats Section - Full Width */}
        <div className="grid grid-cols-4 gap-4 ">
          <div className="text-center bg-[#F5F1EA] rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Sản phẩm</div>
            <div className="font-semibold text-gray-900">56+</div>
          </div>
          <div className="text-center bg-[#F5F1EA] rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Thời gian phản hồi</div>
            <div className="font-semibold text-gray-900">{"< 24h"}</div>
          </div>
          <div className="text-center bg-[#F5F1EA] rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">
              Tỷ lệ giao đúng hẹn
            </div>
            <div className="font-semibold text-gray-900">98%</div>
          </div>
          <div className="text-center bg-[#F5F1EA] rounded-lg p-4">
            <div className="text-sm text-gray-600 mb-1">Năm hoạt động</div>
            <div className="font-semibold text-gray-900">5+ năm</div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sản phẩm liên quan
          </h2>
          <Link
            to="/products"
            className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
          >
            Xem tất cả
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {/* Product 1 - Hộp đựng thực ăn nắp gắp */}
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src="/api/placeholder/240/192"
                  alt="Hộp đựng thực ăn nắp gắp"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                Hộp đựng thực ăn nắp gắp
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-1">{renderStars(5)}</div>
                <span className="text-xs text-gray-600 font-medium">(8)</span>
              </div>
              <div className="text-base font-bold text-green-600 mb-4">
                1.850₫/chiếc
              </div>
            </div>
          </div>

          {/* Product 2 - Ly giấy kraft nắp gỗ */}
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group overflow-hidden relative">
            <div className="absolute top-3 left-3 z-10">
              <span className="bg-green-600 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                Bền vững
              </span>
            </div>
            <div className="relative">
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src="/api/placeholder/240/192"
                  alt="Ly giấy kraft nắp gỗ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                Ly giấy kraft nắp gỗ
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-1">{renderStars(5)}</div>
                <span className="text-xs text-gray-600 font-medium">(12)</span>
              </div>
              <div className="text-base font-bold text-green-600 mb-4">
                1.550₫/chiếc
              </div>
            </div>
          </div>

          {/* Product 3 - Hộp giấy có cửa sổ */}
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                <img
                  src="/api/placeholder/240/192"
                  alt="Hộp giấy có cửa sổ"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                Hộp giấy có cửa sổ
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-1">{renderStars(5)}</div>
                <span className="text-xs text-gray-600 font-medium">(3)</span>
              </div>
              <div className="text-base font-bold text-green-600 mb-4">
                2.250₫/chiếc
              </div>
            </div>
          </div>

          {/* Product 4 - Khăn giấy tái chế cao cấp */}
          <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow group overflow-hidden">
            <div className="relative">
              <div className="w-full h-48 bg-teal-600 flex items-center justify-center overflow-hidden">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-teal-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 3H15L17 5V19C17 20.1 16.1 21 15 21H9C7.9 21 7 20.1 7 19V5C7 3.9 7.9 3 9 3ZM15 19V7H9V19H15Z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 line-clamp-2">
                Khăn giấy tái chế cao cấp
              </h3>
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-1">{renderStars(5)}</div>
                <span className="text-xs text-gray-600 font-medium">(4)</span>
              </div>
              <div className="text-base font-bold text-green-600 mb-4">
                950₫/10 chiếc
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
