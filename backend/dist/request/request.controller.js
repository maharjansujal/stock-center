"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRequest = createRequest;
exports.updateRequest = updateRequest;
exports.reviewRequest = reviewRequest;
exports.getRequests = getRequests;
exports.getPersonalRequests = getPersonalRequests;
const request_service_1 = require("./request.service");
async function createRequest(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const result = await (0, request_service_1.createRequestService)({
        id: req.user.id,
        role: req.user.role,
        item_id: req.body.item_id,
        quantity: req.body.quantity,
    });
    return res.status(201).json(result);
}
async function updateRequest(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { public_id } = req.params;
    const { item_id, quantity } = req.body;
    if (Array.isArray(public_id)) {
        throw new Error("Invalid public_id");
    }
    const result = await (0, request_service_1.updateRequestService)({
        public_id,
        user_id: req.user.id,
        item_id,
        quantity,
    });
    return res.status(200).json(result);
}
async function reviewRequest(req, res) {
    if (!req.user) {
        return res.status(401).json({
            message: "Unauthorized",
        });
    }
    const { public_id } = req.params;
    const { status } = req.body;
    if (Array.isArray(public_id)) {
        throw new Error("Invalid public_id");
    }
    const result = await (0, request_service_1.reviewRequestService)({
        public_id,
        reviewed_by: req.user.id,
        status,
    });
    return res.status(200).json(result);
}
async function getRequests(_req, res) {
    try {
        const result = await (0, request_service_1.getRequestsService)();
        return res.status(200).json({
            message: "Requests retrieved successfully",
            result,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server Error",
        });
    }
}
async function getPersonalRequests(req, res) {
    try {
        const user = req.user;
        if (!user) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }
        const result = await (0, request_service_1.getPersonalRequestsService)(user.id);
        return res.status(200).json({
            message: "Requests retrieved successfully",
            result
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server Error"
        });
    }
}
