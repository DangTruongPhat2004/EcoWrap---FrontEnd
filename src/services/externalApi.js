import axios from "axios";

/**
 * External API Services for Design Elements
 * Integrates with public APIs for colors, icons, and design assets
 */

// Color API - Using The Color API (free, no auth needed)
const colorApiClient = axios.create({
  baseURL: "https://www.thecolorapi.com",
  timeout: 10000,
});

// Unsplash API for images (requires API key)
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY || "demo";
const unsplashClient = axios.create({
  baseURL: "https://api.unsplash.com",
  timeout: 10000,
  headers: {
    Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
  },
});

// Iconify API for icons (free, no auth)
const iconifyClient = axios.create({
  baseURL: "https://api.iconify.design",
  timeout: 10000,
});

/**
 * Color Services
 */
export const colorService = {
  /**
   * Get color information from hex code
   */
  async getColorInfo(hexColor) {
    try {
      const cleanHex = hexColor.replace("#", "");
      const response = await colorApiClient.get(`/id?hex=${cleanHex}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching color info:", error);
      return null;
    }
  },

  /**
   * Get color scheme (complementary, analogous, etc.)
   */
  async getColorScheme(hexColor, mode = "analogic", count = 5) {
    try {
      const cleanHex = hexColor.replace("#", "");
      const response = await colorApiClient.get(
        `/scheme?hex=${cleanHex}&mode=${mode}&count=${count}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching color scheme:", error);
      return null;
    }
  },

  /**
   * Generate eco-friendly color palettes
   * Returns pre-defined eco-friendly color schemes
   */
  async getEcoPalettes() {
    // Pre-defined eco-friendly base colors
    const ecoColors = [
      "#10b981", // Emerald
      "#059669", // Green
      "#92400e", // Brown
      "#365314", // Olive
      "#0891b2", // Cyan
    ];

    try {
      const palettes = await Promise.all(
        ecoColors.map(async (color) => {
          const scheme = await this.getColorScheme(color, "analogic", 5);
          return scheme;
        })
      );
      return palettes.filter(Boolean);
    } catch (error) {
      console.error("Error generating eco palettes:", error);
      return [];
    }
  },

  /**
   * Get trending colors from Coolors API
   */
  async getTrendingPalettes() {
    // Fallback to pre-defined trending palettes
    return [
      {
        name: "Forest Fresh",
        colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2"],
      },
      {
        name: "Earth Tones",
        colors: ["#582f0e", "#7f4f24", "#936639", "#a68a64", "#b6ad90"],
      },
      {
        name: "Ocean Breeze",
        colors: ["#023047", "#126782", "#219ebc", "#8ecae6", "#b8e6f0"],
      },
      {
        name: "Sunset Glow",
        colors: ["#f77f00", "#fcbf49", "#eae2b7", "#d62828", "#003049"],
      },
    ];
  },
};

/**
 * Image Services (Unsplash)
 */
export const imageService = {
  /**
   * Search for images by query
   */
  async searchImages(query, page = 1, perPage = 20) {
    try {
      const response = await unsplashClient.get("/search/photos", {
        params: {
          query,
          page,
          per_page: perPage,
          orientation: "squarish",
        },
      });
      return {
        images: response.data.results.map((img) => ({
          id: img.id,
          url: img.urls.regular,
          thumb: img.urls.thumb,
          small: img.urls.small,
          description: img.description || img.alt_description,
          photographer: img.user.name,
          photographerUrl: img.user.links.html,
        })),
        total: response.data.total,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error("Error searching images:", error);
      return { images: [], total: 0, totalPages: 0 };
    }
  },

  /**
   * Get eco-friendly themed images
   */
  async getEcoImages(page = 1) {
    const queries = [
      "eco friendly",
      "sustainable",
      "nature",
      "green",
      "leaves",
    ];
    const randomQuery = queries[Math.floor(Math.random() * queries.length)];
    return this.searchImages(randomQuery, page, 20);
  },

  /**
   * Get pattern/texture images
   */
  async getPatterns(page = 1) {
    return this.searchImages("pattern texture", page, 20);
  },
};

/**
 * Icon Services (Iconify)
 */
export const iconService = {
  /**
   * Search icons by query
   */
  async searchIcons(query, limit = 50) {
    try {
      // Iconify search API
      const response = await axios.get(
        `https://api.iconify.design/search?query=${encodeURIComponent(
          query
        )}&limit=${limit}`
      );
      return response.data.icons || [];
    } catch (error) {
      console.error("Error searching icons:", error);
      return [];
    }
  },

  /**
   * Get icon SVG data
   */
  async getIconSvg(iconName) {
    try {
      const response = await iconifyClient.get(`/${iconName}.svg`);
      return response.data;
    } catch (error) {
      console.error("Error fetching icon SVG:", error);
      return null;
    }
  },

  /**
   * Get eco-friendly icons
   */
  async getEcoIcons() {
    const queries = ["leaf", "tree", "recycle", "eco", "nature", "plant"];
    const results = await Promise.all(
      queries.map((q) => this.searchIcons(q, 10))
    );
    return results.flat();
  },
};

/**
 * Shape/Element Services
 * Pre-defined SVG shapes and elements
 */
export const shapeService = {
  /**
   * Get basic shapes
   */
  getBasicShapes() {
    return [
      {
        id: "circle",
        name: "Circle",
        type: "circle",
        icon: "⚫",
      },
      {
        id: "square",
        name: "Square",
        type: "rect",
        icon: "⬛",
      },
      {
        id: "triangle",
        name: "Triangle",
        type: "triangle",
        icon: "▲",
      },
      {
        id: "star",
        name: "Star",
        type: "star",
        icon: "⭐",
      },
      {
        id: "heart",
        name: "Heart",
        type: "heart",
        icon: "❤️",
      },
    ];
  },

  /**
   * Get eco-themed elements
   */
  getEcoElements() {
    return [
      { id: "leaf1", icon: "🍃", name: "Leaf", category: "nature" },
      { id: "leaf2", icon: "🌿", name: "Herb", category: "nature" },
      { id: "tree", icon: "🌳", name: "Tree", category: "nature" },
      { id: "seedling", icon: "🌱", name: "Seedling", category: "nature" },
      { id: "recycle", icon: "♻️", name: "Recycle", category: "eco" },
      { id: "earth", icon: "🌍", name: "Earth", category: "eco" },
      { id: "sun", icon: "☀️", name: "Sun", category: "nature" },
      { id: "water", icon: "💧", name: "Water Drop", category: "nature" },
      { id: "flower", icon: "🌸", name: "Flower", category: "nature" },
      { id: "bamboo", icon: "🎋", name: "Bamboo", category: "eco" },
    ];
  },
};

/**
 * Pattern Service
 * Generate or fetch pattern URLs
 */
export const patternService = {
  /**
   * Get pattern from Patternico or similar services
   */
  async getPatterns() {
    // Using Hero Patterns (free SVG patterns)
    return [
      {
        id: "topography",
        name: "Topography",
        url: 'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="%2310b981" opacity="0.1"/%3E%3C/svg%3E',
      },
      {
        id: "leaf-pattern",
        name: "Leaf Pattern",
        url: 'data:image/svg+xml,%3Csvg width="100" height="100" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M0 0h100v100H0z" fill="%23059669" opacity="0.1"/%3E%3C/svg%3E',
      },
    ];
  },

  /**
   * Generate gradient patterns
   */
  getGradients() {
    return [
      {
        id: "green-blue",
        name: "Green to Blue",
        gradient: "linear-gradient(135deg, #10b981 0%, #0891b2 100%)",
      },
      {
        id: "earth-tone",
        name: "Earth Tone",
        gradient: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)",
      },
      {
        id: "forest",
        name: "Forest",
        gradient: "linear-gradient(135deg, #365314 0%, #84cc16 100%)",
      },
      {
        id: "sunset",
        name: "Sunset",
        gradient: "linear-gradient(135deg, #f59e0b 0%, #dc2626 100%)",
      },
    ];
  },
};

export default {
  colorService,
  imageService,
  iconService,
  shapeService,
  patternService,
};
