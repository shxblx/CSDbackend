import jwt from "jsonwebtoken";
import Agent from "../models/agentModel.js";

export const agentAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.csAgent;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const SECRETKEY = process.env.JWT_SECRET_KEY;
    if (!SECRETKEY) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, SECRETKEY);

    const agent = await Agent.findById(decoded.userId);

    if (!agent) {
      return res.status(401).json({ message: "Agent not found" });
    }

    req.agent = agent;
    next();
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
