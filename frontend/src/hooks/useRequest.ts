import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { InventoryRequest } from "../types/api";
import { useAuth } from "./useAuth";

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

export function useRequests() {
  const queryClient = useQueryClient();

  const { user, isAdmin } = useAuth();

  const allRequestsQuery = useQuery<InventoryRequest[]>({
    queryKey: ["requests", "all"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiResponse<InventoryRequest[]>>("/requests");
      return data.result || [];
    },
    enabled: !!user && isAdmin,
  });

  const personalRequestsQuery = useQuery<InventoryRequest[]>({
    queryKey: ["requests", "me"],
    queryFn: async () => {
      const { data } =
        await apiClient.get<ApiResponse<InventoryRequest[]>>("/requests/me");
      return data.result || [];
    },
  });

  const createMutation = useMutation({
    mutationFn: async (newRequest: CreateRequestInput) => {
      const { data } = await apiClient.post<InventoryRequest>(
        "/requests/create",
        newRequest,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ public_id, ...payload }: UpdateRequestInput) => {
      const { data } = await apiClient.patch<InventoryRequest>(
        `/requests/${public_id}`,
        payload,
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
  });

  const reviewMutation = useMutation({
    mutationFn: async ({ public_id, status }: ReviewRequestInput) => {
      const { data } = await apiClient.patch<InventoryRequest>(
        `/requests/${public_id}/review`,
        { status },
      );
      return data;
    },
    onSuccess: () => {
      // Invalidate requests to update the pending status in the lists
      queryClient.invalidateQueries({ queryKey: ["requests"] });
      // Invalidate inventories because approving an item updates global stock counters
      queryClient.invalidateQueries({ queryKey: ["inventories"] });
    },
  });

  return {
    allRequests: allRequestsQuery.data || [],
    isFetchingAllRequests: allRequestsQuery.isPending,
    getAllRequestsError: allRequestsQuery.error,

    personalRequests: personalRequestsQuery.data || [],
    isFetchingPersonalRequests: personalRequestsQuery.isPending,
    getPersonalRequestsError: personalRequestsQuery.error,

    createRequest: createMutation.mutate,
    isCreatingRequest: createMutation.isPending,
    createRequestError: createMutation.error,

    updateRequest: updateMutation.mutate,
    isUpdatingRequest: updateMutation.isPending,
    updateRequestError: updateMutation.error,

    reviewRequest: reviewMutation.mutate,
    isReviewingRequest: reviewMutation.isPending,
    reviewRequestError: reviewMutation.error,
  };
}
