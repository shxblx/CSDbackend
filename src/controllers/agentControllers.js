import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { checkAgent } from "../service/agentServices.js";

export const agentLogin = async (req, res) => {
  try {
    console.log("here");
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
      agentId: agent._id,
      message: "Login successful",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server Error" });
  }
};
