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
  Divider,
  DropdownSection,
} from "@nextui-org/react";
import {
  ChevronDown,
  ChevronRight,
  User as UserIcon,
  Settings,
  Heart,
  Package,
  CreditCard,
  HeadphonesIcon,
  LogOut,
  ShieldCheck,
} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../../assets/logo.png";
import apiClient from "../../services/apiClient";
import { getAllCarts } from "../../services/cartApi";

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
  const navigate = useNavigate();

  // Search state
  const [query, setQuery] = React.useState("");
  const [openSearch, setOpenSearch] = React.useState(false);
  const desktopInputRef = React.useRef(null);
  const mobileInputRef = React.useRef(null);

  // Auth state
  const [user, setUser] = React.useState(null);
  const [authLoading, setAuthLoading] = React.useState(true);

  // Cart state
  const [cartItemCount, setCartItemCount] = React.useState(0);

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
          // Handle nested response structure: { data: { userId, fullName, ... } }
          const userData = res.data?.data || res.data || null;
          setUser(userData);
          try {
            localStorage.setItem("user", JSON.stringify(userData));
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

  // 4) Fetch cart count when user is logged in
  React.useEffect(() => {
    const fetchCartCount = async () => {
      if (!user) {
        setCartItemCount(0);
        return;
      }

      try {
        const cartData = await getAllCarts();
        // Cart API returns { data: [{ cartId, items: [...] }] }
        if (cartData?.data && Array.isArray(cartData.data)) {
          // Get active cart (first one or the one with IsActive = true)
          const activeCart =
            cartData.data.find((cart) => cart.isActive) || cartData.data[0];
          if (activeCart?.items) {
            setCartItemCount(activeCart.items.length);
          } else {
            setCartItemCount(0);
          }
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart count:", error);
        setCartItemCount(0);
      }
    };

    fetchCartCount();
  }, [user]);

  // 5) Listen for cart updates (e.g., when items are added)
  React.useEffect(() => {
    const handleCartUpdate = () => {
      // Re-fetch cart count when cart is updated
      if (user) {
        getAllCarts()
          .then((cartData) => {
            if (cartData?.data && Array.isArray(cartData.data)) {
              const activeCart =
                cartData.data.find((cart) => cart.isActive) || cartData.data[0];
              if (activeCart?.items) {
                setCartItemCount(activeCart.items.length);
              } else {
                setCartItemCount(0);
              }
            }
          })
          .catch((error) => {
            console.error("Error updating cart count:", error);
          });
      }
    };

    window.addEventListener("cart:updated", handleCartUpdate);
    return () => window.removeEventListener("cart:updated", handleCartUpdate);
  }, [user]);

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
            href="/thiet-ke/new"
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

          {/* Messages */}
          <Badge
            content="1"
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
              className="w-11 h-11 bg-[rgba(168,213,186,0.2)] hover:bg-[rgba(168,213,186,0.3)] transition-colors cursor-pointer"
              aria-label="Tin nhắn"
              onClick={() => navigate("/messages")}
            >
              <svg
                className="w-5 h-5 text-[#027534]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  clipRule="evenodd"
                />
              </svg>
            </Button>
          </Badge>

          {/* Cart */}
          <Badge
            content={cartItemCount > 0 ? cartItemCount : "0"}
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
              className="w-11 h-11 bg-[rgba(168,213,186,0.2)] cursor-pointer"
              aria-label="Giỏ hàng"
              onClick={() => navigate("/cart")}
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

          {authLoading ? (
            <div className="h-11 w-[180px] rounded-full bg-gray-100 animate-pulse" />
          ) : user ? (
            <Dropdown
              placement="bottom-end"
              classNames={{
                content:
                  "p-0 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl min-w-[320px]",
              }}
            >
              <DropdownTrigger>
                <Button
                  variant="flat"
                  radius="full"
                  className="group h-11 pl-1 pr-2 gap-2 bg-gray-50 hover:bg-gray-100"
                >
                  <Avatar
                    src={user?.profilePicture || undefined}
                    name={avatarChar}
                    isBordered
                    radius="full"
                    className="w-8 h-8 text-sm bg-emerald-50 text-emerald-700"
                  />
                  <div className="hidden sm:flex flex-col items-start min-w-0">
                    <span className="text-[13px] font-semibold leading-4 text-gray-900 max-w-[150px] truncate">
                      {displayName}
                    </span>
                    <span className="text-[11px] text-gray-500 max-w-[180px] truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronDown className="size-4 text-gray-700 transition-transform group-data-[open=true]:rotate-180" />
                </Button>
              </DropdownTrigger>

              <DropdownMenu
                aria-label="Menu tài khoản"
                onAction={(key) => {
                  switch (key) {
                    case "profile":
                      navigate("/account");
                      break;
                    case "orders":
                      navigate("/account/orders");
                      break;
                    case "wishlist":
                      navigate("/account/wishlist");
                      break;
                    case "payments":
                      navigate("/account/payments");
                      break;
                    case "admin":
                      navigate("/admin");
                      break;
                    case "logout":
                      onLogout();
                      break;
                  }
                }}
                // style chữ & hover thống nhất để dễ đọc
                itemClasses={{
                  base:
                    "px-4 py-3 rounded-lg data-[hover=true]:bg-gray-50 " +
                    "data-[selectable=true]:focus:bg-gray-50",
                  title: "text-[14px] font-medium text-gray-900",
                  description: "text-[12px] text-gray-500",
                  wrapper: "gap-3",
                }}
              >
                {/* Header: rõ ràng, không ảnh */}
                <DropdownSection
                  aria-label="Thông tin"
                  classNames={{
                    heading:
                      "px-4 pt-3 pb-1 text-[11px] uppercase tracking-wide text-gray-500",
                  }}
                  title="Tài khoản"
                >
                  <DropdownItem
                    key="header"
                    isReadOnly
                    className="!cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar
                        src={user?.profilePicture || undefined}
                        name={avatarChar}
                        className="w-10 h-10"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold leading-5 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate max-w-[240px]">
                          {user?.email}
                        </p>
                      </div>
                    </div>
                  </DropdownItem>
                </DropdownSection>

                {/* Nhóm tác vụ chính */}
                <DropdownSection
                  aria-label="Điều hướng"
                  showDivider
                  classNames={{
                    heading:
                      "px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-gray-500",
                  }}
                  title="Quản lý"
                >
                  <DropdownItem
                    key="profile"
                    startContent={<UserIcon className="size-4 text-gray-700" />}
                    endContent={
                      <ChevronRight className="size-4 text-gray-400" />
                    }
                    description="Chỉnh sửa thông tin cá nhân"
                  >
                    Hồ sơ
                  </DropdownItem>

                  <DropdownItem
                    key="orders"
                    startContent={<Package className="size-4 text-gray-700" />}
                    endContent={
                      <ChevronRight className="size-4 text-gray-400" />
                    }
                    description="Theo dõi đơn hàng của bạn"
                  >
                    Đơn hàng
                  </DropdownItem>

                  <DropdownItem
                    key="wishlist"
                    startContent={<Heart className="size-4 text-gray-700" />}
                    endContent={
                      <ChevronRight className="size-4 text-gray-400" />
                    }
                    description="Danh sách yêu thích"
                  >
                    Yêu thích
                  </DropdownItem>
                </DropdownSection>

                {/* Hỗ trợ + Admin */}
                <DropdownSection
                  aria-label="Khác"
                  showDivider
                  classNames={{
                    heading:
                      "px-4 pt-2 pb-1 text-[11px] uppercase tracking-wide text-gray-500",
                  }}
                  title="Khác"
                >
                  {(user?.role === "Admin" || user?.isAdmin) && (
                    <DropdownItem
                      key="admin"
                      className="text-amber-700"
                      startContent={
                        <ShieldCheck className="size-4 text-amber-700" />
                      }
                      endContent={
                        <ChevronRight className="size-4 text-amber-500" />
                      }
                      description="Bảng điều khiển quản trị"
                    >
                      Trang quản trị
                    </DropdownItem>
                  )}
                </DropdownSection>

                {/* Đăng xuất */}
                <DropdownSection showDivider>
                  <DropdownItem
                    key="logout"
                    color="danger"
                    className="text-danger data-[hover=true]:bg-red-50"
                    startContent={<LogOut className="size-4" />}
                    description="Thoát tài khoản an toàn"
                  >
                    Đăng xuất
                  </DropdownItem>
                </DropdownSection>
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
