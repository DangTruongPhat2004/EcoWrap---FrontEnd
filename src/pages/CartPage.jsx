import React from "react";
import { Card, CardBody, Divider, Link as NextUILink } from "@nextui-org/react";
import CartItemRow from "../components/cart/CartItemRow";
import ImpactCard from "../components/cart/ImpactCard";
import SummaryCard from "../components/cart/SummaryCard";
import Perks from "../components/cart/Perks";
import tuigiay from "../assets/tuigiay.png";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const navigate = useNavigate();
  const [items, setItems] = React.useState([
    {
      id: "bag-26x32",
      name: "Túi Giấy Kraft 26×32cm",
      variant: "Túi đựng bánh mì túi kín",
      price: 2000,
      qty: 100,
      image: tuigiay,
    },
    {
      id: "bag-30x40",
      name: "Túi Giấy Kraft 30×40cm",
      variant: "Túi đựng bánh mì túi kín",
      price: 2500,
      qty: 100,
      image: tuigiay,
    },
  ]);
  const updateQty = (id, qty) =>
    setItems((arr) => arr.map((it) => (it.id === id ? { ...it, qty } : it)));
  const removeItem = (id) =>
    setItems((arr) => arr.filter((it) => it.id !== id));

  const cols = (
    <div className="hidden md:grid grid-cols-12 text-sm text-gray-500 pb-2 border-b">
      <div className="col-span-6">Sản phẩm</div>
      <div className="col-span-2">Đơn giá</div>
      <div className="col-span-2">Số lượng</div>
      <div className="col-span-2">Thành tiền</div>
    </div>
  );

  return (
    <main className="bg-[#F6F7F3] min-h-[70vh]">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-semibold text-[#8B6F47]">
          Giỏ hàng của bạn
        </h1>
        <p className="text-sm text-gray-600 mt-1">
          Bạn đang có {items.reduce((s, it) => s + it.qty, 0)} sản phẩm trong
          giỏ hàng
        </p>

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
                        onQty={updateQty}
                        onRemove={removeItem}
                      />
                      <Divider />
                    </React.Fragment>
                  ))}
                </div>
                <div className="pt-3">
                  <NextUILink
                    href="#"
                    className="text-sm text-[#8B6F47] font-medium"
                  >
                    ← Tiếp tục thiết kế
                  </NextUILink>
                </div>
              </CardBody>
            </Card>
          </div>

          <div className="space-y-4">
            <ImpactCard />
            <SummaryCard
              items={items}
              shippingText="Tính khi nhập địa chỉ"
              showCoupon={false} // ẩn mã giảm giá ở cart
              ctaLabel="Tiến hành thanh toán" // đổi chữ nút
              onPlaceOrder={() => navigate("/checkout")} // ⟵ sang Checkout
            />
          </div>
          <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow mt-6">
            <Perks />
          </div>
        </div>
      </div>
    </main>
  );
}
