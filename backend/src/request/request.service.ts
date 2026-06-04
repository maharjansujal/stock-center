import { pool } from "../db";
import { InventoryRequest } from "../types/request";

export interface RequestInput {
  id: number;
  role: "admin" | "employee";
  item_id: number;
  quantity: number;
}

export interface UpdateRequestInput {
  public_id: string;
  user_id: number;
  item_id?: number;
  quantity?: number;
}

export interface ReviewRequestInput {
  public_id: string;
  reviewed_by: number;
  status: "approved" | "denied";
}

export async function getRequestsService() {
  const result = await pool.query<InventoryRequest>("SELECT * FROM requests");
  return result.rows;
}

export async function getPersonalRequestsService(user_id: number) {
  const result = await pool.query<InventoryRequest>(
    "SELECT * FROM requests WHERE user_id = $1",
    [user_id],
  );
  return result.rows;
}

export async function createRequestService({
  id,
  role,
  item_id,
  quantity,
}: RequestInput) {
  if (role === "admin") {
    throw new Error("Admin cannot create inventory request");
  }

  const inventoryCheck = await pool.query(
    "SELECT item_name, total_stock FROM inventories WHERE id = $1 AND deleted_at IS NULL",
    [item_id],
  );

  if (inventoryCheck.rows.length === 0) {
    throw new Error(
      "The selected inventory item does not exist or has been removed",
    );
  }

  const item = inventoryCheck.rows[0];

  if (quantity > item.total_stock) {
    throw new Error(
      `Cannot request ${quantity} units. Only ${item.total_stock} units of "${item.item_name}" are currently available in stock.`,
    );
  }

  const result = await pool.query(
    `
      INSERT INTO requests(item_id, user_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING public_id, quantity, status
    `,
    [item_id, id, quantity],
  );

  return result.rows[0];
}

export async function updateRequestService({
  public_id,
  user_id,
  item_id,
  quantity,
}: UpdateRequestInput) {
  const existing = await pool.query<InventoryRequest>(
    "SELECT * FROM requests WHERE public_id = $1",
    [public_id],
  );

  if (existing.rows.length === 0) {
    throw new Error("Request not found");
  }

  const request = existing.rows[0];

  if (request.user_id !== user_id) {
    throw new Error("You are not allowed to update this request");
  }

  if (request.status !== "pending") {
    throw new Error("Only pending requests can be updated");
  }

  const updatedItemId = item_id ?? request.item_id;
  const updatedQuantity = quantity ?? request.quantity;

  const inventoryCheck = await pool.query(
    "SELECT item_name, total_stock FROM inventories WHERE id = $1 AND deleted_at IS NULL",
    [updatedItemId],
  );

  if (inventoryCheck.rows.length === 0) {
    throw new Error(
      "The selected inventory item does not exist or has been removed",
    );
  }

  const item = inventoryCheck.rows[0];

  if (updatedQuantity > item.total_stock) {
    throw new Error(
      `Cannot update request to ${updatedQuantity} units. Only ${item.total_stock} units of "${item.item_name}" are currently available in stock.`,
    );
  }

  const result = await pool.query(
    `
    UPDATE requests
    SET item_id = $1,
        quantity = $2,
        updated_at = NOW()
    WHERE public_id = $3
    RETURNING public_id, item_id, quantity, status
    `,
    [updatedItemId, updatedQuantity, public_id],
  );

  return result.rows[0];
}

export async function reviewRequestService({
  public_id,
  reviewed_by,
  status,
}: ReviewRequestInput) {
  const client = await pool.connect();

  try {
    // Start SQL Transaction
    await client.query("BEGIN");

    // 1. Find the target supply request
    const requestResult = await client.query<InventoryRequest>(
      "SELECT * FROM requests WHERE public_id = $1",
      [public_id],
    );

    if (requestResult.rows.length === 0) {
      throw new Error("Request not found");
    }

    const request = requestResult.rows[0];

    if (request.status !== "pending") {
      throw new Error("Request has already been processed");
    }

    if (status === "approved") {
      const inventoryResult = await client.query(
        "SELECT total_stock, item_name FROM inventories WHERE id = $1 FOR UPDATE",
        [request.item_id],
      );

      if (inventoryResult.rows.length === 0) {
        throw new Error("Associated inventory item does not exist");
      }

      const inventoryItem = inventoryResult.rows[0];

      if (inventoryItem.total_stock < request.quantity) {
        throw new Error(
          `Cannot approve request. Requested quantity (${request.quantity}) exceeds available stock for "${inventoryItem.item_name}" (${inventoryItem.total_stock}).`,
        );
      }

      await client.query(
        `
        UPDATE inventories
        SET total_stock = total_stock - $1,
            updated_at = NOW()
        WHERE id = $2
        `,
        [request.quantity, request.item_id],
      );
    }

    const finalResult = await client.query(
      `
      UPDATE requests
      SET status = $1,
          reviewed_by = $2,
          reviewed_at = NOW(),
          updated_at = NOW()
      WHERE public_id = $3
      RETURNING id, public_id, item_id, quantity, status
      `,
      [status, reviewed_by, public_id],
    );

    await client.query("COMMIT");
    return finalResult.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
