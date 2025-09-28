import React from "react";
import { Card, CardBody, Input, Button } from "@nextui-org/react";

export default function CouponCard({ onApply }) {
  const [code, setCode] = React.useState("");

  const handle = () => onApply?.(code);
  return (
    <Card className="border border-gray-200">
      <CardBody className="p-5">
        <div className="text-base font-semibold text-gray-800 mb-3">
          Mã giảm giá
        </div>
        <div className="flex">
          <Input
            aria-label="Mã giảm giá"
            placeholder="Nhập mã giảm giá"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            classNames={{
              inputWrapper:
                "rounded-l-xl rounded-r-none h-11 shadow-none border border-gray-300",
              input: "text-sm",
            }}
          />
          <Button
            onPress={handle}
            className="h-11 rounded-r-xl rounded-l-none px-5 bg-[#9C7A4C] text-white hover:opacity-95"
          >
            Áp dụng
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
