// src/hooks/useConversationPartner.js
import { useQuery } from "@tanstack/react-query";
import api from "../services/apiClient";
import { getUserById } from "../services/userApi";
import { useMyUserId } from "./useMyUserId";

/** Lấy meta hội thoại: participants, lastMessage..., v.v. */
async function fetchConversationMeta(conversationId) {
  const { data } = await api.get(`/chats/conversations/${conversationId}`);
  return data; // cần có participants: [{ userId, role }, ...]
}

export function useConversationPartner(conversationId) {
  const { myUserId } = useMyUserId({ fallbackUserId: 2 });

  // 1) details (để lấy participants)
  const convoQuery = useQuery({
    queryKey: ["chat", "meta", conversationId],
    queryFn: () => fetchConversationMeta(conversationId),
    enabled: !!conversationId,
    staleTime: 60_000,
  });

  const participants = convoQuery.data?.participants || [];
  const partnerId = participants.find((p) => p.userId !== myUserId)?.userId;

  // 2) user profile
  const userQuery = useQuery({
    queryKey: ["user", partnerId],
    queryFn: () => getUserById(partnerId),
    enabled: !!partnerId,
    staleTime: 5 * 60_000,
  });

  const partnerName =
    userQuery.data?.fullName ||
    userQuery.data?.username ||
    (partnerId ? `User #${partnerId}` : "");

  const partnerAvatar = userQuery.data?.profilePicture || null;

  return {
    isLoading: convoQuery.isLoading || userQuery.isLoading,
    isError: convoQuery.isError || userQuery.isError,
    partnerId,
    partnerName,
    partnerAvatar,
  };
}
