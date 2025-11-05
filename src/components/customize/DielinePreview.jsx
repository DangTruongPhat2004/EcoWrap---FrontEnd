import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { FileText, Download, Eye, X } from "lucide-react";
import dielineApi from "../../services/dielineApi";

const DielinePreview = ({
  canvasRef,
  packagingType,
  designId,
  isVisible,
  onClose,
}) => {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [svgContent, setSvgContent] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Generate dieline preview
  const generatePreview = React.useCallback(async () => {
    if (!canvasRef.current) return;

    setIsGenerating(true);
    setError(null);

    try {
      const layersData = canvasRef.current.exportAllLayers();
      const result = await dielineApi.generateDielinePreview(
        layersData,
        packagingType,
        canvasRef // Pass canvas reference for rendering designs
      );

      setPreviewUrl(result.previewUrl);
      setSvgContent(result.svgContent);
    } catch (err) {
      console.error("Preview generation failed:", err);
      setError("Không thể tạo preview dieline");
    } finally {
      setIsGenerating(false);
    }
  }, [canvasRef, packagingType]);

  // Generate preview when component becomes visible
  useEffect(() => {
    if (isVisible && !previewUrl && !isGenerating) {
      generatePreview();
    }
  }, [isVisible, previewUrl, isGenerating, generatePreview]);

  // Clean up object URLs
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDownloadSVG = () => {
    if (!svgContent) return;

    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `dieline-${designId || "new"}-${packagingType}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold">Dieline Preview</h2>
            <span className="text-sm text-gray-500">
              ({packagingType} -{" "}
              {Object.keys(canvasRef.current?.exportAllLayers?.() || {}).length}{" "}
              lớp)
            </span>
            <span className="px-2 py-0.5 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
              BETA
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              color="primary"
              variant="bordered"
              startContent={<Download className="w-4 h-4" />}
              onClick={handleDownloadSVG}
              isDisabled={!svgContent || isGenerating}
            >
              Tải SVG
            </Button>
            <Button
              size="sm"
              variant="light"
              onClick={generatePreview}
              isLoading={isGenerating}
            >
              Làm mới
            </Button>
            <Button isIconOnly size="sm" variant="light" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {isGenerating && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Đang tạo dieline preview...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="text-red-500 mb-2">
                <FileText className="w-12 h-12 mx-auto mb-2" />
              </div>
              <p className="text-red-600 font-medium">{error}</p>
              <Button
                size="sm"
                color="primary"
                variant="bordered"
                onClick={generatePreview}
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          )}

          {previewUrl && !isGenerating && !error && (
            <div className="space-y-4">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Dieline sẵn sàng cho sản xuất:</strong> File này chứa
                  tất cả các lớp thiết kế của bạn được chuyển đổi thành định
                  dạng SVG chuẩn công nghiệp với các đường cắt (màu đỏ) và đường
                  gấp (màu xanh).
                </p>
              </div>

              {/* Layer Info */}
              {canvasRef.current && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-800 text-sm mb-2">
                    Các lớp đã xuất:
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(
                      canvasRef.current.exportAllLayers?.() || {}
                    ).map((layerId) => (
                      <span
                        key={layerId}
                        className="px-2 py-1 text-xs bg-white border border-gray-300 rounded"
                      >
                        {layerId}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Dieline SVG Preview
                  </p>
                </div>
                <div className="p-4 flex justify-center">
                  <div
                    className="max-w-full max-h-96 overflow-auto border border-gray-100 rounded"
                    style={{ backgroundColor: "#f8f9fa" }}
                  >
                    <img
                      src={previewUrl}
                      alt="Dieline Preview"
                      className="max-w-full h-auto"
                      style={{ minWidth: "400px", minHeight: "300px" }}
                    />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <h4 className="font-medium text-gray-800 mb-2">Chú thích:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-red-500"></div>
                    <span>Đường cắt (Cut lines)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-500 border-dashed border-t border-blue-500"></div>
                    <span>Đường gấp (Crease lines)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-200 border border-gray-400"></div>
                    <span>Vùng in (Print area)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-blue-100 border border-blue-300"></div>
                    <span>Template dieline</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DielinePreview;
