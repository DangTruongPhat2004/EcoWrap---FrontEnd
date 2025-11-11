import React from "react";
import { Card, CardBody, Tooltip } from "@nextui-org/react";
import { Truck, Package, Bike, Info } from "lucide-react";

function MethodRow({ icon, title, desc, right }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-8 w-8 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="font-medium text-gray-900 truncate">{title}</div>
          <div className="text-sm text-gray-500 truncate">{desc}</div>
        </div>
      </div>
      <div className="text-right shrink-0">{right}</div>
    </div>
  );
}

// Custom Radio Option Component for Shipping
function ShippingRadioOption({
  value,
  selectedValue,
  onChange,
  children,
  disabled = false,
  className = "",
}) {
  const isSelected = selectedValue === value;

  return (
    <div
      className={`
        w-full flex items-stretch cursor-pointer
        rounded-xl border bg-white transition-all duration-200
        p-3 hover:bg-gray-50
        ${
          isSelected
            ? "border-emerald-600 bg-emerald-50 ring-1 ring-emerald-600"
            : "border-gray-200"
        }
        ${disabled ? "opacity-50 cursor-not-allowed hover:bg-white" : ""}
        ${className}
      `}
      onClick={() => !disabled && onChange(value)}
      role="radio"
      aria-checked={isSelected}
      aria-disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onKeyDown={(e) => {
        if (!disabled && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onChange(value);
        }
      }}
    >
      {/* Content */}
      <div className="flex-1 w-full">{children}</div>

      {/* Custom Radio Button */}
      <div
        className={`
        mt-1 mr-2 w-5 h-5 rounded-full border-2 flex items-center justify-center
        transition-all duration-200 shrink-0
        ${isSelected ? "border-emerald-600" : "border-gray-400"}
      `}
      >
        {isSelected && (
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-in zoom-in-50 duration-200" />
        )}
      </div>
    </div>
  );
}

export default function ShippingMethodSelector({
  value,
  onChange,
  className = "",
  title = "Phương thức giao hàng",
  region = "HCM",
}) {
  const options = [
    {
      key: "ghtk",
      fee: 0,
      eta: "2–4 ngày",
      node: (
        <MethodRow
          icon={<Truck className="w-4 h-4" />}
          title="GHTK - Giao Hàng Tiết Kiệm"
          desc="Giao hàng toàn quốc - Đơn vị vận chuyển chính thức"
          right={
            <div className="text-sm">
              <div className="font-semibold text-gray-900">COD</div>
              <div className="text-xs text-gray-500">
                {"ETA " + (region === "HCM" ? "2–3" : "3–5") + " ngày"}
              </div>
            </div>
          }
        />
      ),
    },
  ];

  return (
    <Card className={`border border-gray-200 ${className}`}>
      <CardBody className="p-5">
        <div className="text-base font-semibold text-gray-800 mb-3 flex items-center gap-2">
          {title}
          <Tooltip content="Phí giao hàng ước tính theo khu vực, tính chính xác ở bước thanh toán.">
            <Info className="w-4 h-4 text-gray-400" />
          </Tooltip>
        </div>

        <div className="space-y-3" role="radiogroup">
          {options.map((opt) => (
            <ShippingRadioOption
              key={opt.key}
              value={opt.key}
              selectedValue={value}
              onChange={onChange}
              disabled={opt.disabled}
            >
              {opt.node}
            </ShippingRadioOption>
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
