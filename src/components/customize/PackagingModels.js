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
 * Apply texture to specific layer of a packaging model
 */
export const applyTextureToLayer = (packagingModel, layerId, texture) => {
  const { model, type } = packagingModel;

  if (!model || !texture) return;

  // Find the mesh corresponding to the layer
  switch (type) {
    case PACKAGING_TYPES.CUP:
      if (layerId === "sleeve") {
        const cup = model.children[0];
        if (cup) {
          cup.material.map = texture;
          cup.material.needsUpdate = true;
        }
      }
      break;

    case PACKAGING_TYPES.BAG:
    case PACKAGING_TYPES.BOX: {
      // For box and bag, apply texture to specific faces
      const bodyMesh = model.children[0];
      if (bodyMesh && bodyMesh.geometry) {
        // Apply texture based on UV mapping
        bodyMesh.material.map = texture;
        bodyMesh.material.needsUpdate = true;
      }
      break;
    }

    case PACKAGING_TYPES.POUCH: {
      if (layerId === "front" || layerId === "back") {
        const pouch = model.children[0];
        if (pouch) {
          pouch.material.map = texture;
          pouch.material.needsUpdate = true;
        }
      }
      break;
    }
    default:
      break;
  }
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
