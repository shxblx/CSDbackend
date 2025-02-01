import bcrypt from "bcryptjs";
import { checkUser } from "../service/userServices.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await checkUser(email);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken({ userId: user._id, role: "user" });

    const isProduction = process.env.NODE_ENV === "production";
    res.cookie("xCodejwt", token, {
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
