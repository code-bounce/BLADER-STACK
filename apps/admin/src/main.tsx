import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import "@blader/ui/globals.css";
import { TooltipProvider } from "@blader/ui/components/ui/tooltip";
import { Toaster } from "@blader/ui/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
    <Toaster />
  </StrictMode>,
);
