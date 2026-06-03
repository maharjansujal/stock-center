import { pool } from "../db";
import { Inventory } from "../types/inventory";

export interface InventoryInput {
  item_name: string;
  total_stock: number;
}

export async function addInventoryService({
  item_name,
  total_stock,
}: InventoryInput): Promise<Inventory> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inventoryResult = await client.query<Inventory>(
      `
      INSERT INTO inventories (item_name, total_stock)
      VALUES ($1, $2)
      RETURNING id, public_id, item_name, total_stock
      `,
      [item_name, total_stock],
    );

    const inventory = inventoryResult.rows[0];

    await client.query(
      `
      INSERT INTO inventory_transactions (
        item_id,
        transaction_type,
        quantity
      )
      VALUES ($1, $2, $3)
      `,
      [inventory.id, "stock_in", inventory.total_stock],
    );

    await client.query("COMMIT");

    return inventory;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function getInventoriesService() {
  const result = await pool.query<Inventory[]>("SELECT * FROM inventories");
  return result.rows;
}

export async function updateInventoriesService({
  public_id,
  item_name,
  total_stock,
}: InventoryInput & { public_id: string }) {
  const result = await pool.query<Inventory>(
    `
    UPDATE inventories
    SET 
      item_name = COALESCE($2, item_name),
      total_stock = COALESCE($3, total_stock),
        WHERE public_id = $1
    RETURNING item_name, total_stock, public_id
    `,
    [public_id, item_name, total_stock],
  );

  return result.rows[0];
}

export async function deleteInventoryService(publicId: string): Promise<void> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const inventoryResult = await client.query<Inventory>(
      `
      UPDATE inventories
      SET deleted_at = NOW()
      WHERE public_id = $1
        AND deleted_at IS NULL
      RETURNING id, total_stock;
      `,
      [publicId],
    );

    const inventory = inventoryResult.rows[0];

    if (!inventory) {
      throw new Error("Inventory item not found");
    }

    await client.query(
      `
      INSERT INTO inventory_transactions (
        item_id,
        transaction_type,
        quantity
      )
      VALUES ($1, $2, $3)
      `,
      [inventory.id, "stock_out", inventory.total_stock],
    );

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
