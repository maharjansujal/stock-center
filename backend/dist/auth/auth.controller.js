"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUser = registerUser;
exports.loginUser = loginUser;
const auth_service_1 = require("./auth.service");
async function registerUser(req, res) {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const user = await (0, auth_service_1.registerService)({ name, email, password });
        return res.status(201).json({
            message: "User created successfully",
            user,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}
async function loginUser(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const result = await (0, auth_service_1.loginService)({ email, password });
        return res.status(200).json({
            message: "Login successful",
            ...result,
        });
    }
    catch (err) {
        return res.status(401).json({
            message: err instanceof Error ? err.message : "Invalid credentials",
        });
    }
}
