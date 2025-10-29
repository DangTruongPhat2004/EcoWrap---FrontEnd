import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { Check, RotateCw, Box, LayoutGrid } from "lucide-react";

/**
 * LayerMinimap Component
 * Displays a visual 3D box representation with clickable layers
 */
const LayerMinimap = ({
  layers = [],
  activeLayerId,
  onLayerSelect,
  completedLayers = [],
  packagingType = "box",
}) => {
  const [rotationY, setRotationY] = useState(25);
  const [rotationX, setRotationX] = useState(-15);
  const [viewMode, setViewMode] = useState("3d"); // "3d" or "flat"

  const isCylindrical = packagingType === "cup";

  if (!layers || layers.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Chọn một loại bao bì để bắt đầu
      </div>
    );
  }

  const getLayerStyle = (layerId) => {
    const isActive = layerId === activeLayerId;
    const isCompleted = completedLayers.includes(layerId);

    if (isActive) {
      return "bg-green-500 text-white border-2 border-green-600 shadow-lg";
    } else if (isCompleted) {
      return "bg-blue-100 text-blue-700 border-2 border-blue-400";
    } else {
      return "bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200";
    }
  };

  const handleRotateLeft = () => {
    setRotationY((prev) => prev - 30);
  };

  const handleRotateRight = () => {
    setRotationY((prev) => prev + 30);
  };

  const handleRotateUp = () => {
    setRotationX((prev) => Math.max(-60, prev - 15));
  };

  const handleRotateDown = () => {
    setRotationX((prev) => Math.min(30, prev + 15));
  };

  const handleResetRotation = () => {
    setRotationY(25);
    setRotationX(-15);
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Chọn mặt để thiết kế
        </h3>
        <span className="text-xs text-gray-500">
          {completedLayers.length}/{layers.length}
        </span>
      </div>

      {/* View Mode Toggle */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Button
          size="sm"
          variant={viewMode === "3d" ? "solid" : "flat"}
          color={viewMode === "3d" ? "primary" : "default"}
          onClick={() => setViewMode("3d")}
          startContent={<Box className="w-3 h-3" />}
        >
          3D
        </Button>
        <Button
          size="sm"
          variant={viewMode === "flat" ? "solid" : "flat"}
          color={viewMode === "flat" ? "primary" : "default"}
          onClick={() => setViewMode("flat")}
          startContent={<LayoutGrid className="w-3 h-3" />}
        >
          Phẳng
        </Button>
      </div>

      {viewMode === "3d" ? (
        <>
          {/* Rotation Controls */}
          <div className="flex items-center justify-center gap-2 mb-2">
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              onClick={handleRotateLeft}
            >
              ←
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              onClick={handleRotateUp}
            >
              ↑
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              onClick={handleResetRotation}
            >
              <RotateCw className="w-3 h-3" />
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              onClick={handleRotateDown}
            >
              ↓
            </Button>
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              onClick={handleRotateRight}
            >
              →
            </Button>
          </div>

          {/* 3D Box Visual Representation */}
          <div className="relative flex items-center justify-center h-64">
            {/* Box visualization */}
            <div className="relative" style={{ perspective: "600px" }}>
              <div
                className="relative transition-transform duration-300"
                style={{
                  width: "180px",
                  height: "180px",
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`,
                }}
              >
                {/* Top */}
                {layers.find((l) => l.position === "top") && (
                  <button
                    onClick={() =>
                      onLayerSelect(layers.find((l) => l.position === "top").id)
                    }
                    className={`absolute inset-x-0 top-0 h-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "top").id
                    )}`}
                    style={{
                      transform: "translateZ(90px) rotateX(90deg)",
                      transformOrigin: "bottom",
                    }}
                  >
                    <span
                      className="block"
                      style={{ transform: "rotateX(-90deg)" }}
                    >
                      Nắp trên
                      {completedLayers.includes(
                        layers.find((l) => l.position === "top").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </span>
                  </button>
                )}

                {/* Front */}
                {layers.find((l) => l.position === "front") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "front").id
                      )
                    }
                    className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "front").id
                    )}`}
                    style={{
                      transform: "translateZ(90px)",
                    }}
                  >
                    Mặt trước
                    {completedLayers.includes(
                      layers.find((l) => l.position === "front").id
                    ) && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                )}

                {/* Back */}
                {layers.find((l) => l.position === "back") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "back").id
                      )
                    }
                    className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "back").id
                    )}`}
                    style={{
                      transform: "translateZ(-90px) rotateY(180deg)",
                    }}
                  >
                    Mặt sau
                    {completedLayers.includes(
                      layers.find((l) => l.position === "back").id
                    ) && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                )}

                {/* Left */}
                {layers.find((l) => l.position === "left") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "left").id
                      )
                    }
                    className={`absolute inset-y-0 left-0 w-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "left").id
                    )}`}
                    style={{
                      transform: "translateX(-90px) rotateY(-90deg)",
                      transformOrigin: "right",
                    }}
                  >
                    <span style={{ transform: "rotateY(90deg)" }}>
                      Trái
                      {completedLayers.includes(
                        layers.find((l) => l.position === "left").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </span>
                  </button>
                )}

                {/* Right */}
                {layers.find((l) => l.position === "right") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "right").id
                      )
                    }
                    className={`absolute inset-y-0 right-0 w-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "right").id
                    )}`}
                    style={{
                      transform: "translateX(90px) rotateY(90deg)",
                      transformOrigin: "left",
                    }}
                  >
                    <span style={{ transform: "rotateY(-90deg)" }}>
                      Phải
                      {completedLayers.includes(
                        layers.find((l) => l.position === "right").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </span>
                  </button>
                )}

                {/* Bottom */}
                {layers.find((l) => l.position === "bottom") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "bottom").id
                      )
                    }
                    className={`absolute inset-x-0 bottom-0 h-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "bottom").id
                    )}`}
                    style={{
                      transform: "translateZ(-90px) rotateX(-90deg)",
                      transformOrigin: "top",
                    }}
                  >
                    <span style={{ transform: "rotateX(90deg)" }}>
                      Đáy
                      {completedLayers.includes(
                        layers.find((l) => l.position === "bottom").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </span>
                  </button>
                )}

                {/* Wrap/Sleeve (for cups) */}
                {layers.find((l) => l.position === "wrap") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "wrap").id
                      )
                    }
                    className={`absolute inset-0 flex items-center justify-center text-sm font-medium transition-all cursor-pointer ${getLayerStyle(
                      layers.find((l) => l.position === "wrap").id
                    )}`}
                    style={{
                      transform: "translateZ(90px)",
                    }}
                  >
                    Vòng quanh
                    {completedLayers.includes(
                      layers.find((l) => l.position === "wrap").id
                    ) && <Check className="w-4 h-4 inline ml-1" />}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Flat 2D Dieline View */
        <div className="w-full px-4 py-6">
          {isCylindrical ? (
            /* Cylindrical Package Layout (Cup) - Horizontal wrap */
            <div className="space-y-3">
              <div className="text-center mb-4 text-xs text-gray-600 font-medium">
                Bao bì dạng trụ
              </div>

              {/* Wrap/Sleeve - Wide horizontal rectangle */}
              {layers.find((l) => l.position === "wrap") && (
                <button
                  onClick={() =>
                    onLayerSelect(layers.find((l) => l.position === "wrap").id)
                  }
                  className={`w-full h-28 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                    layers.find((l) => l.position === "wrap").id
                  )}`}
                >
                  <div className="text-center">
                    <div className="font-semibold">Vòng quanh cốc</div>
                    <div className="text-xs opacity-75 mt-1">
                      Thiết kế sẽ bao quanh
                    </div>
                    {completedLayers.includes(
                      layers.find((l) => l.position === "wrap").id
                    ) && <Check className="w-4 h-4 inline ml-2" />}
                  </div>
                </button>
              )}

              {/* Front and Back as separate areas */}
              <div className="grid grid-cols-2 gap-3">
                {layers.find((l) => l.position === "front") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "front").id
                      )
                    }
                    className={`h-20 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                      layers.find((l) => l.position === "front").id
                    )}`}
                  >
                    <div className="text-center">
                      <div>Mặt trước</div>
                      {completedLayers.includes(
                        layers.find((l) => l.position === "front").id
                      ) && <Check className="w-4 h-4 inline ml-1" />}
                    </div>
                  </button>
                )}

                {layers.find((l) => l.position === "back") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "back").id
                      )
                    }
                    className={`h-20 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                      layers.find((l) => l.position === "back").id
                    )}`}
                  >
                    <div className="text-center">
                      <div>Mặt sau</div>
                      {completedLayers.includes(
                        layers.find((l) => l.position === "back").id
                      ) && <Check className="w-4 h-4 inline ml-1" />}
                    </div>
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Box/Bag Dieline Layout - Grid-based for better responsiveness */
            <div className="space-y-3">
              <div className="text-center mb-4 text-xs text-gray-600 font-medium">
                Sơ đồ mặt bao bì
              </div>

              {/* Top */}
              {layers.find((l) => l.position === "top") && (
                <button
                  onClick={() =>
                    onLayerSelect(layers.find((l) => l.position === "top").id)
                  }
                  className={`w-full h-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                    layers.find((l) => l.position === "top").id
                  )}`}
                >
                  <div className="text-center">
                    <div>Nắp trên</div>
                    {completedLayers.includes(
                      layers.find((l) => l.position === "top").id
                    ) && <Check className="w-3 h-3 inline ml-1" />}
                  </div>
                </button>
              )}

              {/* Middle row: Left, Front, Right */}
              <div className="grid grid-cols-3 gap-2">
                {layers.find((l) => l.position === "left") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "left").id
                      )
                    }
                    className={`h-20 flex items-center justify-center text-xs font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                      layers.find((l) => l.position === "left").id
                    )}`}
                  >
                    <div className="text-center">
                      <div>Trái</div>
                      {completedLayers.includes(
                        layers.find((l) => l.position === "left").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </div>
                  </button>
                )}

                {layers.find((l) => l.position === "front") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "front").id
                      )
                    }
                    className={`h-20 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                      layers.find((l) => l.position === "front").id
                    )}`}
                  >
                    <div className="text-center">
                      <div>Trước</div>
                      {completedLayers.includes(
                        layers.find((l) => l.position === "front").id
                      ) && <Check className="w-4 h-4 inline ml-1" />}
                    </div>
                  </button>
                )}

                {layers.find((l) => l.position === "right") && (
                  <button
                    onClick={() =>
                      onLayerSelect(
                        layers.find((l) => l.position === "right").id
                      )
                    }
                    className={`h-20 flex items-center justify-center text-xs font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                      layers.find((l) => l.position === "right").id
                    )}`}
                  >
                    <div className="text-center">
                      <div>Phải</div>
                      {completedLayers.includes(
                        layers.find((l) => l.position === "right").id
                      ) && <Check className="w-3 h-3 inline ml-1" />}
                    </div>
                  </button>
                )}
              </div>

              {/* Back (full width if exists) */}
              {layers.find((l) => l.position === "back") && (
                <button
                  onClick={() =>
                    onLayerSelect(layers.find((l) => l.position === "back").id)
                  }
                  className={`w-full h-20 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                    layers.find((l) => l.position === "back").id
                  )}`}
                >
                  <div className="text-center">
                    <div>Mặt sau</div>
                    {completedLayers.includes(
                      layers.find((l) => l.position === "back").id
                    ) && <Check className="w-4 h-4 inline ml-1" />}
                  </div>
                </button>
              )}

              {/* Bottom */}
              {layers.find((l) => l.position === "bottom") && (
                <button
                  onClick={() =>
                    onLayerSelect(
                      layers.find((l) => l.position === "bottom").id
                    )
                  }
                  className={`w-full h-16 flex items-center justify-center text-xs font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                    layers.find((l) => l.position === "bottom").id
                  )}`}
                >
                  <div className="text-center">
                    <div>Đáy</div>
                    {completedLayers.includes(
                      layers.find((l) => l.position === "bottom").id
                    ) && <Check className="w-3 h-3 inline ml-1" />}
                  </div>
                </button>
              )}

              {/* Pouch layout - simpler */}
              {!layers.find((l) => l.position === "top") &&
                !layers.find((l) => l.position === "bottom") &&
                layers.length === 2 && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    {layers.map((layer) => (
                      <button
                        key={layer.id}
                        onClick={() => onLayerSelect(layer.id)}
                        className={`h-24 flex items-center justify-center text-sm font-medium transition-all cursor-pointer border-2 rounded-lg ${getLayerStyle(
                          layer.id
                        )}`}
                      >
                        <div className="text-center">
                          <div>{layer.name}</div>
                          {completedLayers.includes(layer.id) && (
                            <Check className="w-4 h-4 inline ml-1" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
            </div>
          )}
        </div>
      )}

      {/* Help Text */}
      <div className="mt-8 space-y-2">
        <div className="p-3 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 leading-relaxed">
            💡 <strong>Mẹo:</strong> Nhấp vào mỗi lớp để thiết kế riêng cho từng
            mặt bao bì. Thiết kế của bạn sẽ được tự động lưu.
          </p>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-semibold text-gray-700 mb-2">
            ⌨️ Phím tắt:
          </p>
          <div className="text-xs text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>Hoàn tác</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Ctrl+Z
              </span>
            </div>
            <div className="flex justify-between">
              <span>Làm lại</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Ctrl+Shift+Z
              </span>
            </div>
            <div className="flex justify-between">
              <span>Sao chép</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Ctrl+C
              </span>
            </div>
            <div className="flex justify-between">
              <span>Dán</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Ctrl+V
              </span>
            </div>
            <div className="flex justify-between">
              <span>Nhân đôi</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Ctrl+D
              </span>
            </div>
            <div className="flex justify-between">
              <span>Xóa</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                Delete
              </span>
            </div>
            <div className="flex justify-between">
              <span>Di chuyển</span>
              <span className="font-mono bg-white px-1.5 py-0.5 rounded">
                ←↑↓→
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Minimap Panel Wrapper with packaging type selector
 */
export const LayerMinimapPanel = ({
  packagingType,
  onPackagingTypeChange,
  layers,
  activeLayerId,
  onLayerSelect,
  completedLayers,
}) => {
  const packagingTypes = [
    { id: "cup", name: "Cốc ly", icon: "🥤" },
    { id: "bag", name: "Túi giấy", icon: "🛍️" },
    { id: "box", name: "Hộp giấy", icon: "📦" },
    { id: "pouch", name: "Túi đứng", icon: "🎒" },
  ];

  return (
    <div className="space-y-4">
      {/* Packaging Type Selector */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">
          Loại bao bì
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {packagingTypes.map((type) => (
            <Button
              key={type.id}
              size="sm"
              variant={packagingType === type.id ? "solid" : "flat"}
              color={packagingType === type.id ? "success" : "default"}
              onClick={() => onPackagingTypeChange(type.id)}
              className="h-auto py-2"
            >
              <div className="flex flex-col items-center">
                <span className="text-xl mb-1">{type.icon}</span>
                <span className="text-xs">{type.name}</span>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Layer Selection */}
      <LayerMinimap
        layers={layers}
        activeLayerId={activeLayerId}
        onLayerSelect={onLayerSelect}
        completedLayers={completedLayers}
        packagingType={packagingType}
      />
    </div>
  );
};

export default LayerMinimap;
