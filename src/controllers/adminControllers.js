import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { config } from "dotenv";
import {
  checkAdmin,
  createAgent,
  getAgents,
  distributeTasksToAgents,
  removeAgent,
} from "../service/adminServices.js";
import { checkAgent } from "../service/userServices.js";
import upload from "../utils/multer.js";
import csvParser from "csv-parser";
import * as XLSX from "xlsx";
import { Readable } from "stream";
config();

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await checkAdmin(email);

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
    console.log(req.user);
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

export const deleteAgent = async (req, res) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ message: "Agent ID is required" });
    }

    const result = await removeAgent(agentId);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    res.status(200).json({ message: result.message });
  } catch (error) {
    console.error("Error in deleteAgent:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const adminLogout = async (req, res) => {
  try {
    res.clearCookie("csAdmin", {
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

const parseCSVBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const items = [];
    const readStream = Readable.from(buffer.toString());

    readStream
      .pipe(
        csvParser({
          headers: ["firstName", "phone", "notes"],
          skipLines: 0,
        })
      )
      .on("data", (row) => {
        const { firstName, phone, notes } = row;
        if (firstName && phone) {
          items.push({
            firstName: firstName.trim(),
            phone: Number(phone.replace(/\D/g, "")),
            notes: notes ? notes.trim() : "",
          });
        }
      })
      .on("end", () => {
        resolve(items);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

export const uploadCSV = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(400).json({
        message: "File upload failed",
        error: err.message,
      });
    }

    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    try {
      const items =
        req.file.mimetype === "text/csv"
          ? await parseCSVBuffer(req.file.buffer)
          : parseXLSXBuffer(req.file.buffer);

      if (!items || items.length === 0) {
        return res.status(400).json({
          message: "No valid items found in the uploaded file",
        });
      }

      await distributeTasksToAgents(items);

      res.status(200).json({
        message: "Tasks distributed successfully",
        totalItems: items.length,
      });
    } catch (error) {
      console.error("Processing error:", error);
      res.status(500).json({
        message: "Error processing file",
        error: error.message,
      });
    }
  });
};
