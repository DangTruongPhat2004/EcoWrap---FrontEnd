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
  { key: "Quận 1", label: "Quận 1" },
  { key: "Quận 3", label: "Quận 3" },
  { key: "Quận 7", label: "Quận 7" },
  { key: "Bình Thạnh", label: "Bình Thạnh" },
  { key: "TP. Thủ Đức", label: "TP. Thủ Đức" },
];

const WARDS_Q1 = [
  { key: "Phường Bến Nghé", label: "Phường Bến Nghé" },
  { key: "Phường Bến Thành", label: "Phường Bến Thành" },
  { key: "Phường Cầu Kho", label: "Phường Cầu Kho" },
  { key: "Phường Đa Kao", label: "Phường Đa Kao" },
  { key: "Phường Nguyễn Thái Bình", label: "Phường Nguyễn Thái Bình" },
];

const HAMLETS = [
  { key: "Ấp 1", label: "Ấp 1" },
  { key: "Ấp 2", label: "Ấp 2" },
  { key: "Ấp 3", label: "Ấp 3" },
  { key: "Không có", label: "Không có" },
];

const PROVINCES = [
  { key: "TP. Hồ Chí Minh", label: "TP. Hồ Chí Minh" },
  { key: "Hà Nội", label: "Hà Nội" },
  { key: "Đà Nẵng", label: "Đà Nẵng" },
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
    province: !v.province ? "Chọn tỉnh/thành" : "",
    district: !v.district ? "Chọn quận/huyện" : "",
    ward: !v.ward ? "Chọn phường/xã" : "",
    hamlet: !v.hamlet ? "Chọn ấp" : "",
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
              selectedKeys={v.province ? [v.province] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                console.log("🏙️ Province selected:", selectedKey);
                set("province", selectedKey);
                // Reset dependent fields
                set("district", "");
                set("ward", "");
              }}
              onBlur={() => markTouched("province")}
              isInvalid={!!showErr("province")}
              variant="bordered"
              selectionMode="single"
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {PROVINCES.map((prov) => (
                <SelectItem key={prov.key} value={prov.key}>
                  {prov.label}
                </SelectItem>
              ))}
            </Select>
            {showErr("province") && (
              <span className="text-sm text-red-600">
                {showErr("province")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn quận/huyện"
              selectedKeys={v.district ? [v.district] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                set("district", selectedKey);
                set("ward", ""); // Reset ward when district changes
              }}
              onBlur={() => markTouched("district")}
              isInvalid={!!showErr("district")}
              variant="bordered"
              isDisabled={!v.province || v.province !== "TP. Hồ Chí Minh"}
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
            {showErr("district") && (
              <span className="text-sm text-red-600">
                {showErr("district")}
              </span>
            )}
            {v.province !== "TP. Hồ Chí Minh" && (
              <span className="text-xs text-gray-500">
                Chỉ khả dụng cho TP.HCM
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn phường/xã"
              selectedKeys={v.ward ? [v.ward] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                set("ward", selectedKey);
              }}
              onBlur={() => markTouched("ward")}
              isInvalid={!!showErr("ward")}
              variant="bordered"
              isDisabled={!v.district}
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {WARDS_Q1.map((ward) => (
                <SelectItem key={ward.key} value={ward.key}>
                  {ward.label}
                </SelectItem>
              ))}
            </Select>
            {showErr("ward") && (
              <span className="text-sm text-red-600">{showErr("ward")}</span>
            )}
            {!v.district && (
              <span className="text-xs text-gray-500">
                Chọn quận/huyện trước
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Ấp <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn ấp"
              selectedKeys={v.hamlet ? [v.hamlet] : []}
              onSelectionChange={(keys) => {
                const selectedKey = Array.from(keys)[0];
                set("hamlet", selectedKey);
              }}
              onBlur={() => markTouched("hamlet")}
              isInvalid={!!showErr("hamlet")}
              variant="bordered"
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {HAMLETS.map((hamlet) => (
                <SelectItem key={hamlet.key} value={hamlet.key}>
                  {hamlet.label}
                </SelectItem>
              ))}
            </Select>
            {showErr("hamlet") && (
              <span className="text-sm text-red-600">{showErr("hamlet")}</span>
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
