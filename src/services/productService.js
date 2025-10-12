// src/services/productService.js
// Filter and utility data for product pages
// Note: Actual product data comes from backend API (see productApi.js)

// Categories for filtering
export const categories = [
  { id: "all", name: "Tất cả" },
  { id: "bag", name: "Túi giấy" },
  { id: "cup", name: "Cốc" },
  { id: "box", name: "Hộp" },
  { id: "straw", name: "Ống hút" },
  { id: "container", name: "Hộp đựng thực phẩm" },
];

// Price ranges for filtering
export const priceRanges = [
  { id: "all", name: "Tất cả", min: 0, max: Infinity },
  { id: "under-2000", name: "Dưới 2.000₫", min: 0, max: 2000 },
  { id: "2000-5000", name: "2.000₫ - 5.000₫", min: 2000, max: 5000 },
  { id: "5000-10000", name: "5.000₫ - 10.000₫", min: 5000, max: 10000 },
  { id: "over-10000", name: "Trên 10.000₫", min: 10000, max: Infinity },
];

// Materials for filtering
export const materials = [
  { id: "all", name: "Tất cả" },
  { id: "kraft", name: "Giấy kraft" },
  { id: "white-paper", name: "Giấy trắng" },
  { id: "bagasse", name: "Bã mía" },
  { id: "bamboo", name: "Tre" },
  { id: "recycled", name: "Giấy tái chế" },
];

// Common tags
export const tags = [
  "Túi giấy",
  "Thông Eco",
  "Xưởng EcoPack",
  "Thân thiện môi trường",
  "Phân hủy sinh học",
  "Tái chế",
];

export default {
  categories,
  priceRanges,
  materials,
  tags,
};
