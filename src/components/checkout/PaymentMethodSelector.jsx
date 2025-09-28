import React from "react";
import { Card, CardBody } from "@nextui-org/react";
import { Landmark, Banknote } from "lucide-react";

function BadgeIcon({ children, className = "" }) {
  return (
    <div
      className={
        "h-8 w-8 rounded-md text-white flex items-center justify-center text-xs font-semibold " +
        className
      }
    >
      {children}
    </div>
  );
}

function OptionContent({ badge, title, desc }) {
  return (
    <div className="flex items-center gap-3">
      {badge}
      <div className="min-w-0">
        <div className="font-medium text-gray-900">{title}</div>
        <div className="text-sm text-gray-500 truncate">{desc}</div>
      </div>
    </div>
  );
}

// Custom Radio Item Component
function RadioOption({
  value,
  selectedValue,
  onChange,
  children,
  className = "",
}) {
  const isSelected = selectedValue === value;

  return (
    <div
      className={`
        w-full flex items-center justify-between cursor-pointer
        rounded-lg border bg-white transition-all duration-200
        px-4 py-3 hover:bg-gray-50
        ${
          isSelected
            ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
            : "border-gray-200"
        }
        ${className}
      `}
      onClick={() => onChange(value)}
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange(value);
        }
      }}
    >
      {/* Content */}
      <div className="flex-1">{children}</div>

      {/* Custom Radio Button */}
      <div
        className={`
        w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all duration-200
        ${isSelected ? "border-emerald-600" : "border-gray-300"}
      `}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-in zoom-in-50 duration-200" />
        )}
      </div>
    </div>
  );
}

export default function PaymentMethodSelector({
  value,
  onChange,
  error,
  className = "",
  title = "Phương thức thanh toán",
}) {
  const options = [
    {
      key: "vnpay",
      node: (
        <OptionContent
          badge={<BadgeIcon className="bg-[#2563eb]">VP</BadgeIcon>}
          title="VNPAY"
          desc="Thanh toán nhanh qua ứng dụng VNPAY"
        />
      ),
    },
    {
      key: "momo",
      node: (
        <OptionContent
          badge={<BadgeIcon className="bg-[#ec4899]">M</BadgeIcon>}
          title="MoMo"
          desc="Thanh toán tiện lợi qua ví MoMo"
        />
      ),
    },
    {
      key: "bank",
      node: (
        <OptionContent
          badge={
            <BadgeIcon className="bg-[#8b5cf6]">
              <Landmark className="w-4 h-4" />
            </BadgeIcon>
          }
          title="Chuyển khoản ngân hàng"
          desc="Ngân hàng Vietcombank • STK: 123456789"
        />
      ),
    },
    {
      key: "cod",
      node: (
        <OptionContent
          badge={
            <BadgeIcon className="bg-[#10b981]">
              <Banknote className="w-4 h-4" />
            </BadgeIcon>
          }
          title="Thanh toán khi nhận hàng (COD)"
          desc="Áp dụng trong nội thành hoặc đơn đủ điều kiện"
        />
      ),
    },
  ];

  return (
    <Card className={`border border-gray-200 rounded-xl ${className}`}>
      <CardBody className="p-5">
        <div className="text-[20px] font-semibold text-gray-900 mb-3">
          {title}
        </div>

        <div
          className="space-y-3"
          role="radiogroup"
          aria-describedby={error ? "pm-error" : undefined}
        >
          {options.map((opt) => (
            <RadioOption
              key={opt.key}
              value={opt.key}
              selectedValue={value}
              onChange={onChange}
            >
              {opt.node}
            </RadioOption>
          ))}
        </div>

        {error && (
          <div id="pm-error" className="mt-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
