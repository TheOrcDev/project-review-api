import { Hono } from "hono";
import projectsRouter from "./projects.js";
import reviewedProjectsRouter from "./reviewed-projects.js";
import previouslySubmittedRouter from "./previously-submitted-projects.js";

const apiRoutes = new Hono();

apiRoutes.route("/projects", projectsRouter);
apiRoutes.route("/reviewed-projects", reviewedProjectsRouter);
apiRoutes.route("/previously-submitted-projects", previouslySubmittedRouter);

export default apiRoutes;
