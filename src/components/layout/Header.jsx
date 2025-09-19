import {
  Button,
  Badge,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
  Input,
  Modal,
  ModalContent,
  ModalBody,
  Kbd,
  Link,
} from "@heroui/react";
import React from "react";
import logoImg from "../../assets/logo.png";

function Header() {
  // Search state
  const [query, setQuery] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const desktopInputRef = React.useRef(null);
  const mobileInputRef = React.useRef(null);

  // TODO: Dùng next/navigation -> useRouter() và router.push() thay vì window.location.href
  // import { useRouter } from "next/navigation";
  // const router = useRouter();

  const submitSearch = (q) => {
    const value = (q ?? query).trim();
    if (!value) return;

    // TODO: Chuyển sang: router.push(`/search?q=${encodeURIComponent(value)}`)
    // TODO: Track analytics: search_submit (q, source: 'header'|'mobile_modal')
    window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  // TODO: Phím tắt Ctrl/⌘+K để focus ô search desktop (và mở modal mobile nếu không có desktopInputRef)
  // React.useEffect(() => {
  //   const onKey = (e) => {
  //     const isModK = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k";
  //     if (isModK) {
  //       e.preventDefault();
  //       if (desktopInputRef.current) desktopInputRef.current.focus();
  //       else {
  //         setOpenSearch(true);
  //         setTimeout(() => mobileInputRef.current?.focus(), 0);
  //       }
  //     }
  //   };
  //   window.addEventListener("keydown", onKey);
  //   return () => window.removeEventListener("keydown", onKey);
  // }, []);

  return (
    <Navbar
      maxWidth="xl"
      className="bg-white border-b border-[#BDBDBD] h-20"
      classNames={{
        wrapper: "px-4 h-full max-w-[1280px]",
        base: "bg-white",
      }}
    >
      {/* 1) LOGO (trái) */}
      <NavbarBrand>
        <Link href="/" aria-label="Về trang chủ" className="flex items-center">
          <div className="w-[170px] h-[120px] rounded flex items-center justify-center">
            <img
              src={logoImg}
              alt="EcoWrap Logo"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </Link>
      </NavbarBrand>

      {/* 2) NAV LINKS: Sản phẩm → Bộ sưu tập (bỏ Trang chủ & Thiết kế) */}
      <NavbarContent className="hidden sm:flex gap-8" justify="start">
        {/* TODO: Bạn bảo bỏ "Trang chủ" -> xoá block này khi sẵn sàng */}
        <NavbarItem>
          <NextUILink
            href="/"
            color="foreground"
            className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
          >
            Trang chủ
          </NextUILink>
        </NavbarItem>

        <NavbarItem>
          <NextUILink
            href="/products"
            color="foreground"
            className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
          >
            Sản phẩm
          </NextUILink>
        </NavbarItem>

        <NavbarItem>
          <NextUILink
            href="/collections"
            color="foreground"
            className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
          >
            Bộ sưu tập
          </NextUILink>
        </NavbarItem>
      </NavbarContent>

      {/* 3) THANH TÌM KIẾM (ở giữa, chiếm flex) */}
      <NavbarContent className="hidden sm:flex flex-1" justify="end">
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault();
            submitSearch();
          }}
          className="w-full max-w-sm ml-auto"
        >
          <Input
            ref={desktopInputRef}
            type="search"
            variant="bordered"
            radius="full"
            placeholder="Tìm sản phẩm, danh mục, bộ sưu tập…"
            value={query}
            onChange={(e) => {
              // TODO: debounce 300–400ms để gọi API gợi ý (/api/search/suggest?q=)
              // TODO: lưu query gần đây (localStorage) khi submit thành công
              setQuery(e.target.value);
            }}
            startContent={
              <svg
                className="w-5 h-5 text-gray-500"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="7" strokeWidth="2" />
                <path d="M20 20L17 17" strokeWidth="2" />
              </svg>
            }
            classNames={{
              inputWrapper:
                "h-8 border-gray-300 hover:border-gray-400 focus-within:border-[#027534]",
              // TODO: gọn hơn -> input: 'text-sm', thêm px-2 nếu muốn
            }}
          />

          {/* TODO: Dropdown gợi ý (autocomplete)
              - Hiển thị khi query.length > 0
              - Nhóm: Sản phẩm / Danh mục / Từ khoá
              - Điều hướng bằng phím ↑/↓ + Enter
              - Ẩn khi blur/Esc
          */}
        </form>
      </NavbarContent>

      {/* 4) ACTIONS (phải) */}
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center space-x-4 sm:space-x-6">
          {/* Nút mở search trên mobile */}
          <Button
            isIconOnly
            variant="light"
            radius="full"
            className="w-11 h-11 sm:hidden bg-[rgba(168,213,186,0.2)] hover:bg-[rgba(168,213,186,0.3)] transition-colors"
            onPress={() => {
              setOpenSearch(true);
              setTimeout(() => mobileInputRef.current?.focus(), 0);
            }}
            aria-label="Tìm kiếm"
          >
            <svg
              className="w-5 h-5 text-[#027534]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <path d="M20 20L17 17" strokeWidth="2" />
            </svg>
          </Button>

          {/* Notification */}
          <Badge
            content="3"
            color="danger"
            size="sm"
            classNames={{
              badge:
                "bg-green-500 text-white font-medium min-w-[18px] h-[18px] text-xs flex items-center justify-center",
            }}
            placement="top-right"
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className="w-11 h-11 bg-[rgba(168,213,186,0.2)] hover:bg-[rgba(168,213,186,0.3)] transition-colors"
              aria-label="Thông báo"
            >
              <svg
                className="w-5 h-5 text-[#027534]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="m13.73 21a2 2 0 0 1-3.46 0"
                />
              </svg>
            </Button>
          </Badge>

          {/* Cart */}
          <Badge
            content="0"
            color="default"
            size="sm"
            classNames={{
              badge:
                "bg-[#8B6F47] text-white font-medium min-w-[18px] h-[18px] text-xs flex items-center justify-center",
            }}
            placement="top-right"
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className="w-11 h-11 bg-[rgba(168,213,186,0.2)]"
              aria-label="Giỏ hàng"
            >
              <svg
                className="w-5 h-5 text-[#8B6F47]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </Button>
          </Badge>

          {/* Auth */}
          <NextUILink
            href="/login"
            color="success"
            className="text-[#027534] text-[16px] font-normal hover:underline"
          >
            Đăng nhập/ Đăng ký
          </NextUILink>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Search Modal */}
      <Modal
        isOpen={openSearch}
        onOpenChange={(open) => {
          // TODO: nếu đóng do Esc -> track 'search_modal_close'
          setOpenSearch(open);
        }}
        placement="top-center"
        backdrop="opaque"
        className="max-w-xl"
      >
        <ModalContent>
          <ModalBody className="py-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // TODO: Track analytics: search_submit (source: 'mobile_modal')
                submitSearch();
              }}
            >
              <Input
                ref={mobileInputRef}
                type="search"
                variant="bordered"
                radius="full"
                placeholder="Tìm kiếm EcoWrap…"
                value={query}
                onChange={(e) => {
                  // TODO: debounce + gọi /api/search/suggest
                  setQuery(e.target.value);
                }}
                startContent={
                  <svg
                    className="w-5 h-5 text-gray-500"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <circle cx="11" cy="11" r="7" strokeWidth="2" />
                    <path d="M20 20L17 17" strokeWidth="2" />
                  </svg>
                }
                classNames={{
                  inputWrapper:
                    "h-12 border-gray-300 hover:border-gray-400 focus-within:border-[#027534]",
                }}
              />
            </form>
            <div className="text-xs text-gray-500">
              Nhấn <Kbd>Enter</Kbd> để tìm.
            </div>

            {/* TODO: Render dropdown gợi ý ở mobile (danh sách tối giản) */}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Navbar>
  );
}

export default Header;
