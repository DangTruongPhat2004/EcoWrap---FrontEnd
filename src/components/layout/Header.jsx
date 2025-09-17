import {
  Button,
  Badge,
  Avatar,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link as NextUILink,
} from "@heroui/react";

function Header() {
  return (
    <Navbar
      maxWidth="xl"
      className="bg-white border-b border-[#BDBDBD] h-20"
      classNames={{
        wrapper: "px-4 h-full max-w-[1280px]",
        base: "bg-white",
      }}
    >
      {/* Logo/Brand */}
      <NavbarBrand>
        <div className="flex items-center cursor-pointer">
          <div className="w-[124px] h-[66px] bg-gray-200 rounded flex items-center justify-center">
            <span className="text-green-600 font-bold text-lg">EcoWrap</span>
          </div>
        </div>
      </NavbarBrand>

      {/* Navigation Links */}
      <NavbarContent className="hidden sm:flex gap-10" justify="center">
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
            href="/design"
            color="foreground"
            className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
          >
            Thiết kế
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

        <NavbarItem>
          <NextUILink
            href="/about"
            color="foreground"
            className="text-black text-[16px] font-normal hover:text-green-600 transition-colors"
          >
            Về chúng tôi
          </NextUILink>
        </NavbarItem>
      </NavbarContent>

      {/* Right side actions */}
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center space-x-6">
          {/* Notification with Badge */}
          <Badge
            content="3"
            color="danger"
            size="sm"
            classNames={{
              badge:
                "bg-red-500 text-white font-medium min-w-[18px] h-[18px] text-xs flex items-center justify-center",
            }}
            placement="top-right"
          >
            <Button
              isIconOnly
              variant="light"
              radius="full"
              className="w-11 h-11 bg-[rgba(168,213,186,0.2)] hover:bg-[rgba(168,213,186,0.3)] transition-colors"
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

          {/* Shopping Cart with Badge */}
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

          {/* Login/Register Link */}
          <NextUILink
            href="/login"
            color="success"
            className="text-[#027534] text-[16px] font-normal hover:underline"
          >
            Đăng nhập/ Đăng ký
          </NextUILink>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default Header;
