import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Inventory } from "../types/api";

// Input types matching your controller demands
export interface CreateInventoryInput {
    item_name: string;
    total_stock: number;
}

export interface UpdateInventoryInput {
    public_id: string;
    item_name?: string;
    total_stock?: number;
}

interface ApiResponse<T> {
    message: string;
    inventories?: T;
    inventory?: T;
    updatedInventory?: T;
}

export function useInventories() {
    return useQuery<Inventory[]>({
        queryKey: ["inventories"],
        queryFn: async () => {
            const { data } = await apiClient.get<ApiResponse<Inventory[]>>("/inventory");
            return data.inventories || [];
        },
    });
}

export function useCreateInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newItem: CreateInventoryInput) => {
            const { data } = await apiClient.post<ApiResponse<Inventory>>("/inventory/create", newItem);
            return data.inventory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventories"] });
        },
    });
}

export function useUpdateInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ public_id, ...payload }: UpdateInventoryInput) => {
            const { data } = await apiClient.patch<ApiResponse<Inventory>>(
                `/inventory/update/${public_id}`,
                payload
            );
            return data.updatedInventory;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventories"] });
        },
    });
}

export function useDeleteInventory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (public_id: string) => {
            const { data } = await apiClient.delete<ApiResponse<null>>(`/inventories/delete/${public_id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventories"] });
        },
    });
}