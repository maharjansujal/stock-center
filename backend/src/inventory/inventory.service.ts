import { pool } from "../db";
import { Inventory } from "../types/inventory";

export interface InventoryInput {
    item_name: string;
    total_stock: number;
    available_stock: number;
}

export async function addInventoryService({ item_name, total_stock, available_stock }: InventoryInput): Promise<Inventory> {
    const result = await pool.query("INSERT INTO inventories (item_name, total_stock, available_stock) VALUES ($1, $2, $3) RETURNING public_id, item_name, total_stock, available_stock", [item_name, total_stock, available_stock]);
    return result.rows[0];
}

export async function getInventoriesService() {
    const result = await pool.query<Inventory[]>('SELECT * FROM inventories');
    return result.rows;
}

export async function updateInventoriesService({
    public_id,
    item_name,
    total_stock,
    available_stock
}: InventoryInput & { public_id: string }) {
    const result = await pool.query<Inventory>(`
    UPDATE inventories
    SET 
      item_name = COALESCE($2, item_name),
      total_stock = COALESCE($3, total_stock),
      available_stock = COALESCE($4, available_stock)
        WHERE public_id = $1
    RETURNING item_name, total_stock, available_stock, public_id
    `, [public_id, item_name, total_stock, available_stock]);

    return result.rows[0]
}

export async function deleteInventoryService(public_id: string) {
  const result = await pool.query<Inventory>(
    'DELETE FROM inventories WHERE public_id = $1 RETURNING *',
    [public_id]
  );

  return result.rows[0];
}