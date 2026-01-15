import { eq } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { reviewedProjects } from "../db/schema.js";

const reviewedProjectsRouter = new Hono();

// GET /api/reviewed-projects - List all
reviewedProjectsRouter.get("/", async (c) => {
  const results = await db.select().from(reviewedProjects);
  return c.json(results);
});

// GET /api/reviewed-projects/:id - Get single
reviewedProjectsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [project] = await db
    .select()
    .from(reviewedProjects)
    .where(eq(reviewedProjects.id, id));

  if (!project) {
    return c.json({ error: "Reviewed project not found" }, 404);
  }

  return c.json(project);
});

export default reviewedProjectsRouter;
