import * as THREE from "three";

/**
 * Vietnamese Packaging 3D Models
 * Creates basic geometric models for common packaging types
 */

export const PACKAGING_TYPES = {
  CUP: "cup", // Cốc ly giấy
  BAG: "bag", // Túi giấy
  BOX: "box", // Hộp giấy
  POUCH: "pouch", // Túi đứng
};

/**
 * Layer definitions for each packaging type
 * Each layer represents a customizable surface
 */
export const PACKAGING_LAYERS = {
  [PACKAGING_TYPES.CUP]: [
    { id: "front", name: "Mặt trước", position: "front" },
    { id: "back", name: "Mặt sau", position: "back" },
    { id: "sleeve", name: "Vòng quanh", position: "wrap" },
  ],
  [PACKAGING_TYPES.BAG]: [
    { id: "front", name: "Mặt trước", position: "front" },
    { id: "back", name: "Mặt sau", position: "back" },
    { id: "left", name: "Cạnh trái", position: "left" },
    { id: "right", name: "Cạnh phải", position: "right" },
    { id: "bottom", name: "Đáy", position: "bottom" },
  ],
  [PACKAGING_TYPES.BOX]: [
    { id: "front", name: "Mặt trước", position: "front" },
    { id: "back", name: "Mặt sau", position: "back" },
    { id: "left", name: "Cạnh trái", position: "left" },
    { id: "right", name: "Cạnh phải", position: "right" },
    { id: "top", name: "Nắp trên", position: "top" },
    { id: "bottom", name: "Đáy", position: "bottom" },
  ],
  [PACKAGING_TYPES.POUCH]: [
    { id: "front", name: "Mặt trước", position: "front" },
    { id: "back", name: "Mặt sau", position: "back" },
  ],
};

/**
 * Create a paper cup model (Cốc ly giấy)
 */
export const createPaperCup = () => {
  const group = new THREE.Group();

  // Cup body - cylinder with slight taper
  const cupGeometry = new THREE.CylinderGeometry(0.6, 0.5, 1.5, 32);
  const cupMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.1,
  });
  const cup = new THREE.Mesh(cupGeometry, cupMaterial);
  cup.userData.layerId = "sleeve";
  group.add(cup);

  // Rim
  const rimGeometry = new THREE.TorusGeometry(0.6, 0.05, 16, 32);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.y = 0.75;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  return {
    model: group,
    layers: PACKAGING_LAYERS[PACKAGING_TYPES.CUP],
    type: PACKAGING_TYPES.CUP,
  };
};

/**
 * Create a paper bag model (Túi giấy)
 */
export const createPaperBag = () => {
  const group = new THREE.Group();

  // Main body
  const bodyGeometry = new THREE.BoxGeometry(1.5, 2, 1);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.05,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  group.add(body);

  // Handles
  const handleGeometry = new THREE.TorusGeometry(0.15, 0.03, 8, 16, Math.PI);
  const handleMaterial = new THREE.MeshStandardMaterial({
    color: 0xe8e8e8,
    roughness: 0.9,
  });

  const handle1 = new THREE.Mesh(handleGeometry, handleMaterial);
  handle1.position.set(-0.4, 1.1, 0.51);
  handle1.rotation.x = -Math.PI / 2;
  group.add(handle1);

  const handle2 = new THREE.Mesh(handleGeometry, handleMaterial);
  handle2.position.set(0.4, 1.1, 0.51);
  handle2.rotation.x = -Math.PI / 2;
  group.add(handle2);

  // Bottom gusset
  const gussetGeometry = new THREE.BoxGeometry(1.5, 0.3, 1);
  const gusset = new THREE.Mesh(gussetGeometry, bodyMaterial);
  gusset.position.y = -1.15;
  group.add(gusset);

  return {
    model: group,
    layers: PACKAGING_LAYERS[PACKAGING_TYPES.BAG],
    type: PACKAGING_TYPES.BAG,
  };
};

/**
 * Create a paper box model (Hộp giấy)
 */
