import { Hono } from "hono";
import { db } from "../db/index.js";
import { type InsertProject, projects } from "../db/schema.js";

const projectsRouter = new Hono();

// POST /api/projects - Create project
projectsRouter.post("/", async (c) => {
  try {
    const body = await c.req.json<Partial<InsertProject>>();
    const { name, githubRepoUrl, description, resetDate } = body;

    if (!(name && githubRepoUrl && description)) {
      return c.json(
        { error: "name, githubRepoUrl, and description are required" },
        400
      );
    }

    const [newProject] = await db
      .insert(projects)
      .values({
        name,
        githubRepoUrl,
        description,
        resetDate: resetDate ? new Date(resetDate) : null,
      })
      .returning();

    return c.json(newProject, 201);
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "23505") {
      return c.json(
        { error: "A project with this GitHub URL already exists" },
        409
      );
    }
    throw error;
  }
});

export default projectsRouter;
