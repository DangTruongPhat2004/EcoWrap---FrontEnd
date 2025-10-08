// src/services/chatApi.js
import api from "./apiClient";

export async function ensureConversation({ sellerId, customerId }) {
  const { data } = await api.post("/chats/conversations", {
    sellerId,
    customerId,
  });
  return data;
}

export async function getMessages(conversationId, { cursor, limit = 30 } = {}) {
  const { data } = await api.get(
    `/chats/conversations/${conversationId}/messages`,
    {
      params: { cursor, limit },
    }
  );
  return data; // { items, nextCursor }
}

export async function sendMessage(conversationId, payload) {
  const { data } = await api.post(
    `/chats/conversations/${conversationId}/messages`,
    payload
  );
  return data;
}

export async function markRead(conversationId, { messageId }) {
  const { data } = await api.post(
    `/chats/conversations/${conversationId}/messages/read`,
    { messageId }
  );
  return data; // true
}

export async function listMyConversations({ cursor, limit = 20 } = {}) {
  const { data } = await api.get("/chats/conversations", {
    params: { cursor, limit },
  });
  return data; // { items, nextCursor } (adjust to your BE)
}
