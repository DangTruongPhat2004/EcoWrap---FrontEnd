// src/components/chat/ConversationsSidebar.jsx
import React, { useMemo, useState } from "react";
import {
  Card,
  CardBody,
  Input,
  Button,
  Spinner,
  Avatar,
} from "@nextui-org/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { listMyConversations } from "../../services/chatApi";
import { Search, Plus } from "lucide-react";
import dayjs from "dayjs";
import { useConversationPartner } from "../../hooks/useConversationPartner";

function formatTime(iso) {
  if (!iso) return "";
  const d = dayjs(iso);
  const today = dayjs();
  if (d.isSame(today, "day")) return d.format("HH:mm");
  if (d.isSame(today.subtract(1, "day"), "day")) return "Hôm qua";
  if (d.year() === today.year()) return d.format("DD/MM");
  return d.format("DD/MM/YYYY");
}

function ConversationRow({ c, active, onClick }) {
  // Lấy partner từ /chats/conversations/:id -> participants -> /users/:id
  const { isLoading, partnerName, partnerAvatar } = useConversationPartner(
    c.id
  );

  return (
    <button
      onClick={onClick}
      className={`w-full text-left py-3 px-2 block hover:bg-gray-50 rounded-lg ${
        active ? "bg-emerald-50" : ""
      }`}
      title={`#${c.id}`}
    >
      <div className="flex items-center gap-3">
        <Avatar
          radius="sm"
          name={(partnerName || `#${c.id}`).slice(0, 2)}
          src={partnerAvatar || undefined}
          size="sm"
          className="border border-gray-300 rounded-2xl bg-gray-200"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="font-medium truncate">
              {isLoading ? `#${c.id}` : partnerName || `#${c.id}`}
            </div>
            <div className="text-[11px] text-gray-500 shrink-0">
              {formatTime(c.lastMessageAt)}
            </div>
          </div>
          <div className="text-xs text-gray-600 truncate">
            {c.lastMessagePreview || "Chưa có tin nhắn"}
          </div>
          {!c.isClosed ? null : (
            <div className="mt-1 text-[10px] text-gray-400">Đã đóng</div>
          )}
        </div>
      </div>
    </button>
  );
}

export default function ConversationsSidebar({
  selectedId,
  onSelect,
  className = "",
}) {
  const [q, setQ] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ["chat", "conversations"],
    queryFn: ({ pageParam }) =>
      listMyConversations({ cursor: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });

  // Flatten + sort theo lastMessageAt desc (null xuống cuối)
  const sorted = useMemo(() => {
    const flat = (data?.pages || []).flatMap((p) => p.items || []);
    return [...flat].sort((a, b) => {
      if (!a.lastMessageAt && !b.lastMessageAt) return b.id - a.id;
      if (!a.lastMessageAt) return 1;
      if (!b.lastMessageAt) return -1;
      return (
        dayjs(b.lastMessageAt).valueOf() - dayjs(a.lastMessageAt).valueOf()
      );
    });
  }, [data]);

  // Filter theo q: id hoặc preview (partnerName load async nên filter theo id/preview trước)
  const items = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return sorted;
    return sorted.filter((c) => {
      const idMatch = String(c.id).includes(keyword);
      const prev = (c.lastMessagePreview || "").toLowerCase();
      return idMatch || prev.includes(keyword);
    });
  }, [sorted, q]);

  return (
    <Card className={`h-full ${className}`}>
      <CardBody className="h-full flex flex-col gap-3 p-3">
        {/* Header + search */}
        <div className="flex items-center gap-2">
          <div className="text-base font-semibold flex-1">Tin nhắn</div>
          <Button size="sm" variant="flat" startContent={<Plus size={14} />}>
            Mới
          </Button>
        </div>
        <Input
          value={q}
          onValueChange={setQ}
          placeholder="Tìm theo tên hoặc nội dung"
          startContent={<Search size={16} className="gap-3" />}
          classNames={{ inputWrapper: "h-10" }}
        />

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y">
          {status === "pending" && (
            <div className="h-full flex items-center justify-center">
              <Spinner label="Đang tải hội thoại..." />
            </div>
          )}

          {items.map((c) => (
            <ConversationRow
              key={c.id}
              c={c}
              active={c.id === selectedId}
              onClick={() => onSelect?.(c)}
            />
          ))}

          {hasNextPage && (
            <div className="p-2">
              <Button
                fullWidth
                variant="flat"
                onPress={() => fetchNextPage()}
                isLoading={isFetchingNextPage}
              >
                Tải thêm
              </Button>
            </div>
          )}

          {!isFetching && items.length === 0 && (
            <div className="h-full w-full flex items-center justify-center text-gray-500">
              Không có hội thoại
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
}
