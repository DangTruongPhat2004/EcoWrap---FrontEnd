import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { App } from "antd";
import { messageHelper } from "../../utils/messageHelper";
import ChatService from "../../services/chatService";
import { getProductById } from "../../services/productApi";
import { getUserById } from "../../services/userApi";
import { getSellerById } from "../../services/sellerApi";
import {
  formatChatTimeHanoi,
  getRelativeTimeHanoi,
} from "../../utils/timeUtils";

const MessagesPage = () => {
  const { message } = App.useApp();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Auth state
  const authToken = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let currentUserId = null;
  let currentUsername = null;

  if (userString) {
    try {
      const userResponse = JSON.parse(userString);
      if (userResponse.data) {
        currentUserId = userResponse.data.userId || userResponse.data.id;
        currentUsername =
          userResponse.data.username || userResponse.data.fullName;
      }
    } catch (error) {
      console.error("Error parsing user:", error);
    }
  }

  // State
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [sellerCompanyNames, setSellerCompanyNames] = useState({});
  const [customerNames, setCustomerNames] = useState({});
  const [productsCache, setProductsCache] = useState({});
  const [unreadCounts, setUnreadCounts] = useState({}); // Track unread messages per conversation

  // Refs
  const messagesEndRef = useRef(null);
  const chatServiceRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageIdRef = useRef(null);
  const isFetchingRef = useRef(false);
  const componentMountedRef = useRef(true);
  const conversationListPollingRef = useRef(null);

  // Initialize chat service
  useEffect(() => {
    if (!authToken || !currentUserId) {
      messageHelper.warning(message, "Vui lòng đăng nhập để xem tin nhắn");
      navigate("/login");
      return;
    }
    chatServiceRef.current = new ChatService(authToken);
    componentMountedRef.current = true;

    return () => {
      componentMountedRef.current = false;
      if (conversationListPollingRef.current) {
        clearInterval(conversationListPollingRef.current);
      }
    };
  }, [authToken, currentUserId, navigate]);

  // Fetch conversations on mount and poll for updates
  useEffect(() => {
    if (chatServiceRef.current) {
      fetchConversations();

      // Poll conversation list every 10 seconds to catch new messages
      conversationListPollingRef.current = setInterval(() => {
        fetchConversations(true); // Silent fetch
      }, 10000);
    }

    return () => {
      if (conversationListPollingRef.current) {
        clearInterval(conversationListPollingRef.current);
      }
    };
  }, []);

  // Fetch seller company name from product API
  const fetchSellerCompanyName = useCallback(async (productId) => {
    try {
      const product = await getProductById(productId);
      if (product?.seller?.companyName) {
        return product.seller.companyName;
      }
    } catch (error) {
      console.error("Error fetching seller company name:", error);
    }
    return null;
  }, []);

  // Fetch customer name from User API
  const fetchCustomerName = useCallback(async (userId) => {
    try {
      const response = await getUserById(userId);
      const userData = response.data || response;
      const name = userData.fullName || userData.username;
      return name;
    } catch (error) {
      console.error("Error fetching customer name:", error);
    }
    return null;
  }, []);

  // Fetch seller company name from Seller API by sellerId
  const fetchSellerCompanyNameBySellerId = useCallback(async (sellerId) => {
    try {
      const response = await getSellerById(sellerId);
      const companyName = response.companyName;
      return companyName;
    } catch (error) {
      console.error("Error fetching seller company name:", error);
    }
    return null;
  }, []);

  // Fetch seller company names and customer names for all conversations
  useEffect(() => {
    if (conversations.length > 0) {
      conversations.forEach((conversation) => {
        const otherParticipant = conversation.participants?.find(
          (p) => p.userId !== currentUserId
        );

        if (otherParticipant) {
          const userId = otherParticipant.userId;

          if (
            otherParticipant.role === "Seller" &&
            !sellerCompanyNames[userId]
          ) {
            fetchSellerCompanyNameBySellerId(userId).then((companyName) => {
              if (companyName) {
                setSellerCompanyNames((prev) => ({
                  ...prev,
                  [userId]: companyName,
                }));
              }
            });
          }

          if (
            (otherParticipant.role === "Customer" ||
              otherParticipant.role === "Buyer") &&
            !customerNames[userId]
          ) {
            fetchCustomerName(userId).then((name) => {
              if (name) {
                setCustomerNames((prev) => ({
                  ...prev,
                  [userId]: name,
                }));
              }
            });
          }
        }
      });
    }
  }, [
    conversations,
    currentUserId,
    sellerCompanyNames,
    customerNames,
    fetchSellerCompanyNameBySellerId,
    fetchCustomerName,
  ]);

  // Handle conversation selection from URL params
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId && conversations.length > 0 && !selectedConversation) {
      const conversation = conversations.find(
        (c) => c.id === parseInt(conversationId)
      );
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  // Auto-scroll to bottom
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Fetch product details and cache them
  const fetchProductDetails = async (productId) => {
    if (productsCache[productId]) {
      return productsCache[productId];
    }

    try {
      const product = await getProductById(productId);
      setProductsCache((prev) => ({
        ...prev,
        [productId]: product,
      }));
      return product;
    } catch (error) {
      console.error("Error fetching product:", error);
      return null;
    }
  };

  // Calculate unread messages for a conversation
  const calculateUnreadCount = (conversation) => {
    if (!conversation.lastMessage) return 0;

    // If the last message was sent by the current user, no unread
    if (conversation.lastMessage.senderId === currentUserId) {
      return 0;
    }

    // If there's a read status in the conversation data
    if (conversation.unreadCount !== undefined) {
      return conversation.unreadCount;
    }

    // If last message is from another user and conversation is not selected, mark as unread
    if (selectedConversation?.id !== conversation.id) {
      return conversation.hasUnread ? 1 : 0;
    }

    return 0;
  };

  // Fetch all conversations
  const fetchConversations = async (silent = false) => {
    if (isFetchingRef.current) return;

    if (!silent) setLoading(true);
    isFetchingRef.current = true;

    try {
      const conversationsList =
        await chatServiceRef.current.getUserConversations();

      // Fetch product details for conversations with productId
      const conversationsWithProducts = await Promise.all(
        conversationsList.map(async (conversation) => {
          if (conversation.productId) {
            const product = await fetchProductDetails(conversation.productId);
            return { ...conversation, product };
          }
          return conversation;
        })
      );

      if (componentMountedRef.current) {
        // Calculate unread counts
        const newUnreadCounts = {};
        conversationsWithProducts.forEach((conv) => {
          const unreadCount = calculateUnreadCount(conv);
          if (unreadCount > 0) {
            newUnreadCounts[conv.id] = unreadCount;
          }
        });

        setUnreadCounts(newUnreadCounts);
        setConversations(conversationsWithProducts);
      }
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      if (componentMountedRef.current) {
        if (!silent) setLoading(false);
      }
      isFetchingRef.current = false;
    }
  };

  // Update conversation in list after sending a message
  const updateConversationAfterMessage = useCallback(
    (conversationId, messageBody, timestamp, senderId) => {
      setConversations((prevConversations) => {
        return prevConversations
          .map((conv) => {
            if (conv.id === conversationId) {
              return {
                ...conv,
                lastMessagePreview: messageBody,
                lastMessageAt: timestamp,
                lastMessage: {
                  body: messageBody,
                  createdAt: timestamp,
                  senderId: senderId,
                },
              };
            }
            return conv;
          })
          .sort((a, b) => {
            const dateA = new Date(a.lastMessageAt || 0);
            const dateB = new Date(b.lastMessageAt || 0);
            return dateB - dateA;
          });
      });

      // Clear unread count for current user's sent messages
      if (senderId === currentUserId) {
        setUnreadCounts((prev) => {
          const updated = { ...prev };
          delete updated[conversationId];
          return updated;
        });
      }
    },
    [currentUserId]
  );

  // Mark conversation as read
  const markConversationAsRead = useCallback((conversationId) => {
    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[conversationId];
      return updated;
    });

    // TODO: Call API to mark messages as read on the server
    // await chatServiceRef.current.markAsRead(conversationId);
  }, []);

  // Optimized fetch messages
  const fetchMessages = useCallback(
    async (conversationId, silent = false) => {
      if (!conversationId || isFetchingRef.current) return;

      isFetchingRef.current = true;
      if (!silent) setLoadingMessages(true);

      try {
        const messagesList = await chatServiceRef.current.getMessages(
          conversationId
        );

        if (!componentMountedRef.current) return;

        const sortedMessages = [...messagesList].sort((a, b) => {
          return new Date(a.createdAt) - new Date(b.createdAt);
        });

        const latestMessageId =
          sortedMessages.length > 0
            ? sortedMessages[sortedMessages.length - 1].id
            : null;

        if (latestMessageId !== lastMessageIdRef.current) {
          setMessages(sortedMessages);
          lastMessageIdRef.current = latestMessageId;

          if (sortedMessages.length > messages.length) {
            setTimeout(scrollToBottom, 100);
          }
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        if (componentMountedRef.current) {
          setLoadingMessages(false);
        }
        isFetchingRef.current = false;
      }
    },
    [messages.length, scrollToBottom]
  );

  // Handle conversation selection
  const handleSelectConversation = useCallback(
    async (conversation) => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }

      let updatedConversation = conversation;
      if (conversation.productId && !conversation.product) {
        const product = await fetchProductDetails(conversation.productId);
        updatedConversation = { ...conversation, product };
      }

      setSelectedConversation(updatedConversation);
      setSearchParams({ conversation: conversation.id });
      setMessages([]);
      lastMessageIdRef.current = null;

      // Mark as read
      markConversationAsRead(conversation.id);

      await fetchMessages(conversation.id, false);

      setIsPolling(true);
      pollingIntervalRef.current = setInterval(() => {
        fetchMessages(conversation.id, true);
      }, 5000);
    },
    [fetchMessages, setSearchParams, markConversationAsRead]
  );

  // Cleanup polling on unmount or conversation change
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      setIsPolling(false);
    };
  }, [selectedConversation]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation || isSending) return;

    setIsSending(true);
    const messageBody = newMessage.trim();
    const timestamp = new Date().toISOString();

    try {
      const messageData = {
        body: messageBody,
        contentType: "text",
        clientId: `web-${Date.now()}`,
      };

      await chatServiceRef.current.sendMessage(
        selectedConversation.id,
        messageData
      );

      setNewMessage("");

      updateConversationAfterMessage(
        selectedConversation.id,
        messageBody,
        timestamp,
        currentUserId
      );

      lastMessageIdRef.current = null;
      await fetchMessages(selectedConversation.id, true);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg =
        error?.response?.data?.message ||
        "Không thể gửi tin nhắn. Vui lòng thử lại.";
      const statusCode = error?.response?.status;
      messageHelper.error(
        message,
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsSending(false);
    }
  };

  // Get other participant's name
  const getOtherParticipant = useCallback(
    (conversation) => {
      const otherParticipant = conversation.participants?.find(
        (p) => p.userId !== currentUserId
      );

      if (!otherParticipant) {
        return "Người dùng";
      }

      if (otherParticipant.role === "Seller") {
        const userId = otherParticipant.userId;

        if (sellerCompanyNames[userId]) {
          return sellerCompanyNames[userId];
        }

        if (conversation.product?.seller?.companyName) {
          setSellerCompanyNames((prev) => ({
            ...prev,
            [userId]: conversation.product.seller.companyName,
          }));
          return conversation.product.seller.companyName;
        }

        fetchSellerCompanyNameBySellerId(userId).then((companyName) => {
          if (companyName) {
            setSellerCompanyNames((prev) => ({
              ...prev,
              [userId]: companyName,
            }));
          }
        });

        if (otherParticipant.fullName) {
          return otherParticipant.fullName;
        }
        if (otherParticipant.username) {
          return otherParticipant.username;
        }

        return "Người bán";
      }

      if (
        otherParticipant.role === "Buyer" ||
        otherParticipant.role === "Customer"
      ) {
        const userId = otherParticipant.userId;

        if (customerNames[userId]) {
          return customerNames[userId];
        }

        fetchCustomerName(userId).then((name) => {
          if (name) {
            setCustomerNames((prev) => ({
              ...prev,
              [userId]: name,
            }));
          }
        });

        try {
          const userString = localStorage.getItem("user");

          if (userString) {
            const userResponse = JSON.parse(userString);

            if (userResponse.data) {
              const storedUserId =
                userResponse.data.userId || userResponse.data.id;

              if (storedUserId === otherParticipant.userId) {
                const name =
                  userResponse.data.fullName || userResponse.data.username;
                return name || "Khách hàng";
              }
            }
          }
        } catch (error) {
          console.error("Error parsing user from localStorage:", error);
        }

        if (otherParticipant.user?.fullName) {
          return otherParticipant.user.fullName;
        }
        if (otherParticipant.user?.username) {
          return otherParticipant.user.username;
        }
        if (otherParticipant.fullName) {
          return otherParticipant.fullName;
        }
        if (otherParticipant.username) {
          return otherParticipant.username;
        }
        return "Khách hàng";
      }

      return otherParticipant.role || "Người dùng";
    },
    [
      currentUserId,
      sellerCompanyNames,
      customerNames,
      fetchSellerCompanyNameBySellerId,
      fetchCustomerName,
    ]
  );

  // Get message preview with sender name
  const getMessagePreview = useCallback(
    (conversation) => {
      if (!conversation.lastMessagePreview) {
        return "Chưa có tin nhắn";
      }

      const lastMessage = conversation.lastMessage;
      const isOwnMessage = lastMessage?.senderId === currentUserId;

      const preview = conversation.lastMessagePreview;
      const truncated =
        preview.length > 40 ? preview.substring(0, 40) + "..." : preview;

      if (isOwnMessage) {
        return `Bạn: ${truncated}`;
      }

      return truncated;
    },
    [currentUserId]
  );

  // Close conversation
  const handleCloseConversation = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }
    setSelectedConversation(null);
    setSearchParams({});
    setMessages([]);
    setIsPolling(false);
    lastMessageIdRef.current = null;
  }, [setSearchParams]);

  if (!authToken || !currentUserId) {
    return null;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
            <p className="text-gray-600 mt-1">
              Quản lý hội thoại của bạn
              {isPolling && (
                <span className="ml-2 text-green-600 text-xs">
                  • Đang cập nhật
                </span>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <div className="col-span-4 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                <p className="text-sm text-center">Chưa có hội thoại nào</p>
                <p className="text-xs text-center mt-1 text-gray-400">
                  Bắt đầu trò chuyện bằng cách nhấn "Liên hệ" trên trang sản
                  phẩm
                </p>
              </div>
            ) : (
              conversations.map((conversation) => {
                const unreadCount = unreadCounts[conversation.id] || 0;
                const hasUnread = unreadCount > 0;
                const isSelected = selectedConversation?.id === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    onClick={() => handleSelectConversation(conversation)}
                    className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-all relative ${
                      isSelected
                        ? "bg-green-50 border-l-4 border-l-green-500"
                        : hasUnread
                        ? "bg-blue-50"
                        : ""
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h3
                        className={`text-sm ${
                          hasUnread
                            ? "font-bold text-gray-900"
                            : "font-semibold text-gray-900"
                        }`}
                      >
                        {getOtherParticipant(conversation)}
                      </h3>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                        {conversation.lastMessageAt && (
                          <span className="text-xs text-gray-500">
                            {getRelativeTimeHanoi(conversation.lastMessageAt)}
                          </span>
                        )}
                        {hasUnread && (
                          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-green-500 rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <p
                      className={`text-sm truncate ${
                        hasUnread
                          ? "font-semibold text-gray-900"
                          : "text-gray-600"
                      }`}
                    >
                      {getMessagePreview(conversation)}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {getOtherParticipant(selectedConversation)}
                      </h2>
                      <p className="text-xs text-gray-500">
                        {isPolling ? "Đang hoạt động" : "Trò chuyện"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseConversation}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                    title="Đóng hội thoại"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
                      <p className="text-sm text-gray-500">
                        Đang tải tin nhắn...
                      </p>
                    </div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <svg
                        className="w-16 h-16 mx-auto mb-2 text-gray-300"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                        />
                      </svg>
                      <p className="text-sm">Chưa có tin nhắn</p>
                      <p className="text-xs mt-1">
                        Hãy bắt đầu cuộc trò chuyện!
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isOwnMessage = message.senderId === currentUserId;
                      const showTimeLabel =
                        index === 0 ||
                        new Date(message.createdAt).getTime() -
                          new Date(messages[index - 1].createdAt).getTime() >
                          300000;

                      return (
                        <React.Fragment key={message.id}>
                          {showTimeLabel && (
                            <div className="flex justify-center my-2">
                              <span className="text-xs text-gray-500 bg-white px-3 py-1 rounded-full shadow-sm">
                                {formatChatTimeHanoi(message.createdAt)}
                              </span>
                            </div>
                          )}
                          <div
                            className={`flex flex-col max-w-[70%] ${
                              isOwnMessage
                                ? "ml-auto items-end"
                                : "mr-auto items-start"
                            }`}
                          >
                            <div
                              className={`px-4 py-2.5 rounded-2xl shadow-sm ${
                                isOwnMessage
                                  ? "bg-green-500 text-white rounded-br-sm"
                                  : "bg-white text-gray-800 rounded-bl-sm"
                              }`}
                            >
                              <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                {message.body}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5 px-1">
                              <span className="text-xs text-gray-400">
                                {new Date(message.createdAt).toLocaleTimeString(
                                  "vi-VN",
                                  {
                                    timeZone: "Asia/Ho_Chi_Minh",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                  }
                                )}
                              </span>
                              {isOwnMessage && (
                                <svg
                                  className="w-4 h-4 text-gray-400"
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                          </div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="p-4 border-t border-gray-200 bg-white"
              >
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Nhập tin nhắn..."
                    disabled={isSending}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="w-12 h-12 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
                    title="Gửi tin nhắn"
                  >
                    {isSending ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <svg
                className="w-24 h-24 mb-4 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <p className="text-lg font-medium text-gray-600 mb-1">
                Chọn một hội thoại
              </p>
              <p className="text-sm text-center max-w-xs">
                Chọn một hội thoại từ danh sách bên trái để bắt đầu nhắn tin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
