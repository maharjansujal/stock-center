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