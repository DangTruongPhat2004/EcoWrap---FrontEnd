import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";
import ChatService from "../../services/chatService";

const ChatButton = ({ product, currentUserId, authToken }) => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isCustomer, setIsCustomer] = useState(null); // null = checking, true = customer, false = not customer

  // Check user role on component mount
  useEffect(() => {
    const checkUserRole = async () => {
      if (!authToken || !currentUserId) {
        setIsCustomer(null);
        return;
      }

      try {
        const chatService = new ChatService(authToken);
        const userInfo = await chatService.getUserInfo(currentUserId);
        setIsCustomer(userInfo.roleId === 2);
      } catch (error) {
        console.error("Error checking user role:", error);
        setIsCustomer(null);
      }
    };

    checkUserRole();
  }, [authToken, currentUserId]);

  const handleContactClick = async () => {
    console.log("=== CHAT BUTTON CLICKED ===");
    console.log("1. Product:", product);
    console.log("2. currentUserId:", currentUserId);
    console.log("3. authToken present:", !!authToken);

    // Check authentication
    if (!authToken || !currentUserId) {
      console.error("Missing auth");
      messageHelper.warning(
        message,
        "Vui lòng đăng nhập để liên hệ với người bán"
      );
      navigate("/login");
      return;
    }

    // Check product exists
    if (!product) {
      console.error("Product is undefined");
      messageHelper.error(message, "Lỗi: Không tìm thấy thông tin sản phẩm");
      return;
    }

    // Try multiple ways to get seller ID
    let sellerId = null;

    if (product.sellerId) {
      sellerId = product.sellerId;
    } else if (product.seller?.sellerId) {
      sellerId = product.seller.sellerId;
    } else if (product.seller?.id) {
      sellerId = product.seller.id;
    } else if (product.seller?.userId) {
      sellerId = product.seller.userId;
    }

    console.log("4. Extracted sellerId:", sellerId);

    if (!sellerId) {
      console.error("Could not find seller ID");
      messageHelper.error(
        message,
        "Không thể liên hệ: Không tìm thấy thông tin người bán"
      );
      return;
    }

    setIsLoading(true);

    try {
      const chatService = new ChatService(authToken);

      // Create or get conversation
      console.log("5. Creating conversation");
      const conversation = await chatService.createConversation(
        sellerId,
        currentUserId
      );

      console.log("6. Conversation created:", conversation);

      // Redirect to messages page with conversation selected
      navigate(`/messages?conversation=${conversation.id}`);
    } catch (error) {
      console.error("=== ERROR ===", error);

      let errorMessage = "Không thể mở chat. Vui lòng thử lại.";

      if (error.response?.status === 401) {
        errorMessage = "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      const statusCode = error?.response?.status;
      messageHelper.error(
        message,
        `${errorMessage}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Hide button if user is not a customer (roleId !== 2)
  if (isCustomer === false) {
    return null;
  }

  return (
    <button
      onClick={handleContactClick}
      disabled={isLoading || isCustomer === null}
      className={`
        flex items-center gap-2 px-6 py-2
        bg-white border border-gray-300 text-gray-700
        font-medium text-sm rounded-lg
        transition-all duration-300 
        hover:bg-gray-50
        disabled:opacity-70 disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
      `}
    >
      <svg
        width="17"
        height="16"
        viewBox="0 0 17 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_466_628)">
          <g clipPath="url(#clip1_466_628)">
            <path
              d="M2.60938 0C1.50625 0 0.609375 0.896875 0.609375 2V11C0.609375 12.1031 1.50625 13 2.60938 13H5.60938V15.5C5.60938 15.6906 5.71563 15.8625 5.88438 15.9469C6.05312 16.0312 6.25625 16.0125 6.40938 15.9L10.275 13H14.6094C15.7125 13 16.6094 12.1031 16.6094 11V2C16.6094 0.896875 15.7125 0 14.6094 0H2.60938Z"
              fill="currentColor"
            />
          </g>
        </g>
        <defs>
          <clipPath id="clip0_466_628">
            <rect
              width="16"
              height="16"
              fill="white"
              transform="translate(0.609375)"
            />
          </clipPath>
          <clipPath id="clip1_466_628">
            <path d="M0.609375 0H16.6094V16H0.609375V0Z" fill="white" />
          </clipPath>
        </defs>
      </svg>
      {isLoading ? "Đang mở..." : "Liên hệ"}
    </button>
  );
};

export default ChatButton;
