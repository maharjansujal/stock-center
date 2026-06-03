export interface InventoryTransaction {
  id: number;
  public_id: string;
  item_id: number;
  user_id: number;
  transaction_type: "stock_in" | "stock_out";
  quantity: number;
  created_at: string;
}
