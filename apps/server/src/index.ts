import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { betterAuthMiddleware } from "./middleware/better-auth.middleware";
import { openapi } from "@elysiajs/openapi";

const app = new Elysia()
  .use(
    cors({
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
    }),
  )
  .use(openapi())
  .use(betterAuthMiddleware)
  .get("/", () => "Hello Elysia")
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
