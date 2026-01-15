import { serve } from "@hono/node-server";
import { Hono } from "hono";
import apiRoutes from "./routes/index.js";

const app = new Hono();

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
app.route("/api", apiRoutes);

// Global error handler
app.onError((err, c) => {
  console.error("Unhandled error:", err);
  return c.json({ error: "Internal server error" }, 500);
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: "Not found" }, 404);
});

const port = 3000;

serve({
  fetch: app.fetch,
  port,
});

export default app;
