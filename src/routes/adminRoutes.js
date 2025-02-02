import { Router } from "express";
import {
  addAgent,
  adminLogin,
  adminLogout,
  deleteAgent,
  fetchAgents,
  uploadCSV,
} from "../controllers/adminControllers.js";
import { adminAuthMiddleware } from "../middlewares/adminAuth.js";

const adminRouter = Router();

adminRouter.post("/adminlogin", adminLogin);
adminRouter.post("/addagent", adminAuthMiddleware, addAgent);
adminRouter.get("/fetchAgents", adminAuthMiddleware, fetchAgents);
adminRouter.post("/uploadCsv", adminAuthMiddleware, uploadCSV);
adminRouter.delete("/deleteagent", adminAuthMiddleware, deleteAgent);
adminRouter.post("/adminlogout",adminAuthMiddleware,adminLogout);

export default adminRouter;
