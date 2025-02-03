import { Router } from "express";
import {
  agentLogin,
  agentLogout,
  getTasks,
} from "../controllers/agentControllers.js";
import { agentAuthMiddleware } from "../middlewares/agentAuth.js";

const agentRouter = Router();

agentRouter.post("/agentlogin", agentLogin);
agentRouter.get("/gettasks", agentAuthMiddleware, getTasks);
agentRouter.post("/agentlogout", agentAuthMiddleware, agentLogout);

export default agentRouter;
