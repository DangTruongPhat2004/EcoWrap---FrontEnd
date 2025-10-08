// src/pages/ConversationsPage.jsx
import React from "react";
import ConversationList from "../components/chat/ConversationList";

export default function ConversationsPage() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <ConversationList />
    </div>
  );
}
