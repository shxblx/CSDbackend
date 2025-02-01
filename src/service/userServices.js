import User from "../models/userModel.js";

export const checkUser = async (email) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    return null;
  }
};