export const createPaperBox = () => {
  const group = new THREE.Group();

  // Main box body
  const bodyGeometry = new THREE.BoxGeometry(1.8, 1.2, 1.8);
  const bodyMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.7,
    metalness: 0.1,
  });
  const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
  body.position.y = -0.3;
  group.add(body);

  // Lid
  const lidGeometry = new THREE.BoxGeometry(1.85, 0.4, 1.85);
  const lid = new THREE.Mesh(lidGeometry, bodyMaterial);
  lid.position.y = 0.5;
  group.add(lid);

  // Lid rim
  const rimGeometry = new THREE.BoxGeometry(1.75, 0.05, 1.75);
  const rimMaterial = new THREE.MeshStandardMaterial({
    color: 0xf5f5f5,
    roughness: 0.8,
  });
  const rim = new THREE.Mesh(rimGeometry, rimMaterial);
  rim.position.y = 0.3;
  group.add(rim);

  return {
    model: group,
    layers: PACKAGING_LAYERS[PACKAGING_TYPES.BOX],
    type: PACKAGING_TYPES.BOX,
  };
};

/**
 * Create a stand-up pouch model (Túi đứng)
 */
export const createStandUpPouch = () => {
  const group = new THREE.Group();

  // Create pouch shape using extrude geometry
  const shape = new THREE.Shape();

  // Front face shape - rounded rectangle
  shape.moveTo(-0.8, -1);
  shape.lineTo(-0.8, 0.7);
  shape.quadraticCurveTo(-0.8, 0.9, -0.6, 0.95);
  shape.lineTo(0.6, 0.95);
  shape.quadraticCurveTo(0.8, 0.9, 0.8, 0.7);
  shape.lineTo(0.8, -1);
  shape.lineTo(-0.8, -1);

  const extrudeSettings = {
    steps: 2,
    depth: 0.35,
    bevelEnabled: true,
    bevelThickness: 0.05,
    bevelSize: 0.05,
    bevelSegments: 3,
  };

  const pouchGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  const pouchMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.8,
    metalness: 0.05,
  });

  const pouch = new THREE.Mesh(pouchGeometry, pouchMaterial);
  pouch.position.z = -0.175;
  group.add(pouch);

  // Zipper closure at top
  const zipperGeometry = new THREE.BoxGeometry(1.4, 0.08, 0.4);
  const zipperMaterial = new THREE.MeshStandardMaterial({
    color: 0x444444,
    roughness: 0.5,
    metalness: 0.6,
  });
  const zipper = new THREE.Mesh(zipperGeometry, zipperMaterial);
  zipper.position.set(0, 0.95, 0);
  group.add(zipper);

  // Bottom gusset for stability
  const gussetGeometry = new THREE.BoxGeometry(1.6, 0.2, 0.35);
  const gusset = new THREE.Mesh(gussetGeometry, pouchMaterial);
  gusset.position.y = -1.1;
  group.add(gusset);

  return {
    model: group,
    layers: PACKAGING_LAYERS[PACKAGING_TYPES.POUCH],
    type: PACKAGING_TYPES.POUCH,
  };
};

/**
 * Factory function to create packaging by type
 */
export const createPackaging = (type) => {
  switch (type) {
    case PACKAGING_TYPES.CUP:
      return createPaperCup();
    case PACKAGING_TYPES.BAG:
      return createPaperBag();
    case PACKAGING_TYPES.BOX:
      return createPaperBox();
    case PACKAGING_TYPES.POUCH:
      return createStandUpPouch();
    default:
      return createPaperBox();
  }
};

/**
 * Store for layer-specific textures
 */
const layerTextures = new Map();

/**
 * Apply texture to specific layer of a packaging model
 */
