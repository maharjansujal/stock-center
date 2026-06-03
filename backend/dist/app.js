"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const inventory_routes_1 = __importDefault(require("./inventory/inventory.routes"));
const request_routes_1 = __importDefault(require("./request/request.routes"));
const authenticateUser_1 = require("./middleware/authenticateUser");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(express_1.default.json());
app.use("/auth", auth_routes_1.default);
app.use("/inventories", authenticateUser_1.authenticateUser, inventory_routes_1.default);
app.use("/requests", authenticateUser_1.authenticateUser, request_routes_1.default);
exports.default = app;
