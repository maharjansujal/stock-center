import { Request, Response } from "express";
import { addInventoryService, InventoryInput } from "./inventory.service";

export async function addInventory(req: Request<{}, any, InventoryInput>, res: Response) {
    try {
        const { item_name, available_stock, total_stock } = req.body;

        if (!item_name || !available_stock || !total_stock) {
            return res.status(400).json({
                message: "All fields are required"
            })
        }
        const inventory = await addInventoryService({ item_name, available_stock, total_stock });
        return res.status(201).json({
            message: "Inventory created successfully",
            inventory
        })
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error",
        });
    }
}