import React, { useState, useEffect, useCallback, useRef } from "react";
import { Button, Slider } from "@nextui-org/react";
import {
  Paintbrush,
  Minus,
  Droplet,
  Eraser,
  Undo2,
  Redo2,
  MousePointer2,
} from "lucide-react";
import * as fabric from "fabric";

// Tool constants - inspired by fabric.js and Filerobot
const TOOLS = {
  SELECT: "select",
  BRUSH: "brush",
  LINE: "line",
  BUCKET: "bucket",
  ERASER: "eraser",
};

const BRUSH_DEFAULTS = {
  MIN_SIZE: 1,
  MAX_SIZE: 50,
  DEFAULT_SIZE: 5,
  DEFAULT_COLOR: "#000000",
  ERASER_COLOR: "#ffffff",
};

const CURSOR_STYLES = {
  [TOOLS.SELECT]: { default: "default", hover: "move" },
  [TOOLS.BRUSH]: { default: "crosshair", hover: "crosshair" },
  [TOOLS.LINE]: { default: "crosshair", hover: "crosshair" },
  [TOOLS.BUCKET]: { default: "pointer", hover: "pointer" },
  [TOOLS.ERASER]: { default: "not-allowed", hover: "not-allowed" },
};

// Preset color palette - eco-friendly colors
const COLOR_PRESETS = [
  "#000000", // Black
  "#FFFFFF", // White
  "#22C55E", // Green
  "#3B82F6", // Blue
  "#EF4444", // Red
  "#F59E0B", // Amber
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#6366F1", // Indigo
  "#84CC16", // Lime
];

/**
 * DrawingTools Component
 * Professional drawing tools implementation based on fabric.js and Filerobot patterns
 */
