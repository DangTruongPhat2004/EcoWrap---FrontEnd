import React, { useState, useRef } from "react";
import { Button, Card } from "@nextui-org/react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import * as fabric from "fabric";

const AssetsPanel = ({ canvasRef }) => {
  const [assets, setAssets] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newAsset = {
          id: Date.now() + Math.random(),
          url: e.target.result,
          name: file.name,
          type: file.type,
        };
        setAssets((prev) => [...prev, newAsset]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleAssetClick = (asset) => {
    if (!canvasRef?.current) {
      console.warn("Canvas not ready");
      return;
    }

    const canvas = canvasRef.current.getCanvas();
    if (!canvas) {
      console.warn("Fabric canvas not ready");
      return;
    }

    // Add image to canvas
    fabric.FabricImage.fromURL(asset.url, {
      crossOrigin: "anonymous",
    }).then((img) => {
      // Scale image to fit canvas
      const maxWidth = 300;
      const maxHeight = 300;
      const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);

      img.set({
        left: 250,
        top: 150,
        scaleX: scale,
        scaleY: scale,
        assetId: asset.id,
      });

      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
  };

  const handleRemoveAsset = (assetId) => {
    setAssets((prev) => prev.filter((asset) => asset.id !== assetId));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-gray-700">
          Hình ảnh & Tài nguyên
        </h3>
        <Button
          size="sm"
          color="success"
          variant="flat"
          startContent={<Upload className="w-4 h-4" />}
          onClick={() => fileInputRef.current?.click()}
        >
          Tải lên
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging
            ? "border-green-500 bg-green-50"
            : "border-gray-300 bg-gray-50"
        }`}
      >
        <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
        <p className="text-sm text-gray-600 mb-1">Kéo thả hình ảnh vào đây</p>
        <p className="text-xs text-gray-500">hoặc nhấn "Tải lên"</p>
      </div>

      {/* Assets grid */}
      {assets.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-600">
            {assets.length} hình ảnh
          </p>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                isPressable
                className="relative group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="aspect-square relative overflow-hidden">
                  <img
                    src={asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                  />
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAsset(asset.id);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100">
                      Nhấn để thêm
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <p className="text-xs text-gray-600 truncate">{asset.name}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      {assets.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-xs text-blue-800">
            💡 <strong>Mẹo:</strong> Tải lên hình ảnh logo, họa tiết hoặc ảnh
            sản phẩm. Sau đó nhấn vào hình để thêm vào thiết kế.
          </p>
        </div>
      )}
    </div>
  );
};

export default AssetsPanel;
