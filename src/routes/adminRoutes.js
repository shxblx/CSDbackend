import { Router } from "express";
import { addAgent, adminLogin, fetchAgents } from "../controllers/adminControllers.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";

const adminRouter = Router();

adminRouter.post("/adminlogin", adminLogin);
adminRouter.post("/addagent", adminAuthMiddleware, addAgent);
adminRouter.get("/fetchAgents", adminAuthMiddleware, fetchAgents);

export default adminRouter;
