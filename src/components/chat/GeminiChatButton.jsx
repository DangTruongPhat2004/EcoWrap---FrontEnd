import React from "react";
import { Button, Badge } from "@nextui-org/react";
import { MessageSquare } from "lucide-react";

export default function GeminiChatButton({ onOpen, unread = 0 }) {
  return (
    <div className="fixed bottom-5 right-5 z-[9999]">
      <div className="relative">
        {unread > 0 && (
          <Badge
            content={unread}
            color="success"
            className="absolute -top-2 -right-2"
            size="sm"
          />
        )}
        <Button
          onPress={onOpen}
          radius="full"
          className="
            h-14 w-14 p-0 shadow-2xl
            bg-gradient-to-br from-emerald-500 to-green-600 text-white
            hover:opacity-90
          "
          aria-label="Mở Gemini Chat"
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
