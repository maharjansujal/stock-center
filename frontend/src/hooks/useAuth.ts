import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import type { User } from "../types/api";

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

export function useAuth() {
  const queryClient = useQueryClient();

  const sessionQuery = useQuery<User | null>({
    queryKey: ["auth-user"],
    queryFn: () => {
      const cachedUser = queryClient.getQueryData<User>(["auth-user"]);
      if (cachedUser) return cachedUser;

      const token = localStorage.getItem("auth_token");
      if (!token) return null;

      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
        );

        const claims = JSON.parse(jsonPayload);

        return {
          id: claims.id,
          public_id: claims.public_id,
          name: claims.name,
          email: claims.email,
          role: claims.role,
          password_hash: "",
          created_at: "",
          updated_at: "",
        } as User;
      } catch (e) {
        localStorage.removeItem("auth_token");
        return null;
      }
    },
    staleTime: Infinity,
    gcTime: Infinity,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginInput) => {
      const { data } = await apiClient.post<LoginResponse>(
        "/auth/login",
        credentials,
      );
      return data;
    },
    onSuccess: (data) => {
      localStorage.setItem("auth_token", data.token);

      const mappedUser: User = {
        id: data.user.id,
        public_id: data.user.public_id,
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        password_hash: "",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      queryClient.setQueryData(["auth-user"], mappedUser);
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterInput) => {
      const { data } = await apiClient.post<RegisterResponse>(
        "/auth/register",
        userData,
      );
      return data;
    },
  });

  const logout = () => {
    localStorage.removeItem("auth_token");
    queryClient.setQueryData(["auth-user"], null);
    queryClient.clear();
  };

  return {
    user: sessionQuery.data,
    isAuthenticated: !!sessionQuery.data,
    isAdmin: sessionQuery.data?.role === "admin",
    isEmployee: sessionQuery.data?.role === "employee",

    isRestoringSession: sessionQuery.isLoading,

    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,

    register: registerMutation.mutate,
    isRegistering: registerMutation.isPending,
    registerError: registerMutation.error,

    logout,
  };
}
