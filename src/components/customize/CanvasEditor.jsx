import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import { fabric } from "fabric";

const CanvasEditor = forwardRef(
  ({ zoom = 100, onChange, onHistoryChange }, ref) => {
    const canvasContainerRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Initialize Fabric.js canvas
    useEffect(() => {
      if (!canvasContainerRef.current) return;

      const canvas = new fabric.Canvas("canvas", {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Add default dieline/template
      addDefaultTemplate(canvas);

      // Listen to canvas changes
      canvas.on("object:modified", () => {
        saveHistory();
        onChange?.();
      });

      canvas.on("object:added", () => {
        if (!isLoadingHistory) {
          saveHistory();
          onChange?.();
        }
      });

      canvas.on("object:removed", () => {
        if (!isLoadingHistory) {
          saveHistory();
          onChange?.();
        }
      });

      return () => {
        canvas.dispose();
      };
    }, []);

    // Handle zoom
    useEffect(() => {
      if (!fabricCanvasRef.current) return;
      const canvas = fabricCanvasRef.current;
      const zoomLevel = zoom / 100;
      canvas.setZoom(zoomLevel);
      canvas.renderAll();
    }, [zoom]);

    const addDefaultTemplate = (canvas) => {
      // Add a simple pouch template outline
      const template = new fabric.Rect({
        left: 200,
        top: 100,
        width: 400,
        height: 400,
        fill: "transparent",
        stroke: "#cccccc",
        strokeWidth: 2,
        strokeDashArray: [5, 5],
        selectable: false,
        evented: false,
        name: "template-outline",
      });
      canvas.add(template);
      canvas.sendToBack(template);
    };

    const saveHistory = () => {
      if (!fabricCanvasRef.current) return;

      const json = fabricCanvasRef.current.toJSON([
        "name",
        "assetId",
        "source",
        "kind",
      ]);
      const newHistory = history.slice(0, historyStep + 1);
      newHistory.push(JSON.stringify(json));

      setHistory(newHistory);
      setHistoryStep(newHistory.length - 1);

      onHistoryChange?.(historyStep > 0, false);
    };

    const loadFromHistory = (step) => {
      if (!fabricCanvasRef.current || !history[step]) return;

      setIsLoadingHistory(true);
      const canvas = fabricCanvasRef.current;

      canvas.loadFromJSON(history[step], () => {
        canvas.renderAll();
        setIsLoadingHistory(false);
        onHistoryChange?.(step > 0, step < history.length - 1);
      });
    };

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      // Add image to canvas
      addImage: (url, options = {}) => {
        fabric.Image.fromURL(
          url,
          (img) => {
            img.set({
              left: 300,
              top: 200,
              scaleX: 0.5,
              scaleY: 0.5,
              ...options,
            });
            fabricCanvasRef.current.add(img);
            fabricCanvasRef.current.setActiveObject(img);
            fabricCanvasRef.current.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      },

      // Add text to canvas
      addText: (text, options = {}) => {
        const textObj = new fabric.IText(text, {
          left: 300,
          top: 200,
          fontSize: 32,
          fontFamily: "Arial",
          fill: "#000000",
          ...options,
        });
        fabricCanvasRef.current.add(textObj);
        fabricCanvasRef.current.setActiveObject(textObj);
        fabricCanvasRef.current.renderAll();
      },

      // Add shape to canvas
      addShape: (shapeType, options = {}) => {
        let shape;
        const defaultOptions = {
          left: 300,
          top: 200,
          fill: "#4ade80",
          ...options,
        };

        switch (shapeType) {
          case "rect":
            shape = new fabric.Rect({
              ...defaultOptions,
              width: 100,
              height: 100,
            });
            break;
          case "circle":
            shape = new fabric.Circle({ ...defaultOptions, radius: 50 });
            break;
          case "triangle":
            shape = new fabric.Triangle({
              ...defaultOptions,
              width: 100,
              height: 100,
            });
            break;
          default:
            return;
        }

        fabricCanvasRef.current.add(shape);
        fabricCanvasRef.current.setActiveObject(shape);
        fabricCanvasRef.current.renderAll();
      },

      // Add pattern/texture
      addPattern: (url, options = {}) => {
        fabric.Image.fromURL(
          url,
          (img) => {
            const pattern = new fabric.Pattern({
              source: img.getElement(),
              repeat: "repeat",
            });

            const rect = new fabric.Rect({
              left: 300,
              top: 200,
              width: 200,
              height: 200,
              fill: pattern,
              ...options,
            });

            fabricCanvasRef.current.add(rect);
            fabricCanvasRef.current.setActiveObject(rect);
            fabricCanvasRef.current.renderAll();
          },
          { crossOrigin: "anonymous" }
        );
      },

      // Change background color
      setBackgroundColor: (color) => {
        fabricCanvasRef.current.backgroundColor = color;
        fabricCanvasRef.current.renderAll();
        saveHistory();
      },

      // Delete selected object
      deleteSelected: () => {
        const activeObject = fabricCanvasRef.current.getActiveObject();
        if (activeObject) {
          fabricCanvasRef.current.remove(activeObject);
          fabricCanvasRef.current.renderAll();
        }
      },

      // Undo
      undo: () => {
        if (historyStep > 0) {
          const newStep = historyStep - 1;
          setHistoryStep(newStep);
          loadFromHistory(newStep);
        }
      },

      // Redo
      redo: () => {
        if (historyStep < history.length - 1) {
          const newStep = historyStep + 1;
          setHistoryStep(newStep);
          loadFromHistory(newStep);
        }
      },

      // Load design from JSON
      loadDesign: (designData) => {
        if (!fabricCanvasRef.current) return;
        setIsLoadingHistory(true);

        fabricCanvasRef.current.loadFromJSON(designData, () => {
          fabricCanvasRef.current.renderAll();
          setIsLoadingHistory(false);
          saveHistory();
        });
      },

      // Export design as JSON
      exportDesign: () => {
        if (!fabricCanvasRef.current) return {};

        const json = fabricCanvasRef.current.toJSON([
          "name",
          "assetId",
          "source",
          "kind",
          "selectable",
          "evented",
        ]);

        // Extract used assets
        const usedAssets = [];
        fabricCanvasRef.current.getObjects().forEach((obj) => {
          if (obj.source === "user" || obj.source === "library") {
            usedAssets.push({
              url: obj.getSrc?.() || obj.assetId,
              source: obj.source,
              kind: obj.kind || "image",
              assetId: obj.assetId,
            });
          }
        });

        return {
          ...json,
          usedAssets,
        };
      },

      // Export as thumbnail
      exportThumbnail: async () => {
        if (!fabricCanvasRef.current) return null;

        return fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 0.8,
          multiplier: 0.3,
        });
      },

      // Export high-res for production
      exportHighRes: async () => {
        if (!fabricCanvasRef.current) return null;

        return fabricCanvasRef.current.toDataURL({
          format: "png",
          quality: 1,
          multiplier: 3,
        });
      },

      // Get canvas instance
      getCanvas: () => fabricCanvasRef.current,
    }));

    return (
      <div
        ref={canvasContainerRef}
        className="canvas-container bg-white shadow-lg rounded-lg overflow-hidden"
        style={{
          width: "fit-content",
          height: "fit-content",
        }}
      >
        <canvas id="canvas" />
      </div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;
