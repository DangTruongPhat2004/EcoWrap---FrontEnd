// src/services/productApi.js
import apiClient from "./apiClient";

/**
 * Transform backend product data to frontend-friendly format
 * @param {Object} product - Backend product object
 * @returns {Object} Transformed product object
 */
const transformProduct = (product) => {
  if (!product) return null;

  return {
    // Keep original backend fields
    ...product,
    // Add frontend-friendly aliases
    id: product.productId,
    name: product.productName,
    price: product.productPrice,
    description: product.productDescription,
    material: product.materialType,
    images: product.imageFile ? [product.imageFile] : [],
    inStock: product.productStatus === "In stock",
    category: product.category?.name || product.categoryId,
    // Keep original fields too for backward compatibility
  };
};

/**
 * Get all products
 * @returns {Promise} List of all products
 */
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/api/Product");
    const products = response.data;
    // Transform each product
    return Array.isArray(products) ? products.map(transformProduct) : [];
  } catch (error) {
    console.error("Error fetching all products:", error);
    throw error;
  }
};

/**
 * Get a product by ID
 * @param {string} productId - The product ID
 * @returns {Promise} Product details
 */
export const getProductById = async (productId) => {
  try {
    const response = await apiClient.get(`/api/Product/${productId}`);
    return transformProduct(response.data);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    throw error;
  }
};

/**
 * Get products by current seller (Seller only)
 * @returns {Promise} List of products for the current seller
 */
export const getMyProducts = async () => {
  try {
    const response = await apiClient.get("/api/Product/my-products");
    const products = response.data;
    return Array.isArray(products) ? products.map(transformProduct) : [];
  } catch (error) {
    console.error("Error fetching my products:", error);
    throw error;
  }
};

/**
 * Create a new product (Seller only)
 * @param {FormData} formData - The form data containing product info
 * @returns {Promise} Response from the API
 */
export const createProduct = async (formData) => {
  try {
    const response = await apiClient.post("/api/Product", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update a product (Seller only)
 * @param {string} productId - The product ID
 * @param {FormData} formData - The form data containing updated product info
 * @returns {Promise} Response from the API
 */
export const updateProduct = async (productId, formData) => {
  try {
    const response = await apiClient.put(
      `/api/Product/update/${productId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

/**
 * Delete a product (Seller only)
 * @param {string} productId - The product ID to delete
 * @returns {Promise} Response from the API
 */
export const deleteProduct = async (productId) => {
  try {
    const response = await apiClient.delete(`/api/Product/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
