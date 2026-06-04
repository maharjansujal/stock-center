import { Request, Response } from "express";
import {
  addInventoryService,
  deleteInventoryService,
  getInventoriesService,
  InventoryInput,
  restoreInventoryService,
  updateInventoriesService,
} from "./inventory.service";
import { AuthenticatedRequest } from "../middleware/authenticateUser";

export async function addInventory(
  req: Request<{}, any, InventoryInput>,
  res: Response,
) {
  try {
    const { item_name, total_stock } = req.body;

    if (!item_name || !total_stock) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }
    const inventory = await addInventoryService({ item_name, total_stock });
    return res.status(201).json({
      message: "Inventory created successfully",
      inventory,
    });
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
      inventories,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server error",
    });
  }
}

export async function updateInventory(
  req: AuthenticatedRequest,
  res: Response,
) {
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

    const updatedInventory = await updateInventoriesService(inventory);
    return res.status(200).json({
      message: "Inventory successfully updated",
      updatedInventory,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server error",
    });
  }
}

export async function deleteInventory(req: Request, res: Response) {
  try {
    const { public_id } = req.params;
    if (Array.isArray(public_id)) {
      return res.status(400).json({
        message: "Inventory not found",
      });
    }
    const result = await deleteInventoryService(public_id);
    return res.status(200).json({
      message: "Inventory deleted successfully",
      result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Server error",
    });
  }
}

export async function restoreInventory(req: Request, res: Response) {
  try {
    const { public_id } = req.params;

    if (!public_id || Array.isArray(public_id)) {
      return res.status(400).json({ message: "Invalid or missing required inventory public identifier." });
    }

    const result = await restoreInventoryService(public_id);

    return res.status(200).json({
      message: "Inventory item recovered successfully.",
      inventory: result,
    });
  } catch (err) {
    return res.status(500).json({
      message: err instanceof Error ? err.message : "Failed to recover inventory item.",
    });
  }
}