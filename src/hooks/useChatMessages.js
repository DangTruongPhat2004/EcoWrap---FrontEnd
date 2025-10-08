// src/hooks/useChatMessages.js
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { getMessages, sendMessage, markRead } from "../services/chatApi";
import { useMyUserId } from "./useMyUserId"; // Assuming you have this to get the current user's ID

export function useChatMessages(conversationId) {
  const qc = useQueryClient();
  const { myUserId } = useMyUserId(); // Get the sender's ID for the optimistic message

  const messagesQuery = useInfiniteQuery({
    queryKey: ["chat", conversationId, "messages"],
    queryFn: ({ pageParam }) =>
      getMessages(conversationId, { cursor: pageParam, limit: 30 }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    enabled: !!conversationId,
  });

  const sendMutation = useMutation({
    mutationFn: (payload) => sendMessage(conversationId, payload),

    // ✅ This is the core of the optimistic update
    onMutate: async (newMessage) => {
      // 1. Cancel any outgoing refetches so they don't overwrite our optimistic update
      await qc.cancelQueries({
        queryKey: ["chat", conversationId, "messages"],
      });

      // 2. Snapshot the previous value
      const previousMessages = qc.getQueryData([
        "chat",
        conversationId,
        "messages",
      ]);

      // 3. Create the optimistic message with a temporary unique ID
      const optimisticMessage = {
        id: `temp-${Date.now()}`, // Generate a temporary, unique key
        createdAt: new Date().toISOString(),
        senderId: myUserId, // Make sure you have the current user's ID
        body: newMessage.body,
        contentType: newMessage.contentType,
        // Add other properties as needed to match your data structure
      };

      // 4. Optimistically update to the new value
      qc.setQueryData(["chat", conversationId, "messages"], (old) => {
        if (!old) {
          return {
            pages: [{ items: [optimisticMessage], nextCursor: null }],
            pageParams: [undefined],
          };
        }
        const first = old.pages?.[0] ?? { items: [], nextCursor: null };
        const newFirst = {
          ...first,
          items: [optimisticMessage, ...first.items],
        };
        return { ...old, pages: [newFirst, ...old.pages.slice(1)] };
      });

      // 5. Return a context object with the snapshotted value
      return { previousMessages };
    },

    // If the mutation fails, use the context returned from onMutate to roll back
    onError: (err, newMessage, context) => {
      qc.setQueryData(
        ["chat", conversationId, "messages"],
        context.previousMessages
      );
    },

    // Always refetch after error or success to make sure our data is correct
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["chat", conversationId, "messages"] });
    },
  });

  const readMutation = useMutation({
    mutationFn: ({ messageId }) => markRead(conversationId, { messageId }),
  });

  return { messagesQuery, sendMutation, readMutation };
}
