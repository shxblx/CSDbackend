import Admin from "../models/adminModel.js";
import Agent from "../models/agentModel.js";

export const checkAdmin = async (email) => {
  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
};

export const createAgent = async (agent) => {
  try {
    const newAgent = new Agent(agent);
    const savedAgent = await newAgent.save();
    if (!savedAgent) {
      return null;
    }
    return savedAgent;
  } catch (error) {
    return null;
  }
};

export const getAgents = async () => {
  try {
    return await Agent.find();
  } catch (error) {
    console.error("Error retrieving agents:", error);
    throw new Error("Database Error");
  }
};
