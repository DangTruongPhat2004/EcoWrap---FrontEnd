import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

/* Chỉ cần CSS global của bạn */
import "./styles/index.css";
import "./styles/eco-animations.css";

import { HeroUIProvider } from "@heroui/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HeroUIProvider locale="vi-VN">
      <App />
    </HeroUIProvider>
  </StrictMode>
);
