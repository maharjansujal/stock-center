"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerService = registerService;
exports.loginService = loginService;
const db_1 = require("../db");
const auth_utils_1 = require("./auth.utils");
async function registerService({ name, email, password, }) {
    // Checking if user exists
    const existingUser = await db_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (existingUser.rows.length > 0) {
        throw new Error("User already exists");
    }
    const password_hash = await (0, auth_utils_1.hashPassword)(password);
    const result = await db_1.pool.query("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING public_id, name, email", [name, email, password_hash]);
    return result.rows[0];
}
async function loginService({ email, password }) {
    const result = await db_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
        throw new Error("Invalid username or password");
    }
    const user = result.rows[0];
    const isPasswordValid = await (0, auth_utils_1.comparePassword)(password, user.password_hash ?? "");
    if (!isPasswordValid) {
        throw new Error("Invalid email or password");
    }
    const token = (0, auth_utils_1.generateToken)({
        email: user.email,
        id: user.id,
        name: user.name,
        role: user.role,
        public_id: user.public_id
    });
    return {
        token,
        user: {
            id: user.id,
            name: user.name,
            public_id: user.public_id,
            email: user.email,
            role: user.role
        }
    };
}
