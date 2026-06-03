import { Request, Response } from "express";
import { addInventoryService, deleteInventoryService, getInventoriesService, InventoryInput, updateInventoriesService } from "./inventory.service";

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

export async function getInventories(_req: Request, res: Response) {
    try {
        const inventories = await getInventoriesService();
        return res.status(200).json({
            message: "Inventories received successfully",
            inventories
        })
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error"
        })
    }
}

export async function updateInventory(req: Request<{}, any, InventoryInput & { public_id: string }>, res: Response) {
    try {
        const { item_name, available_stock, total_stock, public_id } = req.body;

        const inventory = {
            item_name: item_name,
            available_stock: available_stock,
            total_stock: total_stock,
            public_id: public_id
        }

        const updatedInventory = await updateInventoriesService(inventory);
        return res.status(200).json({
            message: "Inventory successfully updated",
            updatedInventory
        })
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error"
        })
    }
}

export async function deleteInventory(req: Request<{}, any, { public_id: string }>, res: Response) {
    try {
        const { public_id } = req.body;
        const result = await deleteInventoryService(public_id);
        return res.status(200).json({
            message: "Inventory deleted successfully",
            result
        })
    } catch (err) {
        return res.status(500).json({
            message: err instanceof Error ? err.message : "Server error"
        })
    }
}