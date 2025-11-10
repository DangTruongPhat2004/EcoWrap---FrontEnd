import React, { useState, useEffect, useRef } from "react";
import { message } from "antd";
import ChatService from "../../services/chatService";

const ChatWindow = ({
  conversationId,
  currentUserId,
  authToken,
  sellerName,
  productName,
  onClose,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const chatServiceRef = useRef(null);
  const pollingIntervalRef = useRef(null);

  // Initialize chat service
  useEffect(() => {
    chatServiceRef.current = new ChatService(authToken);
  }, [authToken]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch messages
  const fetchMessages = async () => {
    try {
      const messagesList = await chatServiceRef.current.getMessages(
        conversationId
      );
      setMessages(messagesList);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchMessages().finally(() => setIsLoading(false));
  }, [conversationId]);

  // Setup polling for new messages (every 3 seconds)
  useEffect(() => {
    pollingIntervalRef.current = setInterval(() => {
      fetchMessages();
    }, 3000); // Poll every 3 seconds

    // Cleanup on unmount
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [conversationId]);

  // Send message
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    setIsSending(true);

    try {
      const messageData = {
        body: newMessage.trim(),
        contentType: "text",
        clientId: `web-${Date.now()}`,
      };

      await chatServiceRef.current.sendMessage(conversationId, messageData);

      setNewMessage("");

      // Immediately fetch new messages after sending
      await fetchMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg =
        error?.response?.data?.message ||
        "Không thể gửi tin nhắn. Vui lòng thử lại.";
      const statusCode = error?.response?.status;
      message.error(
        `${errorMsg}${statusCode ? ` (Mã lỗi: ${statusCode})` : ""}`
      );
    } finally {
      setIsSending(false);
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white w-full max-w-lg h-[600px] rounded-2xl flex flex-col shadow-2xl animate-slideUp m-4 md:m-0">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-5 rounded-t-2xl flex justify-between items-center shadow-md">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{sellerName}</h3>
            <p className="text-sm opacity-90 truncate">About: {productName}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-3 w-9 h-9 flex items-center justify-center rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 text-2xl leading-none flex-shrink-0"
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-5 bg-gray-50 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin mb-3"></div>
              <p>Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderId === currentUserId;

              return (
                <div
                  key={message.id}
                  className={`flex flex-col max-w-[75%] animate-messageAppear ${
                    isOwnMessage
                      ? "self-end items-end"
                      : "self-start items-start"
                  }`}
                >
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm break-words ${
                      isOwnMessage
                        ? "bg-green-500 text-white rounded-br-sm"
                        : "bg-white text-gray-800 rounded-bl-sm"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.body}</p>
                    {message.attachmentUrl &&
                      message.attachmentUrl !== "string" && (
                        <div
                          className={`mt-2 pt-2 text-xs ${
                            isOwnMessage
                              ? "border-t border-white border-opacity-20"
                              : "border-t border-gray-200"
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
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form
          onSubmit={handleSendMessage}
          className="flex gap-3 p-4 bg-white border-t border-gray-200 rounded-b-2xl"
        >
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSending || !newMessage.trim()}
            className="w-11 h-11 flex items-center justify-center rounded-full bg-green-500 text-white hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95 flex-shrink-0"
          >
            {isSending ? (
              <span className="text-lg">⏳</span>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

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

        .animate-fadeIn {
          animation: fadeIn 0.2s ease;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }

        .animate-messageAppear {
          animation: messageAppear 0.3s ease;
        }

        /* Custom scrollbar */
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb {
          background: #9ca3af;
          border-radius: 3px;
        }

        .scrollbar-thumb-gray-400::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default ChatWindow;
