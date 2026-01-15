import { Hono } from "hono";
import { handle } from "hono/vercel";
import apiRoutes from "./routes/index.js";

const app = new Hono().basePath("/api");

// Welcome route
app.get("/", (c) => {
  return c.json({
    message: "Project Review API",
    version: "1.0.0",
    endpoints: {
      projects: "/api/projects",
      reviewedProjects: "/api/reviewed-projects",
      previouslySubmittedProjects: "/api/previously-submitted-projects",
    },
  });
});

// Mount API routes
app.route("/", apiRoutes);

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

export default app;
export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
