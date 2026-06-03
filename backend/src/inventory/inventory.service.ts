import { pool } from "../db";
import { Inventory } from "../types/inventory";

export interface InventoryInput {
    item_name: string;
    total_stock: number;
    available_stock: number;
}

export async function addInventoryService({ item_name, total_stock, available_stock }: InventoryInput): Promise<Inventory> {
    const result = await pool.query("INSERT INTO inventory (item_name, total_stock, available_stock) VALUES ($1, $2, $3) RETURNING public_id, item_name, total_stock, available_stock", [item_name, total_stock, available_stock]);

    return result.rows[0]
}

export async function getInventories() {
    const result = await pool.query<Inventory>('SELECT * FROM inventories');
    return result.rows[0];
}