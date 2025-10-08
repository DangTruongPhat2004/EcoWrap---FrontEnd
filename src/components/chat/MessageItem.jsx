// src/components/chat/MessageItem.jsx
import React, { useMemo } from "react";
import dayjs from "dayjs";

export default function MessageItem({ msg, myUserId }) {
  const mine = msg.senderId === myUserId;
  const time = useMemo(
    () => dayjs(msg.createdAt).format("HH:mm"),
    [msg.createdAt]
  );

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} px-2`}>
      <div
        className={`${
          mine ? "bg-emerald-500 text-white" : "bg-gray-100"
        } rounded-2xl px-3 py-2 max-w-[78%] shadow-sm`}
      >
        {msg.attachmentUrl ? (
          <a
            href={msg.attachmentUrl}
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {msg.attachmentName || msg.attachmentUrl}
          </a>
        ) : (
          <div className="whitespace-pre-wrap break-words">{msg.body}</div>
        )}
        <div
          className={`text-[11px] mt-1 ${
            mine ? "text-white/80" : "text-gray-500"
          }`}
        >
          {time}
        </div>
      </div>
    </div>
  );
}
