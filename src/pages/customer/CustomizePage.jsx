import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { toast } from "react-hot-toast";
import {
  ArrowLeft,
  RotateCcw,
  Redo,
  Eye,
  Shuffle,
  Save,
  ShoppingCart,
} from "lucide-react";
import CanvasEditor from "../../components/customize/CanvasEditor";
import ThanhPhanPanel from "../../components/customize/ThanhPhanPanel";
import MauPanel from "../../components/customize/MauPanel";
import MockupPanel from "../../components/customize/MockupPanel";
import DesignSidebar from "../../components/customize/DesignSidebar";
import designApi from "../../services/designApi";

const CustomizePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef(null);

  const [activeTab, setActiveTab] = useState("thanhphan"); // thanhphan | mau | mockup
  const [design, setDesign] = useState(null);
  const [etag, setEtag] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [showMockup, setShowMockup] = useState(false);

  // History for undo/redo
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const loadDesign = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, etag: newEtag } = await designApi.getDesign(id);
      setDesign(data);
      setEtag(newEtag);

      // Load design data into canvas
      if (canvasRef.current && data.designData) {
        canvasRef.current.loadDesign(JSON.parse(data.designData));
      }
    } catch (error) {
      console.error("Failed to load design:", error);
      toast.error("Không thể tải thiết kế");
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
      toast.success("Đã tự động lưu", { duration: 1000 });
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
      const canvasData = canvasRef.current.exportDesign();
      const thumbnail = await canvasRef.current.exportThumbnail();

      const designData = {
        title: design.title,
        designData: JSON.stringify(canvasData),
        thumbnailUrl: thumbnail,
        status: "draft",
        usedAssets: canvasData.usedAssets || [],
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
        toast.success("Đã lưu thiết kế");
      } else {
        // Create new
        const { data, etag: newEtag } = await designApi.createDesign(
          designData
        );
        setDesign(data);
        setEtag(newEtag);
        navigate(`/thiet-ke/${data.id}`, { replace: true });
        toast.success("Đã tạo thiết kế mới");
      }

      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Save failed:", error);
      if (error.response?.status === 409) {
        toast.error(
          "Thiết kế đã được chỉnh sửa bởi người khác. Vui lòng tải lại."
        );
      } else {
        toast.error("Không thể lưu thiết kế");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    await handleSave();
    toast.success("Đã áp dụng thiết kế");
  };

  const handleAddToCart = async () => {
    await handleSave();
    toast.success("Đã thêm vào giỏ hàng");
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

  const handleCanvasChange = () => {
    setHasUnsavedChanges(true);
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
          <h1 className="text-lg font-semibold">Thiết Kế Bao Bì Của Bạn</h1>
          <span className="text-sm text-gray-500">Quay lại</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Undo/Redo */}
          <Button
            isIconOnly
            variant="light"
            isDisabled={!canUndo}
            onClick={handleUndo}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            isIconOnly
            variant="light"
            isDisabled={!canRedo}
            onClick={handleRedo}
          >
            <Redo className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* View Options */}
          <Button
            variant="light"
            startContent={<Eye className="w-4 h-4" />}
            onClick={() => setShowMockup(!showMockup)}
          >
            {showMockup ? "Canvas" : "Mockup"}
          </Button>
          <Button
            isIconOnly
            variant="light"
            onClick={() => {
              /* TODO: Random template */
            }}
          >
            <Shuffle className="w-4 h-4" />
          </Button>

          <div className="w-px h-6 bg-gray-300 mx-2" />

          {/* Actions */}
          <Button
            color="default"
            variant="bordered"
            startContent={<Save className="w-4 h-4" />}
            onClick={handleSave}
            isLoading={isSaving}
          >
            Lưu bản nháp
          </Button>
          <Button
            color="success"
            variant="solid"
            onClick={handleApply}
            isLoading={isSaving}
          >
            Đã áp dụng
          </Button>
          <Button
            color="success"
            variant="solid"
            startContent={<ShoppingCart className="w-4 h-4" />}
            onClick={handleAddToCart}
          >
            Thêm Vào Giỏ Hàng
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <DesignSidebar
          designs={[]} // TODO: Load recent designs
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
          <div className="flex-1 flex items-center justify-center p-8">
            {showMockup ? (
              <MockupPanel canvasRef={canvasRef} zoom={zoom} />
            ) : (
              <CanvasEditor
                ref={canvasRef}
                zoom={zoom}
                onChange={handleCanvasChange}
                onHistoryChange={handleHistoryChange}
              />
            )}
          </div>

          {/* Bottom Info */}
          <div className="bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-center">
            <p className="text-sm text-gray-600">
              Kéo các chi tiết từ thanh công cụ vào đây để bắt đầu thiết kế
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === "thanhphan"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("thanhphan")}
            >
              Thành phần
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
                activeTab === "mockup"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              onClick={() => setActiveTab("mockup")}
            >
              Mockup
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === "thanhphan" && (
              <ThanhPhanPanel canvasRef={canvasRef} />
            )}
            {activeTab === "mau" && <MauPanel canvasRef={canvasRef} />}
            {activeTab === "mockup" && (
              <MockupPanel canvasRef={canvasRef} embedded />
            )}
          </div>
        </div>
      </div>

      {/* Welcome Modal */}
      {design && !design.id && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              Chào mừng đến với EcoWrap!
            </h2>
            <p className="text-gray-600 mb-4">
              Kéo thả các chi tiết từ thanh công cụ vào canvas để bắt đầu tạo
              bao bì của bạn.
            </p>
            <Button
              color="success"
              className="w-full"
              onClick={() => setDesign({ ...design, id: "temp" })}
            >
              Xem hướng dẫn
            </Button>
            <Button
              variant="light"
              className="w-full mt-2"
              onClick={() => setDesign({ ...design, id: "temp" })}
            >
              Bỏ qua
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizePage;
