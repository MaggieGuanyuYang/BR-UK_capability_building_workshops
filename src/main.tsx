import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/dm-sans/latin-400.css";
import "@fontsource/dm-sans/latin-500.css";
import "@fontsource/dm-sans/latin-600.css";
import "@fontsource/lora/latin-500.css";
import "@fontsource/lora/latin-600.css";
import "@fontsource/lora/latin-500-italic.css";
import App from "./App";
import { SocialCard } from "./components/SocialCard";
import "./styles.css";

const exportMode = new URLSearchParams(window.location.search).get("export");
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {exportMode === "social" || exportMode === "square" ? (
      <SocialCard square={exportMode === "square"} />
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
