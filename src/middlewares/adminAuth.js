import jwt from "jsonwebtoken";
import Admin from "../models/adminModel.js";

export const adminAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.csAdmin;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const SECRETKEY = process.env.JWT_SECRET_KEY;
    if (!SECRETKEY) {
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, SECRETKEY);

    const user = await Admin.findById(decoded.userId);

    if (!user || !user.isAdmin) {
      return res.status(401).json({ message: "Not authorized as admin" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    res.status(500).json({ message: "Server error" });
  }
};
