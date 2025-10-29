import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Button } from "@nextui-org/react";
import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from "lucide-react";

const MockupPanel = ({ canvasRef, embedded = false, zoom = 100 }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const controlsRef = useRef(null);
  const meshRef = useRef(null);
  const [mockupType, setMockupType] = useState("pouch"); // pouch | box | bag
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!mountRef.current) return;

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
    mountRef.current.appendChild(renderer.domElement);
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
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

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      scene.clear();
    };
  }, [mockupType]);

  // Update texture from canvas
  useEffect(() => {
    if (!canvasRef?.current || !meshRef.current) return;

    const updateTexture = () => {
      const fabricCanvas = canvasRef.current.getCanvas();
      if (!fabricCanvas) return;

      // Export canvas as image
      const dataURL = fabricCanvas.toDataURL({ format: "png", quality: 1 });

      const loader = new THREE.TextureLoader();
      loader.load(dataURL, (texture) => {
        if (meshRef.current) {
          meshRef.current.material.map = texture;
          meshRef.current.material.needsUpdate = true;
        }
      });
    };

    // Initial update
    updateTexture();

    // Update on canvas changes (with debounce)
    const timer = setInterval(updateTexture, 1000);
    return () => clearInterval(timer);
  }, [canvasRef]);

  const createMockup = (scene, type) => {
    // Remove existing mesh
    if (meshRef.current) {
      scene.remove(meshRef.current);
    }

    let geometry;
    let mesh;

    switch (type) {
      case "pouch":
        // Stand-up pouch geometry
        geometry = createPouchGeometry();
        break;
      case "box":
        // Box geometry
        geometry = new THREE.BoxGeometry(2, 2.5, 0.8);
        break;
      case "bag":
        // Bag geometry
        geometry = createBagGeometry();
        break;
      default:
        geometry = new THREE.PlaneGeometry(2, 2.5);
    }

    const material = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.7,
      metalness: 0.1,
      side: THREE.DoubleSide,
    });

    mesh = new THREE.Mesh(geometry, material);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    meshRef.current = mesh;

    // Add ground plane
    const groundGeometry = new THREE.PlaneGeometry(10, 10);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.3 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    ground.receiveShadow = true;
    scene.add(ground);
  };

  const createPouchGeometry = () => {
    // Create a custom pouch shape
    const shape = new THREE.Shape();

    // Bottom rounded rectangle
    shape.moveTo(-0.8, -1);
    shape.lineTo(-0.8, 0.8);
    shape.quadraticCurveTo(-0.8, 1, -0.6, 1);
    shape.lineTo(0.6, 1);
    shape.quadraticCurveTo(0.8, 1, 0.8, 0.8);
    shape.lineTo(0.8, -1);
    shape.lineTo(-0.8, -1);

    const extrudeSettings = {
      steps: 2,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 3,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  };

  const createBagGeometry = () => {
    // Simple bag shape
    const geometry = new THREE.BoxGeometry(2, 2.5, 1);
    return geometry;
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
            variant={mockupType === "pouch" ? "solid" : "flat"}
            color={mockupType === "pouch" ? "success" : "default"}
            onClick={() => setMockupType("pouch")}
            className="flex-1"
          >
            Túi đứng
          </Button>
          <Button
            size="sm"
            variant={mockupType === "box" ? "solid" : "flat"}
            color={mockupType === "box" ? "success" : "default"}
            onClick={() => setMockupType("box")}
            className="flex-1"
          >
            Hộp
          </Button>
          <Button
            size="sm"
            variant={mockupType === "bag" ? "solid" : "flat"}
            color={mockupType === "bag" ? "success" : "default"}
            onClick={() => setMockupType("bag")}
            className="flex-1"
          >
            Túi xách
          </Button>
        </div>

        {/* 3D View */}
        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-sm text-gray-500">Đang tải 3D...</div>
            </div>
          )}
          <div ref={mountRef} className="w-full h-full" />
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
          variant={mockupType === "pouch" ? "solid" : "flat"}
          color={mockupType === "pouch" ? "success" : "default"}
          onClick={() => setMockupType("pouch")}
        >
          Túi đứng
        </Button>
        <Button
          size="sm"
          variant={mockupType === "box" ? "solid" : "flat"}
          color={mockupType === "box" ? "success" : "default"}
          onClick={() => setMockupType("box")}
        >
          Hộp
        </Button>
        <Button
          size="sm"
          variant={mockupType === "bag" ? "solid" : "flat"}
          color={mockupType === "bag" ? "success" : "default"}
          onClick={() => setMockupType("bag")}
        >
          Túi xách
        </Button>
      </div>
    </div>
  );
};

export default MockupPanel;
