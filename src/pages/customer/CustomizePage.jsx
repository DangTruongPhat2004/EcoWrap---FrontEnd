import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { App } from "antd";
import {
  ArrowLeft,
  RotateCcw,
  Redo,
  Eye,
  Shuffle,
  Save,
  ShoppingCart,
  FileText,
} from "lucide-react";
import CanvasEditor from "../../components/customize/CanvasEditor";
import ThanhPhanPanel from "../../components/customize/ThanhPhanPanel";
import MauPanel from "../../components/customize/MauPanel";
import MockupPanel from "../../components/customize/MockupPanel";
import DrawingTools from "../../components/customize/DrawingTools";
import AssetsPanel from "../../components/customize/AssetsPanel";
import { LayerMinimapPanel } from "../../components/customize/LayerMinimap";
import DesignSidebar from "../../components/customize/DesignSidebar";
import DielinePreview from "../../components/customize/DielinePreview";
import designApi from "../../services/designApi";
import dielineApi from "../../services/dielineApi";
import { PACKAGING_LAYERS } from "../../components/customize/PackagingModels";

const CustomizePage = () => {
  const { message } = App.useApp();
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [activeTab, setActiveTab] = useState("layers"); // layers | thanhphan | mau | mockup
  const [design, setDesign] = useState(null);
  const [etag, setEtag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isGeneratingDieline, setIsGeneratingDieline] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showMockup, setShowMockup] = useState(false);
  const [showDielinePreview, setShowDielinePreview] = useState(false);

  // Packaging and layer state
  const [packagingType, setPackagingType] = useState("box");
  const [activeLayerId, setActiveLayerId] = useState(null);
  const [completedLayers, setCompletedLayers] = useState([]);

  // Initialize first layer when packaging type changes
  useEffect(() => {
    const layers = PACKAGING_LAYERS[packagingType];
    if (layers && layers.length > 0 && !activeLayerId) {
      setActiveLayerId(layers[0].id);
    }
  }, [packagingType, activeLayerId]);

  // Force canvas render when toggling mockup view or on mount
  useEffect(() => {
    if (!showMockup && canvasRef.current) {
      // Small delay to ensure canvas is visible before rendering
      const timer = setTimeout(() => {
        const canvas = canvasRef.current.getCanvas?.();
        if (canvas) {
          canvas.renderAll();
          console.log("CustomizePage: Forced canvas render");
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [showMockup]);

  // History for undo/redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const loadDesign = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, etag: newEtag } = await designApi.getDesign(id);
      setDesign(data);
      setEtag(newEtag);

      // Load design data into canvas from backend
      if (canvasRef.current && data.designData) {
        try {
          const parsedData = JSON.parse(data.designData);

          // Set packaging type from saved design
          if (parsedData.packagingType) {
            setPackagingType(parsedData.packagingType);
          }

          // Load all layers data from backend (primary source)
          if (parsedData.layers && canvasRef.current.loadAllLayers) {
            canvasRef.current.loadAllLayers(parsedData.layers);
            console.log("CustomizePage: Loaded design layers from backend API");

            // Force render after loading
            setTimeout(() => {
              const canvas = canvasRef.current?.getCanvas?.();
              if (canvas) {
                canvas.renderAll();
                console.log("CustomizePage: Forced render after load");
              }
            }, 150);
          } else if (canvasRef.current.loadDesign) {
            // Fallback to old format if exists
            canvasRef.current.loadDesign(parsedData);
            console.log("CustomizePage: Loaded design using legacy format");

            // Force render after loading
            setTimeout(() => {
              const canvas = canvasRef.current?.getCanvas?.();
              if (canvas) {
                canvas.renderAll();
              }
            }, 150);
          }
        } catch (parseError) {
          console.error(
            "CustomizePage: Failed to parse design data:",
            parseError
          );
          message.error("Dữ liệu thiết kế không hợp lệ");
        }
      }
    } catch (error) {
      console.error("Failed to load design:", error);
      message.error("Không thể tải thiết kế");
      navigate("/thiet-ke");
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  const initNewDesign = React.useCallback(() => {
    setDesign({
      id: null,
      title: "Thiết Kế Mới",
      status: "draft",
      designData: "{}",
      usedAssets: [],
      tags: [],
    });
  }, []);

  // Load design
  useEffect(() => {
    if (id && id !== "new") {
      loadDesign();
    } else {
      // New design
      initNewDesign();
    }
  }, [id, loadDesign, initNewDesign]);

  const handleAutoSave = React.useCallback(async () => {
    if (!design?.id || !canvasRef.current) return;

    try {
      const canvasData = canvasRef.current.exportDesign();
      const updateData = {
        designData: JSON.stringify(canvasData),
        updatedAt: new Date().toISOString(),
      };

      const { etag: newEtag } = await designApi.autosaveDesign(
        design.id,
        updateData,
        etag
      );

      setEtag(newEtag);
      setHasUnsavedChanges(false);
      message.success("Đã tự động lưu");
    } catch (error) {
      console.error("Auto-save failed:", error);
    }
  }, [design, etag]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !design?.id) return;

    const timer = setTimeout(() => {
      handleAutoSave();
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => clearTimeout(timer);
  }, [hasUnsavedChanges, design, handleAutoSave]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Get all layers data
      const allLayers = canvasRef.current.exportAllLayers();
      const thumbnail = await canvasRef.current.exportThumbnail();

      // Generate dieline SVG
      let dielineSvgUrl = null;
      if (Object.keys(allLayers).length > 0) {
        setIsGeneratingDieline(true);
        try {
          const dielineResult = await dielineApi.generateAndUploadDieline(
            allLayers,
            packagingType,
            design.id || "new",
            canvasRef // Pass canvas reference for rendering designs
          );
          dielineSvgUrl = dielineResult.url;

          if (dielineResult.success) {
            message.success("Đã tạo file dieline");
          } else if (dielineResult.fallback) {
            message.info("Đang tạo file dieline tạm thời...");
          }
        } catch (dielineError) {
          console.error("Dieline generation failed:", dielineError);
          message.warning(
            "Không thể tạo file dieline, nhưng thiết kế vẫn được lưu"
          );
        } finally {
          setIsGeneratingDieline(false);
        }
      }

      const designData = {
        title: design.title,
        designData: JSON.stringify({
          packagingType,
          layers: allLayers,
        }),
        thumbnailUrl: thumbnail,
        dielineSvgUrl: dielineSvgUrl, // Add dieline URL to the save data
        status: "draft",
        usedAssets: [],
        tags: design.tags || [],
      };

      if (design.id) {
        // Update existing
        const { data, etag: newEtag } = await designApi.updateDesign(
          design.id,
          designData,
          etag
        );
        setDesign(data);
        setEtag(newEtag);
        message.success("Đã lưu thiết kế");
      } else {
        // Create new
        console.log(
          "CustomizePage: Creating new design with data:",
          designData
        );
        const { data, etag: newEtag } = await designApi.createDesign(
          designData
        );
        console.log("CustomizePage: Design created successfully:", data);
        setDesign(data);
        setEtag(newEtag);
        navigate(`/thiet-ke/${data.id}`, { replace: true });
        message.success("Đã tạo thiết kế mới");
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Save failed:", error);
      console.error("Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });

      if (error.response?.status === 409) {
        message.error(
          "Thiết kế đã được chỉnh sửa bởi người khác. Vui lòng tải lại."
        );
      } else if (error.response?.status === 401) {
        message.error("Bạn cần đăng nhập để lưu thiết kế");
      } else if (error.response?.status === 400) {
        message.error(
          "Dữ liệu thiết kế không hợp lệ: " +
            (error.response?.data?.message || "")
        );
      } else {
        message.error(
          "Không thể lưu thiết kế: " + (error.message || "Lỗi không xác định")
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handlePackagingTypeChange = (newType) => {
    setPackagingType(newType);
    const layers = PACKAGING_LAYERS[newType];
    if (layers && layers.length > 0) {
      setActiveLayerId(layers[0].id);
    }
  };

  const handleLayerSelect = (layerId) => {
    setActiveLayerId(layerId);
    // Don't automatically switch tabs - let user decide
  };

  const handleCanvasChange = () => {
    setHasUnsavedChanges(true);
    // Update completed layers
    if (canvasRef.current) {
      const completed = canvasRef.current.getCompletedLayers();
      setCompletedLayers(completed);
    }
  };

  const handleApply = async () => {
    await handleSave();
    message.success("Đã áp dụng thiết kế");
  };

  const handleAddToCart = async () => {
    await handleSave();
    message.success("Đã thêm vào giỏ hàng");
    navigate("/cart");
  };

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (canvasRef.current) {
      canvasRef.current.redo();
      setHasUnsavedChanges(true);
    }
  };

  const handleHistoryChange = (canUndoState, canRedoState) => {
    setCanUndo(canUndoState);
    setCanRedo(canRedoState);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thiết kế...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button isIconOnly variant="light" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-semibold">Thiết Kế Bao Bì Của Bạn</h1>
            <span className="px-2 py-0.5 text-xs font-semibold bg-orange-100 text-orange-700 rounded-full border border-orange-300">
              BETA
            </span>
          </div>
          <span className="text-sm text-gray-500">Quay lại</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            isIconOnly
            variant="light"
            isDisabled={!canUndo}
            onClick={handleUndo}
            title="Hoàn tác (Ctrl+Z)"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            variant="light"
            isDisabled={!canRedo}
            onClick={handleRedo}
            title="Làm lại (Ctrl+Shift+Z)"
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* View Options */}
          <Button
            variant="light"
            startContent={<Eye className="w-4 h-4" />}
            onClick={() => {
              // Save current layer state before toggling
              if (canvasRef.current?.saveCurrentLayer) {
                canvasRef.current.saveCurrentLayer();
              }
              setShowMockup(!showMockup);
            }}
          >
            {showMockup ? "Canvas" : "Mockup"}
          </Button>
          <Button
            variant="light"
            startContent={<FileText className="w-4 h-4" />}
            onClick={() => setShowDielinePreview(true)}
            isDisabled={!canvasRef.current}
          >
            Dieline
          </Button>
          <Button
            isIconOnly
            variant="light"
            onClick={() => {
              message.info("Tính năng mẫu ngẫu nhiên đang được phát triển");
            }}
            title="Áp dụng mẫu ngẫu nhiên (sắp có)"
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Auto-save indicator */}
          {isGeneratingDieline && (
            <span className="text-xs text-blue-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              Đang tạo file dieline...
            </span>
          )}
          {hasUnsavedChanges && !isGeneratingDieline && (
            <span className="text-xs text-amber-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              Đang lưu tự động...
            </span>
          )}
          {!hasUnsavedChanges && !isGeneratingDieline && design?.id && (
            <span className="text-xs text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              Đã lưu
            </span>
          )}

          {/* Actions */}
          <Button
            color="default"
            variant="bordered"
            startContent={<Save className="w-4 h-4" />}
            onClick={handleSave}
            isLoading={isSaving || isGeneratingDieline}
          >
            {isGeneratingDieline ? "Tạo dieline..." : "Lưu ngay"}
          </Button>
          <Button
            color="success"
            variant="solid"
            onClick={handleApply}
            isLoading={isSaving || isGeneratingDieline}
          >
            Áp dụng
          </Button>
          <Button
            color="success"
            variant="solid"
            startContent={<ShoppingCart className="w-4 h-4" />}
            onClick={handleAddToCart}
            isDisabled={isSaving || isGeneratingDieline}
          >
            Thêm Vào Giỏ Hàng
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <DesignSidebar
          designs={[]} // DesignSidebar loads recent designs from backend internally
          currentDesignId={design?.id}
          onCreateNew={() => navigate("/thiet-ke/new")}
          onSelectDesign={(designId) => navigate(`/thiet-ke/${designId}`)}
        />

        {/* Canvas Area */}
        <div className="flex-1 flex flex-col bg-gray-100 relative">
          {/* Zoom Controls */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2 bg-white rounded-lg shadow-md px-3 py-2">
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setZoom(Math.max(25, zoom - 10))}
            >
              -
            </Button>
            <span className="text-sm font-medium w-12 text-center">
              {zoom}%
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="light"
              onClick={() => setZoom(Math.min(200, zoom + 10))}
            >
              +
            </Button>
          </div>

          {/* Canvas or Mockup View */}
          <div className="flex-1 flex items-center justify-center p-8 relative">
            {/* Always keep CanvasEditor mounted and rendered */}
            <div
              style={{
                position: showMockup ? "absolute" : "relative",
                visibility: showMockup ? "hidden" : "visible",
                zIndex: showMockup ? -1 : 1,
                pointerEvents: showMockup ? "none" : "auto",
              }}
            >
              <CanvasEditor
                ref={canvasRef}
                zoom={zoom}
                onChange={handleCanvasChange}
                onHistoryChange={handleHistoryChange}
                activeLayerId={activeLayerId}
                designId={design?.id || id}
                packagingType={packagingType}
              />
            </div>
            {showMockup && (
              <div className="w-full h-full absolute inset-0 flex items-center justify-center">
                <MockupPanel
                  key={`mockup-${packagingType}-${activeLayerId}`}
                  canvasRef={canvasRef}
                  zoom={zoom}
                  packagingType={packagingType}
                  activeLayerId={activeLayerId}
                />
              </div>
            )}
          </div>

          {/* Bottom Info */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-center">
            <p className="text-sm text-gray-600">
              {activeLayerId
                ? `Đang chỉnh sửa: ${
                    PACKAGING_LAYERS[packagingType]?.find(
                      (l) => l.id === activeLayerId
                    )?.name
                  }`
                : "Chọn một lớp để bắt đầu thiết kế"}
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-90 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "layers"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("layers")}
            >
              Lớp
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "thanhphan"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("thanhphan")}
            >
              Phần tử
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "mau"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("mau")}
            >
              Màu
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "drawing"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("drawing")}
            >
              Vẽ
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "assets"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("assets")}
            >
              Hình ảnh
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "mockup"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("mockup")}
            >
              3D
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "layers" && (
              <LayerMinimapPanel
                packagingType={packagingType}
                onPackagingTypeChange={handlePackagingTypeChange}
                layers={PACKAGING_LAYERS[packagingType] || []}
                activeLayerId={activeLayerId}
                onLayerSelect={handleLayerSelect}
                completedLayers={completedLayers}
              />
            )}
            {activeTab === "thanhphan" && (
              <ThanhPhanPanel canvasRef={canvasRef} />
            )}
            {activeTab === "mau" && <MauPanel canvasRef={canvasRef} />}
            {activeTab === "drawing" && <DrawingTools canvasRef={canvasRef} />}
            {activeTab === "assets" && <AssetsPanel canvasRef={canvasRef} />}
            {activeTab === "mockup" && (
              <MockupPanel
                canvasRef={canvasRef}
                embedded
                packagingType={packagingType}
                activeLayerId={activeLayerId}
              />
            )}
          </div>
        </div>
      </div>

      {/* Dieline Preview Modal */}
      <DielinePreview
        canvasRef={canvasRef}
        packagingType={packagingType}
        designId={design?.id}
        isVisible={showDielinePreview}
        onClose={() => setShowDielinePreview(false)}
      />
    </div>
  );
};

export default CustomizePage;
