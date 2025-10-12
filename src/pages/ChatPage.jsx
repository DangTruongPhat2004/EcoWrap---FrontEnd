// src/pages/ChatPage.jsx
import React from "react";
import { useParams } from "react-router-dom";
import ChatWindow from "../components/chat/ChatWindow";

export default function ChatPage() {
  const { id } = useParams();
  const conversationId = Number(id);
  return (
    <div className="max-w-4xl mx-auto p-4">
      <ChatWindow conversationId={conversationId} />
    </div>
  );
}
