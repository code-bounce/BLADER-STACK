import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@blader/ui/globals.css";
import { TooltipProvider } from "@blader/ui/components/ui/tooltip";
import { Toaster } from "@blader/ui/components/ui/sonner";
import { RouterProvider, createRouter } from "@tanstack/react-router";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster />
    </TooltipProvider>
  </StrictMode>,
);
