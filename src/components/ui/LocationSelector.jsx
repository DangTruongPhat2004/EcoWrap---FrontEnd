// src/components/ui/LocationSelector.jsx
import React, { useState, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import {
  getProvinces,
  getDistrictsByProvince,
  getWardsByDistrict,
} from "../../services/locationApi";

/**
 * LocationSelector Component
 * Cascading dropdowns for Province > District > Ward selection
 *
 * @param {Object} props
 * @param {Object} props.value - Current selected values {provinceCode, districtCode, wardCode, provinceName, districtName, wardName}
 * @param {Function} props.onChange - Callback when selection changes
 * @param {Object} props.errors - Validation error messages {province, district, ward}
 * @param {Function} props.onBlur - Callback when fields lose focus
 * @param {boolean} props.isDisabled - Disable all dropdowns
 * @param {string} props.variant - Select variant (default: "bordered")
 */
export default function LocationSelector({
  value = {},
  onChange,
  errors = {},
  onBlur,
  isDisabled = false,
  variant = "bordered",
}) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loading, setLoading] = useState({
    provinces: false,
    districts: false,
    wards: false,
  });

  // Fetch provinces on mount
  useEffect(() => {
    const fetchProvinces = async () => {
      setLoading((prev) => ({ ...prev, provinces: true }));
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Error loading provinces:", error);
      } finally {
        setLoading((prev) => ({ ...prev, provinces: false }));
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when province changes
  useEffect(() => {
    if (value.provinceCode) {
      const fetchDistricts = async () => {
        setLoading((prev) => ({ ...prev, districts: true }));
        try {
          const data = await getDistrictsByProvince(value.provinceCode);
          setDistricts(data);
        } catch (error) {
          console.error("Error loading districts:", error);
          setDistricts([]);
        } finally {
          setLoading((prev) => ({ ...prev, districts: false }));
        }
      };
      fetchDistricts();
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [value.provinceCode]);

  // Fetch wards when district changes
  useEffect(() => {
    if (value.districtCode) {
      const fetchWards = async () => {
        setLoading((prev) => ({ ...prev, wards: true }));
        try {
          const data = await getWardsByDistrict(value.districtCode);
          setWards(data);
        } catch (error) {
          console.error("Error loading wards:", error);
          setWards([]);
        } finally {
          setLoading((prev) => ({ ...prev, wards: false }));
        }
      };
      fetchWards();
    } else {
      setWards([]);
    }
  }, [value.districtCode]);

  const handleProvinceChange = (selectedCode) => {
    const selectedProvince = provinces.find(
      (p) => p.code === Number(selectedCode)
    );
    onChange?.({
      provinceCode: selectedCode,
      provinceName: selectedProvince?.name || "",
      districtCode: "",
      districtName: "",
      wardCode: "",
      wardName: "",
    });
  };

  const handleDistrictChange = (selectedCode) => {
    const selectedDistrict = districts.find(
      (d) => d.code === Number(selectedCode)
    );
    onChange?.({
      ...value,
      districtCode: selectedCode,
      districtName: selectedDistrict?.name || "",
      wardCode: "",
      wardName: "",
    });
  };

  const handleWardChange = (selectedCode) => {
    const selectedWard = wards.find((w) => w.code === Number(selectedCode));
    onChange?.({
      ...value,
      wardCode: selectedCode,
      wardName: selectedWard?.name || "",
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Province Select */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Tỉnh/Thành phố <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Chọn tỉnh/thành phố"
          selectedKeys={value.provinceCode ? [String(value.provinceCode)] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            handleProvinceChange(selectedKey);
          }}
          onBlur={() => onBlur?.("province")}
          isInvalid={!!errors.province}
          errorMessage={errors.province}
          isDisabled={isDisabled || loading.provinces}
          variant={variant}
          classNames={{
            trigger: "min-h-[40px]",
          }}
        >
          {provinces.map((province) => (
            <SelectItem
              key={String(province.code)}
              value={String(province.code)}
            >
              {province.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* District Select */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Quận/Huyện <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Chọn quận/huyện"
          selectedKeys={value.districtCode ? [String(value.districtCode)] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            handleDistrictChange(selectedKey);
          }}
          onBlur={() => onBlur?.("district")}
          isInvalid={!!errors.district}
          errorMessage={errors.district}
          isDisabled={isDisabled || !value.provinceCode || loading.districts}
          variant={variant}
          classNames={{
            trigger: "min-h-[40px]",
          }}
        >
          {districts.map((district) => (
            <SelectItem
              key={String(district.code)}
              value={String(district.code)}
            >
              {district.name}
            </SelectItem>
          ))}
        </Select>
      </div>

      {/* Ward Select */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-gray-700">
          Phường/Xã <span className="text-red-500">*</span>
        </label>
        <Select
          placeholder="Chọn phường/xã"
          selectedKeys={value.wardCode ? [String(value.wardCode)] : []}
          onSelectionChange={(keys) => {
            const selectedKey = Array.from(keys)[0];
            handleWardChange(selectedKey);
          }}
          onBlur={() => onBlur?.("ward")}
          isInvalid={!!errors.ward}
          errorMessage={errors.ward}
          isDisabled={isDisabled || !value.districtCode || loading.wards}
          variant={variant}
          classNames={{
            trigger: "min-h-[40px]",
          }}
        >
          {wards.map((ward) => (
            <SelectItem key={String(ward.code)} value={String(ward.code)}>
              {ward.name}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}
