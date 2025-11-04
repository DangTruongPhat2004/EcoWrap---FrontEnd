// src/services/locationApi.js
import axios from "axios";

/**
 * Location API Services for Vietnam provinces, districts, and wards
 * Using the open API: http://provinces.open-api.vn (HTTP to avoid SSL cert issues)
 */

const LOCATION_API_BASE = "http://provinces.open-api.vn/api";

/**
 * Get all provinces in Vietnam
 * @returns {Promise<Array>} List of provinces
 */
export const getProvinces = async () => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/p/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};

/**
 * Get all districts in a province
 * @param {number} provinceCode - Province code
 * @returns {Promise<Array>} List of districts
 */
export const getDistrictsByProvince = async (provinceCode) => {
  try {
    const response = await axios.get(
      `${LOCATION_API_BASE}/p/${provinceCode}?depth=2`
    );
    return response.data.districts || [];
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
};

/**
 * Get all wards in a district
 * @param {number} districtCode - District code
 * @returns {Promise<Array>} List of wards
 */
export const getWardsByDistrict = async (districtCode) => {
  try {
    const response = await axios.get(
      `${LOCATION_API_BASE}/d/${districtCode}?depth=2`
    );
    return response.data.wards || [];
  } catch (error) {
    console.error("Error fetching wards:", error);
    throw error;
  }
};

/**
 * Get province by code
 * @param {number} provinceCode - Province code
 * @returns {Promise<Object>} Province details
 */
export const getProvinceByCode = async (provinceCode) => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/p/${provinceCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching province:", error);
    throw error;
  }
};

/**
 * Get district by code
 * @param {number} districtCode - District code
 * @returns {Promise<Object>} District details
 */
export const getDistrictByCode = async (districtCode) => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/d/${districtCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching district:", error);
    throw error;
  }
};

/**
 * Get ward by code
 * @param {number} wardCode - Ward code
 * @returns {Promise<Object>} Ward details
 */
export const getWardByCode = async (wardCode) => {
  try {
    const response = await axios.get(`${LOCATION_API_BASE}/w/${wardCode}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching ward:", error);
    throw error;
  }
};
