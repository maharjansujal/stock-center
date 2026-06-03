"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addInventoryService = addInventoryService;
exports.getInventoriesService = getInventoriesService;
exports.updateInventoriesService = updateInventoriesService;
exports.deleteInventoryService = deleteInventoryService;
const db_1 = require("../db");
async function addInventoryService({ item_name, total_stock, }) {
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const inventoryResult = await client.query(`
      INSERT INTO inventories (item_name, total_stock)
      VALUES ($1, $2)
      RETURNING id, public_id, item_name, total_stock
      `, [item_name, total_stock]);
        const inventory = inventoryResult.rows[0];
        await client.query(`
      INSERT INTO inventory_transactions (
        item_id,
        transaction_type,
        quantity
      )
      VALUES ($1, $2, $3)
      `, [inventory.id, "stock_in", inventory.total_stock]);
        await client.query("COMMIT");
        return inventory;
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
async function getInventoriesService() {
    const result = await db_1.pool.query("SELECT * FROM inventories");
    return result.rows;
}
async function updateInventoriesService({ public_id, item_name, total_stock, }) {
    const result = await db_1.pool.query(`
    UPDATE inventories
    SET 
      item_name = COALESCE($2, item_name),
      total_stock = COALESCE($3, total_stock)
        WHERE public_id = $1
    RETURNING item_name, total_stock, public_id
    `, [public_id, item_name, total_stock]);
    return result.rows[0];
}
async function deleteInventoryService(publicId) {
    const client = await db_1.pool.connect();
    try {
        await client.query("BEGIN");
        const inventoryResult = await client.query(`
      UPDATE inventories
      SET deleted_at = NOW()
      WHERE public_id = $1
        AND deleted_at IS NULL
      RETURNING id, total_stock;
      `, [publicId]);
        const inventory = inventoryResult.rows[0];
        if (!inventory) {
            throw new Error("Inventory item not found");
        }
        await client.query(`
      INSERT INTO inventory_transactions (
        item_id,
        transaction_type,
        quantity
      )
      VALUES ($1, $2, $3)
      `, [inventory.id, "stock_out", inventory.total_stock]);
        await client.query("COMMIT");
    }
    catch (error) {
        await client.query("ROLLBACK");
        throw error;
    }
    finally {
        client.release();
    }
}
