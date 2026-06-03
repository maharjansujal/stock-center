"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInventory = addInventory;
exports.getInventories = getInventories;
exports.updateInventory = updateInventory;
exports.deleteInventory = deleteInventory;
const inventory_service_1 = require("./inventory.service");
async function addInventory(req, res) {
    try {
        const { item_name, total_stock } = req.body;
        if (!item_name || !total_stock) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }
        const inventory = await (0, inventory_service_1.addInventoryService)({ item_name, total_stock });
        return res.status(201).json({
            message: "Inventory created successfully",
            inventory,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}
async function getInventories(_req, res) {
    try {
        const inventories = await (0, inventory_service_1.getInventoriesService)();
        return res.status(200).json({
            message: "Inventories received successfully",
            inventories,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}
async function updateInventory(req, res) {
    try {
        const { public_id } = req.params;
        const { item_name, total_stock } = req.body;
        if (Array.isArray(public_id)) {
            throw new Error("Invalid public_id");
        }
        const inventory = {
            item_name: item_name,
            total_stock: total_stock,
            public_id: public_id,
        };
        const updatedInventory = await (0, inventory_service_1.updateInventoriesService)(inventory);
        return res.status(200).json({
            message: "Inventory successfully updated",
            updatedInventory,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}
async function deleteInventory(req, res) {
    try {
        const { public_id } = req.body;
        const result = await (0, inventory_service_1.deleteInventoryService)(public_id);
        return res.status(200).json({
            message: "Inventory deleted successfully",
            result,
        });
    }
    catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}
