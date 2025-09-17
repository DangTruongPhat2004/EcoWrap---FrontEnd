import React from "react";
import {
  Button,
  Input,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Badge,
  Avatar,
  Chip,
} from "@heroui/react";
import { Search, ShoppingCart } from "lucide-react";

const Home = () => {
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [visibleSections, setVisibleSections] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");

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
      {/* Hero Section */}
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
          {/* More floating elements... */}
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

              <Button
                size="md"
                className={`font-medium px-8 py-6 text-white bg-green-700 hover:bg-green-800 rounded-md ${
                  visibleSections.hero ? "animate-slide-in-left" : ""
                }`}
                endContent={<ShoppingCart className="w-4 h-4" />}
              >
                Bắt đầu mua sắm
              </Button>
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

                {/* Product arrangement */}
                <div className="relative z-10 flex items-center justify-center w-full h-full">
                  {/* Back row - larger bags */}
                  <div className="absolute">
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
                    <div className="flex space-x-2">
                      <div className="w-12 h-16 bg-gradient-to-b from-green-300 to-green-400 rounded-b-full shadow-md">
                        <div className="w-full h-4 bg-green-200 rounded-t-lg"></div>
                      </div>
                      <div className="w-12 h-16 bg-gradient-to-b from-blue-200 to-blue-300 rounded-b-full shadow-md">
                        <div className="w-full h-4 bg-blue-100 rounded-t-lg"></div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-2">
                      <div className="w-16 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-sm"></div>
                      <div className="w-20 h-6 bg-gradient-to-r from-yellow-100 to-yellow-200 rounded-lg shadow-sm"></div>
                    </div>

                    <div className="flex space-x-2">
                      <div className="w-10 h-14 bg-gradient-to-b from-pink-200 to-pink-300 rounded-b-full shadow-md">
                        <div className="w-full h-3 bg-pink-100 rounded-t-lg"></div>
                      </div>
                      <div className="w-10 h-14 bg-gradient-to-b from-purple-200 to-purple-300 rounded-b-full shadow-md">
                        <div className="w-full h-3 bg-purple-100 rounded-t-lg"></div>
                      </div>
                    </div>
                  </div>
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
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-600 border-l-4 border-green-600 pl-4 py-2 bg-gradient-to-r from-green-50 to-transparent rounded-r-lg flex items-center gap-3">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  Sản phẩm bao bì
                </h2>
              </div>

              {/* Search Bar with HeroUI Input */}
              <div className="flex gap-4">
                <div className="w-[38rem] border border-gray-300 rounded-full flex items-center px-4 focus-within:border-green-500">
                  <Input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm bao bì..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                    size="lg"
                    radius="full"
                    variant="flat"
                    classNames={{
                      input: "text-base !outline-none",
                      inputWrapper:
                        "!border-none !outline-none shadow-none bg-transparent",
                    }}
                  />
                  <Button
                    isIconOnly
                    radius="full"
                    variant="flat"
                    className="bg-gray-100 !outline-none hover:bg-green-50 text-green-600 hover:text-green-700"
                  >
                    <Search className="w-5 h-5 text-gray-600" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters with HeroUI Dropdowns */}
            <div className="flex gap-3 flex-wrap items-center py-4">
              {/* Filter Button */}
              <Button
                variant="bordered"
                radius="lg"
                startContent={
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
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 2v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                }
                className="h-10 px-4 border-2 border-gray-200 hover:border-green-500 bg-white text-gray-700 font-medium transition-all duration-200 hover:shadow-sm rounded-lg"
              >
                Bộ lọc
              </Button>

              {/* Product Type Dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    radius="lg"
                    endContent={
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
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
                    }
                    className="h-10 px-4 border-2 border-gray-200 hover:border-green-500 bg-white text-gray-700 font-medium transition-all duration-200 hover:shadow-sm min-w-[130px] rounded-lg"
                  >
                    Loại sản phẩm
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Product types"
                  className="min-w-[200px]"
                  itemClasses={{
                    base: "rounded-lg data-[hover=true]:bg-green-50 data-[hover=true]:text-green-700",
                  }}
                >
                  <DropdownItem key="all" className="font-medium text-gray-900">
                    Tất cả sản phẩm
                  </DropdownItem>
                  <DropdownItem key="paper-bags" startContent="📄">
                    Túi giấy
                  </DropdownItem>
                  <DropdownItem key="paper-cups" startContent="☕">
                    Ly giấy
                  </DropdownItem>
                  <DropdownItem key="containers" startContent="📦">
                    Hộp đựng
                  </DropdownItem>
                  <DropdownItem key="food-packaging" startContent="🥡">
                    Bao bì thực phẩm
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* Size Dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    radius="lg"
                    endContent={
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
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
                    }
                    className="h-10 px-4 border-2 border-gray-200 hover:border-green-500 bg-white text-gray-700 font-medium transition-all duration-200 hover:shadow-sm min-w-[110px] rounded-lg"
                  >
                    Kích thước
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Sizes"
                  className="min-w-[160px]"
                  itemClasses={{
                    base: "rounded-lg data-[hover=true]:bg-green-50 data-[hover=true]:text-green-700",
                  }}
                >
                  <DropdownItem key="all" className="font-medium text-gray-900">
                    Tất cả kích thước
                  </DropdownItem>
                  <DropdownItem key="small" startContent="S">
                    Nhỏ (Small)
                  </DropdownItem>
                  <DropdownItem key="medium" startContent="M">
                    Vừa (Medium)
                  </DropdownItem>
                  <DropdownItem key="large" startContent="L">
                    Lớn (Large)
                  </DropdownItem>
                  <DropdownItem key="extra-large" startContent="XL">
                    Rất lớn (XL)
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* Price Dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    radius="lg"
                    endContent={
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
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
                    }
                    className="h-10 px-4 border-2 border-gray-200 hover:border-green-500 bg-white text-gray-700 font-medium transition-all duration-200 hover:shadow-sm min-w-[80px] rounded-lg"
                  >
                    Giá
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Price ranges"
                  className="min-w-[180px]"
                  itemClasses={{
                    base: "rounded-lg data-[hover=true]:bg-green-50 data-[hover=true]:text-green-700",
                  }}
                >
                  <DropdownItem key="all" className="font-medium text-gray-900">
                    Tất cả mức giá
                  </DropdownItem>
                  <DropdownItem key="under-50k" startContent="💰">
                    Dưới 50.000₫
                  </DropdownItem>
                  <DropdownItem key="50k-200k" startContent="💰💰">
                    50.000₫ - 200.000₫
                  </DropdownItem>
                  <DropdownItem key="200k-500k" startContent="💰💰💰">
                    200.000₫ - 500.000₫
                  </DropdownItem>
                  <DropdownItem key="over-500k" startContent="💎">
                    Trên 500.000₫
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>

              {/* Supplier Dropdown */}
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <Button
                    variant="bordered"
                    radius="lg"
                    endContent={
                      <svg
                        className="w-4 h-4 transition-transform duration-200"
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
                    }
                    className="h-10 px-4 border-2 border-gray-200 hover:border-green-500 bg-white text-gray-700 font-medium transition-all duration-200 hover:shadow-sm min-w-[120px] rounded-lg"
                  >
                    Nhà cung cấp
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Suppliers"
                  className="min-w-[200px]"
                  itemClasses={{
                    base: "rounded-lg data-[hover=true]:bg-green-50 data-[hover=true]:text-green-700",
                  }}
                >
                  <DropdownItem key="all" className="font-medium text-gray-900">
                    Tất cả nhà cung cấp
                  </DropdownItem>
                  <DropdownItem key="ecopack" startContent="🌱">
                    EcoPack Việt Nam
                  </DropdownItem>
                  <DropdownItem key="greenwrap" startContent="♻️">
                    GreenWrap Co.
                  </DropdownItem>
                  <DropdownItem key="biopackage" startContent="🌿">
                    BioPackage Plus
                  </DropdownItem>
                  <DropdownItem key="naturebox" startContent="🍃">
                    NatureBox Việt Nam
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button
                variant="light"
                radius="lg"
                className="h-10 px-3 text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200"
                startContent={
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                }
              >
                Xóa bộ lọc
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section with HeroUI Cards */}
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
            {/* Túi giấy */}
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-slide-in-left" : ""
              }`}
              isPressable
            >
              <CardBody className="p-6">
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
              </CardBody>
            </Card>

            {/* Cốc & Ly */}
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
              isPressable
            >
              <CardBody className="p-6">
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
              </CardBody>
            </Card>

            {/* Hộp đựng thức ăn */}
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
              isPressable
            >
              <CardBody className="p-6">
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
              </CardBody>
            </Card>

            {/* Ống hút & Đũa */}
            <Card
              className={`shadow-sm hover:shadow-md transition-shadow ${
                visibleSections.categories ? "animate-scale-in" : ""
              }`}
              isPressable
            >
              <CardBody className="p-6">
                <div className="h-40 bg-gradient-to-br from-gray-50 to-slate-100 rounded-lg mb-4 flex items-center justify-center relative">
                  <div className="flex items-center justify-center">
                    <div className="flex space-x-1">
                      <div className="w-1 h-24 bg-gradient-to-b from-pink-200 to-pink-300 rounded-full shadow-sm transform rotate-12"></div>
                      <div className="w-1 h-24 bg-gradient-to-b from-yellow-200 to-yellow-300 rounded-full shadow-sm transform -rotate-6"></div>
                      <div className="w-1 h-24 bg-gradient-to-b from-green-200 to-green-300 rounded-full shadow-sm transform rotate-3"></div>
                      <div className="w-1 h-24 bg-gradient-to-b from-blue-200 to-blue-300 rounded-full shadow-sm transform -rotate-12"></div>
                      <div className="w-1 h-24 bg-gradient-to-b from-purple-200 to-purple-300 rounded-full shadow-sm transform rotate-6"></div>
                      <div className="w-1 h-24 bg-gradient-to-b from-orange-200 to-orange-300 rounded-full shadow-sm transform -rotate-3"></div>
                    </div>

                    <div className="ml-4 flex space-x-1">
                      <div className="w-1 h-20 bg-gradient-to-b from-yellow-600 to-yellow-700 rounded-full shadow-sm transform rotate-15"></div>
                      <div className="w-1 h-20 bg-gradient-to-b from-amber-600 to-amber-700 rounded-full shadow-sm transform -rotate-10"></div>
                      <div className="w-1 h-20 bg-gradient-to-b from-yellow-700 to-yellow-800 rounded-full shadow-sm transform rotate-5"></div>
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-center">Ống hút & Đũa</h3>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Section with HeroUI Cards */}
      <section id="products" data-animate className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-600 border-l-4 border-green-600 pl-4 py-2 bg-gradient-to-r from-green-50 to-transparent rounded-r-lg flex items-center gap-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Sản phẩm phổ biến
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Product 1 - Túi giấy kraft */}
            <Card
              className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                  <Chip size="sm" variant="flat" className="mb-2">
                    20×30cm
                  </Chip>
                  <p className="text-xs text-gray-500 mb-3">
                    Nhà cung cấp: Xưởng In Xanh
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-md"
                      size="sm"
                      startContent={<ShoppingCart className="w-4 h-4" />}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Product 2 - Cốc cà phê sinh học */}
            <Card
              className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                  <Chip size="sm" variant="flat" className="mb-2">
                    300ml
                  </Chip>
                  <p className="text-xs text-gray-500 mb-3">
                    Nhà cung cấp: Xưởng Sài Gòn
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-md"
                      size="sm"
                      startContent={<ShoppingCart className="w-4 h-4" />}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Product 3 - Hộp đựng tre */}
            <Card
              className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                  <Chip size="sm" variant="flat" className="mb-2">
                    15×15cm
                  </Chip>
                  <p className="text-xs text-gray-500 mb-3">
                    Nhà cung cấp: Eco Packaging
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-md"
                      size="sm"
                      startContent={<ShoppingCart className="w-4 h-4" />}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Product 4 - Ống hút giấy */}
            <Card
              className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                visibleSections.products ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                  <Chip size="sm" variant="flat" className="mb-2">
                    20cm
                  </Chip>
                  <p className="text-xs text-gray-500 mb-3">
                    Nhà cung cấp: Xưởng In Xanh
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="bordered"
                      size="sm"
                      className="flex-1 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
                    >
                      Xem chi tiết
                    </Button>
                    <Button
                      className="flex-1 bg-green-700 text-white hover:bg-green-800 rounded-md"
                      size="sm"
                      startContent={<ShoppingCart className="w-4 h-4" />}
                    >
                      Thêm
                    </Button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="bordered"
              size="lg"
              className="px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
            >
              Xem thêm sản phẩm
            </Button>
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
            <Card className="text-center" shadow="none">
              <CardBody className="items-center">
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
              </CardBody>
            </Card>

            <Card className="text-center" shadow="none">
              <CardBody className="items-center">
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
              </CardBody>
            </Card>

            <Card className="text-center" shadow="none">
              <CardBody className="items-center">
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
                  Dễ dàng tùy chỉnh bao bì theo thương hiệu và nhu cầu cụ thể
                  của doanh nghiệp bạn, từ kích thước đến thiết kế.
                </p>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" data-animate className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-600 border-l-4 border-green-600 pl-4 py-2 bg-gradient-to-r from-green-50 to-transparent rounded-r-lg flex items-center gap-3">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
                />
              </svg>
              Sản phẩm nổi bật
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Featured Product 1 */}
            <Card
              className={`shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                    Túi giấy kraft chất lượng cao với thiết kế logo tùy chỉnh
                    theo yêu cầu, phù hợp cho doanh nghiệp
                  </p>
                  <Button className="w-full font-medium bg-green-700 text-white hover:bg-green-800 rounded-md">
                    Mua ngay
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Featured Product 2 */}
            <Card
              className={`shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
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
                    Bộ hộp đựng thức ăn làm từ vật liệu sinh học, an toàn cho
                    sức khỏe và môi trường
                  </p>
                  <Button className="w-full font-medium bg-green-700 text-white hover:bg-green-800 rounded-md">
                    Mua ngay
                  </Button>
                </div>
              </CardBody>
            </Card>

            {/* Featured Product 3 */}
            <Card
              className={`shadow-lg ${
                visibleSections.featured ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-0">
                <div className="h-64 bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                  <div className="w-24 h-32 bg-green-600 rounded-lg flex items-center justify-center relative">
                    <div className="w-20 h-28 bg-green-500 rounded-lg flex items-center justify-center">
                      <div className="w-6 h-6 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">
                    Cốc cà phê có thể tái sử dụng
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
                  <Button className="w-full font-medium bg-green-700 text-white hover:bg-green-800 rounded-md">
                    Mua ngay
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
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
            <Card
              className={`shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar
                    name="NV"
                    size="md"
                    className="mr-4"
                    color="default"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
                  />
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
                  phẩm sinh học từ EcoWrap. Khách hàng rất ủng hộ và gia đình
                  tôi cũng yên tâm hơn về việc bảo vệ môi trường."
                </p>
              </CardBody>
            </Card>

            {/* Review 2 */}
            <Card
              className={`shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar
                    name="TT"
                    size="md"
                    className="mr-4"
                    color="default"
                    src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  />
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
                  "Dịch vụ tốt và nhanh chóng! Hộp đựng bánh từ EcoWrap không
                  chỉ đẹp mắt mà còn giữ được độ tươi ngon của bánh. Khách hàng
                  luôn khen ngợi về việc chúng tôi sử dụng bao bì thân thiện môi
                  trường."
                </p>
              </CardBody>
            </Card>

            {/* Review 3 */}
            <Card
              className={`shadow-sm ${
                visibleSections.reviews ? "animate-scale-in" : ""
              }`}
            >
              <CardBody className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar
                    name="LV"
                    size="md"
                    className="mr-4"
                    color="default"
                    src="https://i.pravatar.cc/150?u=a04258114e29026702d"
                  />
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
                  tôi về bảo vệ môi trường. Khách hàng luôn cảm thấy hài lòng
                  khi thấy chúng tôi quan tâm đến việc giảm thiểu rác thải
                  nhựa."
                </p>
              </CardBody>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Button
              variant="bordered"
              color="default"
              className="border-2 border-[#8B6F47] text-[#8B6F47] hover:bg-[#8B6F47] hover:text-white font-medium"
              endContent={
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
              }
            >
              Xem thêm đánh giá
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
            <Button
              size="lg"
              className="font-semibold px-8 text-white bg-green-700 hover:bg-green-800 rounded-md"
              endContent={<ShoppingCart className="w-4 h-4" />}
            >
              Bắt đầu mua sắm
            </Button>
            <Button
              variant="solid"
              size="lg"
              startContent={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-4m-5 0H3m2 0h3M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              }
              className="bg-white text-orange-900 hover:bg-gray-100 font-semibold px-4 rounded-md"
            >
              Đăng ký làm nhà cung cấp
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
