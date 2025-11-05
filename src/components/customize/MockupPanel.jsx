import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@nextui-org/react";
import { RotateCw, ZoomIn, ZoomOut } from "lucide-react";
import { createPackaging, PACKAGING_TYPES } from "./PackagingModels";

const MockupPanel = ({
  canvasRef,
  embedded = false,
  packagingType = "box",
  activeLayerId,
}) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const packagingRef = useRef(null); // Store packaging model
  const animationFrameIdRef = useRef(null); // Store animation frame ID
  const [mockupType, setMockupType] = useState(
    packagingType || PACKAGING_TYPES.BOX
  );
  const [isLoading, setIsLoading] = useState(true);

  // Sync mockupType with packagingType prop changes
  useEffect(() => {
    if (packagingType && packagingType !== mockupType) {
      console.log(
        "MockupPanel: Syncing packaging type from",
        mockupType,
        "to",
        packagingType
      );
      setMockupType(packagingType);
    }
  }, [packagingType, mockupType]);

  useEffect(() => {
    if (!mountRef.current) {
      console.warn("MockupPanel: mountRef not ready");
      return;
    }

    console.log("MockupPanel: Initializing 3D scene with type:", mockupType);
    const currentMount = mountRef.current;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 5);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.4);
    pointLight.position.set(-5, 5, 0);
    scene.add(pointLight);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controlsRef.current = controls;

    // Create mockup geometry
    createMockup(scene, mockupType);
    console.log("MockupPanel: Created mockup model");

    // Animation loop
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    setIsLoading(false);
    console.log("MockupPanel: 3D scene initialized successfully");

    // Cleanup
    return () => {
      console.log("MockupPanel: Cleaning up 3D scene");
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
      window.removeEventListener("resize", handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [mockupType]);

  // Update texture from canvas - apply specific layer to specific model face
  useEffect(() => {
    if (!canvasRef?.current || !packagingRef.current || !activeLayerId) {
      console.log(
        "MockupPanel: Skipping texture update - missing dependencies",
        {
          hasCanvasRef: !!canvasRef?.current,
          hasPackagingRef: !!packagingRef.current,
          activeLayerId: activeLayerId,
        }
      );
      return;
    }

    console.log(
      "MockupPanel: Setting up texture updates for layer:",
      activeLayerId,
      "on packaging type:",
      mockupType
    );

    const updateTexture = async () => {
      if (!canvasRef?.current || !activeLayerId) {
        console.warn("MockupPanel: Missing dependencies in updateTexture");
        return;
      }

      try {
        let dataURL = null;

        // Try to export the specific layer
        if (canvasRef.current.exportLayerAsImage) {
          console.log("MockupPanel: Exporting layer as image:", activeLayerId);
          dataURL = await canvasRef.current.exportLayerAsImage(activeLayerId);
        } else if (canvasRef.current.getCanvas) {
          // Fallback: use current canvas content
          console.warn("MockupPanel: Using current canvas as fallback");
          const fabricCanvas = canvasRef.current.getCanvas();
          if (fabricCanvas) {
            dataURL = fabricCanvas.toDataURL({ format: "png", quality: 0.8 });
          }
        }

        // Check if we have valid image data (should start with data:image/png;base64,)
        if (
          dataURL &&
          dataURL !== "data:," &&
          dataURL.startsWith("data:image/")
        ) {
          console.log(
            "MockupPanel: Applying texture for layer:",
            activeLayerId
          );
          await applyTextureToModel(dataURL, activeLayerId);
        } else {
          console.log(
            "MockupPanel: No valid texture data for layer:",
            activeLayerId,
            "dataURL:",
            dataURL ? dataURL.substring(0, 50) : "null"
          );
        }
      } catch (error) {
        console.error("MockupPanel: Error updating texture:", error);
      }
    };

    const applyTextureToModel = async (dataURL, layerId) => {
      return new Promise((resolve) => {
        const loader = new THREE.TextureLoader();
        loader.load(
          dataURL,
          (texture) => {
            try {
              // Configure texture properly
              texture.flipY = false;
              texture.wrapS = THREE.ClampToEdgeWrapping;
              texture.wrapT = THREE.ClampToEdgeWrapping;
              texture.minFilter = THREE.LinearFilter;
              texture.magFilter = THREE.LinearFilter;

              // Apply texture to specific layer using the utility function
              if (packagingRef.current) {
                // Import the utility function dynamically
                import("./PackagingModels").then(({ applyTextureToLayer }) => {
                  applyTextureToLayer(packagingRef.current, layerId, texture);
                  console.log(
                    `MockupPanel: Applied texture to layer ${layerId} successfully`
                  );
                  resolve();
                });
              }
            } catch (error) {
              console.error("MockupPanel: Error applying texture:", error);
              resolve();
            }
          },
          undefined,
          (error) => {
            console.error("MockupPanel: Error loading texture:", error);
            resolve();
          }
        );
      });
    };

    // Debounced update function
    let updateTimer = null;
    const debouncedUpdate = () => {
      if (updateTimer) clearTimeout(updateTimer);
      updateTimer = setTimeout(updateTexture, 300);
    };

    // Initial update after a short delay
    const initialTimer = setTimeout(updateTexture, 800);

    // Listen for canvas changes if available
    const handleCanvasChange = () => {
      console.log("MockupPanel: Canvas change detected, updating texture...");
      debouncedUpdate();
    };

    // Capture canvas reference at the time of effect
    const currentCanvasRef = canvasRef.current;
    let fabricCanvas = null;

    // Set up canvas change listener
    if (currentCanvasRef && currentCanvasRef.getCanvas) {
      fabricCanvas = currentCanvasRef.getCanvas();
      if (fabricCanvas) {
        console.log(
          "MockupPanel: Setting up canvas event listeners for layer:",
          activeLayerId
        );
        fabricCanvas.on("object:modified", handleCanvasChange);
        fabricCanvas.on("object:added", handleCanvasChange);
        fabricCanvas.on("object:removed", handleCanvasChange);
        fabricCanvas.on("path:created", handleCanvasChange);
        fabricCanvas.on("after:render", handleCanvasChange);
      } else {
        console.warn("MockupPanel: Could not get fabric canvas instance");
      }
    } else {
      console.warn("MockupPanel: Canvas ref not ready for event listeners");
    }

    // Cleanup
    return () => {
      console.log(
        "MockupPanel: Cleaning up event listeners for layer:",
        activeLayerId
      );
      clearTimeout(initialTimer);
      if (updateTimer) clearTimeout(updateTimer);

      // Use captured reference for cleanup
      if (fabricCanvas) {
        fabricCanvas.off("object:modified", handleCanvasChange);
        fabricCanvas.off("object:added", handleCanvasChange);
        fabricCanvas.off("object:removed", handleCanvasChange);
        fabricCanvas.off("path:created", handleCanvasChange);
        fabricCanvas.off("after:render", handleCanvasChange);
      }
    };
  }, [canvasRef, activeLayerId, mockupType]); // Removed layersData to prevent excessive updates

  const createMockup = (scene, type) => {
    console.log("Creating packaging model of type:", type);

    // Remove existing packaging
    if (packagingRef.current) {
      scene.remove(packagingRef.current.model);
      console.log("Removed previous packaging model");
    }

    // Create new packaging model
    const packaging = createPackaging(type);
    if (!packaging || !packaging.model) {
      console.error("Failed to create packaging model for type:", type);
      return;
    }

    scene.add(packaging.model);
    packagingRef.current = packaging;
    console.log("Added packaging model to scene:", packaging.type);

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);
  };

  const handleResetView = () => {
    if (cameraRef.current && controlsRef.current) {
      cameraRef.current.position.set(0, 0, 5);
      controlsRef.current.reset();
    }
  };

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.max(
        2,
        cameraRef.current.position.z - 0.5
      );
    }
  };

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.z = Math.min(
        10,
        cameraRef.current.position.z + 0.5
      );
    }
  };

  if (embedded) {
    return (
      <div className="p-4 space-y-4">
        <div className="text-sm font-medium text-gray-700 mb-2">
          Xem trước 3D
        </div>

        {/* Mockup Type Selector */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={mockupType === PACKAGING_TYPES.CUP ? "solid" : "flat"}
            color={mockupType === PACKAGING_TYPES.CUP ? "success" : "default"}
            onClick={() => setMockupType(PACKAGING_TYPES.CUP)}
            className="flex-1"
          >
            Cốc ly
          </Button>
          <Button
            size="sm"
            variant={mockupType === PACKAGING_TYPES.BAG ? "solid" : "flat"}
            color={mockupType === PACKAGING_TYPES.BAG ? "success" : "default"}
            onClick={() => setMockupType(PACKAGING_TYPES.BAG)}
            className="flex-1"
          >
            Túi giấy
          </Button>
          <Button
            size="sm"
            variant={mockupType === PACKAGING_TYPES.BOX ? "solid" : "flat"}
            color={mockupType === PACKAGING_TYPES.BOX ? "success" : "default"}
            onClick={() => setMockupType(PACKAGING_TYPES.BOX)}
            className="flex-1"
          >
            Hộp
          </Button>
          <Button
            size="sm"
            variant={mockupType === PACKAGING_TYPES.POUCH ? "solid" : "flat"}
            color={mockupType === PACKAGING_TYPES.POUCH ? "success" : "default"}
            onClick={() => setMockupType(PACKAGING_TYPES.POUCH)}
            className="flex-1"
          >
            Túi đứng
          </Button>
        </div>

        {/* 3D View */}
        <div className="relative w-full h-80 bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="text-sm text-gray-500">Đang tải 3D...</div>
            </div>
          )}
          <div
            ref={mountRef}
            className="w-full h-full"
            style={{ minHeight: "320px" }}
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <Button size="sm" variant="flat" isIconOnly onClick={handleResetView}>
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="flat" isIconOnly onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="flat" isIconOnly onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          💡 Kéo để xoay, cuộn chuột để phóng to/thu nhỏ
        </p>
      </div>
    );
  }

  // Full-screen mockup view
  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tạo mockup 3D...</p>
          </div>
        </div>
      )}

      <div ref={mountRef} className="w-full h-full" />

      {/* Floating controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button
          size="sm"
          variant="flat"
          className="bg-white shadow-md"
          startContent={<RotateCw className="w-4 h-4" />}
          onClick={handleResetView}
        >
          Đặt lại
        </Button>
      </div>

      {/* Mockup type switcher */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-lg shadow-lg p-2">
        <Button
          size="sm"
          variant={mockupType === PACKAGING_TYPES.CUP ? "solid" : "flat"}
          color={mockupType === PACKAGING_TYPES.CUP ? "success" : "default"}
          onClick={() => setMockupType(PACKAGING_TYPES.CUP)}
        >
          Cốc ly
        </Button>
        <Button
          size="sm"
          variant={mockupType === PACKAGING_TYPES.BAG ? "solid" : "flat"}
          color={mockupType === PACKAGING_TYPES.BAG ? "success" : "default"}
          onClick={() => setMockupType(PACKAGING_TYPES.BAG)}
        >
          Túi giấy
        </Button>
        <Button
          size="sm"
          variant={mockupType === PACKAGING_TYPES.BOX ? "solid" : "flat"}
          color={mockupType === PACKAGING_TYPES.BOX ? "success" : "default"}
          onClick={() => setMockupType(PACKAGING_TYPES.BOX)}
        >
          Hộp
        </Button>
        <Button
          size="sm"
          variant={mockupType === PACKAGING_TYPES.POUCH ? "solid" : "flat"}
          color={mockupType === PACKAGING_TYPES.POUCH ? "success" : "default"}
          onClick={() => setMockupType(PACKAGING_TYPES.POUCH)}
        >
          Túi đứng
        </Button>
      </div>
    </div>
  );
};

export default MockupPanel;
