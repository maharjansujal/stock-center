import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { Inventory } from "../types/api";

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

export function useInventory() {
  const queryClient = useQueryClient();

  const inventoriesQuery = useQuery<Inventory[]>({
    queryKey: ["inventories"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<Inventory[]>>("/inventories");
      return data.inventories || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newItem: CreateInventoryInput) => {
      const { data } = await apiClient.post<ApiResponse<Inventory>>("/inventories/create", newItem);
      return data.inventory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ public_id, ...payload }: UpdateInventoryInput) => {
      const { data } = await apiClient.patch<ApiResponse<Inventory>>(
        `/inventories/update/${public_id}`,
        payload
      );
      return data.updatedInventory;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (public_id: string) => {
      const { data } = await apiClient.delete<ApiResponse<null>>(`/inventories/delete/${public_id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  return {
    inventories: inventoriesQuery.data || [],
    isFetchingInventories: inventoriesQuery.isPending,
    getInventoriesError: inventoriesQuery.error,

    createInventory: createMutation.mutate, 
    isCreatingInventory: createMutation.isPending,
    createInventoryError: createMutation.error,

    updateInventory: updateMutation.mutate,
    isUpdatingInventory: updateMutation.isPending,
    updateInventoryError: updateMutation.error,

    deleteInventory: deleteMutation.mutate,
    isDeletingInventory: deleteMutation.isPending,
    deleteInventoryError: deleteMutation.error,
  };
}