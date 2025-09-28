import React from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
} from "@nextui-org/react";

const DISTRICTS_HCM = [
  { key: "Q1", label: "Quận 1" },
  { key: "Q3", label: "Quận 3" },
  { key: "Q7", label: "Quận 7" },
  { key: "QB", label: "Bình Thạnh" },
  { key: "TPTHUCDUC", label: "TP. Thủ Đức" },
];

const CITIES = [
  { key: "HCM", label: "TP. Hồ Chí Minh" },
  { key: "HN", label: "Hà Nội" },
  { key: "DN", label: "Đà Nẵng" },
];

export default function AddressForm({
  value,
  onChange,
  className = "",
  title = "Địa chỉ giao hàng",
  showSave = true,
}) {
  const v = value || {};
  const set = (k, val) => onChange?.({ ...v, [k]: val });

  const [touched, setTouched] = React.useState({});

  const err = {
    fullName: !v.fullName?.trim() ? "Vui lòng nhập họ tên" : "",
    phone: !/^0\d{9}$/.test(v.phone || "") ? "SĐT 10 số, bắt đầu bằng 0" : "",
    address: !v.address?.trim() ? "Vui lòng nhập địa chỉ" : "",
    city: !v.city ? "Chọn tỉnh/thành" : "",
  };

  const showErr = (k) => touched[k] && err[k];
  const markTouched = (field) => setTouched((t) => ({ ...t, [field]: true }));

  return (
    <Card className={`border border-gray-200 rounded-xl ${className}`}>
      <CardBody className="p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nguyễn Văn A"
              value={v.fullName || ""}
              onValueChange={(val) => set("fullName", val)}
              onBlur={() => markTouched("fullName")}
              isInvalid={!!showErr("fullName")}
              variant="bordered"
            />
            {showErr("fullName") && (
              <span className="text-sm text-red-600">
                {showErr("fullName")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="0xxxxxxxxx"
              value={v.phone || ""}
              onValueChange={(val) => set("phone", val)}
              onBlur={() => markTouched("phone")}
              isInvalid={!!showErr("phone")}
              variant="bordered"
            />
            {showErr("phone") && (
              <span className="text-sm text-red-600">{showErr("phone")}</span>
            )}
          </div>

          <div className="md:col-span-2 flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Số nhà, đường, phường/xã"
              value={v.address || ""}
              onValueChange={(val) => set("address", val)}
              onBlur={() => markTouched("address")}
              isInvalid={!!showErr("address")}
              variant="bordered"
            />
            {showErr("address") && (
              <span className="text-sm text-red-600">{showErr("address")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn tỉnh/thành phố"
              selectedKeys={v.city ? [v.city] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                set("city", selectedKey);
              }}
              onBlur={() => markTouched("city")}
              isInvalid={!!showErr("city")}
              variant="bordered"
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {CITIES.map((city) => (
                <SelectItem key={city.key} value={city.key}>
                  {city.label}
                </SelectItem>
              ))}
            </Select>
            {showErr("city") && (
              <span className="text-sm text-red-600">{showErr("city")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Quận/Huyện
            </label>
            <Select
              placeholder="Chọn quận/huyện"
              selectedKeys={v.district ? [v.district] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                set("district", selectedKey);
              }}
              variant="bordered"
              isDisabled={!v.city || v.city !== "HCM"}
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {DISTRICTS_HCM.map((district) => (
                <SelectItem key={district.key} value={district.key}>
                  {district.label}
                </SelectItem>
              ))}
            </Select>
            {v.city !== "HCM" && (
              <span className="text-xs text-gray-500">
                Chỉ khả dụng cho TP.HCM
              </span>
            )}
          </div>

          <Textarea
            className="md:col-span-2"
            label="Ghi chú (không bắt buộc)"
            labelPlacement="outside"
            placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến..."
            value={v.note || ""}
            onValueChange={(val) => set("note", val)}
            variant="bordered"
            minRows={3}
            maxRows={6}
          />
        </div>

        {showSave && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <Checkbox
              isSelected={!!v.save}
              onValueChange={(checked) => set("save", checked)}
              color="success"
              size="md"
            >
              <span className="text-sm text-gray-700">
                Lưu địa chỉ này cho lần mua hàng tiếp theo
              </span>
            </Checkbox>
          </div>
        )}
      </CardBody>
    </Card>
  );
}
