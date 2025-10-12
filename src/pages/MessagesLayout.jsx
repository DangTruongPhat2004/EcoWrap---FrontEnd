// src/pages/MessagesLayout.jsx
import React, { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConversationsSidebar from "../components/chat/ConversationsSidebar";
import ChatWindow from "../components/chat/ChatWindow";
import { Card, CardBody } from "@nextui-org/react";

export default function MessagesLayout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const conversationId = useMemo(() => (id ? Number(id) : undefined), [id]);

  return (
    // Chiều cao toàn trang trừ Header 80px, KHÓA cuộn ngoài
    <div className="h-[calc(100vh-80px)] max-h-[calc(100vh-80px)] p-3 overflow-hidden">
      {/* min-h-0 để con có thể overflow */}
      <div className="grid grid-cols-12 gap-3 h-full min-h-0">
        {/* Sidebar (left) */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 h-full min-h-0 overflow-hidden">
          {/* Bản thân Sidebar sẽ có scroll ở list bên trong */}
          <ConversationsSidebar
            selectedId={conversationId}
            onSelect={(c) => navigate(`/messages/${c.id}`)}
            className="h-full min-h-0"
          />
        </div>

        {/* Content (right) */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 h-full min-h-0 overflow-hidden">
          {conversationId ? (
            // ChatWindow quản lý scroll ở vùng messages
            <ChatWindow conversationId={conversationId} />
          ) : (
            <Card className="h-full min-h-0">
              <CardBody className="h-full min-h-0 flex items-center justify-center text-gray-500">
                Chọn một hội thoại ở bên trái để bắt đầu.
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
