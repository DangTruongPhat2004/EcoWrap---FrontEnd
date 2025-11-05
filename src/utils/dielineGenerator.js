/**
 * Dieline SVG Generator
 * Converts Fabric.js canvas data to production-ready dieline SVG
 */

import { PACKAGING_LAYERS } from "../components/customize/PackagingModels";

export class DielineGenerator {
  constructor(packagingType, layersData, canvasRef = null) {
    this.packagingType = packagingType;
    this.layersData = layersData;
    this.canvasRef = canvasRef;
    this.layers = PACKAGING_LAYERS[packagingType] || [];
  }

  /**
   * Generate complete dieline SVG with all layers and designs
   */
  async generateDielineSVG() {
    const svgElements = [];
    let maxWidth = 800;
    let maxHeight = 600;

    // Add dieline template based on packaging type
    const { template, bounds } = this.getDielineTemplate();
    svgElements.push(template);

    maxWidth = bounds.width;
    maxHeight = bounds.height;

    // Process each layer and embed designs
    let yOffset = 0;
    for (const layer of this.layers) {
      const layerData = this.layersData[layer.id];
      if (layerData && layerData.objects && layerData.objects.length > 0) {
        const { elements, bounds: layerBounds } =
          await this.processLayerWithDesign(layer, layerData, yOffset);
        svgElements.push(...elements);
        yOffset += layerBounds.height + 50; // Add spacing between layers
        maxHeight = Math.max(maxHeight, yOffset);
      }
    }

    // Create SVG wrapper
    const svgContent = `
      <svg width="${maxWidth}" height="${maxHeight}" 
           xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink"
           viewBox="0 0 ${maxWidth} ${maxHeight}">
        <defs>
          <style>
            .dieline-cut { stroke: #FF0000; stroke-width: 2; fill: none; }
            .dieline-crease { stroke: #0000FF; stroke-width: 1; fill: none; stroke-dasharray: 5,5; }
            .print-area { fill-opacity: 1; }
            .layer-design { opacity: 0.9; }
          </style>
        </defs>
        ${svgElements.join("\n        ")}
      </svg>
    `.trim();

    return svgContent;
  }

  /**
   * Process layer and include rendered design
   */
  async processLayerWithDesign(layer, layerData, yOffset) {
    const elements = [];

    // Add layer label
    elements.push(`<!-- Layer: ${layer.name} -->`);
    elements.push(`<g id="layer-${layer.id}" class="design-layer">`);

    // Add layer title
    elements.push(
      `  <text x="50" y="${
        yOffset + 20
      }" font-size="14" font-weight="bold" fill="#333">Layer: ${
        layer.name
      }</text>`
    );

    // Render layer design if canvas reference is available
    if (this.canvasRef?.current) {
      try {
        const designImage = await this.renderLayerDesign(layer.id, layerData);
        if (designImage) {
          elements.push(
            `  <image x="50" y="${
              yOffset + 30
            }" width="400" height="400" href="${designImage}" class="layer-design" />`
          );
        }
      } catch (err) {
        console.error(`Failed to render layer ${layer.id}:`, err);
        elements.push(
          `  <text x="50" y="${
            yOffset + 50
          }" fill="#999" font-size="12">Failed to render design</text>`
        );
      }
    }

    // Process individual objects for detailed SVG conversion
    const objectElements = [];
    layerData.objects.forEach((obj, index) => {
      // Skip template objects
      if (obj.name === "template-outline" || obj.name === "helper-line") {
        return;
      }

      const element = this.convertFabricObjectToSVG(
        obj,
        `${layer.id}-obj-${index}`,
        yOffset + 30
      );
      if (element) {
        objectElements.push(`  ${element}`);
      }
    });

    if (objectElements.length > 0) {
      elements.push(...objectElements);
    }

    elements.push(`</g>`);

    return {
      elements,
      bounds: {
        width: 500,
        height: 450,
      },
    };
  }

