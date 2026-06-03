import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { InventoryRequest } from "../types/api";

export interface CreateRequestInput {
  item_id: number;
  quantity: number;
}

export interface UpdateRequestInput {
  public_id: string;
  item_id?: number;
  quantity?: number;
}

export interface ReviewRequestInput {
  public_id: string;
  status: "approved" | "denied";
}

interface ApiResponse<T> {
  message?: string;
  result?: T;
}

// Fetch all requests (Admin view)
export function useRequests() {
  return useQuery<InventoryRequest[]>({
    queryKey: ["requests"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<InventoryRequest[]>>("/requests");
      return data.result || [];
    },
  });
}

// fetch personal requests (employee view)
export function usePersonalRequests() {
  return useQuery<InventoryRequest[]>({
    queryKey: ["requests", "me"],
    queryFn: async () => {
      const { data } = await apiClient.get<ApiResponse<InventoryRequest[]>>("/requests/me");
      return data.result || [];
    },
  });
}

// Create a new request
export function useCreateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newRequest: CreateRequestInput) => {
      const { data } = await apiClient.post<InventoryRequest>("/requests/create", newRequest);
      return data;
    },
    onSuccess: () => {
      // Invalidate both keys to ensure both views stay perfectly in sync
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

// Update an existing pending request
export function useUpdateRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ public_id, ...payload }: UpdateRequestInput) => {
      const { data } = await apiClient.patch<InventoryRequest>(`/requests/${public_id}`, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

// Review a pending request (Admin action)
export function useReviewRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ public_id, status }: ReviewRequestInput) => {
      const { data } = await apiClient.patch<InventoryRequest>(
        `/requests/${public_id}/review`,
        { status }
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate requests cache since the status changed
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // Invalidate inventories cache because approved items alter stock counts
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });
}