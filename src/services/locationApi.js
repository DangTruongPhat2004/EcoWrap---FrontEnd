// src/services/locationApi.js
import axios from "axios";

/**
 * Location API Services for Vietnam provinces, districts, and wards
 * Using alternative API: https://vapi.vnappmob.com (HTTPS compatible)
 * Fallback from provinces.open-api.vn due to SSL certificate issues
 */

const LOCATION_API_BASE = "https://vapi.vnappmob.com/api/province";

/**
 * Get all provinces in Vietnam
 * @returns {Promise<Array>} List of provinces with {province_id, province_name} format
 */
export const getProvinces = async () => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/`);
    // Map to common format: {code, name}
    return response.data.results.map((p) => ({
      code: p.province_id,
      name: p.province_name,
    }));
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

/**
 * Get all districts in a province
 * @param {string} provinceId - Province ID
 * @returns {Promise<Array>} List of districts
 */
export const getDistrictsByProvince = async (provinceId) => {
  try {
    const response = await axios.get(
      `${LOCATION_API_BASE}/district/${provinceId}`
    );
    // Map to common format: {code, name}
    return response.data.results.map((d) => ({
      code: d.district_id,
      name: d.district_name,
    }));
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

/**
 * Get all wards in a district
 * @param {string} districtId - District ID
 * @returns {Promise<Array>} List of wards
 */
export const getWardsByDistrict = async (districtId) => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/ward/${districtId}`);
    // Map to common format: {code, name}
    return response.data.results.map((w) => ({
      code: w.ward_id,
      name: w.ward_name,
    }));
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

/**
 * Note: The vnappmob API doesn't support getting individual province/district/ward by code
 * These functions are kept for API compatibility but may not work as expected
 */

export const getProvinceByCode = async (provinceId) => {
  try {
    // Fetch all provinces and find the one with matching ID
    const provinces = await getProvinces();
    return provinces.find((p) => p.code === provinceId);
  } catch (error) {
    console.error("Error fetching province:", error);
    throw error;
  }
};

export const getDistrictByCode = async (districtId) => {
  try {
    // Note: This requires knowing the province ID first
    console.warn(
      "getDistrictByCode requires province context with vnappmob API"
    );
    return null;
  } catch (error) {
    console.error("Error fetching district:", error);
    throw error;
  }
};

export const getWardByCode = async (wardId) => {
  try {
    // Note: This requires knowing the district ID first
    console.warn("getWardByCode requires district context with vnappmob API");
    return null;
  } catch (error) {
    console.error("Error fetching ward:", error);
    throw error;
  }
};
