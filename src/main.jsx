import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/index.css";
import "./styles/eco-animations.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConfigProvider, message } from "antd";
import { NextUIProvider } from "@nextui-org/react";

// Configure message globally
message.config({
  top: 100,
  duration: 3,
  maxCount: 3,
  rtl: false,
  prefixCls: "ant-message",
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // giảm retry mặc định
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider>
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
