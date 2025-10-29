import React, { useState, useEffect } from "react";
import { Button, Input, Spinner } from "@nextui-org/react";
import { Palette, Pipette, RefreshCw } from "lucide-react";
import { colorService } from "../../services/externalApi";

const MauPanel = ({ canvasRef }) => {
  const [customColor, setCustomColor] = useState("#4ade80");
  const [trendingPalettes, setTrendingPalettes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Default color palettes
  const colorPalettes = {
    eco: {
      name: "Màu Eco",
      colors: [
        "#10b981",
        "#059669",
        "#047857",
        "#065f46",
        "#86efac",
        "#4ade80",
        "#22c55e",
        "#16a34a",
        "#dcfce7",
        "#bbf7d0",
        "#6ee7b7",
        "#34d399",
      ],
    },
    earth: {
      name: "Màu Đất",
      colors: [
        "#92400e",
        "#78350f",
        "#451a03",
        "#292524",
        "#d97706",
        "#b45309",
        "#a16207",
        "#854d0e",
        "#fef3c7",
        "#fde68a",
        "#fcd34d",
        "#fbbf24",
      ],
    },
    nature: {
      name: "Thiên Nhiên",
      colors: [
        "#365314",
        "#3f6212",
        "#4d7c0f",
        "#65a30d",
        "#84cc16",
        "#a3e635",
        "#bef264",
        "#d9f99d",
        "#164e63",
        "#155e75",
        "#0e7490",
        "#0891b2",
      ],
    },
  };

  // Load trending palettes on mount
  useEffect(() => {
    loadTrendingPalettes();
  }, []);

  const loadTrendingPalettes = async () => {
    setIsLoading(true);
    try {
      const palettes = await colorService.getTrendingPalettes();
      setTrendingPalettes(palettes);
    } catch (error) {
      console.error("Error loading trending palettes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleColorClick = (color) => {
    if (!canvasRef?.current) return;

    const canvas = canvasRef.current.getCanvas();
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
      if (activeObject.type === "i-text" || activeObject.type === "text") {
        activeObject.set("fill", color);
      } else {
        activeObject.set("fill", color);
      }
      canvas.renderAll();
    } else {
      // Set background color
      canvasRef.current.setBackgroundColor(color);
    }
  };

  const handleCustomColorChange = (e) => {
    const color = e.target.value;
    setCustomColor(color);
    handleColorClick(color);
  };

  const generateColorScheme = async (baseColor) => {
    setIsLoading(true);
    try {
      const scheme = await colorService.getColorScheme(
        baseColor,
        "analogic",
        6
      );
      if (scheme?.colors) {
        const newPalette = {
          name: "Generated Scheme",
          colors: scheme.colors.map((c) => c.hex.value),
        };
        setTrendingPalettes([newPalette, ...trendingPalettes.slice(0, 3)]);
      }
    } catch (error) {
      console.error("Error generating color scheme:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      {/* Color Picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Pipette className="w-4 h-4" />
          Chọn màu tùy chỉnh
        </label>
        <div className="flex gap-2">
          <input
            type="color"
            value={customColor}
            onChange={handleCustomColorChange}
            className="w-12 h-12 rounded cursor-pointer border-2 border-gray-200"
          />
          <Input
            value={customColor}
            onChange={(e) => setCustomColor(e.target.value)}
            placeholder="#000000"
            size="sm"
            className="flex-1"
          />
          <Button
            size="sm"
            isIconOnly
            variant="flat"
            onClick={() => generateColorScheme(customColor)}
            isDisabled={isLoading}
            title="Tạo bảng màu từ màu này"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Gradient Tool */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Gradient
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div
            className="h-12 rounded bg-gradient-to-r from-green-400 to-blue-500 cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
            onClick={() => handleColorClick("#4ade80")}
          />
          <div
            className="h-12 rounded bg-gradient-to-r from-yellow-400 to-orange-500 cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
            onClick={() => handleColorClick("#fbbf24")}
          />
          <div
            className="h-12 rounded bg-gradient-to-r from-purple-400 to-pink-500 cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
            onClick={() => handleColorClick("#a855f7")}
          />
          <div
            className="h-12 rounded bg-gradient-to-r from-gray-700 to-gray-900 cursor-pointer border-2 border-transparent hover:border-green-500 transition-all"
            onClick={() => handleColorClick("#374151")}
          />
        </div>
      </div>

      {/* Trending Palettes from API */}
      {isLoading ? (
        <div className="flex justify-center py-4">
          <Spinner size="sm" />
        </div>
      ) : (
        trendingPalettes.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">
                Bảng màu xu hướng
              </h3>
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onClick={loadTrendingPalettes}
                title="Tải lại"
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            {trendingPalettes.map((palette, idx) => (
              <div key={idx} className="space-y-1">
                <p className="text-xs text-gray-600">{palette.name}</p>
                <div className="grid grid-cols-5 gap-1">
                  {palette.colors.map((color, colorIdx) => (
                    <button
                      key={colorIdx}
                      className="aspect-square rounded hover:scale-110 transition-transform border border-gray-200 hover:border-green-500"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorClick(color)}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Color Palettes */}
      {Object.entries(colorPalettes).map(([key, palette]) => (
        <div key={key} className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">{palette.name}</h3>
          <div className="grid grid-cols-4 gap-2">
            {palette.colors.map((color) => (
              <button
                key={color}
                className="aspect-square rounded hover:scale-110 transition-transform border-2 border-gray-200 hover:border-green-500"
                style={{ backgroundColor: color }}
                onClick={() => handleColorClick(color)}
                title={color}
              />
            ))}
          </div>
        </div>
      ))}

      {/* Quick Actions */}
      <div className="pt-4 border-t border-gray-200 space-y-2">
        <Button
          size="sm"
          variant="flat"
          className="w-full"
          onClick={() => handleColorClick("#ffffff")}
        >
          Đặt nền trắng
        </Button>
        <Button
          size="sm"
          variant="flat"
          className="w-full"
          onClick={() => handleColorClick("transparent")}
        >
          Trong suốt
        </Button>
      </div>

      {/* Info */}
      <div className="p-3 bg-blue-50 rounded-lg">
        <p className="text-xs text-blue-800">
          💡 <strong>Mẹo:</strong> Chọn một đối tượng trên canvas trước khi chọn
          màu để thay đổi màu của đối tượng đó. Nếu không chọn đối tượng nào,
          màu nền sẽ được thay đổi.
        </p>
      </div>
    </div>
  );
};

export default MauPanel;
