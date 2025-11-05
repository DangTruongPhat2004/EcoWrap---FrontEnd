import React, { useState, useEffect } from "react";
import { Card, CardBody, Input, Textarea, Checkbox } from "@nextui-org/react";
import { getUserById } from "../../services/userApi";
import { getUserIdFromJwt } from "../../utils/jwt";

export default function AddressForm({
  value,
  onChange,
  className = "",
  title = "Địa chỉ giao hàng",
  showSave = true,
}) {
  const v = value || {};
  const set = (k, val) => onChange?.({ ...v, [k]: val });

  const [touched, setTouched] = useState({});
  const [userDataLoaded, setUserDataLoaded] = useState(false);

  // Function to build complete address from location parts
  const buildCompleteAddress = (addressParts) => {
    const parts = [];
    if (addressParts.address?.trim()) parts.push(addressParts.address.trim());
    if (addressParts.hamlet?.trim()) parts.push(addressParts.hamlet.trim());
    if (addressParts.ward?.trim()) parts.push(addressParts.ward.trim());
    if (addressParts.district?.trim()) parts.push(addressParts.district.trim());
    if (addressParts.province?.trim()) parts.push(addressParts.province.trim());
    return parts.join(", ");
  };

  // Custom set function for location fields that updates complete address
  const setWithAddressUpdate = (k, val) => {
    const newValue = { ...v, [k]: val };
    // If updating a location field, rebuild the complete address
    if (["ward", "district", "province", "hamlet"].includes(k)) {
      newValue.completeAddress = buildCompleteAddress(newValue);
    }
    onChange?.(newValue);
  };

  // Auto-fill user data on mount
  useEffect(() => {
    let isMounted = true;

    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !isMounted) return;

        const userId = getUserIdFromJwt(token);
        if (!userId) return;

        const userData = await getUserById(userId);
        console.log("User data fetched for autofill:", userData);

        // Autofill if form is empty and component is still mounted
        if (isMounted && !userDataLoaded) {
          const autofillData = {
            fullName: userData.data?.fullName || userData.fullName || "",
            phone: userData.data?.phoneNumber || userData.phoneNumber || "",
          };

          console.log("Autofilling address form with:", autofillData);

          // Merge autofill data with existing values
          onChange?.({ ...v, ...autofillData });
          setUserDataLoaded(true);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();

    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const err = {
    fullName: !v.fullName?.trim() ? "Vui lòng nhập họ tên" : "",
    phone: !/^0\d{9}$/.test(v.phone || "") ? "SĐT 10 số, bắt đầu bằng 0" : "",
    address: !v.address?.trim() ? "Vui lòng nhập địa chỉ" : "",
    ward: !v.ward?.trim() ? "Vui lòng nhập phường/xã" : "",
    district: !v.district?.trim() ? "Vui lòng nhập quận/huyện" : "",
    province: !v.province?.trim() ? "Vui lòng nhập tỉnh/thành phố" : "",
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
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập phường/xã"
              value={v.ward || ""}
              onValueChange={(val) => setWithAddressUpdate("ward", val)}
              onBlur={() => markTouched("ward")}
              isInvalid={!!showErr("ward")}
              variant="bordered"
            />
            {showErr("ward") && (
              <span className="text-sm text-red-600">{showErr("ward")}</span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Quận/Huyện <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập quận/huyện"
              value={v.district || ""}
              onValueChange={(val) => setWithAddressUpdate("district", val)}
              onBlur={() => markTouched("district")}
              isInvalid={!!showErr("district")}
              variant="bordered"
            />
            {showErr("district") && (
              <span className="text-sm text-red-600">
                {showErr("district")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Tỉnh/Thành phố <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Nhập tỉnh/thành phố"
              value={v.province || ""}
              onValueChange={(val) => setWithAddressUpdate("province", val)}
              onBlur={() => markTouched("province")}
              isInvalid={!!showErr("province")}
              variant="bordered"
            />
            {showErr("province") && (
              <span className="text-sm text-red-600">
                {showErr("province")}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Ấp/Thôn</label>
            <Input
              placeholder="Nhập ấp/thôn"
              value={v.hamlet || ""}
              onValueChange={(val) => setWithAddressUpdate("hamlet", val)}
              variant="bordered"
            />
          </div>

          {/* Display Complete Address */}
          {v.completeAddress && (
            <div className="md:col-span-2 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
              <label className="text-sm font-medium text-emerald-800 mb-2 block">
                Địa chỉ đầy đủ:
              </label>
              <p className="text-sm text-gray-700">{v.completeAddress}</p>
            </div>
          )}

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
