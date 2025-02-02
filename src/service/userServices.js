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
