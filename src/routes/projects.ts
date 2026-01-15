import { eq, isNull } from "drizzle-orm";
import { Hono } from "hono";
import { db } from "../db/index.js";
import { type InsertProject, projects } from "../db/schema.js";

const projectsRouter = new Hono();

// GET /api/projects - List all (exclude soft-deleted by default)
projectsRouter.get("/", async (c) => {
  const includeDeleted = c.req.query("includeDeleted") === "true";

  const results = includeDeleted
    ? await db.select().from(projects)
    : await db.select().from(projects).where(isNull(projects.deletedAt));

  return c.json(results);
});

// GET /api/projects/:id - Get single project
projectsRouter.get("/:id", async (c) => {
  const id = c.req.param("id");

  const [project] = await db.select().from(projects).where(eq(projects.id, id));

  if (!project) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json(project);
});

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

// PUT /api/projects/:id - Update project
projectsRouter.put("/:id", async (c) => {
  const id = c.req.param("id");

  const body = await c.req.json<Partial<InsertProject>>();
  const { name, githubRepoUrl, description, resetDate } = body;

  try {
    const [updated] = await db
      .update(projects)
      .set({
        ...(name && { name }),
        ...(githubRepoUrl && { githubRepoUrl }),
        ...(description !== undefined && { description }),
        ...(resetDate !== undefined && {
          resetDate: resetDate ? new Date(resetDate) : null,
        }),
        updatedAt: new Date(),
      })
      .where(eq(projects.id, id))
      .returning();

    if (!updated) {
      return c.json({ error: "Project not found" }, 404);
    }

    return c.json(updated);
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

// DELETE /api/projects/:id - Soft delete
projectsRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");

  const [deleted] = await db
    .update(projects)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(eq(projects.id, id))
    .returning();

  if (!deleted) {
    return c.json({ error: "Project not found" }, 404);
  }

  return c.json({ message: "Project deleted successfully" });
});

export default projectsRouter;
