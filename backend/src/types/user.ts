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