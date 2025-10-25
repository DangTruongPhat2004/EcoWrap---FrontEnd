import React from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  CheckCircle2,
  Clipboard,
  ClipboardCheck,
  Package,
  CalendarClock,
  Leaf,
  Truck,
  MapPin,
  Phone,
  HelpCircle,
  Info,
  ArrowRight,
  FileText,
  RotateCw,
} from "lucide-react";
import { getOrderById } from "../../services/orderApi";
import toast from "react-hot-toast";
import dayjs from "dayjs";

// --------- helpers ----------
const fmtVND = (n) => (Number(n) || 0).toLocaleString("vi-VN") + "đ";

function Copyable({ text }) {
  const [copied, setCopied] = React.useState(false);
  const Icon = copied ? ClipboardCheck : Clipboard;
  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };
  return (
    <button
      onClick={onCopy}
      className="p-1 rounded hover:bg-gray-100 transition-colors"
      title={copied ? "Đã sao chép" : "Sao chép"}
    >
      <Icon size={16} className={copied ? "text-green-600" : "text-gray-500"} />
    </button>
  );
}

// --------- 1) Banner thành công ----------
const SuccessBanner = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="text-white" size={24} />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Đặt Hàng Thành Công!
          </h1>
          <p className="text-gray-600 mb-3">
            Đơn hàng của bạn đã được xử lý thành công. Chúng tôi sẽ sớm giao đến
            bạn.
          </p>
          <div className="bg-green-50 border-l-4 border-green-400 px-4 py-2 text-sm text-green-700">
            Chúng tôi sẽ gửi email xác nhận trong vòng 24 giờ.
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --------- 2) Thông tin đơn hàng ----------
const OrderInfoCard = ({ order }) => {
  const items = order?.items ?? [];
  const subtotal = items.reduce(
    (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
          <Package size={20} className="text-green-700" />
          <h2 className="text-xl font-semibold text-gray-800">
            Thông tin đơn hàng
          </h2>
        </div>

        {/* Thông tin cơ bản */}
        <div className="pt-6 pb-6">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">Mã đơn hàng</div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-800 font-medium">
                  #{order?.code}
                </span>
                <Copyable text={order?.code} />
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">Ngày đặt hàng</div>
              <div className="text-gray-800 font-medium">
                {order?.createdAt}
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết sản phẩm */}
        <div className="border-t border-gray-100">
          <div className="pt-4 pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-800">Chi tiết sản phẩm</h3>
              <span className="text-sm text-gray-500">
                {items.length} sản phẩm
              </span>
            </div>

            <div className="space-y-4">
              {items.map((it, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-4 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-5">
                    {it.thumb && (
                      <img
                        src={it.thumb}
                        alt={it.name}
                        className="h-16 w-14 object-cover rounded-lg border border-gray-200"
                      />
                    )}
                    <div>
                      <div className="font-medium text-gray-800 mb-1">
                        {it.name}
                      </div>
                      <div className="text-sm text-gray-500">{it.desc}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-800 font-medium mb-1">
                      {it.qty} × {fmtVND(it.price)}
                    </div>
                    <div className="font-semibold text-green-700">
                      {fmtVND((it.qty || 0) * (it.price || 0))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tổng kết */}
        <div className="border-t border-gray-100 pt-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Tạm tính</span>
              <span className="text-gray-800">{fmtVND(subtotal)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Phí vận chuyển</span>
              <span className="text-gray-800">
                {order?.shippingFee ?? "Miễn phí"}
              </span>
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
              <span className="text-lg font-semibold text-gray-800">
                Tổng cộng
              </span>
              <span className="text-lg font-semibold text-green-700">
                {fmtVND(subtotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --------- 3) Tác động môi trường ----------
const EnvironmentCard = ({ impactKg = 0 }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
    {/* Header với background xanh */}
    <div className="bg-green-200 px-6 py-4">
      <div className="flex items-center gap-3">
        <Leaf size={20} className="text-green-700" />
        <h3 className="text-xl font-semibold text-green-700">
          Tác động môi trường
        </h3>
      </div>
    </div>

    {/* Content */}
    <div className="p-6">
      {/* Icon circle */}
      <div className="flex justify-center mb-6">
        <div className="h-24 w-24 rounded-full bg-green-50 flex items-center justify-center">
          <Leaf size={36} className="text-green-700" />
        </div>
      </div>

      {/* Text content */}
      <div className="text-center mb-6">
        <p className="text-lg font-semibold text-gray-800 mb-2">
          Đơn hàng này giúp giảm
        </p>
        <div className="text-3xl font-bold text-green-700 mb-2">
          {impactKg}kg
        </div>
        <p className="text-gray-800 font-semibold">rác thải nhựa!</p>
      </div>

      {/* Message box */}
      <div className="bg-gray-50 rounded p-3 text-sm text-gray-600 leading-5">
        Bằng cách chọn sản phẩm của chúng tôi, bạn đã góp phần bảo vệ môi
        trường. Cảm ơn bạn đã chọn giải pháp xanh!
      </div>
    </div>
  </div>
);

// --------- 4) Thông tin vận chuyển ----------
const ShippingCard = ({ shipping }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100">
    <div className="p-6">
      <div className="flex items-center gap-3 pb-6 border-b border-gray-200">
        <Truck size={20} className="text-green-700" />
        <h2 className="text-xl font-semibold text-gray-800">
          Thông tin vận chuyển
        </h2>
      </div>

      <div className="pt-6 space-y-6">
        {/* Thông tin cá nhân */}
        <div className="grid grid-cols-2 gap-x-6">
          <div className="space-y-1">
            <div className="text-gray-500 text-sm">Người nhận</div>
            <div className="text-gray-800 font-medium">{shipping?.name}</div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-500 text-sm">Số điện thoại</div>
            <div className="text-gray-800 font-medium">{shipping?.phone}</div>
          </div>
        </div>

        {/* Địa chỉ */}
        <div className="space-y-1">
          <div className="text-gray-500 text-sm">Địa chỉ giao hàng</div>
          <div className="flex items-center gap-2">
            <span className="text-gray-800 font-medium">
              {shipping?.address}
            </span>
            <Copyable text={shipping?.address} />
          </div>
        </div>

        {/* Thông tin vận chuyển chi tiết - Background xám */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">Đơn vị vận chuyển</div>
              <div className="text-gray-800 font-medium">
                {shipping?.carrier}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">
                Phương thức vận chuyển
              </div>
              <div className="text-gray-800 font-medium">
                {shipping?.service}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">
                Thời gian dự kiến giao hàng
              </div>
              <div className="text-gray-800 font-medium">{shipping?.eta}</div>
            </div>
            <div className="space-y-1">
              <div className="text-gray-500 text-sm">
                Mã theo dõi vận chuyển
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-gray-800 font-medium">
                  #{shipping?.tracking}
                </span>
                <Copyable text={shipping?.tracking} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// --------- 5) Hỗ trợ & Chính sách ----------
const SupportPolicyCard = () => {
  const Item = ({ icon, text }) => {
    const IconComponent = icon;
    return (
      <div className="flex items-center gap-3 py-2">
        <IconComponent size={16} className="text-green-700" />
        <a
          href="#"
          className="text-gray-700 hover:text-green-600 text-sm transition-colors"
        >
          {text}
        </a>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      {/* Header với background xanh */}
      <div className="bg-green-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <Info size={20} className="text-green-700" />
          <h3 className="text-xl font-semibold text-green-700">
            Hỗ trợ & Chính sách
          </h3>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="space-y-1 mb-6">
          <Item icon={Truck} text="Chính sách giao hàng" />
          <Item icon={RotateCw} text="Chính sách đổi trả" />
          <Item icon={Phone} text="Liên hệ hỗ trợ" />
          <Item icon={HelpCircle} text="Câu hỏi thường gặp" />
        </div>

        <div className="bg-gray-50 rounded p-4 text-center">
          <div className="text-sm text-gray-600 mb-2">Cần hỗ trợ?</div>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Phone size={16} className="text-green-700" />
            <div className="font-semibold text-green-700">1900 123 456</div>
          </div>
          <div className="text-sm text-gray-500">
            Thời gian hỗ trợ: 8:00 - 20:00 (Thứ 2 - Chủ nhật)
          </div>
        </div>
      </div>
    </div>
  );
};

// --------- Trang chính ----------
export default function OrderSuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");

  const [order, setOrder] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchOrderData = async () => {
      if (!orderId) {
        setError("Không tìm thấy mã đơn hàng");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getOrderById(orderId);

        if (response.success && response.data) {
          setOrder(response.data);
        } else {
          // Check if backend not implemented
          if (response.message?.includes("chưa được backend triển khai")) {
            setError(
              "Backend chưa triển khai API lấy chi tiết đơn hàng. Vui lòng liên hệ đội phát triển."
            );
          } else {
            setError(response.message || "Không thể tải thông tin đơn hàng");
          }
        }
      } catch (err) {
        console.error("Error fetching order:", err);
        if (err.response?.status === 501) {
          setError(
            "Backend chưa triển khai chức năng xem chi tiết đơn hàng (GetOrderByIdAsync)"
          );
        } else {
          setError("Đã xảy ra lỗi khi tải đơn hàng");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  const handleTrackOrder = () => {
    // Since backend GetOrderByIdAsync is not implemented yet,
    // we'll stay on this page or refresh to show latest data
    if (order?.orderId) {
      toast.info("Chức năng theo dõi chi tiết đơn hàng đang được phát triển");
      // Could refresh the current order data here if needed
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
          <p className="ml-4 text-gray-600">Đang tải thông tin đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 mb-4">
            {error || "Không tìm thấy đơn hàng"}
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </div>
    );
  }

  // Transform order data to component format
  const orderData = {
    code: `ORD-${order.orderId}`,
    createdAt: dayjs(order.createdDate).format("DD/MM/YYYY HH:mm"),
    status: order.orderStatus,
    items:
      order.cartItems?.map((item) => ({
        name: item.productName || "Sản phẩm",
        desc: item.product?.productDescription || "",
        qty: item.quantity,
        price: item.cartItemPrice / item.quantity,
        thumb: item.product?.productImages?.[0] || null,
      })) || [],
    shippingFee: "Đang tính toán",
    impactKg: Math.round((order.totalAmount || 0) * 0.2), // Estimate
    shipping: {
      name: order.customer?.user?.fullName || "Khách hàng",
      phone: order.customer?.user?.phoneNumber || "",
      address: `${order.address}, ${order.ward}, ${order.district}, ${order.province}`,
      carrier: order.transportUnit || "Đang xử lý",
      service: "Giao hàng tiêu chuẩn",
      eta: "3-5 ngày làm việc",
      tracking: order.shippingCode || "Đang cập nhật",
    },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 bg-gray-50 min-h-screen">
      {/* Banner thành công */}
      <SuccessBanner />

      {/* Layout 2 cột */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột trái - Thông tin chính */}
        <div className="lg:col-span-2 space-y-6">
          <OrderInfoCard order={orderData} />
          <ShippingCard shipping={orderData.shipping} />
        </div>

        {/* Cột phải - Thông tin phụ */}
        <div className="space-y-6">
          <EnvironmentCard impactKg={orderData.impactKg} />
          <SupportPolicyCard />
        </div>
      </div>

      {/* Buttons cuối trang */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
        <button
          onClick={handleTrackOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-1"
        >
          <FileText size={18} />
          Xem chi tiết đơn hàng
        </button>
        <button
          onClick={handleContinueShopping}
          className="border-2 border-amber-600 text-amber-700 hover:bg-amber-50 px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors flex-1"
        >
          <ArrowRight size={18} />
          Tiếp tục mua sắm
        </button>
      </div>
    </div>
  );
}