export const applyTextureToLayer = (packagingModel, layerId, texture) => {
  const { model, type } = packagingModel;

  if (!model || !texture || !layerId) {
    console.warn(
      "PackagingModels: Missing required parameters for applyTextureToLayer"
    );
    return;
  }

  console.log(`PackagingModels: Applying texture to ${type} layer ${layerId}`);

  // Store texture for this layer
  const textureKey = `${type}-${layerId}`;
  layerTextures.set(textureKey, texture);

  // Configure texture properties
  texture.flipY = false;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;

  // Apply to different packaging types and layers
  switch (type) {
    case PACKAGING_TYPES.CUP:
      applyCupTexture(model, layerId, texture);
      break;
    case PACKAGING_TYPES.BAG:
      applyBagTexture(model, layerId, texture);
      break;
    case PACKAGING_TYPES.BOX:
      applyBoxTexture(model, layerId, texture);
      break;
    case PACKAGING_TYPES.POUCH:
      applyPouchTexture(model, layerId, texture);
      break;
    default:
      console.warn(`PackagingModels: Unknown packaging type: ${type}`);
      break;
  }
};

/**
 * Apply texture to cup layers
 */
const applyCupTexture = (model, layerId, texture) => {
  // Find the main cylinder body (largest cylinder, not the rim)
  let cupBody = null;
  let maxHeight = 0;

  model.children.forEach((child) => {
    if (child.geometry?.type === "CylinderGeometry") {
      const params = child.geometry.parameters;
      const height = params?.height || 0;
      if (height > maxHeight) {
        maxHeight = height;
        cupBody = child;
      }
    }
  });

  if (!cupBody) {
    console.warn("PackagingModels: Could not find cup body mesh");
    return;
  }

  // Clear any existing textures from rim (TorusGeometry)
  model.children.forEach((child) => {
    if (child.geometry?.type === "TorusGeometry") {
      if (child.material.map) {
        child.material.map.dispose();
        child.material.map = null;
        child.material.needsUpdate = true;
        console.log("PackagingModels: Cleared texture from cup rim");
      }
    }
  });

  switch (layerId) {
    case "sleeve":
    case "front":
    case "back": {
      // For cups, all these layers apply to the wrap-around surface
      // The cylinder only has one surface that wraps around
      if (cupBody.material.map) {
        cupBody.material.map.dispose();
      }
      cupBody.material.map = texture.clone();
      cupBody.material.needsUpdate = true;
      console.log(`PackagingModels: Applied texture to cup body ${layerId}`);
      break;
    }
    default:
      console.warn(`PackagingModels: Unknown cup layer: ${layerId}`);
  }
};

/**
 * Apply texture to bag layers
 */
const applyBagTexture = (model, layerId, texture) => {
  // Find the main body mesh (largest box, not handles or gusset)
  let bodyMesh = null;
  let maxVolume = 0;

  model.children.forEach((child) => {
    if (child.geometry?.type === "BoxGeometry") {
      const params = child.geometry.parameters;
      const volume =
        (params?.width || 0) * (params?.height || 0) * (params?.depth || 0);
      if (volume > maxVolume) {
        maxVolume = volume;
        bodyMesh = child;
      }
    }
  });

  if (!bodyMesh) {
    console.warn("PackagingModels: Could not find bag body mesh");
    return;
  }

  // Clear textures from other bag meshes (handles, gusset)
  model.children.forEach((child) => {
    if (child !== bodyMesh && child.geometry?.type === "BoxGeometry") {
      if (child.material.map) {
        child.material.map.dispose();
        child.material.map = null;
        child.material.needsUpdate = true;
        console.log("PackagingModels: Cleared texture from bag handle/gusset");
      }
    }
  });

  // Create materials array for different faces if not exists
  if (!Array.isArray(bodyMesh.material)) {
    const originalMaterial = bodyMesh.material;
    bodyMesh.material = [
      originalMaterial.clone(), // right (0)
      originalMaterial.clone(), // left (1)
      originalMaterial.clone(), // top (2)
      originalMaterial.clone(), // bottom (3)
      originalMaterial.clone(), // front (4)
      originalMaterial.clone(), // back (5)
    ];
  }

  const materials = bodyMesh.material;

  switch (layerId) {
    case "front": {
      if (materials[4]) {
        if (materials[4].map) materials[4].map.dispose();
        materials[4].map = texture.clone();
        materials[4].needsUpdate = true;
        console.log("PackagingModels: Applied texture to bag front (face 4)");
      }
      break;
    }
    case "back": {
      if (materials[5]) {
        if (materials[5].map) materials[5].map.dispose();
        materials[5].map = texture.clone();
        materials[5].needsUpdate = true;
        console.log("PackagingModels: Applied texture to bag back (face 5)");
      }
      break;
    }
    case "left": {
      if (materials[1]) {
        if (materials[1].map) materials[1].map.dispose();
        materials[1].map = texture.clone();
        materials[1].needsUpdate = true;
        console.log("PackagingModels: Applied texture to bag left (face 1)");
      }
      break;
    }
    case "right": {
      if (materials[0]) {
        if (materials[0].map) materials[0].map.dispose();
        materials[0].map = texture.clone();
        materials[0].needsUpdate = true;
        console.log("PackagingModels: Applied texture to bag right (face 0)");
      }
      break;
    }
    case "bottom": {
      if (materials[3]) {
        if (materials[3].map) materials[3].map.dispose();
        materials[3].map = texture.clone();
        materials[3].needsUpdate = true;
        console.log("PackagingModels: Applied texture to bag bottom (face 3)");
      }
      break;
    }
    default:
      console.warn(`PackagingModels: Unknown bag layer: ${layerId}`);
  }
};

