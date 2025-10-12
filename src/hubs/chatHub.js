// chatHub.js
import * as signalR from "@microsoft/signalr";

// ✅ SỬA 1: Khởi tạo connection ngay lập tức để đảm bảo là singleton
// Điều này giúp quản lý kết nối nhất quán trên toàn bộ ứng dụng.
const connection = createConnection();

function createConnection() {
  const baseUrl = "https://localhost:7077"; // Hoặc lấy từ biến môi trường

  function getLsToken() {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  }

  const options = {
    accessTokenFactory: () => getLsToken() || "",
  };

  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hubs/chat`, options)
    .withAutomaticReconnect([0, 2000, 5000, 10000]) // Cấu hình thời gian reconnect rõ ràng hơn
    .configureLogging(signalR.LogLevel.Information)
    .build();
}

// Hàm này giờ chỉ đơn giản là trả về instance duy nhất đã được tạo
export function getChatConnection() {
  return connection;
}

// ✅ SỬA 2: Sửa lại logic kiểm tra trạng thái một cách chặt chẽ
export async function ensureConnected() {
  // Chỉ thực hiện start NẾU và CHỈ NẾU trạng thái là 'Disconnected'
  if (connection.state === signalR.HubConnectionState.Disconnected) {
    try {
      console.log("[SignalR] Connection is Disconnected. Starting...");
      await connection.start();
      console.log("[SignalR] Connection established.");
    } catch (e) {
      console.error("[SignalR] Failed to start connection:", e);
      // Ném lỗi ra ngoài để component có thể xử lý (ví dụ: hiển thị thông báo lỗi)
      throw e;
    }
  } else {
    console.log(
      `[SignalR] Connection state is '${connection.state}'. No action needed.`
    );
  }
}

export async function joinConversation(conversationId) {
  if (connection.state !== signalR.HubConnectionState.Connected) {
    console.warn(
      "[SignalR] Cannot join conversation, connection not established."
    );
    return;
  }
  return connection.invoke("JoinConversation", conversationId);
}

export function bindAutoRejoin(conversationId) {
  const handler = async () => {
    console.log("[SignalR] Reconnected. Re-joining conversation...");
    try {
      await joinConversation(conversationId);
    } catch (e) {
      console.error("[SignalR] Failed to re-join conversation:", e);
    }
  };
  connection.onreconnected(handler);

  // Trả về một hàm cleanup để gỡ bỏ event listener khi component unmount
  return () => connection.off("onreconnected", handler);
}

// Các hàm đăng ký và gỡ bỏ event listener
export function onMessageCreated(handler) {
  connection.on("MessageCreated", handler);
}
export function onReadReceipt(handler) {
  connection.on("ReadReceipt", handler);
}
export function offAll() {
  connection.off("MessageCreated");
  connection.off("ReadReceipt");
}
