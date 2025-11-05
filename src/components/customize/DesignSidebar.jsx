import React, { useState, useEffect } from "react";
import { Button, ScrollShadow, Spinner } from "@nextui-org/react";
import { Plus, FolderOpen } from "lucide-react";
import designApi from "../../services/designApi";

const DesignSidebar = ({
  designs = [],
  currentDesignId,
  onCreateNew,
  onSelectDesign,
}) => {
  const [recentDesigns, setRecentDesigns] = useState([]);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);

  // Fetch recent designs from backend
  const fetchRecentDesigns = React.useCallback(async () => {
    setIsLoadingDesigns(true);
    try {
      const response = await designApi.getDesigns({
        page: 1,
        pageSize: 10,
        status: "", // Get all statuses
      });

      if (response?.items) {
        // Format designs for display
        const formattedDesigns = response.items.map((design) => ({
          id: design.id,
          title: design.name || "Thiết kế không tên",
          thumbnail: design.thumbnailUrl,
          updatedAt: formatRelativeTime(design.updatedAt),
          status: design.status,
        }));
        setRecentDesigns(formattedDesigns);
        console.log(
          "DesignSidebar: Loaded",
          formattedDesigns.length,
          "recent designs"
        );
      }
    } catch (error) {
      console.error("DesignSidebar: Failed to load recent designs:", error);
      // Use empty array on error
      setRecentDesigns([]);
    } finally {
      setIsLoadingDesigns(false);
    }
  }, []);

  // Fetch on mount
  useEffect(() => {
    fetchRecentDesigns();
  }, [fetchRecentDesigns]);

  const formatRelativeTime = (dateString) => {
    if (!dateString) return "Chưa rõ";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const allDesigns = designs.length > 0 ? designs : recentDesigns;

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <Button
          color="success"
          className="w-full"
          startContent={<Plus className="w-4 h-4" />}
          onClick={onCreateNew}
        >
          Thiết kế mới
        </Button>
      </div>

      {/* Folder Section */}
      <div className="p-4 border-b border-gray-200">
        <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
          <FolderOpen className="w-4 h-4" />
          <span>Mở thiết kế</span>
        </button>
      </div>

      {/* Recent Designs */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Thiết kế gần đây
          </h3>
        </div>

        <ScrollShadow className="flex-1">
          <div className="p-2 space-y-1">
            {isLoadingDesigns ? (
              <div className="flex items-center justify-center py-8">
                <Spinner size="sm" color="success" />
              </div>
            ) : allDesigns.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-gray-500">Chưa có thiết kế nào</p>
                <p className="text-xs text-gray-400 mt-1">
                  Tạo thiết kế mới để bắt đầu
                </p>
              </div>
            ) : (
              allDesigns.map((design) => (
                <button
                  key={design.id}
                  className={`w-full flex items-start gap-3 p-3 rounded-lg transition-colors ${
                    currentDesignId === design.id
                      ? "bg-green-50 border border-green-200"
                      : "hover:bg-gray-50 border border-transparent"
                  }`}
                  onClick={() => onSelectDesign(design.id)}
                >
                  {/* Thumbnail */}
                  <div className="w-12 h-12 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                    {design.thumbnail ? (
                      <img
                        src={design.thumbnail}
                        alt={design.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <span className="text-gray-400 text-xs">📦</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {design.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {design.updatedAt}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollShadow>
      </div>

      {/* Tips */}
      <div className="p-4 border-t border-gray-200 bg-yellow-50">
        <div className="flex items-start gap-2">
          <span className="text-lg">💡</span>
          <div>
            <p className="text-xs font-medium text-yellow-800">Mẹo thiết kế</p>
            <p className="text-xs text-yellow-700 mt-1">
              Sử dụng tối đa 3 màu để thiết kế bao bì nổi bật hơn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSidebar;
