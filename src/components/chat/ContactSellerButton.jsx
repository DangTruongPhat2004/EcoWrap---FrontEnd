// src/components/chat/ContactSellerButton.jsx
import React, { useState } from "react";
import { Button } from "@nextui-org/react";
import { MessageSquare } from "lucide-react";
import { ensureConversation } from "../../services/chatApi";
import { useNavigate } from "react-router-dom";

function getLsUserId() {
  try {
    const raw = localStorage.getItem("user");
    const obj = raw ? JSON.parse(raw) : null;
    const id = obj?.userId;
    return Number.isFinite(Number(id)) ? Number(id) : undefined;
  } catch {
    return undefined;
  }
}

export default function ContactSellerButton({ sellerId }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const customerId = getLsUserId(); // e.g., 2

  async function handleClick() {
    try {
      setLoading(true);
      if (!customerId)
        throw new Error("Không tìm thấy userId trong localStorage");
      const convo = await ensureConversation({ sellerId, customerId });
      navigate(`/chat/${convo.id}`);
    } catch (e) {
      console.error("Create conversation failed", e);
      // TODO: toast error
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      color="success"
      startContent={<MessageSquare size={18} />}
      isLoading={loading}
      onPress={handleClick}
    >
      Liên hệ
    </Button>
  );
}