/**
 * Apply texture to box layers
 */
const applyBoxTexture = (model, layerId, texture) => {
  // Similar to bag but also handle lid
  applyBagTexture(model, layerId, texture);

  // Also apply to lid if it's a top layer
  if (layerId === "top") {
    const lid = model.children.find(
      (child) => child.position.y > 0 && child.geometry?.type === "BoxGeometry"
    );
    if (lid) {
      if (!Array.isArray(lid.material)) {
        const originalMaterial = lid.material;
        lid.material = Array(6)
          .fill(null)
          .map(() => originalMaterial.clone());
      }
      if (lid.material[2]) {
        // top face
        if (lid.material[2].map) lid.material[2].map.dispose();
        lid.material[2].map = texture;
        lid.material[2].needsUpdate = true;
      }
    }
  }
};

/**
 * Apply texture to pouch layers
 */
const applyPouchTexture = (model, layerId, texture) => {
  const pouch = model.children.find(
    (child) => child.geometry?.type === "ExtrudeGeometry"
  );
  if (!pouch) {
    console.warn("PackagingModels: Could not find pouch mesh");
    return;
  }

  // Convert to materials array if needed (for front/back separation)
  if (!Array.isArray(pouch.material)) {
    const originalMaterial = pouch.material;
    // ExtrudeGeometry has 3 material groups: front, back, and sides
    pouch.material = [
      originalMaterial.clone(), // front face (0)
      originalMaterial.clone(), // back face (1)
      originalMaterial.clone(), // sides (2)
    ];
  }

  const materials = pouch.material;

  switch (layerId) {
    case "front": {
      if (materials[0]) {
        if (materials[0].map) materials[0].map.dispose();
        materials[0].map = texture.clone();
        materials[0].needsUpdate = true;
        console.log("PackagingModels: Applied texture to pouch front (face 0)");
      }
      break;
    }
    case "back": {
      if (materials[1]) {
        if (materials[1].map) materials[1].map.dispose();
        materials[1].map = texture.clone();
        materials[1].needsUpdate = true;
        console.log("PackagingModels: Applied texture to pouch back (face 1)");
      }
      break;
    }
    default:
      console.warn(`PackagingModels: Unknown pouch layer: ${layerId}`);
  }
};

/**
 * Get texture for a specific layer (useful for switching between layers)
 */
export const getLayerTexture = (packagingType, layerId) => {
  const textureKey = `${packagingType}-${layerId}`;
  return layerTextures.get(textureKey);
};

/**
 * Clear all stored textures (cleanup)
 */
export const clearLayerTextures = () => {
  for (const texture of layerTextures.values()) {
    if (texture && texture.dispose) {
      texture.dispose();
    }
  }
  layerTextures.clear();
};

export default {
  PACKAGING_TYPES,
  PACKAGING_LAYERS,
  createPackaging,
  applyTextureToLayer,
  createPaperCup,
  createPaperBag,
  createPaperBox,
  createStandUpPouch,
};
