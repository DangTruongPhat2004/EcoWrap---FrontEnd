import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Divider,
  Link as NextUILink,
  Checkbox,
} from "@nextui-org/react";
import { App } from "antd";
import CartItemRow from "../components/cart/CartItemRow";
import ImpactCard from "../components/cart/ImpactCard";
import SummaryCard from "../components/cart/SummaryCard";
import Perks from "../components/cart/Perks";
import { useNavigate } from "react-router-dom";
import {
  getAllCarts,
  deleteCartItem,
  updateCartItem,
} from "../services/cartApi";

export default function CartPage() {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch cart data from API
  useEffect(() => {
    fetchCartData();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await getAllCarts();
      console.log("Cart response:", response);

      // Find active cart
      const activeCart = response.data?.find((cart) => cart.isActive);

      if (activeCart && activeCart.items) {
        // Transform API data to component format
        const transformedItems = activeCart.items.map((item) => ({
          id: item.cartItemId,
          cartItemId: item.cartItemId,
          productId: item.productId,
          name: item.productName || "Sản phẩm",
          variant: item.product?.productDescription || "",
          price: item.cartItemPrice / item.quantity, // Unit price
          qty: item.quantity,
          image: item.imageFile || item.product?.productImages?.[0] || null,
          designFile: item.designFile,
        }));
        setItems(transformedItems);
        // Select all items by default
        setSelectedItems(new Set(transformedItems.map((item) => item.id)));
      } else {
        setItems([]);
        setSelectedItems(new Set());
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setError("Không thể tải giỏ hàng");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (id, qty) => {
    try {
      // Update in backend
      await updateCartItem(id, { quantity: qty });

      // Update local state
      setItems((arr) => arr.map((it) => (it.id === id ? { ...it, qty } : it)));
    } catch (err) {
      console.error("Error updating quantity:", err);
      const errorMsg =
        err?.response?.data?.message || "Không thể cập nhật số lượng";
      const statusCode = err?.response?.status;
      message.error(
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    }
  };

  const removeItem = async (id) => {
    try {
      // Delete from backend
      await deleteCartItem(id);

      // Remove from local state
      setItems((arr) => arr.filter((it) => it.id !== id));
      setSelectedItems((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      message.success("Đã xóa sản phẩm khỏi giỏ hàng");
    } catch (err) {
      console.error("Error removing item:", err);
      const errorMsg = err?.response?.data?.message || "Không thể xóa sản phẩm";
      const statusCode = err?.response?.status;
      message.error(
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    }
  };

  const toggleItemSelection = (id) => {
    setSelectedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedItems.size === items.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(items.map((item) => item.id)));
    }
  };

  // Get only selected items for summary
  const selectedCartItems = items.filter((item) => selectedItems.has(item.id));

  const cols = (
    <div className="hidden md:grid grid-cols-12 text-sm text-gray-500 pb-2 border-b">
      <div className="col-span-1 flex items-center">
        <Checkbox
          isSelected={items.length > 0 && selectedItems.size === items.length}
          isIndeterminate={
            selectedItems.size > 0 && selectedItems.size < items.length
          }
          onValueChange={toggleSelectAll}
          classNames={{
            wrapper: "after:bg-emerald-600 after:border-emerald-600",
          }}
        />
      </div>
      <div className="col-span-5">Sản phẩm</div>
      <div className="col-span-2">Đơn giá</div>
      <div className="col-span-2">Số lượng</div>
      <div className="col-span-2">Thành tiền</div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <main className="bg-[#F6F7F3] min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải giỏ hàng...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error) {
    return (
      <main className="bg-[#F6F7F3] min-h-[70vh]">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="bg-red-50 border border-red-200 rounded-md p-4 text-center">
            <p className="text-red-800">{error}</p>
            <button
              onClick={fetchCartData}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F6F7F3] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#8B6F47]">
          Giỏ hàng của bạn
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Bạn đang có {items.length} sản phẩm trong giỏ hàng
          {selectedItems.size > 0 &&
            selectedItems.size < items.length &&
            ` (đã chọn ${selectedItems.size})`}
        </p>

        {items.length === 0 ? (
          <div className="mt-6 bg-white p-12 rounded-lg shadow text-center">
            <svg
              className="w-24 h-24 text-gray-300 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Giỏ hàng trống
            </h3>
            <p className="text-gray-500 mb-6">
              Bạn chưa có sản phẩm nào trong giỏ hàng
            </p>
            <button
              onClick={() => navigate("/products")}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-8 ">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow ">
              <Card>
                <CardBody>
                  {cols}
                  <div>
                    {items.map((it) => (
                      <React.Fragment key={it.id}>
                        <CartItemRow
                          item={it}
                          isSelected={selectedItems.has(it.id)}
                          onToggleSelect={() => toggleItemSelection(it.id)}
                          onQty={updateQty}
                          onRemove={removeItem}
                        />
                        <Divider />
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="pt-3">
                    <NextUILink
                      href="/products"
                      className="text-sm text-[#8B6F47] font-medium"
                    >
                      ← Tiếp tục mua sắm
                    </NextUILink>
                  </div>
                </CardBody>
              </Card>
            </div>

            <div className="space-y-4">
              <ImpactCard />
              <SummaryCard
                items={selectedCartItems}
                shippingText="Tính khi nhập địa chỉ"
                showCoupon={false} // ẩn mã giảm giá ở cart
                ctaLabel="Tiến hành thanh toán" // đổi chữ nút
                onPlaceOrder={() => {
                  // Validate at least one item is selected
                  if (selectedItems.size === 0) {
                    message.warning(
                      "Vui lòng chọn ít nhất một sản phẩm để thanh toán"
                    );
                    return;
                  }
                  // Pass selected item IDs to checkout
                  const selectedIds = Array.from(selectedItems);
                  navigate("/checkout", {
                    state: { selectedItemIds: selectedIds },
                  });
                }}
              />
            </div>
            <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow mt-6">
              <Perks />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
