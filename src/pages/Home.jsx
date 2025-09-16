import React from "react";

const Home = () => {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [visibleSections, setVisibleSections] = React.useState({});

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  // Intersection Observer for scroll animations
  React.useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleSections((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }));
        }
      });
    }, observerOptions);

    // Observe all sections with animations
    const sections = document.querySelectorAll("[data-animate]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest(".dropdown-container")) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdown]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Exact match to Figma */}
      <section
        id="hero"
        data-animate
        className="py-16 relative overflow-hidden"
        style={{ backgroundColor: "#F5F9F7" }}
      >
        {/* Floating Eco Elements */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Floating Leaves */}
          <div className="absolute top-20 left-4 animate-float-slow opacity-20">
            <svg
              className="w-8 h-8 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zM5 5a1 1 0 000 2h8a1 1 0 100-2H5zM5 9a1 1 0 000 2h8a1 1 0 100-2H5zM5 13a1 1 0 000 2h4a1 1 0 100-2H5z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="absolute top-32 left-1/4 animate-float-medium opacity-15">
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="absolute bottom-40 left-20 animate-float-fast opacity-25">
            <svg
              className="w-10 h-10 text-green-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 1.414L10.586 9.5H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 00.293-.707V9.5a1 1 0 00-.293-.707z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="absolute top-1/2 left-6 animate-float-slow opacity-20">
            <svg
              className="w-7 h-7 text-green-400"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Recycling Symbol */}
          <div className="absolute bottom-20 left-12 animate-spin-slow opacity-10">
            <svg
              className="w-12 h-12 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          {/* Right Side Floating Elements */}
          <div className="absolute top-16 right-8 animate-float-slow opacity-20">
            <svg
              className="w-8 h-8 text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6L9,8H17Z" />
            </svg>
          </div>
          <div className="absolute top-32 right-1/4 animate-float-medium opacity-15">
            <svg
              className="w-6 h-6 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6L9,8H17Z" />
            </svg>
          </div>
          <div className="absolute bottom-32 right-16 animate-float-fast opacity-25">
            <svg
              className="w-10 h-10 text-green-300"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6L9,8H17Z" />
            </svg>
          </div>
          <div className="absolute top-1/2 right-6 animate-float-slow opacity-20">
            <svg
              className="w-7 h-7 text-green-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6L9,8H17Z" />
            </svg>
          </div>
          <div className="absolute bottom-16 right-12 animate-spin-slow opacity-10">
            <svg
              className="w-12 h-12 text-green-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6L9,8H17Z" />
            </svg>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1
                className={`text-5xl font-bold text-gray-800 leading-tight ${
                  visibleSections.hero ? "animate-slide-in-left" : ""
                }`}
              >
                Mua và Thiết Kế Thương Hiệu và Bao Bì
              </h1>
              <p
                className={`text-lg text-gray-600 leading-relaxed ${
                  visibleSections.hero ? "animate-slide-in-left" : ""
                }`}
              >
                Khám phá các sản phẩm bao bì thân thiện môi trường từ các xưởng
                uy tín. Tìm kiếm và đặt hàng ngay hôm nay để giảm thiểu rác
                thải!
              </p>
              <button
                className={`bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-md font-medium flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/25 hover:scale-105 ${
                  visibleSections.hero ? "animate-slide-in-left" : ""
                }`}
              >
                Bắt đầu mua sắm
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
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
              </button>
            </div>

            {/* Right Image - Product showcase */}
            <div
              className={`relative ${
                visibleSections.hero ? "animate-scale-in" : ""
              }`}
            >
              <div className="w-full h-96 bg-gray-100 rounded-3xl p-8 flex items-center justify-center relative overflow-hidden">
                {/* Background gradient circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-yellow-50 to-green-50 rounded-3xl"></div>

                {/* Animated Eco Particles */}
                <div className="absolute inset-0">
                  <div className="absolute top-16 left-16 w-2 h-2 bg-green-400 rounded-full animate-bubble-1 opacity-60"></div>
                  <div className="absolute top-24 right-20 w-1.5 h-1.5 bg-green-300 rounded-full animate-bubble-2 opacity-50"></div>
                  <div className="absolute bottom-32 left-12 w-3 h-3 bg-green-500 rounded-full animate-bubble-3 opacity-40"></div>
                  <div className="absolute bottom-20 right-16 w-2 h-2 bg-green-400 rounded-full animate-bubble-1 opacity-70"></div>
                  <div className="absolute top-1/2 left-8 w-1 h-1 bg-green-200 rounded-full animate-bubble-2 opacity-80"></div>
                  <div className="absolute top-1/3 right-12 w-2.5 h-2.5 bg-green-300 rounded-full animate-bubble-3 opacity-60"></div>
                </div>

                {/* Product arrangement matching Figma */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  {/* Back row - larger bags */}
                  <div className="absolute">
                    {/* Large kraft bag - back left */}
                    <div className="w-32 h-40 bg-gradient-to-b from-orange-200 to-orange-300 rounded-lg shadow-lg transform -rotate-12 -translate-x-16 -translate-y-8">
                      <div className="w-full h-8 bg-orange-300 rounded-t-lg"></div>
                      <div className="flex justify-center mt-4">
                        <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                          <span className="text-orange-600 font-bold text-xs">
                            ECO
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Large kraft bag - back right */}
                    <div className="w-32 h-40 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg shadow-lg transform rotate-6 translate-x-20 -translate-y-4">
                      <div className="w-full h-8 bg-yellow-300 rounded-t-lg"></div>
                      <div className="flex justify-center mt-4">
                        <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                          <span className="text-yellow-600 font-bold text-xs">
                            GREEN
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Front row - cups and containers */}
                  <div className="relative z-20 flex items-center justify-center space-x-4">
                    {/* Coffee cups */}
                    <div className="flex space-x-2">
                      <div className="w-12 h-16 bg-gradient-to-b from-green-300 to-green-400 rounded-b-full shadow-md">
                        <div className="w-full h-4 bg-green-200 rounded-t-lg"></div>
                      </div>
                      <div className="w-12 h-16 bg-gradient-to-b from-blue-200 to-blue-300 rounded-b-full shadow-md">
                        <div className="w-full h-4 bg-blue-100 rounded-t-lg"></div>
                      </div>
                    </div>

                    {/* Center containers */}
                    <div className="flex flex-col space-y-2">
                      <div className="w-16 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-sm"></div>
                      <div className="w-20 h-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg shadow-sm"></div>
                    </div>

                    {/* Right side cups */}
                    <div className="flex space-x-2">
                      <div className="w-10 h-14 bg-gradient-to-b from-pink-200 to-pink-300 rounded-b-full shadow-md">
                        <div className="w-full h-3 bg-pink-100 rounded-t-lg"></div>
                      </div>
                      <div className="w-10 h-14 bg-gradient-to-b from-purple-200 to-purple-300 rounded-b-full shadow-md">
                        <div className="w-full h-3 bg-purple-100 rounded-t-lg"></div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative leaf */}
                  <div className="absolute bottom-8 left-8 w-8 h-8 bg-green-400 rounded-full opacity-60 transform rotate-45"></div>
                  <div className="absolute bottom-10 left-6 w-6 h-6 bg-green-300 rounded-full opacity-40 transform rotate-12"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Sản phẩm bao bì
              </h2>

              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="w-[38rem]">
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm bao bì..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-green-500"
                  />
                </div>
                <button className="bg-gray-100 p-3 rounded-full">
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap dropdown-container">
              {/* Bộ lọc Button */}
              <button className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group bg-white">
                <svg
                  className="w-4 h-4 text-gray-600 group-hover:text-green-600 transition-colors duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                  Bộ lọc
                </span>
              </button>

              {/* Custom Dropdown Components */}
              <div className="relative">
                <button
                  onClick={() => toggleDropdown("productType")}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group min-w-[140px] bg-white"
                >
                  <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                    Loại sản phẩm
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 group-hover:text-green-600 transition-all duration-200 transform ${
                      openDropdown === "productType"
                        ? "rotate-180"
                        : "group-hover:rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "productType" && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Túi giấy
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Ly giấy
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Hộp đựng
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Bao bì thực phẩm
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("size")}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group min-w-[120px] bg-white"
                >
                  <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                    Kích thước
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 group-hover:text-green-600 transition-all duration-200 transform ${
                      openDropdown === "size"
                        ? "rotate-180"
                        : "group-hover:rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "size" && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Nhỏ (S)
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Trung bình (M)
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Lớn (L)
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Extra Large (XL)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("price")}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group min-w-[80px] bg-white"
                >
                  <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                    Giá
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 group-hover:text-green-600 transition-all duration-200 transform ${
                      openDropdown === "price"
                        ? "rotate-180"
                        : "group-hover:rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "price" && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Dưới 50.000đ
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        50.000đ - 200.000đ
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        200.000đ - 500.000đ
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        Trên 500.000đ
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown("supplier")}
                  className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 hover:border-green-500 hover:bg-green-50 transition-all duration-200 group min-w-[140px] bg-white"
                >
                  <span className="text-sm text-gray-700 group-hover:text-green-700 transition-colors duration-200">
                    Nhà cung cấp
                  </span>
                  <svg
                    className={`w-4 h-4 text-gray-500 group-hover:text-green-600 transition-all duration-200 transform ${
                      openDropdown === "supplier"
                        ? "rotate-180"
                        : "group-hover:rotate-180"
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {openDropdown === "supplier" && (
                  <div className="absolute top-full mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        EcoPack Việt Nam
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        GreenWrap Co.
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        BioPackage Plus
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-700 transition-colors duration-150 bg-white">
                        NatureBox Việt Nam
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - "Danh mục nổi bật" */}
      <section
        id="categories"
        data-animate
        className="py-12 mx-auto"
        style={{ backgroundColor: "#F5F9F7", width: "80%" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Danh mục nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Túi giấy - Stack of kraft bags */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow eco-card ${
                visibleSections.categories ? "animate-slide-in-left" : ""
              }`}
            >
              <div className="h-40 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                <div className="flex">
                  <div className="w-16 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-lg shadow-md transform -rotate-6 -translate-x-2">
                    <div className="w-full h-4 bg-orange-300 rounded-t-lg"></div>
                  </div>
                  <div className="w-16 h-24 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-lg shadow-md transform rotate-3">
                    <div className="w-full h-4 bg-yellow-300 rounded-t-lg"></div>
                  </div>
                  <div className="w-16 h-24 bg-gradient-to-b from-orange-300 to-orange-400 rounded-lg shadow-md transform -rotate-3 translate-x-2">
                    <div className="w-full h-4 bg-orange-400 rounded-t-lg"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-center">Túi giấy</h3>
            </div>

            {/* Cốc & Ly - Coffee cups with Starbucks-style design */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-40 bg-gradient-to-br from-teal-50 to-emerald-100 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="flex space-x-3">
                  <div className="relative">
                    <div className="w-12 h-20 bg-gradient-to-b from-teal-300 to-teal-400 rounded-b-full shadow-lg">
                      <div className="w-full h-4 bg-teal-200 rounded-t-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-teal-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-1 top-6 w-3 h-6 bg-teal-300 rounded-full"></div>
                  </div>
                  <div className="relative">
                    <div className="w-12 h-20 bg-gradient-to-b from-emerald-300 to-emerald-400 rounded-b-full shadow-lg">
                      <div className="w-full h-4 bg-emerald-200 rounded-t-lg"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-emerald-600 rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-1 top-6 w-3 h-6 bg-emerald-300 rounded-full"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-center">Cốc & Ly</h3>
            </div>

            {/* Hộp đựng thức ăn - Food containers */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-40 bg-gradient-to-br from-green-50 to-lime-100 rounded-lg mb-4 flex items-center justify-center">
                <div className="flex flex-col space-y-2">
                  <div className="flex space-x-2">
                    <div className="w-14 h-8 bg-gradient-to-r from-green-200 to-green-300 rounded-lg shadow-sm border border-green-300">
                      <div className="w-full h-2 bg-green-300 rounded-t-lg"></div>
                    </div>
                    <div className="w-14 h-8 bg-gradient-to-r from-lime-200 to-lime-300 rounded-lg shadow-sm border border-lime-300">
                      <div className="w-full h-2 bg-lime-300 rounded-t-lg"></div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="w-20 h-12 bg-gradient-to-r from-green-300 to-green-400 rounded-lg shadow-md border border-green-400">
                      <div className="w-full h-3 bg-green-400 rounded-t-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-center">Hộp đựng thức ăn</h3>
            </div>

            {/* Ống hút & Đũa - Straws and utensils */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-40 bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg mb-4 flex items-center justify-center relative">
                <div className="flex items-center justify-center">
                  {/* Straws bundle */}
                  <div className="flex space-x-1">
                    <div className="w-1 h-24 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full shadow-sm transform rotate-12"></div>
                    <div className="w-1 h-24 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full shadow-sm transform -rotate-6"></div>
                    <div className="w-1 h-24 bg-gradient-to-b from-green-200 to-green-300 rounded-full shadow-sm transform rotate-3"></div>
                    <div className="w-1 h-24 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full shadow-sm transform -rotate-12"></div>
                    <div className="w-1 h-24 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full shadow-sm transform rotate-6"></div>
                    <div className="w-1 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full shadow-sm transform -rotate-3"></div>
                  </div>

                  {/* Wooden utensils */}
                  <div className="ml-4 flex space-x-1">
                    <div className="w-1 h-20 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-full shadow-sm transform rotate-15"></div>
                    <div className="w-1 h-20 bg-gradient-to-b from-amber-600 to-amber-700 rounded-full shadow-sm transform -rotate-10"></div>
                    <div className="w-1 h-20 bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-full shadow-sm transform rotate-5"></div>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold text-center">Ống hút & Đũa</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - "Sản phẩm phổ biến" */}
      <section id="products" data-animate className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Sản phẩm phổ biến
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1 - Túi giấy kraft */}
            <div
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-orange-50 to-yellow-50 flex items-center justify-center relative">
                <div className="w-24 h-32 bg-gradient-to-b from-orange-200 to-orange-300 rounded-lg shadow-lg">
                  <div className="w-full h-6 bg-orange-300 rounded-t-lg"></div>
                  <div className="flex justify-center mt-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <span className="text-orange-600 font-bold text-xs">
                        ECO
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Túi giấy kraft</h3>
                <p className="text-sm text-gray-600 mb-2">2.000đ/chiếc</p>
                <p className="text-xs text-gray-500 mb-2">
                  Kích thước: 20×30cm
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Nhà cung cấp: Xưởng In Xanh
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-green-600 text-green-600 text-sm py-1 px-3 rounded hover:bg-green-50">
                    Xem chi tiết
                  </button>
                  <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Product 2 - Cốc cà phê sinh học */}
            <div
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center relative">
                <div className="relative">
                  <div className="w-16 h-24 bg-gradient-to-b from-green-300 to-green-400 rounded-b-full shadow-lg">
                    <div className="w-full h-5 bg-green-200 rounded-t-lg"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mt-2">
                        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">
                            ★
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="absolute -right-1 top-8 w-4 h-8 bg-green-300 rounded-full"></div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Cốc cà phê sinh học</h3>
                <p className="text-sm text-gray-600 mb-2">5.000đ/chiếc</p>
                <p className="text-xs text-gray-500 mb-2">Kích thước: 300ml</p>
                <p className="text-xs text-gray-500 mb-3">
                  Nhà cung cấp: Xưởng Sài Gòn
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-green-600 text-green-600 text-sm py-1 px-3 rounded hover:bg-green-50">
                    Xem chi tiết
                  </button>
                  <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Product 3 - Hộp đựng tre */}
            <div
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-green-50 to-lime-50 flex items-center justify-center relative">
                <div className="flex flex-col space-y-1">
                  <div className="w-20 h-6 bg-gradient-to-r from-green-200 to-green-300 rounded-lg shadow-sm border border-green-300">
                    <div className="w-full h-2 bg-green-300 rounded-t-lg"></div>
                  </div>
                  <div className="w-24 h-8 bg-gradient-to-r from-green-300 to-green-400 rounded-lg shadow-md border border-green-400">
                    <div className="w-full h-2 bg-green-400 rounded-t-lg"></div>
                  </div>
                  <div className="w-18 h-5 bg-gradient-to-r from-lime-200 to-lime-300 rounded-lg shadow-sm border border-lime-300">
                    <div className="w-full h-1 bg-lime-300 rounded-t-lg"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Hộp đựng tre</h3>
                <p className="text-sm text-gray-600 mb-2">8.000đ/chiếc</p>
                <p className="text-xs text-gray-500 mb-2">
                  Kích thước: 15×15cm
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  Nhà cung cấp: Eco Packaging
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-green-600 text-green-600 text-sm py-1 px-3 rounded hover:bg-green-50">
                    Xem chi tiết
                  </button>
                  <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                    Thêm
                  </button>
                </div>
              </div>
            </div>

            {/* Product 4 - Ống hút giấy */}
            <div
              className={`bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-48 bg-gradient-to-br from-gray-50 to-slate-50 flex items-center justify-center relative">
                <div className="flex items-center justify-center">
                  <div className="flex space-x-1 transform rotate-12">
                    <div className="w-2 h-32 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full shadow-sm"></div>
                    <div className="w-2 h-32 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full shadow-sm"></div>
                    <div className="w-2 h-32 bg-gradient-to-b from-green-200 to-green-300 rounded-full shadow-sm"></div>
                    <div className="w-2 h-32 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full shadow-sm"></div>
                    <div className="w-2 h-32 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full shadow-sm"></div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-1">Ống hút giấy</h3>
                <p className="text-sm text-gray-600 mb-2">1.000đ/chiếc</p>
                <p className="text-xs text-gray-500 mb-2">Kích thước: 20cm</p>
                <p className="text-xs text-gray-500 mb-3">
                  Nhà cung cấp: Xưởng In Xanh
                </p>
                <div className="flex gap-2">
                  <button className="flex-1 bg-white border border-green-600 text-green-600 text-sm py-1 px-3 rounded hover:bg-green-50">
                    Xem chi tiết
                  </button>
                  <button className="bg-green-600 text-white text-sm py-1 px-3 rounded hover:bg-green-700">
                    Thêm
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="border-2 border-green-600 text-green-600 bg-white px-6 py-3 rounded-lg hover:bg-green-600 hover:text-white font-medium transition-all duration-200 shadow-sm">
              Xem thêm sản phẩm
            </button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        className="py-12 mx-auto"
        style={{ backgroundColor: "#F5F9F7", width: "80%" }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-12">
            Tại sao chọn dịch vụ của chúng tôi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">
                Sản phẩm thân thiện môi trường
              </h3>
              <p className="text-sm text-gray-600">
                Tất cả sản phẩm của chúng tôi đều được làm từ vật liệu tái chế
                hoặc có thể phân hủy sinh học, giúp bảo vệ môi trường.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">
                Đội ngũ nhà cung cấp đáng tin cậy
              </h3>
              <p className="text-sm text-gray-600">
                Chúng tôi hợp tác với các xưởng sản xuất uy tín, đảm bảo chất
                lượng sản phẩm và dịch vụ tốt nhất cho khách hàng.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Tùy chỉnh theo yêu cầu</h3>
              <p className="text-sm text-gray-600">
                Dễ dàng tùy chỉnh bao bì theo thương hiệu và nhu cầu cụ thể của
                doanh nghiệp bạn, từ kích thước đến thiết kế.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section - "Sản phẩm nổi bật" */}
      <section id="featured" data-animate className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-8">
            Sản phẩm nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Product 1 - Túi giấy kraft logo cao cấp */}
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-64 bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center relative">
                <div className="w-32 h-32 bg-orange-200 rounded-lg flex items-center justify-center">
                  <span className="text-orange-600 font-bold text-sm">
                    LOGO
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Túi giấy in logo cao cấp
                </h3>
                <p className="text-xl font-bold text-green-600 mb-2">
                  3.500đ/chiếc
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Nhà cung cấp: Xưởng In Minh
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Túi giấy kraft chất lượng cao với thiết kế logo tùy chỉnh theo
                  yêu cầu, phù hợp cho doanh nghiệp
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 font-medium">
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Featured Product 2 - Bộ hộp đựng thực phẩm sinh học */}
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-64 bg-gradient-to-br from-green-100 to-lime-100 flex items-center justify-center">
                <div className="flex space-x-2">
                  <div className="w-16 h-20 bg-green-200 rounded"></div>
                  <div className="w-16 h-16 bg-green-300 rounded"></div>
                  <div className="w-16 h-12 bg-green-200 rounded"></div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Bộ hộp đựng thực phẩm sinh học
                </h3>
                <p className="text-xl font-bold text-green-600 mb-2">
                  15.000đ/bộ
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Nhà cung cấp: Eco Packaging
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Bộ hộp đựng thức ăn làm từ vật liệu sinh học, an toàn cho sức
                  khỏe và môi trường
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 font-medium">
                  Mua ngay
                </button>
              </div>
            </div>

            {/* Featured Product 3 - Cốc cà phê có thể chế tạm hay */}
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <div className="h-64 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                <div className="w-24 h-32 bg-green-600 rounded-lg flex items-center justify-center relative">
                  <div className="w-20 h-28 bg-green-500 rounded-lg flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-semibold text-lg mb-2">
                  Cốc cà phê có thể chế tạm hay
                </h3>
                <p className="text-xl font-bold text-green-600 mb-2">
                  4.500đ/chiếc
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  Nhà cung cấp: Green Cup
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Cốc cà phê sinh học với thiết kế độc đáo, có thể tái sử dụng
                  nhiều lần, thân thiện môi trường
                </p>
                <button className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 font-medium">
                  Mua ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section - "Khách hàng nói gì về chúng tôi?" */}
      <section
        id="reviews"
        data-animate
        className="py-12 mx-auto"
        style={{ backgroundColor: "#F5F9F7", width: "80%" }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-semibold text-center text-gray-800 mb-12">
            Khách hàng nói gì về chúng tôi?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Review 1 */}
            <div
              className={`bg-white p-6 rounded-xl shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-medium">NV</span>
                </div>
                <div>
                  <h4 className="font-medium">Nguyễn Văn A</h4>
                  <p className="text-sm text-gray-600">Chủ quán trà sữa</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Chúng tôi đã chuyển từ sử dụng cốc nhựa một lần sang các sản
                phẩm sinh học từ EcoWrap. Khách hàng rất ủng hộ và gia đình tôi
                cũng yên tâm hơn về việc bảo vệ môi trường."
              </p>
            </div>

            {/* Review 2 */}
            <div
              className={`bg-white p-6 rounded-xl shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-medium">TT</span>
                </div>
                <div>
                  <h4 className="font-medium">Trần Thị B</h4>
                  <p className="text-sm text-gray-600">Chủ tiệm bánh</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Dịch vụ tốt và nhanh chóng! Hộp đựng bánh từ EcoWrap không chỉ
                đẹp mắt mà còn giữ được độ tươi ngon của bánh. Khách hàng luôn
                khen ngợi về việc chúng tôi sử dụng bao bì thân thiện môi
                trường."
              </p>
            </div>

            {/* Review 3 */}
            <div
              className={`bg-white p-6 rounded-xl shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center mr-4">
                  <span className="text-sm font-medium">LV</span>
                </div>
                <div>
                  <h4 className="font-medium">Lê Văn C</h4>
                  <p className="text-sm text-gray-600">Chủ nhà hàng chay</p>
                </div>
              </div>
              <div className="flex mb-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                "Hệ thống bao bì phù hợp với triết lý nhà hàng chay của chúng
                tôi về bảo vệ môi trường. Khách hàng luôn cảm thấy hài lòng khi
                thấy chúng tôi quan tâm đến việc giảm thiểu rác thải nhựa."
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <button className="bg-[#F5F9F7] border-2 border-[#8B6F47] text-[#8B6F47] px-6 py-3 rounded-lg hover:bg-[#8B6F47] hover:text-white font-medium transition-all duration-200 shadow-sm flex items-center gap-2 mx-auto">
              Xem thêm đánh giá
              <svg
                className="w-4 h-4"
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
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section with brown background matching Figma */}
      <section
        id="cta"
        data-animate
        className={`py-16 mx-auto`}
        style={{ backgroundColor: "#8B6F47", width: "80%" }}
      >
        <div className="max-w-5xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">
            Sẵn sàng bắt đầu với EcoWrap?
          </h2>
          <p className="text-lg text-orange-100 mb-8">
            Hãy tham gia cùng chúng tôi trong hành trình giảm thiểu rác thải
            nhựa và bảo vệ môi trường với các giải pháp bao bì thân thiện sinh
            thái.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-lg font-semibold">
              Bắt đầu mua sắm
            </button>
            <button className="bg-white text-orange-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold">
              Đăng ký làm nhà cung cấp
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
