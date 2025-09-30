// src/components/layout/Header.jsx
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
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar,
} from "@nextui-org/react";
import React from "react";
import logoImg from "../../assets/logo.png";
import apiClient from "../../services/apiClient";

// --- helpers: decode JWT để lấy userId ---
function b64urlDecode(str) {
  const pad = "=".repeat((4 - (str.length % 4)) % 4);
  const base64 = (str + pad).replace(/-/g, "+").replace(/_/g, "/");
  try {
    return atob(base64);
  } catch {
    return "";
  }
}
function decodeJwt(token) {
  const parts = token?.split(".") || [];
  if (parts.length !== 3) return null;
  try {
    return JSON.parse(b64urlDecode(parts[1]));
  } catch {
    return null;
  }
}
function getUserIdFromToken(token) {
  const p = decodeJwt(token);
  if (!p) return null;
  return (
    p.id ||
    p["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] ||
    null
  );
}

function Header() {
  // Search state
  const [query, setQuery] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const desktopInputRef = React.useRef(null);
  const mobileInputRef = React.useRef(null);

  // Auth state
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  // 0) Hydrate từ localStorage (user) để hiển thị ngay
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        if (u && typeof u === "object") setUser(u);
      }
    } catch {}
  }, []);

  // 1) Lắng nghe sự kiện custom "auth:updated" để cập nhật ngay sau login/logout
  React.useEffect(() => {
    const onAuthUpdated = (e) => {
      const nextUser = e?.detail?.user || null;
      if (nextUser) {
        setUser(nextUser);
        try {
          localStorage.setItem("user", JSON.stringify(nextUser));
        } catch {}
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    };
    window.addEventListener("auth:updated", onAuthUpdated);
    return () => window.removeEventListener("auth:updated", onAuthUpdated);
  }, []);

  // 2) Đồng bộ đa tab qua "storage" event
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === "user") {
        try {
          const u = e.newValue ? JSON.parse(e.newValue) : null;
          setUser(u);
        } catch {
          setUser(null);
        }
      }
      if (e.key === "token" && !e.newValue) {
        setUser(null);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // 3) mount: nếu có token thì fetch user (fallback khi F5)
  React.useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (alive) setAuthLoading(false);
          return;
        }
        // nếu đã có user từ localStorage thì chỉ cần clear loading
        if (user) {
          if (alive) setAuthLoading(false);
          return;
        }
        const id = getUserIdFromToken(token);
        if (!id) {
          localStorage.removeItem("token");
          if (alive) setAuthLoading(false);
          return;
        }
        const res = await apiClient.get(`/api/Users/${id}`);
        if (alive) {
          setUser(res.data || null);
          try {
            localStorage.setItem("user", JSON.stringify(res.data || null));
          } catch {}
        }
      } catch (e) {
        console.warn("[header] fetch user error:", e);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } finally {
        if (alive) setAuthLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []); // chỉ chạy khi mount

  const submitSearch = (q) => {
    const value = (q ?? query).trim();
    if (!value) return;
    window.location.href = `/search?q=${encodeURIComponent(value)}`;
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // phát sự kiện cho các component khác
    window.dispatchEvent(
      new CustomEvent("auth:updated", { detail: { token: null, user: null } })
    );
    window.location.href = "/login";
  };

  const displayName =
    user?.fullName?.trim() || user?.username?.trim() || "Tài khoản";
  const avatarChar = (displayName[0] || "U").toUpperCase();

  return (
    <Navbar
      maxWidth="xl"
      className="bg-white border-b border-[#BDBDBD] h-20"
      classNames={{
        wrapper: "px-4 h-full max-w-[1280px]",
        base: "bg-white",
      }}
    >
      {/* 1) LOGO */}
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

      {/* 2) NAV LINKS */}
      <NavbarContent className="hidden sm:flex gap-8" justify="start">
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

      {/* 3) SEARCH */}
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
            onChange={(e) => setQuery(e.target.value)}
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
            }}
          />
        </form>
      </NavbarContent>

      {/* 4) ACTIONS */}
      <NavbarContent justify="end">
        <NavbarItem className="flex items-center space-x-4 sm:space-x-6">
          {/* Mobile search */}
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

          {/* Auth: nếu đã đăng nhập -> Dropdown user, ngược lại -> link login */}
          {authLoading ? (
            <div className="w-28 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="px-2 h-11 gap-2 bg-[rgba(168,213,186,0.18)] hover:bg-[rgba(168,213,186,0.28)]"
                >
                  <Avatar
                    src={user?.profilePicture || undefined}
                    name={avatarChar}
                    isBordered
                    radius="full"
                    className="w-7 h-7 text-sm bg-[#e8f5e8] text-[#027534]"
                  />
                  <span className="hidden sm:inline text-[#027534]">
                    {displayName}
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Menu tài khoản"
                onAction={(key) => {
                  if (key === "profile") window.location.href = "/account";
                  if (key === "logout") onLogout();
                }}
              >
                <DropdownItem key="profile">Thông tin cá nhân</DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  className="text-danger"
                >
                  Đăng xuất
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <NextUILink
              href="/login"
              color="success"
              className="text-[#027534] text-[16px] font-normal hover:underline"
            >
              Đăng nhập/ Đăng ký
            </NextUILink>
          )}
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Search Modal */}
      <Modal
        isOpen={openSearch}
        onOpenChange={(open) => setOpenSearch(open)}
        placement="top-center"
        backdrop="opaque"
        className="max-w-xl"
      >
        <ModalContent>
          <ModalBody className="py-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
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
                onChange={(e) => setQuery(e.target.value)}
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
          </ModalBody>
        </ModalContent>
      </Modal>
    </Navbar>
  );
}

export default Header;
