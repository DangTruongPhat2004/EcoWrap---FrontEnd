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
    // Add seller information
    seller: product.seller
      ? {
          id: product.seller.sellerId,
          companyName: product.seller.companyName,
          address: product.seller.address,
          // Use product count from seller's products array if available
          productCount: product.seller.products?.length || 0,
          // For now, we'll need to calculate ratings per-seller by fetching all products
          // This is a temporary solution - ideally backend should provide aggregated stats
          rating: 0, // Will be calculated when displaying seller info
          reviewCount: 0, // Will be calculated when displaying seller info
          user: product.seller.user
            ? {
                id: product.seller.user.userId,
                username: product.seller.user.username,
                fullName: product.seller.user.fullName,
                phoneNumber: product.seller.user.phoneNumber,
                profilePicture: product.seller.user.profilePicture,
                isVerified: product.seller.user.isVerified,
              }
            : null,
        }
      : null,
    // Product-specific rating and reviews (not seller-wide)
    rating:
      product.reviews?.length > 0
        ? product.reviews.reduce((sum, r) => sum + r.rating, 0) /
          product.reviews.length
        : 0,
    reviewCount: product.reviews?.length || 0,
    // Keep original fields too for backward compatibility
  };
};

/**
 * Calculate seller-wide stats from all products
 * @param {number} sellerId - The seller ID
 * @param {Array} allProducts - All products in the system
 * @returns {Object} Seller stats (rating, reviewCount, productCount)
 */
export const calculateSellerStats = (sellerId, allProducts) => {
  if (!sellerId || !Array.isArray(allProducts)) {
    return { rating: 0, reviewCount: 0, productCount: 0 };
  }

  // Filter products by seller
  const sellerProducts = allProducts.filter(
    (p) => p.seller?.id === sellerId || p.sellerId === sellerId
  );

  if (sellerProducts.length === 0) {
    return { rating: 0, reviewCount: 0, productCount: 0 };
  }

  // Calculate total reviews and average rating
  let totalReviews = 0;
  let totalRating = 0;
  let productsWithReviews = 0;

  sellerProducts.forEach((product) => {
    const reviews = product.reviews || [];
    if (reviews.length > 0) {
      totalReviews += reviews.length;
      const productRating =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
      totalRating += productRating;
      productsWithReviews++;
    }
  });

  const averageRating =
    productsWithReviews > 0 ? totalRating / productsWithReviews : 0;

  return {
    rating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
    reviewCount: totalReviews,
    productCount: sellerProducts.length,
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
