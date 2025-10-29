import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Accordion,
  AccordionItem,
  Spinner,
  Tabs,
  Tab,
} from "@nextui-org/react";
import {
  Image as ImageIcon,
  Type,
  Square,
  Circle,
  Triangle,
  Heart,
  Star,
  Upload,
  Search,
} from "lucide-react";
import { shapeService, imageService } from "../../services/externalApi";

const ThanhPhanPanel = ({ canvasRef }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [ecoElements, setEcoElements] = useState([]);
  const [onlineImages, setOnlineImages] = useState([]);
  const [isLoadingImages, setIsLoadingImages] = useState(false);
  const [selectedImageTab, setSelectedImageTab] = useState("eco");

  const shapes = [
    { id: "circle", icon: Circle, label: "Hình tròn", type: "circle" },
    { id: "square", icon: Square, label: "Hình vuông", type: "rect" },
    { id: "triangle", icon: Triangle, label: "Tam giác", type: "triangle" },
    { id: "heart", icon: Heart, label: "Trái tim", type: "heart" },
    { id: "star", icon: Star, label: "Ngôi sao", type: "star" },
  ];

  // Load eco elements on mount
  useEffect(() => {
    const loadEcoElements = async () => {
      const elements = shapeService.getEcoElements();
      setEcoElements(elements);
    };
    loadEcoElements();
  }, []);

  // Load online images when tab changes
  useEffect(() => {
    if (selectedImageTab === "eco") {
      loadEcoImages();
    } else if (selectedImageTab === "search" && searchQuery) {
      searchOnlineImages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImageTab]);

  const loadEcoImages = async () => {
    setIsLoadingImages(true);
    try {
      const result = await imageService.getEcoImages(1);
      setOnlineImages(result.images || []);
    } catch (error) {
      console.error("Error loading eco images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const searchOnlineImages = async () => {
    if (!searchQuery.trim()) return;

    setIsLoadingImages(true);
    try {
      const result = await imageService.searchImages(searchQuery, 1, 12);
      setOnlineImages(result.images || []);
    } catch (error) {
      console.error("Error searching images:", error);
    } finally {
      setIsLoadingImages(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      setSelectedImageTab("search");
      searchOnlineImages();
    }
  };

  const handleAddText = () => {
    if (canvasRef?.current) {
      canvasRef.current.addText("Nhấp để chỉnh sửa", {
        fontSize: 32,
        fontFamily: "Arial",
        fill: "#000000",
      });
    }
  };

  const handleAddShape = (shapeType) => {
    if (canvasRef?.current) {
      canvasRef.current.addShape(shapeType, {
        fill: "#4ade80",
      });
    }
  };

  const handleUploadImage = (e) => {
    const file = e.target.files[0];
    if (!file || !canvasRef?.current) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      canvasRef.current.addImage(event.target.result, {
        crossOrigin: "anonymous",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleAddElement = (element) => {
    if (canvasRef?.current) {
      // Add emoji/icon as text
      canvasRef.current.addText(element.icon, {
        fontSize: 64,
        fontFamily: "Arial",
      });
    }
  };

  const handleAddOnlineImage = (imageUrl) => {
    if (canvasRef?.current) {
      canvasRef.current.addImage(imageUrl, {
        crossOrigin: "anonymous",
      });
    }
  };

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <form onSubmit={handleSearchSubmit}>
        <Input
          placeholder="Tìm kiếm ảnh, biểu tượng..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          size="sm"
          endContent={
            <Button isIconOnly size="sm" variant="light" type="submit">
              <Search className="w-4 h-4" />
            </Button>
          }
          classNames={{
            input: "text-sm",
          }}
        />
      </form>

      <Accordion
        selectionMode="multiple"
        defaultExpandedKeys={["shapes", "elements"]}
      >
        {/* Text */}
        <AccordionItem
          key="text"
          title="Chữ"
          startContent={<Type className="w-4 h-4" />}
        >
          <Button
            className="w-full"
            color="success"
            variant="flat"
            startContent={<Type className="w-4 h-4" />}
            onClick={handleAddText}
          >
            Thêm văn bản
          </Button>
        </AccordionItem>

        {/* Shapes */}
        <AccordionItem
          key="shapes"
          title="Hình dạng"
          startContent={<Square className="w-4 h-4" />}
        >
          <div className="grid grid-cols-3 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => handleAddShape(shape.type)}
              >
                <shape.icon className="w-6 h-6 text-gray-700 mb-1" />
                <span className="text-xs text-gray-600">{shape.label}</span>
              </button>
            ))}
          </div>
        </AccordionItem>

        {/* Online Images */}
        <AccordionItem
          key="online-images"
          title="Ảnh trực tuyến"
          startContent={<ImageIcon className="w-4 h-4" />}
        >
          <Tabs
            size="sm"
            selectedKey={selectedImageTab}
            onSelectionChange={setSelectedImageTab}
            className="mb-2"
          >
            <Tab key="eco" title="Eco" />
            <Tab key="search" title="Tìm kiếm" />
          </Tabs>

          {isLoadingImages ? (
            <div className="flex justify-center py-8">
              <Spinner size="sm" />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {onlineImages.map((img) => (
                <button
                  key={img.id}
                  className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity border border-gray-200"
                  onClick={() => handleAddOnlineImage(img.small)}
                  title={img.description}
                >
                  <img
                    src={img.thumb}
                    alt={img.description}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">Powered by Unsplash</p>
        </AccordionItem>

        {/* Elements & Icons */}
        <AccordionItem
          key="elements"
          title="Biểu tượng Eco"
          startContent={<Star className="w-4 h-4" />}
        >
          <div className="grid grid-cols-4 gap-2">
            {ecoElements.map((element) => (
              <button
                key={element.id}
                className="flex flex-col items-center justify-center p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => handleAddElement(element)}
              >
                <span className="text-2xl mb-1">{element.icon}</span>
                <span className="text-xs text-gray-600 text-center">
                  {element.name}
                </span>
              </button>
            ))}
          </div>
        </AccordionItem>

        {/* Upload */}
        <AccordionItem
          key="upload"
          title="Tải lên"
          startContent={<Upload className="w-4 h-4" />}
        >
          <label className="block">
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUploadImage}
            />
            <Button
              as="span"
              className="w-full cursor-pointer"
              color="success"
              variant="bordered"
              startContent={<ImageIcon className="w-4 h-4" />}
            >
              Tải ảnh lên
            </Button>
          </label>
          <p className="text-xs text-gray-500 mt-2">
            Hỗ trợ: PNG, JPG, SVG (tối đa 10MB)
          </p>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default ThanhPhanPanel;
