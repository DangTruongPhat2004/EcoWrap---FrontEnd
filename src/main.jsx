import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/index.css";
import "./styles/eco-animations.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { App as AntApp, ConfigProvider } from "antd";
import { NextUIProvider } from "@nextui-org/react";

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
      <ConfigProvider
        theme={{
          token: {
            zIndexPopupBase: 9999,
          },
        }}
      >
        <AntApp>
          <NextUIProvider>
            <App />
          </NextUIProvider>
        </AntApp>
      </ConfigProvider>
    </QueryClientProvider>
  </StrictMode>
);
