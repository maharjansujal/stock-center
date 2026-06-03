import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/auth.routes"
import inventoryRoutes from "./inventory/inventory.routes"
import requestRoutes from "./request/request.routes"
import { authenticateUser, requireAdmin } from "./middleware/authenticateUser";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/inventories", authenticateUser, requireAdmin, inventoryRoutes);
app.use("/requests", authenticateUser, requestRoutes);

export default app;
