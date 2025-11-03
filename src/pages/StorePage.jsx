import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardBody, Button, Chip, Avatar } from "@nextui-org/react";
import {
  Store,
  MapPin,
  Package,
  ArrowLeft,
  MessageCircle,
  Star,
} from "lucide-react";
import { getSellerById } from "../services/sellerApi";
import { getProductsBySeller } from "../services/productApi";
import { fmtVND } from "../utils/money";
import toast from "react-hot-toast";

export default function StorePage() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sellerId]);

  const fetchStoreData = async () => {
    try {
      setLoading(true);

      // Fetch seller info
      const sellerResponse = await getSellerById(sellerId);
      // Accept both shapes: { success, data } or plain object
      if (sellerResponse) {
        const sellerData =
          sellerResponse && typeof sellerResponse === "object"
            ? sellerResponse.data ?? sellerResponse
            : null;
        if (sellerData) setSeller(sellerData);
      }

      // Fetch seller products
      const productsResponse = await getProductsBySeller(sellerId);
      if (productsResponse.success && productsResponse.data) {
        setProducts(productsResponse.data);
      }
    } catch (error) {
      console.error("Error fetching store data:", error);
      toast.error("Không thể tải thông tin cửa hàng");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="bg-[#F6F7F3] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            <p className="ml-4 text-gray-600">Đang tải cửa hàng...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!seller) {
    return (
      <main className="bg-[#F6F7F3] min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 mb-4">Không tìm thấy cửa hàng</p>
            <Button color="primary" onPress={() => navigate("/products")}>
              Quay lại sản phẩm
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F6F7F3] min-h-screen">
      {/* Banner Section */}
      <div className="relative">
        {/* Banner Image */}
        <div className="h-64 md:h-80 w-full overflow-hidden bg-gradient-to-r from-emerald-500 to-teal-600">
          {seller.companyBanner ? (
            <img
              src={seller.companyBanner}
              alt={seller.companyName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Store size={80} className="text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Store Info Overlay */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative -mt-20 bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Store Avatar */}
              <div className="flex-shrink-0">
                <Avatar
                  src={seller.companyImage}
                  alt={seller.companyName}
                  className="w-32 h-32 border-4 border-white shadow-lg"
                  fallback={<Store size={48} className="text-gray-400" />}
                />
              </div>

              {/* Store Details */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {seller.companyName || "Cửa hàng"}
                    </h1>
                    {seller.address && (
                      <div className="flex items-center gap-2 text-gray-600 mb-3">
                        <MapPin size={18} />
                        <span>{seller.address}</span>
                      </div>
                    )}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Package size={16} />
                        <span>{products.length} Sản phẩm</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star
                          size={16}
                          className="text-yellow-500 fill-yellow-500"
                        />
                        <span>4.8 Đánh giá</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      color="default"
                      variant="bordered"
                      startContent={<MessageCircle size={18} />}
                    >
                      Chat ngay
                    </Button>
                    <Button color="primary" startContent={<Store size={18} />}>
                      Theo dõi
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-800">
            Sản phẩm của cửa hàng
          </h2>
          <Button
            variant="light"
            startContent={<ArrowLeft size={20} />}
            onPress={() => navigate(-1)}
          >
            Quay lại
          </Button>
        </div>

        {products.length === 0 ? (
          <Card className="border border-gray-200">
            <CardBody className="p-12 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">Cửa hàng chưa có sản phẩm nào</p>
            </CardBody>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product) => (
              <Card
                key={product.productId}
                isPressable
                onPress={() => navigate(`/products/${product.productId}`)}
                className="border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <CardBody className="p-0">
                  {/* Product Image */}
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    {product.imageFile ? (
                      <img
                        src={product.imageFile}
                        alt={product.productName}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={48} className="text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3">
                    <h3 className="text-sm font-medium text-gray-800 mb-2 line-clamp-2 min-h-[40px]">
                      {product.productName}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-emerald-600">
                        {fmtVND(product.productPrice)}
                      </span>
                    </div>
                    {product.productStatus && (
                      <div className="mt-2">
                        <Chip
                          size="sm"
                          color={
                            product.productStatus === "Available"
                              ? "success"
                              : "default"
                          }
                          variant="flat"
                        >
                          {product.productStatus === "Available"
                            ? "Còn hàng"
                            : "Hết hàng"}
                        </Chip>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
