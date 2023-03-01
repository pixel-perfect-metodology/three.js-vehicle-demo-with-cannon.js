import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// @ts-expect-error
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
