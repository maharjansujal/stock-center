"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = authenticateUser;
exports.requireAdmin = requireAdmin;
const auth_utils_1 = require("../auth/auth.utils");
function authenticateUser(req, res, next) {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
        return res.status(401).json({ message: "Authentication header is required" });
    }
    const [scheme, token] = authorizationHeader.split(" ");
    if (scheme !== "Bearer" || !token) {
        return res.status(401).json({ message: "Invalid authorization format" });
    }
    try {
        const decoded = (0, auth_utils_1.verifyToken)(token);
        req.user = {
            id: decoded.id,
            email: decoded.email,
            name: decoded.name,
            public_id: decoded.public_id,
            role: decoded.role
        };
        next(); // IMPORTANT
    }
    catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}
function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Admin access required" });
    }
    next();
}
