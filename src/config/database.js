import mongoose from "mongoose";
import { config } from "dotenv";

config();

const connectDb = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "CSDashboard",
    });
    console.log("Connected to database");
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectDb;
