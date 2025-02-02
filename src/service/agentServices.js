import Agent from "../models/agentModel.js";

export const checkAgent = async (email) => {
  try {
    const user = await Agent.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
};

export const fetchTasks = async (agentId) => {
  try {
    const agent = await Agent.findById(agentId).select("items");

    if (!agent) {
      return null;
    }

    return agent.items;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
