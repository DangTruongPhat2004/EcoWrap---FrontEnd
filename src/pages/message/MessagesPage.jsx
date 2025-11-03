import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatService from "../../services/chatService";

const MessagesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Auth state
  const authToken = localStorage.getItem("token");
  const userString = localStorage.getItem("user");
  let currentUserId = null;
  let currentUser = null;

  if (userString) {
    try {
      const userResponse = JSON.parse(userString);
      if (userResponse.data) {
        currentUser = userResponse.data;
        currentUserId = currentUser.userId || currentUser.id;
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

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const chatServiceRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const lastMessageCountRef = useRef(0);

  // Initialize chat service
  useEffect(() => {
    if (!authToken || !currentUserId) {
      alert("Vui lòng đăng nhập để xem tin nhắn");
      navigate("/login");
      return;
    }
    chatServiceRef.current = new ChatService(authToken);
  }, [authToken, currentUserId, navigate]);

  // Fetch conversations on mount
  useEffect(() => {
    if (chatServiceRef.current) {
      fetchConversations();
    }
  }, []);

  // Handle conversation selection from URL params
  useEffect(() => {
    const conversationId = searchParams.get("conversation");
    if (conversationId && conversations.length > 0) {
      const conversation = conversations.find(
        (c) => c.id === parseInt(conversationId)
      );
      if (conversation) {
        handleSelectConversation(conversation);
      }
    }
  }, [searchParams, conversations]);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    // Only scroll if new messages were added
    if (messages.length > lastMessageCountRef.current) {
      scrollToBottom();
    }
    lastMessageCountRef.current = messages.length;
  }, [messages]);

  // Fetch all conversations
  const fetchConversations = async () => {
    setLoading(true);
    try {
      const conversationsList =
        await chatServiceRef.current.getUserConversations();
      setConversations(conversationsList);
    } catch (error) {
      console.error("Error fetching conversations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    try {
      const messagesList = await chatServiceRef.current.getMessages(
        conversationId
      );

      // FIXED: Sort messages by createdAt in ascending order (oldest first)
      // This ensures newest messages appear at the bottom
      const sortedMessages = [...messagesList].sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });

      setMessages(sortedMessages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Handle conversation selection
  const handleSelectConversation = async (conversation) => {
    setSelectedConversation(conversation);
    setSearchParams({ conversation: conversation.id });
    setLoadingMessages(true);
    lastMessageCountRef.current = 0; // Reset counter

    // Stop polling for previous conversation
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    await fetchMessages(conversation.id);
    setLoadingMessages(false);

    // Start polling for new messages every 2 seconds
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages(conversation.id);
    }, 2000); // Reduced to 2 seconds for more real-time feel
  };

  // Cleanup polling on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedConversation) return;

    setIsSending(true);

    try {
      const messageData = {
        body: newMessage.trim(),
        contentType: "text",
        clientId: `web-${Date.now()}`,
      };

      await chatServiceRef.current.sendMessage(
        selectedConversation.id,
        messageData
      );

      setNewMessage("");

      // Immediately fetch new messages after sending
      await fetchMessages(selectedConversation.id);
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Không thể gửi tin nhắn. Vui lòng thử lại.");
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
      });
    }
  };

  // Get other participant's name
  const getOtherParticipant = (conversation) => {
    const otherParticipant = conversation.participants?.find(
      (p) => p.userId !== currentUserId
    );
    return otherParticipant?.role === "Seller" ? "Người bán" : "Khách hàng";
  };

  if (!authToken || !currentUserId) {
    return null;
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tin nhắn</h1>
        <p className="text-gray-600 mt-1">Quản lý hội thoại của bạn</p>
      </div>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
        {/* Conversation List */}
        <div className="col-span-4 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <input
              type="text"
              placeholder="Tìm kiếm hội thoại..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
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
                <p className="text-xs text-center mt-1">
                  Bắt đầu trò chuyện bằng cách nhấn "Liên hệ" trên trang sản
                  phẩm
                </p>
              </div>
            ) : (
              conversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => handleSelectConversation(conversation)}
                  className={`w-full p-4 border-b border-gray-200 hover:bg-gray-50 text-left transition-colors ${
                    selectedConversation?.id === conversation.id
                      ? "bg-green-50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm">
                      {getOtherParticipant(conversation)}
                    </h3>
                    {conversation.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {formatTime(conversation.lastMessageAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessagePreview || "Chưa có tin nhắn"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="col-span-8 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-gray-900">
                      {getOtherParticipant(selectedConversation)}
                    </h2>
                    <p className="text-xs text-gray-500">
                      Trò chuyện ID: {selectedConversation.id}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedConversation(null);
                      setSearchParams({});
                      setMessages([]);
                      lastMessageCountRef.current = 0;
                      if (pollingIntervalRef.current) {
                        clearInterval(pollingIntervalRef.current);
                      }
                    }}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <svg
                      className="w-6 h-6"
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

              {/* Messages - FIXED: Messages now display from top to bottom (oldest to newest) */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 bg-gray-50"
              >
                {loadingMessages ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-sm">
                      Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwnMessage = message.senderId === currentUserId;

                      return (
                        <div
                          key={message.id}
                          className={`flex flex-col max-w-[75%] animate-messageAppear ${
                            isOwnMessage
                              ? "ml-auto items-end"
                              : "mr-auto items-start"
                          }`}
                        >
                          <div
                            className={`px-4 py-3 rounded-2xl ${
                              isOwnMessage
                                ? "bg-green-500 text-white rounded-br-sm"
                                : "bg-white text-gray-800 rounded-bl-sm shadow-sm"
                            }`}
                          >
                            <p className="text-sm leading-relaxed break-words">
                              {message.body}
                            </p>
                            {message.attachmentUrl &&
                              message.attachmentUrl !== "string" && (
                                <div
                                  className={`mt-2 pt-2 text-xs border-t ${
                                    isOwnMessage
                                      ? "border-white border-opacity-20"
                                      : "border-gray-200"
                                  }`}
                                >
                                  <a
                                    href={message.attachmentUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    📎 {message.attachmentName || "Attachment"}
                                  </a>
                                </div>
                              )}
                          </div>
                          <span className="text-xs text-gray-500 mt-1 px-1">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      );
                    })}
                    {/* Scroll anchor - placed at the end */}
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 disabled:bg-gray-100"
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="w-11 h-11 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all"
                  >
                    {isSending ? (
                      <span className="text-lg">⏳</span>
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
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
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
              <p className="text-lg font-medium mb-2">Chọn một hội thoại</p>
              <p className="text-sm text-center">
                Chọn một hội thoại từ danh sách bên trái
                <br />
                để bắt đầu nhắn tin
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add message animation styles */}
      <style jsx>{`
        @keyframes messageAppear {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-messageAppear {
          animation: messageAppear 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default MessagesPage;
