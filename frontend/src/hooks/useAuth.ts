import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    public_id: string;
    name: string;
    email: string;
    role: "employee" | "admin";
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    public_id: string;
    name: string;
    email: string;
  };
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post<LoginResponse>("/auth/login", credentials);
      return data;
    },
    onSuccess: (data) => {
      // store the token for Axios Interceptor extraction
      localStorage.setItem("auth_token", data.token);

      const mappedUser = {
        id: data.user.id,
        public_id: data.user.public_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        created_at: "",
        updated_at: ""
      };

      // Populate TanStack global Query cache with session details instantly
      queryClient.setQueryData(["auth-user"], mappedUser);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { data } = await apiClient.post<RegisterResponse>("/auth/register", userData);
      return data;
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["auth-user"], null);
    queryClient.invalidateQueries(); // Clear cache logs across panels
  };
}