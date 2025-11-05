import React, { useState, useRef, useEffect } from "react";
import { Button, Card, Spinner } from "@nextui-org/react";
import { Upload, X, Image as ImageIcon, AlertCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import * as fabric from "fabric";

const ASSETS_STORAGE_KEY = "ecowrap_user_assets";

const AssetsPanel = ({ canvasRef }) => {
  const [assets, setAssets] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const fileInputRef = useRef(null);

  // Load user's existing assets from localStorage on mount
  useEffect(() => {
    loadUserAssets();
  }, []);

  const loadUserAssets = () => {
    setIsLoadingAssets(true);
    try {
      const storedAssets = localStorage.getItem(ASSETS_STORAGE_KEY);
      if (storedAssets) {
        const parsedAssets = JSON.parse(storedAssets);
        setAssets(parsedAssets);
        console.log(
          "AssetsPanel: Loaded",
          parsedAssets.length,
          "assets from localStorage"
        );
      } else {
        setAssets([]);
      }
    } catch (error) {
      console.error("AssetsPanel: Failed to load assets:", error);
      toast.error("Không thể tải tài nguyên của bạn");
      setAssets([]);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const saveAssetsToStorage = (assetsToSave) => {
    try {
      localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assetsToSave));
      setAssets(assetsToSave);
      console.log(
        "AssetsPanel: Saved",
        assetsToSave.length,
        "assets to localStorage"
      );
    } catch (error) {
      console.error("AssetsPanel: Failed to save assets:", error);
      toast.error("Không thể lưu tài nguyên");
    }
  };

  const compressImage = async (dataUrl, quality = 0.7) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // Calculate new dimensions (max 800px on longest side)
        const maxSize = 800;
        let { width, height } = img;

        if (width > height) {
          if (width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

        resolve(compressedDataUrl);
      };

      img.src = dataUrl;
    });
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      toast.error("Vui lòng chọn file hình ảnh");
      return;
    }

    // Validate file sizes (max 5MB per file)
    const oversizedFiles = imageFiles.filter(
      (file) => file.size > 5 * 1024 * 1024
    );
    if (oversizedFiles.length > 0) {
      toast.error(`File quá lớn: ${oversizedFiles[0].name} (tối đa 5MB)`);
      return;
    }

    setIsUploading(true);
    const uploadPromises = imageFiles.map((file) =>
      uploadFileToLocalStorage(file)
    );

    try {
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter((r) => r.success);

      if (successfulUploads.length > 0) {
        // Add new assets to existing assets
        const newAssets = successfulUploads.map((r) => r.asset);
        const updatedAssets = [...assets, ...newAssets];
        saveAssetsToStorage(updatedAssets);
        toast.success(`Đã tải lên ${successfulUploads.length} file thành công`);
      }

      const failedUploads = results.filter((r) => !r.success);
      if (failedUploads.length > 0) {
        toast.error(`${failedUploads.length} file tải lên thất bại`);
      }
    } catch (error) {
      console.error("AssetsPanel: Upload error:", error);
      toast.error("Có lỗi xảy ra khi tải file lên");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFileToLocalStorage = async (file) => {
    try {
      // Read file as data URL
      const reader = new FileReader();

      return new Promise((resolve) => {
        reader.onload = async (e) => {
          try {
            const dataUrl = e.target.result;
            console.log(
              "AssetsPanel: Generated data URL for",
              file.name,
              "length:",
              dataUrl.length,
              "starts with:",
              dataUrl.substring(0, 50)
            );

            // Check if data URL is too large for localStorage (limit to 2MB per image)
            const maxSize = 2 * 1024 * 1024; // 2MB
            let finalDataUrl = dataUrl;

            if (dataUrl.length > maxSize) {
              console.warn(
                "AssetsPanel: Data URL too large, compressing image:",
                file.name
              );
              // Create a compressed version
              finalDataUrl = await compressImage(dataUrl, 0.7); // 70% quality
              console.log(
                "AssetsPanel: Compressed data URL length:",
                finalDataUrl.length
              );
            }

            const asset = {
              id: `asset_${Date.now()}_${Math.random()
                .toString(36)
                .substr(2, 9)}`,
              url: finalDataUrl,
              thumbnailUrl: finalDataUrl,
              name: file.name,
              type: "image",
              format: file.type.split("/")[1],
              size: file.size,
              uploadedAt: new Date().toISOString(),
              fromLocalStorage: true,
            };

            console.log("AssetsPanel: File saved to localStorage:", asset.name);
            resolve({ success: true, asset });
          } catch (error) {
            console.error(
              "AssetsPanel: Error processing file:",
              file.name,
              error
            );
            resolve({ success: false, error: error.message });
          }
        };

        reader.onerror = () => {
          console.error("AssetsPanel: Failed to read file:", file.name);
          resolve({ success: false, error: "Failed to read file" });
        };

        reader.readAsDataURL(file);
      });
    } catch (error) {
      console.error("AssetsPanel: Failed to process file:", file.name, error);
      return { success: false, error: error.message };
    }
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
      console.warn("AssetsPanel: Canvas not ready");
      toast.error("Canvas chưa sẵn sàng");
      return;
    }

    const canvas = canvasRef.current.getCanvas();
    if (!canvas) {
      console.warn("AssetsPanel: Fabric canvas not ready");
      toast.error("Canvas chưa sẵn sàng");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Đang thêm hình ảnh...");

    // Add image to canvas using data URL or remote URL
    const imageUrl = asset.thumbnailUrl || asset.url;

    // For data URLs (localStorage), don't use crossOrigin
    const loadOptions = imageUrl.startsWith("data:")
      ? {}
      : { crossOrigin: "anonymous" };

    fabric.FabricImage.fromURL(imageUrl, loadOptions)
      .then((img) => {
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
          source: asset.fromLocalStorage ? "localStorage" : "user",
          name: asset.name,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();

        toast.success("Đã thêm hình ảnh vào thiết kế", { id: loadingToast });
        console.log("AssetsPanel: Added image to canvas:", asset.name);
      })
      .catch((error) => {
        console.error("AssetsPanel: Failed to add image:", error);
        toast.error("Không thể thêm hình ảnh", { id: loadingToast });
      });
  };

  const handleRemoveAsset = (assetId) => {
    try {
      // Remove from localStorage
      const updatedAssets = assets.filter((a) => a.id !== assetId);
      saveAssetsToStorage(updatedAssets);
      toast.success("Đã xóa tài nguyên");
      console.log("AssetsPanel: Deleted asset from localStorage:", assetId);
    } catch (error) {
      console.error("AssetsPanel: Failed to delete asset:", error);
      toast.error("Không thể xóa tài nguyên");
    }
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
        } ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
      >
        {isUploading ? (
          <>
            <Spinner size="lg" color="success" className="mb-2" />
            <p className="text-sm text-gray-600">Đang tải lên...</p>
          </>
        ) : (
          <>
            <ImageIcon className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              Kéo thả hình ảnh vào đây
            </p>
            <p className="text-xs text-gray-500">
              hoặc nhấn "Tải lên" (Tối đa 5MB/file)
            </p>
          </>
        )}
      </div>

      {/* Loading state */}
      {isLoadingAssets && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <Spinner size="lg" color="success" className="mb-2" />
            <p className="text-sm text-gray-600">Đang tải tài nguyên...</p>
          </div>
        </div>
      )}

      {/* Assets grid */}
      {!isLoadingAssets && assets.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-gray-600">
              {assets.length} hình ảnh
            </p>
            <Button
              size="sm"
              variant="light"
              onClick={loadUserAssets}
              className="text-xs"
            >
              Làm mới
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
            {assets.map((asset) => (
              <Card
                key={asset.id}
                isPressable
                className="relative group cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleAssetClick(asset)}
              >
                <div className="aspect-square relative overflow-hidden bg-gray-100">
                  <img
                    src={asset.thumbnailUrl || asset.url}
                    alt={asset.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onLoad={() =>
                      console.log(
                        "Asset image loaded successfully:",
                        asset.name
                      )
                    }
                    onError={(e) => {
                      console.error(
                        "Failed to load asset image:",
                        asset.name,
                        asset.url
                      );
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  {/* Fallback for failed images */}
                  <div
                    className="absolute inset-0 bg-gray-200 flex items-center justify-center"
                    style={{ display: "none" }}
                  >
                    <ImageIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveAsset(asset.id);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 z-10"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  {/* LocalStorage indicator */}
                  {asset.fromLocalStorage && (
                    <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-[10px] px-1 rounded">
                      💾
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <span className="text-white text-xs opacity-0 group-hover:opacity-100 font-medium">
                      Nhấn để thêm
                    </span>
                  </div>
                </div>
                <div className="p-2">
                  <p
                    className="text-xs text-gray-600 truncate"
                    title={asset.name}
                  >
                    {asset.name}
                  </p>
                  {asset.format && (
                    <p className="text-[10px] text-gray-400 uppercase">
                      {asset.format}
                    </p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Instructions and empty state */}
      {!isLoadingAssets && assets.length === 0 && (
        <div className="space-y-3">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-800">
              💡 <strong>Mẹo:</strong> Tải lên hình ảnh logo, họa tiết hoặc ảnh
              sản phẩm. Sau đó nhấn vào hình để thêm vào thiết kế.
            </p>
          </div>
          <div className="text-center py-4">
            <ImageIcon className="w-16 h-16 mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">Chưa có tài nguyên nào</p>
            <p className="text-xs text-gray-400 mt-1">
              Tải lên hình ảnh để bắt đầu
            </p>
          </div>
        </div>
      )}

      {/* Error state for upload issues */}
      {!isLoadingAssets && !isUploading && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-amber-800 font-medium mb-1">
                Lưu ý quan trọng
              </p>
              <p className="text-xs text-amber-700">
                File tải lên sẽ được lưu trên server và có thể tái sử dụng cho
                các thiết kế khác. Hỗ trợ: JPG, PNG, GIF. Tối đa 5MB/file.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssetsPanel;
