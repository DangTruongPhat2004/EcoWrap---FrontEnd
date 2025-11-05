/**
 * Dieline API Service
 * Handles dieline SVG generation and localStorage storage
 */

const dielineApi = {
  /**
   * Save dieline SVG to localStorage and return data URL
   * @param {string} svgContent - The SVG content as string
   * @param {string} designId - The design ID for naming
   * @param {string} packagingType - The packaging type
   */
  async uploadDielineSVG(svgContent, designId, packagingType) {
    try {
      const fileName = `dieline-${designId}-${packagingType}-${Date.now()}.svg`;

      // Create data URL for the SVG
      const dataUrl = `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgContent))
      )}`;

      // Store in localStorage
      const dielineKey = `ecowrap_dieline_${designId}`;
      const dielineData = {
        fileName,
        svgContent,
        dataUrl,
        packagingType,
        createdAt: new Date().toISOString(),
        designId,
      };

      localStorage.setItem(dielineKey, JSON.stringify(dielineData));
      console.log("Dieline saved to localStorage:", fileName);

      return {
        success: true,
        url: dataUrl,
        filename: fileName,
        assetId: dielineKey,
        thumbnailUrl: dataUrl,
        fromLocalStorage: true,
      };
    } catch (error) {
      console.error("Failed to save dieline SVG:", error);

      // Fallback: just return data URL without saving
      const dataUrl = `data:image/svg+xml;base64,${btoa(
        unescape(encodeURIComponent(svgContent))
      )}`;

      return {
        success: false,
        url: dataUrl,
        error: error.message,
        fallback: true,
        filename: `dieline-${designId}-${packagingType}-fallback.svg`,
      };
    }
  },

  /**
   * Generate and upload dieline in one step
   * @param {object} layersData - All layers data from canvas
   * @param {string} packagingType - The packaging type
   * @param {string} designId - The design ID
   * @param {object} canvasRef - Canvas reference for rendering designs
   */
  async generateAndUploadDieline(
    layersData,
    packagingType,
    designId,
    canvasRef = null
  ) {
    try {
      // Dynamic import to avoid bundle size issues
      const { DielineGenerator } = await import("../utils/dielineGenerator");

      // Generate dieline with canvas reference
      const generator = new DielineGenerator(
        packagingType,
        layersData,
        canvasRef
      );
      const svgContent = await generator.generateProductionDieline();

      // Upload dieline
      const uploadResult = await this.uploadDielineSVG(
        svgContent,
        designId,
        packagingType
      );

      return {
        ...uploadResult,
        svgContent,
        packagingType,
        layersCount: Object.keys(layersData).length,
      };
    } catch (error) {
      console.error("Failed to generate and upload dieline:", error);
      throw new Error(`Dieline generation failed: ${error.message}`);
    }
  },

  /**
   * Preview dieline without uploading
   * @param {object} layersData - All layers data from canvas
   * @param {string} packagingType - The packaging type
   * @param {object} canvasRef - Canvas reference for rendering designs
   */
  async generateDielinePreview(layersData, packagingType, canvasRef = null) {
    try {
      const { DielineGenerator } = await import("../utils/dielineGenerator");

      const generator = new DielineGenerator(
        packagingType,
        layersData,
        canvasRef
      );
      const svgContent = await generator.generateDielineSVG();

      // Create blob URL for preview
      const svgBlob = new Blob([svgContent], { type: "image/svg+xml" });
      const previewUrl = URL.createObjectURL(svgBlob);

      return {
        success: true,
        previewUrl,
        svgContent,
        packagingType,
      };
    } catch (error) {
      console.error("Failed to generate dieline preview:", error);
      throw new Error(`Dieline preview failed: ${error.message}`);
    }
  },
};

export default dielineApi;
