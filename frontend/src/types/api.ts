export interface Inventory{
    id: number;
    public_id: string;
    item_name: string;
    total_stock: number;
    available_stock: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface InventoryTransaction {
  id: number;
  public_id: string;
  item_id: number;
  user_id: number;
  transaction_type: "stock_in" | "stock_out";
  quantity: number;
  created_at: string;
}

export interface InventoryRequest{
    id: number;
    public_id: string;
    user_id: number;
    item_id: number;
    quantity: number;
    status: "pending" | "approved" | "denied";
    reviewed_by?: number;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface User{
    id: number;
    public_id: string;
    email: string;
    password_hash: string;
    name: string;
    role: "employee" | "admin";
    created_at: string;
    updated_at: string;
}