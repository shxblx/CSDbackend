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

export const distributeTasksToAgents = async (items) => {
  try {
    const agents = await Agent.find();

    if (agents.length === 0) {
      throw new Error("No agents available to assign tasks");
    }

    const tasksPerAgent = Math.floor(items.length / agents.length);
    const updates = [];

    for (let i = 0; i < agents.length; i++) {
      const start = i * tasksPerAgent;
      const end =
        i === agents.length - 1 ? items.length : start + tasksPerAgent;

      const assignedTasks = items.slice(start, end);

      updates.push(
        Agent.updateOne(
          { _id: agents[i]._id },
          { $push: { items: { $each: assignedTasks } } }
        )
      );
    }

    await Promise.all(updates);
  } catch (error) {
    console.error("Error distributing tasks:", error);
    throw new Error("Error distributing tasks");
  }
};
