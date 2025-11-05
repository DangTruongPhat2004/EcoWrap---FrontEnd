import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useEffect,
  useState,
} from "react";
import * as fabric from "fabric";

const CanvasEditor = forwardRef(
  (
    {
      zoom = 100,
      onChange,
      onHistoryChange,
      activeLayerId,
      designId,
      packagingType,
    },
    ref
  ) => {
    const canvasContainerRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const [history, setHistory] = useState([]);
    const [historyStep, setHistoryStep] = useState(-1);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);

    // Store all layers data
    const layersDataRef = useRef({});
    const currentLayerRef = useRef(null);

    // Get localStorage key for this design
    const getStorageKey = React.useCallback(() => {
      const id = designId || "new-design";
      return `ecowrap-layers-${id}`;
    }, [designId]);

    // Save layers to localStorage
    const saveToLocalStorage = React.useCallback(() => {
      const storageKey = getStorageKey();
      try {
        // Save current layer data
        if (currentLayerRef.current && fabricCanvasRef.current) {
          const currentData = fabricCanvasRef.current.toJSON([
            "name",
            "assetId",
            "source",
            "kind",
          ]);
          layersDataRef.current[currentLayerRef.current] = currentData;
          console.log(
            "CanvasEditor: Saving layer",
            currentLayerRef.current,
            "to localStorage"
          );
        }

        localStorage.setItem(storageKey, JSON.stringify(layersDataRef.current));
        console.log(
          "CanvasEditor: Saved all layers to localStorage:",
          storageKey
        );
      } catch (error) {
        console.error("Failed to save layers to localStorage:", error);
      }
    }, [getStorageKey]);

    // Debounced save to localStorage (save after 1 second of inactivity)
    const debouncedSaveRef = useRef(null);
    const saveToLocalStorageDebounced = React.useCallback(() => {
      if (debouncedSaveRef.current) {
        clearTimeout(debouncedSaveRef.current);
      }
      debouncedSaveRef.current = setTimeout(() => {
        saveToLocalStorage();
      }, 1000);
    }, [saveToLocalStorage]);

    // Load layers from localStorage on mount
    useEffect(() => {
      const storageKey = getStorageKey();
      const savedLayers = localStorage.getItem(storageKey);
      if (savedLayers) {
        try {
          layersDataRef.current = JSON.parse(savedLayers);
          console.log("Loaded layers from localStorage:", storageKey);
        } catch (error) {
          console.error("Failed to load layers from localStorage:", error);
        }
      }
    }, [getStorageKey]);

    // Initialize Fabric.js canvas
    useEffect(() => {
      if (!canvasContainerRef.current) return;

      const container = canvasContainerRef.current;

      // Create canvas element
      const canvasElement = document.createElement("canvas");
      canvasElement.width = 800;
      canvasElement.height = 600;
      container.appendChild(canvasElement);

      const canvas = new fabric.Canvas(canvasElement, {
        width: 800,
        height: 600,
        backgroundColor: "#ffffff",
        preserveObjectStacking: true,
      });

      fabricCanvasRef.current = canvas;

      // Add default dieline/template
      addDefaultTemplate(canvas);

      // Create saveHistory function that also saves to localStorage
      const handleCanvasChange = () => {
        saveHistory();
        onChange?.();
        saveToLocalStorageDebounced();
      };

      // Listen to canvas changes
      canvas.on("object:modified", handleCanvasChange);

      canvas.on("object:added", () => {
        if (!isLoadingHistory) {
          handleCanvasChange();
        }
      });

      canvas.on("object:removed", () => {
        if (!isLoadingHistory) {
          handleCanvasChange();
        }
      });

      return () => {
        canvas.dispose();
        if (container && canvasElement) {
          container.removeChild(canvasElement);
        }
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

    // History functions - defined before keyboard shortcuts
    const saveHistory = React.useCallback(() => {
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
    }, [history, historyStep, onHistoryChange]);

    const loadFromHistory = React.useCallback(
      (step) => {
        if (!fabricCanvasRef.current || !history[step]) return;

        setIsLoadingHistory(true);
        const canvas = fabricCanvasRef.current;

        canvas.loadFromJSON(history[step], () => {
          canvas.renderAll();
          setIsLoadingHistory(false);
          onHistoryChange?.(step > 0, step < history.length - 1);
        });
      },
      [history, onHistoryChange]
    );

    // Keyboard shortcuts
    useEffect(() => {
      const handleKeyDown = (e) => {
        // Don't handle shortcuts if user is typing in an input/textarea
        if (
          e.target.tagName === "INPUT" ||
          e.target.tagName === "TEXTAREA" ||
          e.target.isContentEditable
        ) {
          return;
        }

        if (!fabricCanvasRef.current) return;

        const canvas = fabricCanvasRef.current;
        const activeObject = canvas.getActiveObject();

        // Ctrl/Cmd + Z - Undo
        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "z" &&
          !e.shiftKey
        ) {
          e.preventDefault();
          if (historyStep > 0) {
            const newStep = historyStep - 1;
            setHistoryStep(newStep);
            loadFromHistory(newStep);
          }
          return;
        }

        // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y - Redo
        if (
          ((e.ctrlKey || e.metaKey) &&
            e.shiftKey &&
            e.key.toLowerCase() === "z") ||
          ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y")
        ) {
          e.preventDefault();
          if (historyStep < history.length - 1) {
            const newStep = historyStep + 1;
            setHistoryStep(newStep);
            loadFromHistory(newStep);
          }
          return;
        }

        // Delete or Backspace - Delete selected object
        if ((e.key === "Delete" || e.key === "Backspace") && activeObject) {
          e.preventDefault();
          canvas.remove(activeObject);
          canvas.renderAll();
          return;
        }

        // Ctrl/Cmd + A - Select all
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "a") {
          e.preventDefault();
          canvas.discardActiveObject();
          const allObjects = canvas
            .getObjects()
            .filter((obj) => obj.selectable !== false);
          if (allObjects.length > 0) {
            const selection = new fabric.ActiveSelection(allObjects, {
              canvas: canvas,
            });
            canvas.setActiveObject(selection);
            canvas.renderAll();
          }
          return;
        }

        // Ctrl/Cmd + C - Copy
        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "c" &&
          activeObject
        ) {
          e.preventDefault();
          activeObject.clone((cloned) => {
            canvas._clipboard = cloned;
          });
          return;
        }

        // Ctrl/Cmd + V - Paste
        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "v" &&
          canvas._clipboard
        ) {
          e.preventDefault();
          canvas._clipboard.clone((clonedObj) => {
            canvas.discardActiveObject();
            clonedObj.set({
              left: clonedObj.left + 10,
              top: clonedObj.top + 10,
              evented: true,
            });
            if (clonedObj.type === "activeSelection") {
              clonedObj.canvas = canvas;
              clonedObj.forEachObject((obj) => {
                canvas.add(obj);
              });
              clonedObj.setCoords();
            } else {
              canvas.add(clonedObj);
            }
            canvas._clipboard = clonedObj;
            canvas.setActiveObject(clonedObj);
            canvas.requestRenderAll();
          });
          return;
        }

        // Ctrl/Cmd + D - Duplicate
        if (
          (e.ctrlKey || e.metaKey) &&
          e.key.toLowerCase() === "d" &&
          activeObject
        ) {
          e.preventDefault();
          activeObject.clone((cloned) => {
            canvas.discardActiveObject();
            cloned.set({
              left: cloned.left + 10,
              top: cloned.top + 10,
              evented: true,
            });
            if (cloned.type === "activeSelection") {
              cloned.canvas = canvas;
              cloned.forEachObject((obj) => {
                canvas.add(obj);
              });
              cloned.setCoords();
            } else {
              canvas.add(cloned);
            }
            canvas.setActiveObject(cloned);
            canvas.requestRenderAll();
          });
          return;
        }

        // Arrow keys - Move selected object
        if (
          activeObject &&
          ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)
        ) {
          e.preventDefault();
          const step = e.shiftKey ? 10 : 1; // Hold Shift for faster movement

          switch (e.key) {
            case "ArrowUp":
              activeObject.set("top", activeObject.top - step);
              break;
            case "ArrowDown":
              activeObject.set("top", activeObject.top + step);
              break;
            case "ArrowLeft":
              activeObject.set("left", activeObject.left - step);
              break;
            case "ArrowRight":
              activeObject.set("left", activeObject.left + step);
              break;
          }

          activeObject.setCoords();
          canvas.renderAll();
          saveHistory();
          onChange?.();
          return;
        }
      };

      // Attach to document with capture phase for better interception
      document.addEventListener("keydown", handleKeyDown, true);

      return () => {
        document.removeEventListener("keydown", handleKeyDown, true);
      };
    }, [history, historyStep, onChange, loadFromHistory, saveHistory]);

    // Handle layer switching
    useEffect(() => {
      if (!fabricCanvasRef.current || !activeLayerId) return;

      // Save current layer data before switching
      if (
        currentLayerRef.current &&
        currentLayerRef.current !== activeLayerId
      ) {
        console.log(
          "CanvasEditor: Switching from layer",
          currentLayerRef.current,
          "to",
          activeLayerId
        );
        const currentData = fabricCanvasRef.current.toJSON([
          "name",
          "assetId",
          "source",
          "kind",
        ]);
        layersDataRef.current[currentLayerRef.current] = currentData;
        saveToLocalStorage(); // Save to localStorage
      }

      // Load new layer data
      currentLayerRef.current = activeLayerId;
      const layerData = layersDataRef.current[activeLayerId];

      if (layerData) {
        // Load existing layer data
        console.log(
          "CanvasEditor: Loading existing layer data for",
          activeLayerId
        );
        setIsLoadingHistory(true);
        fabricCanvasRef.current.loadFromJSON(layerData, () => {
          fabricCanvasRef.current.renderAll();
          setIsLoadingHistory(false);
        });
      } else {
        // Clear canvas for new layer
        console.log("CanvasEditor: Creating new layer", activeLayerId);
        try {
          // Safer canvas clearing - remove all objects instead of using clear()
          fabricCanvasRef.current.remove(
            ...fabricCanvasRef.current.getObjects()
          );
          fabricCanvasRef.current.backgroundColor = "#ffffff";
          addDefaultTemplate(fabricCanvasRef.current);
          fabricCanvasRef.current.renderAll();
        } catch (error) {
          console.error("Error clearing canvas:", error);
          // Re-initialize canvas if clearing fails
          fabricCanvasRef.current.dispose();
          const newCanvas = new fabric.Canvas(
            fabricCanvasRef.current.lowerCanvasEl,
            {
              width: 800,
              height: 600,
              backgroundColor: "#ffffff",
              preserveObjectStacking: true,
            }
          );
          fabricCanvasRef.current = newCanvas;
          addDefaultTemplate(newCanvas);
          newCanvas.renderAll();
        }
      }
    }, [activeLayerId, saveToLocalStorage]);

    const addDefaultTemplate = (canvas) => {
      // Determine if this is a cylindrical/rounded package
      const isCylindrical = packagingType === "cup";

      if (isCylindrical) {
        // For cylindrical shapes, use a wider rectangular template
        const template = new fabric.Rect({
          left: 100,
          top: 150,
          width: 600,
          height: 300,
          fill: "transparent",
          stroke: "#cccccc",
          strokeWidth: 2,
          strokeDashArray: [5, 5],
          selectable: false,
          evented: false,
          name: "template-outline",
        });
        canvas.add(template);
        canvas.sendObjectToBack(template);

        // Add helper lines for cylindrical wrap
        const centerLine = new fabric.Line([400, 150, 400, 450], {
          stroke: "#e0e0e0",
          strokeWidth: 1,
          strokeDashArray: [3, 3],
          selectable: false,
          evented: false,
          name: "helper-line",
        });
        canvas.add(centerLine);
        canvas.sendObjectToBack(centerLine);
      } else {
        // Standard rectangular template for boxes, bags, pouches
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
        canvas.sendObjectToBack(template);
      }
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

        // Save current layer before exporting
        if (currentLayerRef.current) {
          const currentData = fabricCanvasRef.current.toJSON([
            "name",
            "assetId",
            "source",
            "kind",
            "selectable",
            "evented",
          ]);
          layersDataRef.current[currentLayerRef.current] = currentData;
        }

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

      // Export all layers data
      exportAllLayers: () => {
        // Save current layer
        if (currentLayerRef.current && fabricCanvasRef.current) {
          const currentData = fabricCanvasRef.current.toJSON([
            "name",
            "assetId",
            "source",
            "kind",
            "selectable",
            "evented",
          ]);
          layersDataRef.current[currentLayerRef.current] = currentData;
        }

        return { ...layersDataRef.current };
      },

      // Load all layers data
      loadAllLayers: (layersData) => {
        if (!layersData) return;
        layersDataRef.current = { ...layersData };

        // Load current layer if activeLayerId is set
        if (currentLayerRef.current && layersData[currentLayerRef.current]) {
          setIsLoadingHistory(true);
          fabricCanvasRef.current.loadFromJSON(
            layersData[currentLayerRef.current],
            () => {
              fabricCanvasRef.current.renderAll();
              setIsLoadingHistory(false);
            }
          );
        }
      },

      // Get completed layers (layers with content)
      getCompletedLayers: () => {
        const completed = [];
        Object.keys(layersDataRef.current).forEach((layerId) => {
          const layerData = layersDataRef.current[layerId];
          if (layerData?.objects && layerData.objects.length > 1) {
            // More than just template
            completed.push(layerId);
          }
        });
        return completed;
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

      // Export specific layer as image
      exportLayerAsImage: async (layerId) => {
        // Save current layer first
        if (currentLayerRef.current && fabricCanvasRef.current) {
          const currentData = fabricCanvasRef.current.toJSON([
            "name",
            "assetId",
            "source",
            "kind",
          ]);
          layersDataRef.current[currentLayerRef.current] = currentData;
        }

        const layerData = layersDataRef.current[layerId];
        if (!layerData) {
          console.warn(`No data found for layer: ${layerId}`);
          return null;
        }

        // Create temporary canvas to render the layer
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = 800;
        tempCanvas.height = 600;

        const fabricTemp = new fabric.Canvas(tempCanvas, {
          width: 800,
          height: 600,
          backgroundColor: "#ffffff",
        });

        return new Promise((resolve) => {
          fabricTemp.loadFromJSON(layerData, () => {
            fabricTemp.renderAll();
            const dataURL = fabricTemp.toDataURL({ format: "png", quality: 1 });
            fabricTemp.dispose();
            resolve(dataURL);
          });
        });
      },

      // Get all layers data
      getAllLayersData: () => {
        // Save current layer first
        if (currentLayerRef.current && fabricCanvasRef.current) {
          const currentData = fabricCanvasRef.current.toJSON([
            "name",
            "assetId",
            "source",
            "kind",
          ]);
          layersDataRef.current[currentLayerRef.current] = currentData;
        }
        return { ...layersDataRef.current };
      },
    }));

    return (
      <div
        ref={canvasContainerRef}
        className="canvas-container bg-white shadow-lg rounded-lg overflow-hidden"
        style={{
          width: "fit-content",
          height: "fit-content",
        }}
      ></div>
    );
  }
);

CanvasEditor.displayName = "CanvasEditor";

export default CanvasEditor;
