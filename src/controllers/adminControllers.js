import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { config } from "dotenv";
import {
  checkAdmin,
  createAgent,
  getAgents,
} from "../service/adminServices.js";
import { checkAgent } from "../service/userServices.js";
config();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await checkAdmin(email);
    console.log(user);
    if (!user || user.isAdmin === false) {
      return res.status(400).json({ message: "Unauthorized access" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = await generateToken({ userId: user._id, role: "user" });
    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("csAdmin", token, {
      httpOnly: true,
      secure: isProduction,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      sameSite: isProduction ? "none" : "strict",
    });

    return res.status(200).json({
      userId: user._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const addAgent = async (req, res) => {
  try {
    const agent = req.body;
    const exist = await checkAgent(req.body.email);
    if (exist) {
      return res.status(400).json({ message: "Agent already exists" });
    }

    const newAgent = await createAgent(agent);

    if (!newAgent) {
      return res
        .status(400)
        .json({ message: "Something went wrong in the database" });
    }

    return res
      .status(201)
      .json({ message: "Agent created successfully", agent: newAgent });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const fetchAgents = async (req, res) => {
  try {
    console.log("here");
    const agents = await getAgents();

    if (agents.length === 0) {
      return res.status(404).json({ message: "No Agents Found" });
    }

    return res
      .status(200)
      .json({ agents, message: "Agents fetched successfully" });
  } catch (error) {
    console.error("Error fetching agents:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
