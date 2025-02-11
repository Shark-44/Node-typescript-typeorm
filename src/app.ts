import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/AuthRoutes";
import userRoutes from "./routes/UserRoutes";

dotenv.config();
const app = express();

app.use(cors({
    origin: "http://localhost:5173", 
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
    credentials: true,
  }));

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/users", userRoutes);

  

export default app;
