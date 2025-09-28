import { Card, CardBody, Link as NextUILink } from "@nextui-org/react";
import { Truck, Users, Headset } from "lucide-react";

export default function Perks() {
  return (
    <Card className="mt-6">
      <CardBody className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">Giao hàng nhanh chóng</div>
            <p className="text-sm text-gray-600">
              Miễn phí giao hàng cho đơn từ 1 triệu đồng.{" "}
              <NextUILink href="#">Tìm hiểu thêm</NextUILink>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">Giá ưu đãi số lượng lớn</div>
            <p className="text-sm text-gray-600">
              Giảm giá cho đơn hàng doanh nghiệp.{" "}
              <NextUILink href="#">Liên hệ báo giá</NextUILink>
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Headset className="w-5 h-5" />
          </div>
          <div>
            <div className="font-medium">Hỗ trợ 24/7</div>
            <p className="text-sm text-gray-600">
              Gọi{" "}
              <NextUILink href="tel:1900123456" className="text-emerald-700">
                1900 123 456
              </NextUILink>{" "}
              hoặc chat với chúng tôi
            </p>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
