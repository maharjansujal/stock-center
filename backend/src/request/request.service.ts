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

export async function getRequestsService(){
    const result = await pool.query<InventoryRequest>('SELECT * FROM requests');
    return result.rows;
}

export async function getPersonalRequestsService(user_id: number){
    const result = await pool.query<InventoryRequest>('SELECT * FROM requests WHERE user_id = $1', [user_id]);
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

    const result = await pool.query(
        `
      INSERT INTO requests(item_id, user_id, quantity)
      VALUES ($1, $2, $3)
      RETURNING public_id, quantity
    `,
        [item_id, id, quantity]
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
    [public_id]
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

  const result = await pool.query(
    `
    UPDATE requests
    SET item_id = $1,
        quantity = $2,
        updated_at = NOW()
    WHERE public_id = $3
    RETURNING public_id, item_id, quantity, status
    `,
    [updatedItemId, updatedQuantity, public_id]
  );

  return result.rows[0];
}

export async function reviewRequestService({
  public_id,
  reviewed_by,
  status,
}: ReviewRequestInput) {
  const existing = await pool.query<InventoryRequest>(
    "SELECT * FROM requests WHERE public_id = $1",
    [public_id]
  );

  if (existing.rows.length === 0) {
    throw new Error("Request not found");
  }

  const request = existing.rows[0];

  if (request.status !== "pending") {
    throw new Error("Request is already reviewed");
  }

  const result = await pool.query(
    `
    UPDATE requests
    SET status = $1,
        reviewed_by = $2,
        reviewed_at = NOW(),
        updated_at = NOW()
    WHERE public_id = $3
    RETURNING public_id, status, reviewed_by, reviewed_at
    `,
    [status, reviewed_by, public_id]
  );

  return result.rows[0];
}