import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { checkAgent, fetchTasks } from "../service/agentServices.js";
import mongoose from "mongoose";

export const agentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const agent = await checkAgent(email);
    if (!agent) {
      return res.status(400).json({ message: "Agent not found" });
    }

    if (password !== agent.password) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = await generateToken({ userId: agent._id, role: "agent" });
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("csAgent", token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "strict",
    });

    return res.status(200).json({
      agent: agent.name,
      agentId: agent._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getTasks = async (req, res) => {
  try {
    const tasks = await fetchTasks(req.agent._id);

    if (!tasks) {
      return res.status(404).json({ message: "Tasks not found" });
    }

    res.status(200).json({ tasks });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const agentLogout = async (req, res) => {
  try {
    res.clearCookie("csAgent", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
