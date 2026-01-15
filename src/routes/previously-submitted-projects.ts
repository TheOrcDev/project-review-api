import { Hono } from "hono";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { previouslySubmittedProjects } from "../db/schema.js";

const previouslySubmittedRouter = new Hono();

// GET /api/previously-submitted-projects - List all
previouslySubmittedRouter.get("/", async (c) => {
  const results = await db.select().from(previouslySubmittedProjects);
  return c.json(results);
});

// GET /api/previously-submitted-projects/:id - Get single
previouslySubmittedRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [project] = await db
    .select()
    .from(previouslySubmittedProjects)
    .where(eq(previouslySubmittedProjects.id, id));

  if (!project) {
    return c.json({ error: "Previously submitted project not found" }, 404);
  }

  return c.json(project);
});

export default previouslySubmittedRouter;
