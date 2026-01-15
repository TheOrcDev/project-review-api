import { Hono } from "hono";
import projectsRouter from "./projects.js";

const apiRoutes = new Hono();

apiRoutes.route("/projects", projectsRouter);

export default apiRoutes;
