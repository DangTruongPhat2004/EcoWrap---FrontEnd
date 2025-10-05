import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  Drawer,
  DrawerContent,
  Input,
  Button,
  Spinner,
  Switch, // <-- thêm cái này
} from "@nextui-org/react";

// --- FIX: tách & loại TL;DR khỏi phần body, tách "Nguồn" thông minh ---
function parseRagMessage(text = "") {
  let work = text;

  // TL;DR có thể ở dạng "TL;DR" hoặc "**TL;DR**"
  const tldrRegexes = [
    /(^|\n)\s*\*\*?TL;DR\*\*?[:\s]*\n?([\s\S]+?)(\n{2,}|$)/i,
    /(^|\n)\s*TL;DR[:\s]*\n?([\s\S]+?)(\n{2,}|$)/i,
  ];

  let tldr = "";
  for (const rx of tldrRegexes) {
    const m = work.match(rx);
    if (m) {
      tldr = (m[2] || "").trim();
      // loại bỏ block TL;DR khỏi phần body
      work = (
        work.slice(0, m.index) + work.slice(m.index + m[0].length)
      ).trim();
      break;
    }
  }

  // Tách phần "Nguồn" (tìm header hoặc --- + **Nguồn)
  const srcHeader =
    /(^|\n)(#+\s*nguồn|#+\s*nguồn trích dẫn|\*\*\s*nguồn|\*\*\s*nguồn trích dẫn)/i;
  const sepIdx = work.search(srcHeader);
  let body = work;
  let sourcesBlock = "";
  if (sepIdx >= 0) {
    body = work.slice(0, sepIdx).trim();
    sourcesBlock = work.slice(sepIdx).trim();
  }

  // Parse các dòng dạng [C1, Title — Source]
  const sources = [];
  const sourceRegex = /\[C(\d+)\s*,\s*([^\]]+?)\s*—\s*([^\]]+?)\]/g;
  let m;
  while ((m = sourceRegex.exec(sourcesBlock))) {
    sources.push({ cid: `C${m[1]}`, title: m[2].trim(), source: m[3].trim() });
  }

  return { tldr, body, sources };
}

function SourcesList({ items = [] }) {
  if (!items.length) return null;
  return (
    <div className="mt-3">
      <div className="text-xs font-semibold text-gray-600 mb-1">
        Nguồn trích dẫn
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((s, i) => (
          <li
            key={i}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1 flex items-center gap-2"
          >
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
              {s.cid}
            </span>
            <span className="font-medium">{s.title}</span>
            <span className="text-gray-500">— {s.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BotBubble({ text }) {
  const { tldr, body, sources } = parseRagMessage(text);

  return (
    <div className="flex gap-3 items-start">
      <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-semibold">
        G
      </div>
      <div className="bg-gray-100 rounded-2xl px-3 py-2 text-sm max-w-[80%]">
        {tldr && (
          <div className="mb-2 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2">
            <div className="text-xs font-semibold text-emerald-700 mb-1">
              TL;DR
            </div>
            <div className="text-sm text-emerald-900">{tldr}</div>
          </div>
        )}
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {body || ""}
          </ReactMarkdown>
        </div>
        <SourcesList items={sources} />
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
      role: "assistant", // <-- bot chào trước
      content:
        "Xin chào! Mình là EcoWrap AI. Hỏi mình về bao bì thân thiện môi trường nhé 🌿",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [useRag, setUseRag] = React.useState(true); // bật RAG mặc định

  // Auto-scroll
  const endRef = React.useRef(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async () => {
    if (loading) return;
    const text = input.trim();
    if (!text) return;

    // Thêm user message (role đúng là "user")
    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const endpoint = useRag ? "/ai/chat-rag" : "/ai/chat";

      const body = useRag
        ? {
            messages: history.map((m) => ({
              role: m.role, // "assistant" | "user"
              content: m.content,
            })),
            k: 5, // có thể cho chỉnh trên UI
          }
        : {
            messages: history.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const raw = await res.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        data = { error: true, message: "Invalid JSON", detail: raw };
      }

      if (!res.ok || data?.error) {
        const reason =
          data?.detail || data?.message || `Request failed: ${res.status}`;
        setMessages((m) => [
          ...m,
          {
            role: "assistant",
            content:
              "Xin lỗi, có lỗi khi gọi API.\n\n```\n" +
              String(reason).slice(0, 1200) +
              "\n```",
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
            "Không kết nối được tới máy chủ.\n" + String(e?.message || e),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      if (e.shiftKey) return;
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
                <div className="font-semibold">EcoWrap AI</div>
                <div className="text-xs text-gray-500">
                  Hỏi đáp • Gợi ý đóng gói xanh
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Switch
                size="sm"
                isSelected={useRag}
                onValueChange={setUseRag}
                color="success"
              >
                RAG
              </Switch>
              <Button size="sm" variant="light" onPress={onClose}>
                Đóng
              </Button>
            </div>
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
                placeholder={useRag ? "Hỏi (KB RAG)…" : "Hỏi (chat thường)…"}
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
              *Không gửi thông tin nhạy cảm. RAG dùng tri thức bạn đã nạp.
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
