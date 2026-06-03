import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/auth.routes"
import inventoryRoutes from "./inventory/inventory.routes"
import requestRoutes from "./request/request.routes"
import { authenticateUser } from "./middleware/authenticateUser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/inventories", authenticateUser, inventoryRoutes);
app.use("/requests", authenticateUser, requestRoutes);

export default app;