const DrawingTools = ({ canvasRef }) => {
  const [activeTool, setActiveTool] = useState(TOOLS.SELECT);
  const [brushSize, setBrushSize] = useState(BRUSH_DEFAULTS.DEFAULT_SIZE);
  const [brushColor, setBrushColor] = useState(BRUSH_DEFAULTS.DEFAULT_COLOR);

  // Refs to store current drawing state
  const drawingStateRef = useRef({
    isDrawing: false,
    startPoint: null,
    currentShape: null,
  });

  // Cleanup function to remove event listeners
  const cleanupEventListeners = useCallback((canvas) => {
    if (!canvas) return;
    canvas.off("mouse:down");
    canvas.off("mouse:move");
    canvas.off("mouse:up");
  }, []);

  // Update brush properties when settings change
  useEffect(() => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current.getCanvas();
    if (!canvas) return;

    // Initialize brush if it doesn't exist
    if (!canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
    }

    const brush = canvas.freeDrawingBrush;

    // Update brush settings based on active tool
    if (activeTool === TOOLS.BRUSH) {
      brush.width = brushSize;
      brush.color = brushColor;
      brush.strokeLineCap = "round";
      brush.strokeLineJoin = "round";
    } else if (activeTool === TOOLS.ERASER) {
      brush.width = brushSize;
      brush.color = BRUSH_DEFAULTS.ERASER_COLOR;
      brush.strokeLineCap = "round";
      brush.strokeLineJoin = "round";
    }
  }, [brushSize, brushColor, activeTool, canvasRef]);

  /**
   * Enable selection/move mode
   * Based on fabric.js default behavior
   */
  const enableSelectMode = useCallback((canvas) => {
    canvas.isDrawingMode = false;
    canvas.selection = true;

    // Make objects selectable except for helpers
    canvas.getObjects().forEach((obj) => {
      const isHelper =
        obj.name === "template-outline" || obj.name === "helper-line";
      obj.selectable = !isHelper;
      obj.evented = !isHelper;
    });

    canvas.renderAll();
  }, []);

  /**
   * Enable brush drawing mode
   * Pattern from fabric.js PencilBrush
   */
  const enableBrushMode = useCallback(
    (canvas) => {
      canvas.isDrawingMode = true;

      // Initialize brush if it doesn't exist
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }

      const brush = canvas.freeDrawingBrush;
      brush.width = brushSize;
      brush.color = brushColor;
      brush.strokeLineCap = "round";
      brush.strokeLineJoin = "round";

      canvas.renderAll();
    },
    [brushSize, brushColor]
  );

  /**
   * Enable line drawing mode
   * Custom implementation following fabric.js patterns
   */
  const enableLineMode = useCallback(
    (canvas) => {
      let line = null;
      let isDrawing = false;

      const onMouseDown = (options) => {
        isDrawing = true;
        const pointer = canvas.getPointer(options.e);

        line = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          strokeWidth: brushSize,
          stroke: brushColor,
          selectable: false,
          strokeLineCap: "round",
        });
        canvas.add(line);
      };

      const onMouseMove = (options) => {
        if (!isDrawing || !line) return;
        const pointer = canvas.getPointer(options.e);
        line.set({ x2: pointer.x, y2: pointer.y });
        canvas.renderAll();
      };

      const onMouseUp = () => {
        if (line) {
          line.selectable = true;
          line.setCoords();
        }
        isDrawing = false;
        line = null;
      };

      canvas.on("mouse:down", onMouseDown);
      canvas.on("mouse:move", onMouseMove);
      canvas.on("mouse:up", onMouseUp);
    },
    [brushSize, brushColor]
  );

  /**
   * Enable bucket fill mode
   * Simple flood-fill implementation
   */
  const enableBucketFill = useCallback(
    (canvas) => {
      const onMouseDown = (options) => {
        const target = canvas.findTarget(options.e);

        if (target && target.type !== "activeSelection") {
          // Fill existing object
          target.set("fill", brushColor);
          canvas.renderAll();
        } else if (!target) {
          // Create background rectangle
          const rect = new fabric.Rect({
            left: 0,
            top: 0,
            width: canvas.width,
            height: canvas.height,
            fill: brushColor,
            selectable: false,
            evented: false,
            name: "background-fill",
          });
          canvas.add(rect);
          canvas.sendObjectToBack(rect);
          canvas.renderAll();
        }
      };

      canvas.on("mouse:down", onMouseDown);
    },
    [brushColor]
  );

  /**
   * Enable eraser mode
   * Using white brush as simple eraser (can be enhanced with EraserBrush)
   */
  const enableEraserMode = useCallback(
    (canvas) => {
      canvas.isDrawingMode = true;

      // Initialize brush if it doesn't exist
      if (!canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      }

      const brush = canvas.freeDrawingBrush;
      brush.width = brushSize;
      brush.color = BRUSH_DEFAULTS.ERASER_COLOR;
      brush.strokeLineCap = "round";
      brush.strokeLineJoin = "round";

      canvas.renderAll();
    },
    [brushSize]
  );

  /**
   * Handle tool selection and initialization
   * Pattern based on fabric.js tool switching
   */
  const handleToolSelect = useCallback(
    (toolId) => {
      if (!canvasRef?.current) return;

      const canvas = canvasRef.current.getCanvas();
      if (!canvas) return;

      // Cleanup previous tool state
      cleanupEventListeners(canvas);
      drawingStateRef.current = {
        isDrawing: false,
        startPoint: null,
        currentShape: null,
      };

      // Reset canvas state
      canvas.isDrawingMode = false;
      canvas.selection = true;

      // Apply cursor styles
      const cursors = CURSOR_STYLES[toolId] || CURSOR_STYLES[TOOLS.SELECT];
      canvas.defaultCursor = cursors.default;
      canvas.hoverCursor = cursors.hover;

      // Activate the selected tool
      setActiveTool(toolId);

      switch (toolId) {
        case TOOLS.SELECT:
          enableSelectMode(canvas);
          break;
        case TOOLS.BRUSH:
          enableBrushMode(canvas);
          break;
        case TOOLS.LINE:
          enableLineMode(canvas);
          break;
        case TOOLS.BUCKET:
          enableBucketFill(canvas);
          break;
        case TOOLS.ERASER:
          enableEraserMode(canvas);
          break;
        default:
          enableSelectMode(canvas);
      }
    },
    [
      canvasRef,
      cleanupEventListeners,
      enableSelectMode,
      enableBrushMode,
      enableLineMode,
      enableBucketFill,
      enableEraserMode,
    ]
  );

  /**
   * Utility functions for canvas operations
   */
  const handleUndo = useCallback(() => {
    canvasRef?.current?.undo();
  }, [canvasRef]);

  const handleRedo = useCallback(() => {
    canvasRef?.current?.redo();
  }, [canvasRef]);

  const handleClearDrawing = useCallback(() => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current.getCanvas();
    if (!canvas) return;

    // Remove all drawing objects (paths and lines)
    const objects = canvas.getObjects();
    const drawingObjects = objects.filter(
      (obj) =>
        (obj.type === "path" || obj.type === "line") &&
        obj.name !== "template-outline" &&
        obj.name !== "helper-line"
    );

    drawingObjects.forEach((obj) => canvas.remove(obj));
    canvas.renderAll();
  }, [canvasRef]);

  const handleColorSelect = useCallback((color) => {
    setBrushColor(color);
  }, []);

  // Tool definitions with metadata
  const tools = [
    {
      id: TOOLS.SELECT,
      icon: MousePointer2,
      label: "Di chuyển/Chọn",
      color: "default",
      description: "Chọn và di chuyển đối tượng",
    },
    {
      id: TOOLS.BRUSH,
      icon: Paintbrush,
      label: "Bút vẽ",
      color: "primary",
      description: "Vẽ tự do trên canvas",
    },
    {
      id: TOOLS.LINE,
      icon: Minus,
      label: "Đường thẳng",
      color: "secondary",
      description: "Kéo để vẽ đường thẳng",
    },
    {
      id: TOOLS.BUCKET,
      icon: Droplet,
      label: "Đổ màu",
      color: "success",
      description: "Đổ màu vào hình",
    },
    {
      id: TOOLS.ERASER,
      icon: Eraser,
      label: "Tẩy",
      color: "danger",
      description: "Xóa các nét vẽ",
    },
  ];

  /**
   * Render component
   * UI structure inspired by Filerobot
   */
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700">Công cụ vẽ</h3>
        {activeTool && (
          <span className="text-xs text-gray-500">
            {tools.find((t) => t.id === activeTool)?.label}
          </span>
        )}
      </div>

      {/* Tool Selection Grid */}
      <div className="grid grid-cols-2 gap-2">
        {tools.map((tool) => {
          const isActive = activeTool === tool.id;
          return (
            <Button
              key={tool.id}
              size="sm"
              color={isActive ? tool.color : "default"}
              variant={isActive ? "solid" : "bordered"}
              startContent={<tool.icon className="w-4 h-4" />}
              onClick={() => handleToolSelect(tool.id)}
              className="justify-start"
              title={tool.description}
            >
              {tool.label}
            </Button>
          );
        })}
      </div>

      {/* Brush/Line/Eraser Settings */}
      {(activeTool === TOOLS.BRUSH ||
        activeTool === TOOLS.LINE ||
        activeTool === TOOLS.ERASER) && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          {/* Size Control */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-700">
                Kích thước
              </label>
              <span className="text-xs font-mono text-gray-600">
                {brushSize}px
              </span>
            </div>
            <Slider
              size="sm"
              step={1}
              minValue={BRUSH_DEFAULTS.MIN_SIZE}
              maxValue={BRUSH_DEFAULTS.MAX_SIZE}
              value={brushSize}
              onChange={setBrushSize}
              className="max-w-full"
              aria-label="Brush size"
            />
          </div>

          {/* Color Control (hide for eraser) */}
          {activeTool !== TOOLS.ERASER && (
            <div>
              <label className="text-xs font-medium text-gray-700 mb-2 block">
                Màu sắc
              </label>
              <div className="flex gap-2 items-center">
                <input
                  type="color"
                  value={brushColor}
                  onChange={(e) => setBrushColor(e.target.value)}
                  className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                  aria-label="Color picker"
                />
                <div className="flex-1">
                  <div className="text-xs font-mono text-gray-600">
                    {brushColor.toUpperCase()}
                  </div>
                  <div className="text-xs text-gray-500">Nhấp để chọn màu</div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bucket Fill Settings */}
      {activeTool === TOOLS.BUCKET && (
        <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">
              Màu đổ
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={brushColor}
                onChange={(e) => setBrushColor(e.target.value)}
                className="w-12 h-12 rounded-lg border-2 border-gray-300 cursor-pointer hover:border-gray-400 transition-colors"
                aria-label="Fill color picker"
              />
              <div className="flex-1">
                <div className="text-xs font-mono text-gray-600">
                  {brushColor.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-start gap-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
            <span className="text-lg">💡</span>
            <div>
              <strong>Mẹo:</strong> Nhấp vào đối tượng để đổ màu, hoặc nhấp vào
              nền để tô nền canvas
            </div>
          </div>
        </div>
      )}

      {/* Color Presets Palette */}
      {(activeTool === TOOLS.BRUSH ||
        activeTool === TOOLS.LINE ||
        activeTool === TOOLS.BUCKET) && (
        <div>
          <label className="text-xs font-medium text-gray-700 mb-2 block">
            Màu nhanh
          </label>
          <div className="grid grid-cols-6 gap-2">
            {COLOR_PRESETS.map((color) => {
              const isSelected =
                brushColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  onClick={() => handleColorSelect(color)}
                  className={`w-full aspect-square rounded-lg border-2 transition-all hover:scale-110 ${
                    isSelected
                      ? "border-gray-900 scale-110 ring-2 ring-offset-1 ring-gray-900"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                  aria-label={`Select color ${color}`}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          size="sm"
          variant="flat"
          isIconOnly
          onClick={handleUndo}
          title="Hoàn tác (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="flat"
          isIconOnly
          onClick={handleRedo}
          title="Làm lại (Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="flat"
          color="danger"
          onClick={handleClearDrawing}
          className="flex-1"
        >
          Xóa tất cả vẽ
        </Button>
      </div>

      {/* Help Section */}
      {activeTool && (
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-3 rounded-lg border border-gray-200">
          <div className="text-xs text-gray-700 space-y-1.5">
            <div className="flex items-start gap-2">
              <span className="font-semibold min-w-[80px]">
                {tools.find((t) => t.id === activeTool)?.label}:
              </span>
              <span className="text-gray-600">
                {tools.find((t) => t.id === activeTool)?.description}
              </span>
            </div>
            {activeTool === TOOLS.SELECT && (
              <div className="text-gray-500 mt-2">
                • Nhấp để chọn đối tượng
                <br />• Kéo để di chuyển đối tượng
              </div>
            )}
            {activeTool === TOOLS.LINE && (
              <div className="text-gray-500 mt-2">
                • Nhấp chuột và kéo để vẽ đường
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DrawingTools;
