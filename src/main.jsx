import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./styles/index.css";
import "./styles/eco-animations.css";

import { NextUIProvider } from "@nextui-org/react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </StrictMode>
);
