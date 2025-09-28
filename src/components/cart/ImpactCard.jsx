import { Card, CardBody } from "@nextui-org/react";
import { Globe2 } from "lucide-react";

export default function ImpactCard({
  title = "Tác động môi trường",
  highlight = "~20kg nhựa dùng một lần!",
  note = "Cảm ơn bạn đã chọn sản phẩm thân thiện với môi trường!",
}) {
  return (
    <Card className="bg-[#0B7A43] text-white border-0 shadow-none rounded-lg">
      <CardBody className="p-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className="h-8 w-8 rounded-full bg-white/15 flex items-center justify-center shrink-0">
            <Globe2 className="w-4 h-4" />
          </div>

          {/* Text */}
          <div className="leading-relaxed">
            <div className="font-semibold">{title}</div>
            <div className="mt-1 text-sm">
              Đơn hàng của bạn giúp giảm
              <br />
              <span className="font-semibold">{highlight}</span>
            </div>
            <div className="mt-1 text-xs opacity-90">{note}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
