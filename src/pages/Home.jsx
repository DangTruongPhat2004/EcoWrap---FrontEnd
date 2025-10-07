import React from "react";
import { useNavigate } from "react-router-dom";
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
} from "@nextui-org/react";
import { Search, ShoppingCart } from "lucide-react";
import bannerImg from "../assets/banner.png";
import tuigiay from "../assets/tuigiay.png";
import cocLy from "../assets/cocly.png";
import hop from "../assets/hop.png";
import onghut from "../assets/onghut.png";
import tuigiaycaocap from "../assets/tuigiaycaocap.png";
import coccaphe from "../assets/coccaphe.png";
import hopdungthucpham from "../assets/hopdungthucpham.png";
import slide1 from "../assets/slide1.png";
import slide2 from "../assets/slide2.png";
import slide3 from "../assets/slide3.png";
import slide4 from "../assets/slide4.png";
import slide5 from "../assets/slide5.png";
import { ProductCarousel } from "../components/carousel/ProductCarousel";

import { desc, i } from "framer-motion/client";
import PackagingCarousel from "../components/carousel/PackagingCarousel";
import ClientLogoMarquee from "../components/marquee/ClientLogoMarquee";

const Home = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [visibleSections, setVisibleSections] = React.useState({});
  const [searchValue, setSearchValue] = React.useState("");

  const logos = [
    {
      src: "//images.ctfassets.net/5gvckmvm9289/6lR50SiZeNVr2IOgW1rcTo/23c1b3cbed1501e0dfd65fecf4578b3c/Baggu.png?w=384&q=90&fm=avif",
      alt: "Baggu",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/61oLU7rnzBb2dZAufuJ4lU/1ffdac5c83957b1fe0026af6aedf54d6/PopUp_Grocer_.png?w=384&q=90&fm=avif",
      alt: "PopUp Grocer",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/1IrCt4lXmWO5DCMlVavZ6x/d8703429900a206d54f7e03c99f1009d/Uniqlo.png?w=384&q=90&fm=avif",
      alt: "Uniqlo",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/1a3EgcnzmsQsjqfjtD1TJO/43927c12669f9c6b7f19e089ba768a26/Flamingo_Estate.png?w=384&q=90&fm=avif",
      alt: "Flamingo Estate",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/22twqbPopzZz39NWLdSOu1/85b801d8123e7deac360424e4650d729/Garmentory-L.png?w=384&q=90&fm=avif",
      alt: "Garmentory",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/ELN0rxG63nKWenFpuF9X2/d201e300f7b87df33e1f18f87373f0c9/Micos_Hot_Chicken.png?w=384&q=90&fm=avif",
      alt: "Mico's Hot Chicken",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/176lrIAxq2SjYvJcYHeMvR/b3e7e0775b14a31bb550a934c60e6824/Edie_Parker.png?w=384&q=90&fm=avif",
      alt: "Edie Parker",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/3t2R7AIo7bKxoa1fFi87LR/fc408849fdddce436a6e85fde0f7077e/For_Love_and_Lemons.png?w=384&q=90&fm=avif",
      alt: "For Love & Lemons",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/TcN4y6BdjTzg9kGhjK2EM/191a3c6aa10f9aca020dcc22005a7b1e/Carhartt.png?w=384&q=90&fm=avif",
      alt: "Carhartt WIP",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/65kAraxxHSKeljkes7Lox7/0fe531299182f31978b04977e66fd35f/Client_Logo_-_Partners_Coffee.png?w=384&q=90&fm=avif",
      alt: "Partners Coffee",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/6K0F1J8vLmJmIwZsP0Hbkl/6693cff127b581bb88abe2e5c05dfe3e/Client_Logo_-_Sweetgreen.png?w=384&q=90&fm=avif",
      alt: "Sweetgreen",
    },
    {
      src: "//images.ctfassets.net/5gvckmvm9289/6esveekv7q2UjeKWA1DWSo/851fa300ff0ebd1ccd6fc81a4650d7ea/airbnb__1_.png?w=384&q=90&fm=avif",
      alt: "Airbnb",
    },
  ];

  const slides = [
    {
      id: "tui-giay",
      image: slide1,
      title: "Túi Giấy",
      categories: ["Túi Giấy", "Túi Giấy đựng đồ", "Túi Giấy Bánh"],
      ctaLabel: "Mua ngay →",
      href: "#",
    },
    {
      id: "paper-bowls",
      image: slide2,
      title: "Hộp giấy ",
      categories: ["Hộp Giấy Tròn", "Hộp Giấy Chữ Nhật"],
      ctaLabel: "Mua ngay →",
      href: "#",
    },
    {
      id: "coffee-cups",
      image: slide3,
      title: "Cốc Giấy",
      categories: ["Cốc Nóng", "Cốc Lạnh"],
      ctaLabel: "Mua ngay →",
      href: "#",
    },
    {
      id: "food-containers",
      image: slide4,
      title: "Túi giấy ",
      categories: ["Túi đựng thực phẩm", "Túi đựng đồ"],
      ctaLabel: "Mua ngay →",
      href: "#",
    },
    {
      id: "straws",
      image: slide5,
      title: "Giấy lót thực phẩm",
      categories: ["Giấy nến", "Giấy lót bánh mì", "Giấy lót bánh ngọt"],
      ctaLabel: "Mua ngay →",
      href: "#",
    },
    // thêm slide khác nếu cần
  ];

  const toggleDropdown = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const CategoryCard = ({ img, title }) => (
    <Card
      isPressable
      className="group shadow-sm hover:shadow-md transition-shadow min-w-0" // tránh tràn ngang
    >
      <CardBody className="p-0">
        {/* Khung tỉ lệ, chính nó mới overflow-hidden */}
        <div className="relative w-full aspect-[16/10] min-h-[300px] overflow-hidden rounded-medium">
          {/* Ảnh: block + cover, không absolute */}
          <img
            src={img}
            alt={title}
            className="block w-full h-full object-cover
                     transition-transform duration-500 will-change-transform
                     group-hover:scale-105"
          />

          {/* Overlay & tiêu đề */}
          <div className="pointer-events-none absolute inset-0 flex items-end">
            <div className="w-full p-4 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <h3 className="text-white font-semibold text-left text-lg drop-shadow">
                {title}
              </h3>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );

  const ProductCard = ({
    img,
    title,
    minUnits,
    delivery,
    priceText, // ví dụ: "2.000đ"
    unitText = "/chiếc",
    tags = [],
    isNew = false,
  }) => (
    <Card
      className={`overflow-hidden rounded-[28px] border border-gray-200 shadow-sm hover:shadow-lg transition-shadow ${
        visibleSections.products ? "animate-scale-in" : ""
      }`}
      isPressable
    >
      <CardBody className="p-0">
        {/* Ảnh bo góc lớn, có margin trong card để tạo viền trắng như mẫu */}
        <div className="relative m-3 rounded-[24px] overflow-hidden">
          <div className="aspect-[16/11] w-full">
            <img
              src={img}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>

          {isNew && (
            <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-medium bg-white/90 text-gray-900 shadow">
              New
            </span>
          )}
        </div>

        {/* Nội dung */}
        <div className="px-5 pb-5">
          <p className="text-sm text-gray-500">
            Min. {minUnits} • Delivery: {delivery}
          </p>

          <h3 className="mt-2 text-[20px] leading-6 font-semibold text-[#2A1F6F]">
            {title}
          </h3>

          <p className="mt-1 text-sm">
            from{" "}
            <span className="font-semibold text-pink-600">{priceText}</span>{" "}
            <span className="text-gray-600">{unitText}</span>
          </p>

          {/* Tag pills */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <div
                key={t}
                className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </CardBody>
    </Card>
  );

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
        </div>

        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <h1 className="text-5xl font-bold text-gray-800 leading-tight">
                Mua và Thiết Kế Thương Hiệu và Bao Bì
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Khám phá các sản phẩm bao bì thân thiện môi trường từ các xưởng
                uy tín. Tìm kiếm và đặt hàng ngay hôm nay để giảm thiểu rác
                thải!
              </p>

              <Button
                className="bg-green-700 text-white hover:bg-green-800 rounded-md h-12 px-8 leading-none
             inline-flex items-center whitespace-nowrap" // ⛔ chặn wrap ở root
                classNames={{
                  base: "whitespace-nowrap", // ⛔ chặn wrap
                  content: "flex items-center gap-2",
                  label: "whitespace-nowrap", // ⛔ chặn wrap cho span chữ
                }}
                endContent={<ShoppingCart className="w-5 h-5 shrink-0" />} // icon không co
              >
                Bắt đầu mua sắm
              </Button>
            </div>

            {/* Right Image - Real Product Image */}
            <div className="relative">
              <div className="w-full h-96 bg-white rounded-3xl overflow-hidden shadow-xl">
                <img
                  src={bannerImg}
                  alt="Eco-friendly packaging products - kraft paper bags, coffee cups, and food containers"
                  className="w-full h-full object-cover"
                />

                {/* Overlay text */}
                <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-700">
                      100% Eco-Friendly
                    </span>
                  </div>
                </div>

                {/* Small floating eco badge */}
                <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  Tái chế
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PackagingCarousel title="Sản phẩm bao bì" slides={slides} />

      {/* Marquee logo ngay bên dưới */}
      <ClientLogoMarquee
        logos={logos}
        speed="normal" // "slow" | "normal" | "fast"
        reverse={false} // true để chạy ngược chiều
        className="mt-2"
      />

      {/* Categories Section with HeroUI Cards */}
      <section
        id="categories"
        data-animate
        className="py-12 bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-8">
            Danh mục nổi bật
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-1">
            <CategoryCard img={tuigiay} title="Túi giấy" />
            <CategoryCard img={cocLy} title="Cốc & ly" />
            <CategoryCard img={hop} title="Hộp giấy" />
            <CategoryCard img={onghut} title="Ống hút" />
          </div>
        </div>
      </section>

      {/* Products Section with HeroUI Cards */}
      <section className="py-12 bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Sản phẩm
          </h2>

          <ProductCarousel
            items={[
              {
                img: tuigiay,
                title: "Túi giấy đựng thực phẩm",
                topMeta: "Tối thiểu. 500 chiếc • Thời gian giao hàng: 4–5 tuần",
                provider: "EcoPack Việt Nam",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.72</span>{" "}
                    mỗi chiếc
                  </>
                ),
                tags: [
                  "Tối thiểu thấp",
                  "Giao hàng nhanh",
                  "Tái chế",
                  "Có thể phân hủy",
                  "Niêm phong nhiệt",
                  "Tùy chỉnh",
                ],
                isNew: true,
              },
              {
                img: cocLy,
                title: "Cốc giấy in logo tùy chỉnh",
                provider: "GreenWrap Co.",
                topMeta: "Tối thiểu. 50 chiếc • Thời gian giao hàng: 3 tuần",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.13</span>{" "}
                    mỗi chiếc
                  </>
                ),
                tags: ["Tối thiểu thấp", "Giao hàng nhanh", "Tùy chỉnh"],
                isNew: true,
              },
              {
                img: hop,
                title: "Hộp giấy in logo tùy chỉnh  ",
                provider: "BioPackage Plus",
                topMeta: "Tối thiểu. 1000 chiếc • Thời gian giao hàng: 3 tuần",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.03</span>{" "}
                    mỗi chiếc
                  </>
                ),
                tags: ["Giao hàng nhanh", "Cuộn", "Tùy chỉnh"],
              },
              {
                img: onghut,
                title: "Ống hút giấy sinh học",
                provider: "NatureBox Việt Nam",
                topMeta: "Tối thiểu. 5000 chiếc • Thời gian giao hàng: 6 tuần",
                priceLine: <>Yêu cầu báo giá</>,
                tags: ["Giao hàng nhanh", "Cuộn", "Tùy chỉnh"],
              },
              {
                img: onghut,
                title: "Bát giấy tùy chỉnh",
                provider: "EcoPack Việt Nam",
                topMeta: "Tối thiểu. 5000 chiếc • Thời gian giao hàng: 6 tuần",
                priceLine: <>Yêu cầu báo giá</>,
                tags: ["Giao hàng nhanh", "Cuộn", "Tùy chỉnh"],
                isNew: true,
              },
              // ...cứ thêm item là kéo được tiếp
            ]}
          />
        </div>
      </section>

      {/* <div className="text-center mt-8">
            <Button
              variant="bordered"
              size="lg"
              className="px-8 py-3 border-2 border-green-600 text-green-600 hover:bg-green-50 bg-white rounded-md"
            >
              Xem thêm sản phẩm
            </Button>
          </div>
        </div>
      </section> */}

      {/* Why Choose Us Section */}
      <section className="py-12 mx-auto bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
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
      <section className="py-12 bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-4xl font-semibold text-gray-800 mb-6">
            Sản phẩm nổi bật
          </h2>

          <ProductCarousel
            items={[
              {
                img: tuigiaycaocap,
                title: "Túi giấy đựng thực phẩm",

                provider: "EcoPack Việt Nam",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.72</span>{" "}
                    mỗi chiếc
                  </>
                ),
                description:
                  "Túi giấy kraft chất lượng cao, thân thiện với môi trường ",

                isNew: true,
              },
              {
                img: coccaphe,
                title: "Cốc cà phê có thể tái sử dụng",
                provider: "GreenWrap Co.",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.13</span>{" "}
                    mỗi chiếc
                  </>
                ),
                description:
                  "Cốc cà phê giấy in logo tùy chỉnh, giữ nhiệt tốt, thân thiện môi trường",
                isNew: true,
              },
              {
                img: hopdungthucpham,
                title: "Hộp đựng thực phẩm đa năng  ",
                provider: "BioPackage Plus",
                description:
                  "Hộp đựng thực phẩm giấy, dễ dàng tùy chỉnh kích thước và in ấn logo.",
                priceLine: (
                  <>
                    từ{" "}
                    <span className="font-semibold text-pink-600">$0.03</span>{" "}
                    mỗi chiếc
                  </>
                ),
              },
              {
                img: onghut,
                title: "Ống hút giấy sinh học",
                provider: "NatureBox Việt Nam",
                topMeta: "Tối thiểu. 5000 chiếc • Thời gian giao hàng: 6 tuần",
                description:
                  "Ống hút giấy sinh học, an toàn cho sức khỏe và môi trường.",
                priceLine: <>Yêu cầu báo giá</>,
              },
              {
                img: onghut,
                title: "Bát giấy tùy chỉnh",
                provider: "EcoPack Việt Nam",
                topMeta: "Tối thiểu. 5000 chiếc • Thời gian giao hàng: 6 tuần",
                description:
                  "Bát giấy sinh học, an toàn cho thực phẩm nóng và lạnh.",
                priceLine: <>Yêu cầu báo giá</>,

                isNew: true,
              },
              // ...cứ thêm item là kéo được tiếp
            ]}
          />
        </div>
      </section>
      {/* Customer Reviews Section */}
      <section
        id="reviews"
        data-animate
        className="py-12 mx-auto bg-gradient-to-br bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]"
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
      <div className="flex justify-center bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8]">
        <section
          id="cta"
          data-animate
          className={`py-16 mx-auto bg-gradient-to-br from-[#F4F4F4] to-[#E8F5E8] `}
        >
          <div className="max-w-5xl mx-auto text-center px-4 bg-[#8B6F47] rounded-lg shadow-lg py-12 ">
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
                onClick={() => navigate("/vendor-registration")}
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
    </div>
  );
};

export default Home;
