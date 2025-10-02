import React from "react";
import {
  Drawer,
  DrawerContent,
  Input,
  Button,
  Spinner,
} from "@nextui-org/react";

function BotBubble({ text }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
        G
      </div>
      <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex gap-3 items-start justify-end">
      <div className="bg-emerald-600 text-white rounded-2xl px-3 py-2 text-sm max-w-[80%] whitespace-pre-wrap">
        {text}
      </div>
    </div>
  );
}

export default function GeminiChatWidget({ open, onClose }) {
  const [messages, setMessages] = React.useState([
    {
      role: "user",
      content: "Xin chào! Mình là Gemini. Bạn cần hỗ trợ gì về EcoWrap?",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // Auto-scroll xuống cuối khi có message mới
  const endRef = React.useRef(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (loading) return;
    const text = input.trim();
    if (!text) return;

    // Lấy lịch sử trước khi setState để tránh “stale”
    const history = [...messages, { role: "customer", content: text }];

    // Hiển thị ngay tin nhắn người dùng
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // credentials: "include", // bật nếu bạn cần cookie; không thì bỏ
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role, // "assistant" | "user"
            content: m.content,
          })),
        }),
      });

      const textBody = await res.text(); // lấy raw để log khi lỗi
      let data = {};
      try {
        data = textBody ? JSON.parse(textBody) : {};
      } catch {
        // server trả HTML/lỗi không phải JSON
        data = {
          reply: "",
          error: true,
          message: "Invalid JSON",
          detail: textBody,
        };
      }

      if (!res.ok || data?.error) {
        console.warn("Gemini /ai/chat error:", res.status, data);
        const reason =
          data?.detail ||
          data?.message ||
          `Request failed with status ${res.status}`;
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Xin lỗi, có lỗi khi gọi Gemini.\nChi tiết: " +
              String(reason).slice(0, 800),
          },
        ]);
        return;
      }

      const reply = data?.reply ?? "(không nhận được phản hồi)";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Xin lỗi, không kết nối được tới máy chủ.\n" +
            String(e?.message ?? e),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return; // cho phép xuống dòng
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Drawer
      isOpen={open}
      onClose={onClose}
      placement="right"
      size="lg"
      hideCloseButton
    >
      <DrawerContent className="p-0">
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-14 flex items-center justify-between px-4 border-b bg-white/80 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center">
                G
              </div>
              <div>
                <div className="font-semibold">Gemini Chat</div>
                <div className="text-xs text-gray-500">
                  Hỏi đáp sản phẩm • Gợi ý đóng gói xanh
                </div>
              </div>
            </div>
            <Button size="sm" variant="light" onPress={onClose}>
              Đóng
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-white to-emerald-50/30">
            {messages.map((m, i) =>
              m.role === "assistant" ? (
                <BotBubble key={i} text={m.content} />
              ) : (
                <UserBubble key={i} text={m.content} />
              )
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm">
                  <Spinner size="sm" className="mr-2" /> Đang soạn…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Input */}
          <div className="border-t p-3 bg-white">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập câu hỏi…"
                value={input}
                onValueChange={setInput}
                onKeyDown={onKeyDown}
                variant="bordered"
                color="success"
                classNames={{
                  inputWrapper:
                    "h-12 border-gray-200 data-[focus=true]:border-emerald-500",
                }}
              />
              <Button
                onPress={sendMessage}
                className="h-12 bg-emerald-600 text-white"
                isDisabled={loading || !input.trim()}
              >
                Gửi
              </Button>
            </div>
            <div className="text-[11px] text-gray-500 mt-1">
              *Đừng để lộ thông tin nhạy cảm. API key được bảo vệ ở backend.
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
