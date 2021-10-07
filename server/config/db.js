import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const URL = process.env.MONGO_URL;

const connectDB = async () => {
  try {
    await mongoose.connect(URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error(error.message);
    //Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
