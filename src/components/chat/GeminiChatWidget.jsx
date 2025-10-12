import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Input, Button, Spinner } from "@nextui-org/react";
import { MessageSquare, Sparkles, X } from "lucide-react";
import logo from "../../assets/logo.png";

/* ---------- helpers: giữ nguyên logic ---------- */
function parseRagMessage(text = "") {
  let work = text;

  const tldrRegexes = [
    /(^|\n)\s*\*\*?TL;DR\*\*?[:\s]*\n?([\s\S]+?)(\n{2,}|$)/i,
    /(^|\n)\s*TL;DR[:\s]*\n?([\s\S]+?)(\n{2,}|$)/i,
  ];

  let tldr = "";
  for (const rx of tldrRegexes) {
    const m = work.match(rx);
    if (m) {
      tldr = (m[2] || "").trim();
      work = (
        work.slice(0, m.index) + work.slice(m.index + m[0].length)
      ).trim();
      break;
    }
  }

  const srcHeader =
    /(^|\n)(#+\s*nguồn|#+\s*nguồn trích dẫn|\*\*\s*nguồn|\*\*\s*nguồn trích dẫn)/i;
  const sepIdx = work.search(srcHeader);
  let body = work;
  let sourcesBlock = "";
  if (sepIdx >= 0) {
    body = work.slice(0, sepIdx).trim();
    sourcesBlock = work.slice(sepIdx).trim();
  }

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
      <div className="text-[11px] font-semibold text-gray-500 mb-1 tracking-wide">
        Nguồn trích dẫn
      </div>
      <ul className="flex flex-col gap-1.5">
        {items.map((s, i) => (
          <li
            key={i}
            className="text-[12px] bg-white border border-gray-200 rounded-xl px-2.5 py-1.5 flex items-center gap-2"
          >
            <span className="inline-flex items-center justify-center h-5 px-2 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-semibold">
              {s.cid}
            </span>
            <span className="font-medium text-gray-800">{s.title}</span>
            <span className="text-gray-500">— {s.source}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------- bubbles (UI only) ---------- */
export function BotBubble({ text }) {
  const { tldr, body, sources } = parseRagMessage(text);

  return (
    <div className="flex items-end gap-2">
      {/* avatar bot */}
      <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-emerald-600/20 text-emerald-700 font-semibold grid place-items-center">
        <img src={logo} alt="logo" className="h-6 w-10" />
      </div>

      <div className="max-w-[78%]">
        <div className="rounded-2xl rounded-bl-md bg-white text-gray-800 shadow-sm border border-gray-200 px-3 py-2">
          {tldr && (
            <div className="mb-2 border border-emerald-200 bg-emerald-50 rounded-lg px-3 py-2">
              <div className="text-xs font-semibold text-emerald-700 mb-1 tracking-wide">
                TL;DR
              </div>
              <div className="text-[13px] text-emerald-900 leading-5">
                {tldr}
              </div>
            </div>
          )}

          <div className="prose prose-sm max-w-none break-words prose-pre:whitespace-pre-wrap prose-a:break-all prose-p:my-2 prose-ul:my-2 prose-li:my-0.5 prose-a:text-emerald-700 hover:prose-a:text-emerald-800">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {body || ""}
            </ReactMarkdown>
          </div>
        </div>
        <SourcesList items={sources} />
      </div>
    </div>
  );
}

function UserBubble({ text }) {
  return (
    <div className="flex items-end gap-2 justify-end">
      <div className="max-w-[78%] rounded-2xl rounded-br-md bg-emerald-600 text-white px-3 py-2 shadow-sm">
        <div className="whitespace-pre-wrap break-words break-all text-[14px] leading-5">
          {text}
        </div>
      </div>
      {/* avatar user (placeholder) */}
      <div className="shrink-0 h-8 w-8 rounded-full bg-gray-300 grid place-items-center text-gray-700 text-xs">
        Bạn
      </div>
    </div>
  );
}

/* ---------- Floating widget (bottom-right) ---------- */
export default function GeminiChatWidget({
  open: openProp,
  onClose: onCloseProp,
}) {
  // tự quản lý mở/đóng nếu không truyền prop
  const selfManaged = openProp === undefined;
  const [open, setOpen] = React.useState(false);
  const realOpen = selfManaged ? open : openProp;
  const close = () => {
    if (selfManaged) setOpen(false);
    onCloseProp?.();
  };
  const openPanel = () => {
    if (selfManaged) setOpen(true);
  };

  // -------- logic gốc (KHÔNG đổi) --------
  const [messages, setMessages] = React.useState([
    {
      role: "assistant",
      content:
        "Xin chào! Mình là EcoWrap AI. Hỏi mình về bao bì thân thiện môi trường nhé 🌿",
    },
  ]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [useRag, setUseRag] = React.useState(true); // bật RAG mặc định

  // nhớ mode giữa các lần mở (không ảnh hưởng logic gọi API)
  React.useEffect(() => {
    const saved = localStorage.getItem("ecw_mode");
    if (saved === "rag" || saved === "normal") setUseRag(saved === "rag");
  }, []);
  React.useEffect(() => {
    localStorage.setItem("ecw_mode", useRag ? "rag" : "normal");
  }, [useRag]);

  // Auto-scroll
  const endRef = React.useRef(null);
  React.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, realOpen]);

  const sendMessage = async () => {
    if (loading) return;
    const text = input.trim();
    if (!text) return;

    const history = [...messages, { role: "user", content: text }];
    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const endpoint = useRag ? "/ai/chat-rag" : "/ai/chat";
      const body = {
        messages: history.map((m) => ({ role: m.role, content: m.content })),
        ...(useRag ? { k: 5 } : {}),
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
    if (e.altKey && (e.key === "r" || e.key === "R")) {
      e.preventDefault();
      setUseRag((t) => !t); // phím tắt Alt+R
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Panel */}
      {realOpen && (
        <div className="fixed bottom-5 right-5 z-[1000]">
          <div
            className="
              w-[380px] max-w-[94vw]
              h-[560px] sm:h-[600px] max-h-[80vh]
              bg-[#f0f2f5] rounded-2xl shadow-2xl border border-gray-200
              flex flex-col overflow-hidden
            "
          >
            {/* Header (minimal, không có selector để tiết kiệm diện tích) */}
            <div className="h-14 flex items-center justify-between px-4 border-b bg-white/90 backdrop-blur">
              <div className="flex items-center gap-2 min-w-0">
                <div className="h-9 w-9 rounded-full bg-white grid place-items-center">
                  <img src={logo} alt="logo" className="h-7 w-9" />
                </div>
                <div className="truncate">
                  <div className="font-semibold leading-tight">EcoWrap AI</div>
                  <div className="text-[12px] text-gray-500 truncate">
                    Hỏi đáp • Gợi ý đóng gói xanh
                  </div>
                </div>
              </div>

              <Button
                isIconOnly
                variant="light"
                radius="full"
                onPress={close}
                aria-label="Đóng"
              >
                <X size={18} />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              <div className="mx-auto w-full max-w-xl px-3 md:px-4 py-3 space-y-3">
                {messages.map((m, i) =>
                  m.role === "assistant" ? (
                    <BotBubble key={i} text={m.content} />
                  ) : (
                    <UserBubble key={i} text={m.content} />
                  )
                )}

                {loading && (
                  <div className="flex items-end gap-2">
                    <div className="shrink-0 h-10 w-10 rounded-full bg-white border border-emerald-600/20 text-emerald-700 font-semibold grid place-items-center">
                      <img src={logo} alt="logo" className="h-6 w-10" />
                    </div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-3 py-2 shadow-sm text-sm text-gray-700">
                      <Spinner size="sm" className="mr-2" /> Đang soạn…
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>
            </div>

            {/* Composer: chip toggle trong Input (thiết kế mới, không đổi logic) */}
            <div className="border-t bg-white">
              <div className="mx-auto w-full max-w-xl px-3 md:px-4 py-3">
                <div className="flex gap-2">
                  <Input
                    placeholder={
                      useRag ? "Hỏi (KB RAG)..." : "Hỏi (chat thường)..."
                    }
                    value={input}
                    onValueChange={(v) => {
                      // slash command (không ảnh hưởng luồng gửi)
                      if (/^\/rag\s*/i.test(v)) {
                        setUseRag(true);
                        setInput(v.replace(/^\/rag\s*/i, ""));
                        return;
                      }
                      if (/^\/normal\s*/i.test(v)) {
                        setUseRag(false);
                        setInput(v.replace(/^\/normal\s*/i, ""));
                        return;
                      }
                      setInput(v);
                    }}
                    onKeyDown={onKeyDown}
                    variant="bordered"
                    color="success"
                    classNames={{
                      inputWrapper:
                        "h-11 rounded-2xl border-gray-200 data-[focus=true]:border-emerald-500 bg-[#f7f8fa]",
                      input: "text-[14px]",
                    }}
                    startContent={
                      <button
                        type="button"
                        onClick={() => setUseRag((t) => !t)}
                        className={[
                          "inline-flex items-center gap-1.5 px-2.5 h-7 rounded-full text-xs font-medium",
                          "border transition-colors select-none",
                          useRag
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-gray-700 border-gray-200 hover:bg-gray-100",
                        ].join(" ")}
                        title={
                          useRag
                            ? "Đang dùng RAG • Alt+R để chuyển"
                            : "Đang chat thường • Alt+R để chuyển"
                        }
                        aria-pressed={useRag}
                      >
                        {useRag ? (
                          <Sparkles size={14} />
                        ) : (
                          <MessageSquare size={14} />
                        )}
                        {useRag ? "RAG" : "Thường"}
                      </button>
                    }
                  />
                  <Button
                    onPress={sendMessage}
                    className="h-11 rounded-2xl bg-emerald-600 text-white px-5"
                    isDisabled={loading || !input.trim()}
                  >
                    Gửi
                  </Button>
                </div>
                <div className="text-[11px] text-gray-500 mt-1">
                  *Không gửi thông tin nhạy cảm.{" "}
                  {useRag
                    ? "RAG dùng tri thức bạn đã nạp."
                    : "Đang ở chế độ chat thường."}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
