import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Textarea,
  Checkbox,
  Spinner,
} from "@nextui-org/react";
import { getUserById } from "../../services/userApi";
import { getUserIdFromJwt } from "../../utils/jwt";
import toast from "react-hot-toast";

export default function AddressForm({
  value,
  onChange,
  className = "",
  title = "Địa chỉ giao hàng",
  showSave = true,
}) {
  const v = value || {};
  const set = (k, val) => onChange?.({ ...v, [k]: val });
  const setMany = (updates) => onChange?.({ ...v, ...updates });

  const [touched, setTouched] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
  const [userDataLoaded, setUserDataLoaded] = useState(false);

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

  // Fetch provinces from Vietnam Province API (using secure proxy)
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoadingProvinces(true);
      try {
        const response = await fetch("/api/location/p/");
        const data = await response.json();
        setProvinces(data);
      } catch (error) {
        console.error("Error fetching provinces:", error);
        toast.error("Không thể tải danh sách tỉnh/thành phố");
      } finally {
        setLoadingProvinces(false);
      }
    };

    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (!v.provinceCode) {
      setDistricts([]);
      return;
    }

    const fetchDistricts = async () => {
      setLoadingDistricts(true);
      try {
        const response = await fetch(
          `/api/location/p/${v.provinceCode}?depth=2`
        );
        const data = await response.json();
        setDistricts(data.districts || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        toast.error("Không thể tải danh sách quận/huyện");
      } finally {
        setLoadingDistricts(false);
      }
    };

    fetchDistricts();
  }, [v.provinceCode]);

  // Fetch wards when district changes
  useEffect(() => {
    if (!v.districtCode) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      setLoadingWards(true);
      try {
        const response = await fetch(
          `/api/location/d/${v.districtCode}?depth=2`
        );
        const data = await response.json();
        setWards(data.wards || []);
      } catch (error) {
        console.error("Error fetching wards:", error);
        toast.error("Không thể tải danh sách phường/xã");
      } finally {
        setLoadingWards(false);
      }
    };

    fetchWards();
  }, [v.districtCode]);

  const err = {
    fullName: !v.fullName?.trim() ? "Vui lòng nhập họ tên" : "",
    phone: !/^0\d{9}$/.test(v.phone || "") ? "SĐT 10 số, bắt đầu bằng 0" : "",
    address: !v.address?.trim() ? "Vui lòng nhập địa chỉ" : "",
    province: !v.province ? "Chọn tỉnh/thành" : "",
    district: !v.district ? "Chọn quận/huyện" : "",
    ward: !v.ward ? "Chọn phường/xã" : "",
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
              selectedKeys={v.province ? new Set([v.province]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedKeys = Array.from(keys);
                const selectedProvinceName = selectedKeys[0];
                const province = provinces.find(
                  (p) => p.name === selectedProvinceName
                );
                console.log(
                  "🏙️ Province selected:",
                  selectedProvinceName,
                  province
                );
                // Single atomic update to avoid stale merges
                setMany({
                  province: selectedProvinceName || "",
                  provinceCode: province?.code || "",
                  district: "",
                  districtCode: "",
                  ward: "",
                  wardCode: "",
                });
              }}
              onBlur={() => markTouched("province")}
              isInvalid={!!showErr("province")}
              variant="bordered"
              selectionMode="single"
              isLoading={loadingProvinces}
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {provinces.map((prov) => (
                <SelectItem key={prov.name} value={prov.name}>
                  {prov.name}
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
              selectedKeys={v.district ? new Set([v.district]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedKeys = Array.from(keys);
                const selectedDistrictName = selectedKeys[0];
                const district = districts.find(
                  (d) => d.name === selectedDistrictName
                );
                // Single atomic update to avoid stale merges
                setMany({
                  district: selectedDistrictName || "",
                  districtCode: district?.code || "",
                  ward: "",
                  wardCode: "",
                });
              }}
              onBlur={() => markTouched("district")}
              isInvalid={!!showErr("district")}
              variant="bordered"
              isDisabled={!v.provinceCode}
              isLoading={loadingDistricts}
              selectionMode="single"
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {districts.map((district) => (
                <SelectItem key={district.name} value={district.name}>
                  {district.name}
                </SelectItem>
              ))}
            </Select>
            {showErr("district") && (
              <span className="text-sm text-red-600">
                {showErr("district")}
              </span>
            )}
            {!v.provinceCode && (
              <span className="text-xs text-gray-500">
                Vui lòng chọn tỉnh/thành trước
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Phường/Xã <span className="text-red-500">*</span>
            </label>
            <Select
              placeholder="Chọn phường/xã"
              selectedKeys={v.ward ? new Set([v.ward]) : new Set()}
              onSelectionChange={(keys) => {
                const selectedKeys = Array.from(keys);
                const selectedWardName = selectedKeys[0];
                const ward = wards.find((w) => w.name === selectedWardName);
                // Single atomic update to avoid stale merges
                setMany({
                  ward: selectedWardName || "",
                  wardCode: ward?.code || "",
                });
              }}
              onBlur={() => markTouched("ward")}
              isInvalid={!!showErr("ward")}
              variant="bordered"
              isDisabled={!v.districtCode}
              isLoading={loadingWards}
              selectionMode="single"
              classNames={{
                trigger: "data-[hover=true]:bg-default-100",
                selectorIcon: "right-3",
              }}
            >
              {wards.map((ward) => (
                <SelectItem key={ward.name} value={ward.name}>
                  {ward.name}
                </SelectItem>
              ))}
            </Select>
            {showErr("ward") && (
              <span className="text-sm text-red-600">{showErr("ward")}</span>
            )}
            {!v.districtCode && (
              <span className="text-xs text-gray-500">
                Vui lòng chọn quận/huyện trước
              </span>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">
              Ấp/Thôn (tuỳ chọn)
            </label>
            <Input
              placeholder="Nhập ấp/thôn nếu có"
              value={v.hamlet || ""}
              onValueChange={(val) => set("hamlet", val)}
              variant="bordered"
            />
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
