import { Router } from "express";
import { agentLogin } from "../controllers/agentControllers.js";

const agentRouter = Router();

agentRouter.post("/agentlogin", agentLogin);

export default agentRouter;
