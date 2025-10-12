// src/components/chat/ChatWindow.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
  Avatar,
} from "@nextui-org/react";
import {
  getChatConnection,
  ensureConnected,
  joinConversation,
  bindAutoRejoin,
  onMessageCreated,
  onReadReceipt,
  offAll,
} from "../../hubs/chatHub";
import MessageItem from "./MessageItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../services/apiClient";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useMyUserId } from "../../hooks/useMyUserId";
import { useConversationPartner } from "../../hooks/useConversationPartner";

async function fetchConversation(conversationId) {
  const { data } = await api.get(`/chats/conversations/${conversationId}`);
  return data;
}

export default function ChatWindow({
  conversationId,
  getToken,
  myUserId: myUserIdProp,
}) {
  // ===== Hooks =====
  const listRef = useRef(null);
  const [text, setText] = useState("");
  const qc = useQueryClient();

  const { myUserId: myIdFromJwt } = useMyUserId({
    getToken,
    fallbackUserId: 2,
    myUserIdProp,
  });
  const myUserId = myUserIdProp ?? myIdFromJwt ?? 2;

  const convoQuery = useQuery({
    queryKey: ["chat", conversationId, "meta"],
    queryFn: () => fetchConversation(conversationId),
    enabled: !!conversationId,
  });

  const { messagesQuery, sendMutation, readMutation } =
    useChatMessages(conversationId);

  const { partnerName, partnerAvatar } = useConversationPartner(conversationId);

  const allMessages = useMemo(() => {
    const pages = messagesQuery.data?.pages || [];
    const items = pages.flatMap((p) => p.items || []);
    return [...items].reverse();
  }, [messagesQuery.data]);

  const lastIncomingId = useMemo(() => {
    for (let i = allMessages.length - 1; i >= 0; i--) {
      const m = allMessages[i];
      if (m.senderId !== myUserId) return m.id;
    }
    return undefined;
  }, [allMessages, myUserId]);

  const sentReadRef = useRef(new Set());

  // ===== Effects =====
  useEffect(() => {
    if (!conversationId) return;
    const connection = getChatConnection();
    const handleMessageCreated = (msg) => {
      if (msg.conversationId !== conversationId) return;
      qc.setQueryData(["chat", conversationId, "messages"], (old) => {
        if (!old) return old;
        const first = old.pages?.[0] ?? { items: [], nextCursor: null };
        const newFirst = { ...first, items: [msg, ...first.items] };
        return { ...old, pages: [newFirst, ...old.pages.slice(1)] };
      });
    };
    const setupConnection = async () => {
      try {
        await ensureConnected();
        await joinConversation(conversationId);
        onMessageCreated(handleMessageCreated);
        onReadReceipt(() => {});
      } catch (error) {
        console.error("Failed to setup SignalR connection:", error);
      }
    };
    setupConnection();
    const cleanupRejoin = bindAutoRejoin(conversationId);
    return () => {
      offAll();
      cleanupRejoin();
    };
  }, [conversationId, qc]);

  // Auto scroll to bottom khi có thêm message
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [allMessages.length]);

  // Gửi read-receipt cho tin nhắn đến mới nhất
  useEffect(() => {
    if (lastIncomingId && !sentReadRef.current.has(lastIncomingId)) {
      sentReadRef.current.add(lastIncomingId);
      readMutation.mutate({ messageId: lastIncomingId });
      if (sentReadRef.current.size > 2000) {
        sentReadRef.current = new Set(
          Array.from(sentReadRef.current).slice(-1000)
        );
      }
    }
  }, [lastIncomingId, readMutation]);

  // Reset cache read-receipt khi đổi cuộc trò chuyện
  useEffect(() => {
    sentReadRef.current.clear();
  }, [conversationId]);

  // ===== Handlers =====
  async function handleSend() {
    const body = text.trim();
    if (!body) return;
    setText("");
    await sendMutation.mutateAsync({ body, contentType: "text" });
  }

  // ===== Loading =====
  if (convoQuery.isLoading || messagesQuery.isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner label="Đang tải hội thoại..." />
      </div>
    );
  }

  // ===== UI =====
  return (
    // Quan trọng: h-full + min-h-0 + overflow-hidden để phần Messages là chỗ CUỘN DUY NHẤT
    <Card className="h-full min-h-0 flex flex-col overflow-hidden">
      <CardBody className="h-full min-h-0 p-0 flex flex-col overflow-hidden">
        {/* Header (cố định) */}
        <div className="shrink-0 px-4 py-3 border-b border-default-200">
          <div className="flex items-center gap-3 min-w-0  ">
            <Avatar
              radius="sm"
              src={partnerAvatar || undefined}
              name={(partnerName || `#${conversationId}`).slice(0, 2)}
              size="sm"
              className="border border-gray-300 rounded-2xl bg-gray-200"
            />
            <div className="min-w-0">
              <div className="font-semibold truncate">
                {partnerName || `#${conversationId}`}
              </div>
            </div>
          </div>
        </div>

        {/* Messages (CUỘN ở đây) */}
        <div
          ref={listRef}
          className="flex-1 min-h-0 overflow-y-auto px-3 py-2 space-y-2 bg-content2"
        >
          {allMessages.map((m) => (
            <MessageItem key={m.id} msg={m} myUserId={myUserId} />
          ))}

          {allMessages.length === 0 && (
            <div className="h-full w-full flex items-center justify-center text-default-500">
              Chưa có tin nhắn. Hãy bắt đầu cuộc trò chuyện!
            </div>
          )}
        </div>

        {/* Composer (cố định) */}
        <div className="shrink-0 px-3 py-3 border-t border-default-200">
          <div className="flex items-center gap-2">
            <Input
              value={text}
              onValueChange={setText}
              placeholder="Nhập tin nhắn..."
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              classNames={{ inputWrapper: "h-12" }}
            />
            <Button
              color="success"
              isLoading={sendMutation.isPending}
              onPress={handleSend}
              className="h-12"
            >
              Gửi
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
