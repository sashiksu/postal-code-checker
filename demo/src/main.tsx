import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./hooks/useTheme";
import { App } from "./App";
import "./styles/global.scss";

const container = document.getElementById("root");
if (!container) throw new Error("Root container #root not found");

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
