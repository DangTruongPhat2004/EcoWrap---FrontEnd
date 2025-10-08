// src/components/chat/ConversationList.jsx
import React, { useMemo } from "react";
import { Card, CardBody, Button } from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listMyConversations } from "../../services/chatApi";
import { useNavigate } from "react-router-dom";

export default function ConversationList() {
  const navigate = useNavigate();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["chat", "conversations"],
      queryFn: ({ pageParam }) =>
        listMyConversations({ cursor: pageParam, limit: 20 }),
      getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
    });

  const items = useMemo(
    () => (data?.pages || []).flatMap((p) => p.items || []),
    [data]
  );

  return (
    <Card>
      <CardBody className="space-y-3">
        <div className="text-lg font-semibold">Hội thoại của tôi</div>
        <div className="divide-y">
          {items.map((c) => (
            <div key={c.id} className="py-3 flex items-center justify-between">
              <div>
                <div className="font-medium">
                  #{c.id}{" "}
                  {c.lastMessagePreview ? `· ${c.lastMessagePreview}` : ""}
                </div>
                <div className="text-sm text-gray-500">
                  {c.isClosed ? "Đã đóng" : "Đang mở"}
                </div>
              </div>
              <Button size="sm" onPress={() => navigate(`/chat/${c.id}`)}>
                Mở
              </Button>
            </div>
          ))}
        </div>

        {hasNextPage && (
          <Button
            variant="flat"
            onPress={() => fetchNextPage()}
            isLoading={isFetchingNextPage}
          >
            Tải thêm
          </Button>
        )}
      </CardBody>
    </Card>
  );
}