  /**
   * Render layer design as data URL
   */
  async renderLayerDesign(layerId, layerData) {
    return new Promise((resolve) => {
      // Create temporary canvas
      const fabric = window.fabric;
      if (!fabric) {
        resolve(null);
        return;
      }

      const tempCanvas = new fabric.Canvas(document.createElement("canvas"), {
        width: 400,
        height: 400,
        backgroundColor: "#ffffff",
      });

      // Load layer data
      tempCanvas.loadFromJSON(layerData, () => {
        tempCanvas.renderAll();
        const dataUrl = tempCanvas.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 2,
        });
        tempCanvas.dispose();
        resolve(dataUrl);
      });
    });
  }

  /**
   * Convert Fabric.js object to SVG element
   */
  convertFabricObjectToSVG(obj, id, yOffset = 0) {
    // Add yOffset to all positions
    const offsetObj = { ...obj, top: (obj.top || 0) + yOffset };

    switch (obj.type) {
      case "rect":
        return this.createRectSVG(offsetObj, id);
      case "circle":
        return this.createCircleSVG(offsetObj, id);
      case "triangle":
        return this.createTriangleSVG(offsetObj, id);
      case "i-text":
      case "text":
        return this.createTextSVG(offsetObj, id);
      case "image":
        return this.createImageSVG(offsetObj, id);
      case "path":
        return this.createPathSVG(offsetObj, id);
      default:
        console.warn(`Unsupported object type for dieline: ${obj.type}`);
        return null;
    }
  }

  createRectSVG(obj, id) {
    const transform = this.getTransform(obj);
    return `<rect id="${id}" 
              x="${obj.left}" y="${obj.top}" 
              width="${obj.width * (obj.scaleX || 1)}" 
              height="${obj.height * (obj.scaleY || 1)}"
              fill="${obj.fill || "none"}" 
              stroke="${obj.stroke || "none"}"
              stroke-width="${obj.strokeWidth || 0}"
              class="print-area"
              ${transform} />`;
  }

  createCircleSVG(obj, id) {
    const r = obj.radius * (obj.scaleX || 1);
    const cx = obj.left + r;
    const cy = obj.top + r;
    const transform = this.getTransform(obj);

    return `<circle id="${id}" 
              cx="${cx}" cy="${cy}" r="${r}"
              fill="${obj.fill || "none"}" 
              stroke="${obj.stroke || "none"}"
              stroke-width="${obj.strokeWidth || 0}"
              class="print-area"
              ${transform} />`;
  }

  createTriangleSVG(obj, id) {
    const width = obj.width * (obj.scaleX || 1);
    const height = obj.height * (obj.scaleY || 1);
    const points = [
      [obj.left + width / 2, obj.top],
      [obj.left, obj.top + height],
      [obj.left + width, obj.top + height],
    ]
      .map((p) => p.join(","))
      .join(" ");

    const transform = this.getTransform(obj);
    return `<polygon id="${id}" 
              points="${points}"
              fill="${obj.fill || "none"}" 
              stroke="${obj.stroke || "none"}"
              stroke-width="${obj.strokeWidth || 0}"
              class="print-area"
              ${transform} />`;
  }

  createTextSVG(obj, id) {
    const fontSize = (obj.fontSize || 20) * (obj.scaleY || 1);
    const transform = this.getTransform(obj);

    return `<text id="${id}" 
              x="${obj.left}" y="${obj.top + fontSize * 0.8}"
              font-family="${obj.fontFamily || "Arial"}"
              font-size="${fontSize}"
              font-weight="${obj.fontWeight || "normal"}"
              font-style="${obj.fontStyle || "normal"}"
              fill="${obj.fill || "#000000"}"
              class="print-area"
              ${transform}>${this.escapeXml(obj.text || "")}</text>`;
  }

  createImageSVG(obj, id) {
    const width = (obj.width || 100) * (obj.scaleX || 1);
    const height = (obj.height || 100) * (obj.scaleY || 1);
    const transform = this.getTransform(obj);

    // For production dieline, we might want to reference the image or embed it
    return `<image id="${id}" 
              x="${obj.left}" y="${obj.top}"
              width="${width}" height="${height}"
              href="${obj.src || ""}"
              class="print-area"
              ${transform} />`;
  }

  createPathSVG(obj, id) {
    const transform = this.getTransform(obj);
    return `<path id="${id}" 
              d="${obj.path || ""}"
              fill="${obj.fill || "none"}" 
              stroke="${obj.stroke || "none"}"
              stroke-width="${obj.strokeWidth || 0}"
              class="print-area"
              ${transform} />`;
  }

  getTransform(obj) {
    const transforms = [];

    if (obj.angle && obj.angle !== 0) {
      const cx = obj.left + (obj.width * (obj.scaleX || 1)) / 2;
      const cy = obj.top + (obj.height * (obj.scaleY || 1)) / 2;
      transforms.push(`rotate(${obj.angle} ${cx} ${cy})`);
    }

    if (obj.flipX) transforms.push("scaleX(-1)");
    if (obj.flipY) transforms.push("scaleY(-1)");

    return transforms.length > 0 ? `transform="${transforms.join(" ")}"` : "";
  }

  getObjectBounds(obj) {
    return {
      left: obj.left || 0,
      top: obj.top || 0,
      width: (obj.width || 0) * (obj.scaleX || 1),
      height: (obj.height || 0) * (obj.scaleY || 1),
    };
  }

  /**
   * Get dieline template based on packaging type
   */
  getDielineTemplate() {
    const templates = {
      box: this.getBoxTemplate(),
      bag: this.getBagTemplate(),
      pouch: this.getPouchTemplate(),
      cup: this.getCupTemplate(),
      bottle: this.getBottleTemplate(),
    };

    return templates[this.packagingType] || templates.box;
  }

  getBoxTemplate() {
    return {
      template: `
      <!-- Box Dieline Template -->
      <g id="dieline-template" class="dieline-template">
        <text x="50" y="30" font-size="16" font-weight="bold" fill="#333">Box Packaging Dieline</text>
        <!-- Main faces -->
        <rect x="200" y="50" width="400" height="400" class="dieline-cut" />
        <!-- Flaps and tabs -->
        <rect x="200" y="10" width="400" height="40" class="dieline-cut" />
        <rect x="200" y="450" width="400" height="40" class="dieline-cut" />
        <rect x="160" y="50" width="40" height="400" class="dieline-cut" />
        <rect x="600" y="50" width="40" height="400" class="dieline-cut" />
        <!-- Crease lines -->
        <line x1="200" y1="50" x2="600" y2="50" class="dieline-crease" />
        <line x1="200" y1="450" x2="600" y2="450" class="dieline-crease" />
      </g>
    `,
      bounds: { width: 800, height: 550 },
    };
  }

  getBagTemplate() {
    return {
      template: `
      <!-- Bag Dieline Template -->
      <g id="dieline-template" class="dieline-template">
        <text x="50" y="30" font-size="16" font-weight="bold" fill="#333">Bag Packaging Dieline</text>
        <rect x="200" y="50" width="400" height="400" class="dieline-cut" />
        <!-- Handle areas -->
        <circle cx="300" cy="70" r="15" class="dieline-cut" />
        <circle cx="500" cy="70" r="15" class="dieline-cut" />
        <!-- Bottom fold -->
        <rect x="200" y="430" width="400" height="20" class="dieline-crease" />
      </g>
    `,
      bounds: { width: 800, height: 500 },
    };
  }

  getPouchTemplate() {
    return {
      template: `
      <!-- Pouch Dieline Template -->
      <g id="dieline-template" class="dieline-template">
        <text x="50" y="30" font-size="16" font-weight="bold" fill="#333">Pouch Packaging Dieline</text>
        <rect x="200" y="80" width="400" height="300" class="dieline-cut" />
        <!-- Seal area -->
        <rect x="200" y="60" width="400" height="20" class="dieline-crease" />
      </g>
    `,
      bounds: { width: 800, height: 420 },
    };
  }

  getCupTemplate() {
    return {
      template: `
      <!-- Cup Dieline Template (Cylindrical unwrap) -->
      <g id="dieline-template" class="dieline-template">
        <text x="50" y="30" font-size="16" font-weight="bold" fill="#333">Cup Packaging Dieline (Unwrapped)</text>
        <rect x="100" y="80" width="600" height="300" class="dieline-cut" />
        <!-- Bottom circle -->
        <circle cx="400" cy="410" r="100" class="dieline-cut" />
        <!-- Wrap indicators -->
        <line x1="400" y1="80" x2="400" y2="380" class="dieline-crease" />
      </g>
    `,
      bounds: { width: 800, height: 550 },
    };
  }

  getBottleTemplate() {
    return {
      template: `
      <!-- Bottle Label Template -->
      <g id="dieline-template" class="dieline-template">
        <text x="50" y="30" font-size="16" font-weight="bold" fill="#333">Bottle Label Dieline</text>
        <rect x="150" y="130" width="500" height="200" class="dieline-cut" rx="25" />
        <!-- Wrap indicators -->
        <line x1="400" y1="130" x2="400" y2="330" class="dieline-crease" />
      </g>
    `,
      bounds: { width: 800, height: 380 },
    };
  }

  escapeXml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Generate dieline for production (high-res, CMYK-ready)
   */
  async generateProductionDieline() {
    const svgContent = await this.generateDielineSVG();

    // Add production-specific metadata
    const productionSVG = svgContent.replace(
      "<svg",
      `<svg 
         data-production="true" 
         data-packaging-type="${this.packagingType}"
         data-created="${new Date().toISOString()}"
         data-layers="${this.layers.length}"`
    );

    return productionSVG;
  }
}

export default DielineGenerator;
