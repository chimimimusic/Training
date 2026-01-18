import { getLoginUrl } from "@/const";
import { trpc } from "@/lib/trpc";
import { TRPCClientError } from "@trpc/client";
import { useCallback, useEffect, useMemo } from "react";

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

// Mock user for bypassing auth during development/demo
const MOCK_USER = {
  id: 1,
  openId: "demo-user",
  name: "Demo Trainee",
  email: "demo@soundbridge.health",
  role: "trainee",
  status: "active",
  agreedToTerms: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Set to true to bypass authentication
const BYPASS_AUTH = true;

export function useAuth(options?: UseAuthOptions) {
  const { redirectOnUnauthenticated = false, redirectPath = getLoginUrl() } =
    options ?? {};
  const utils = trpc.useUtils();

  const meQuery = trpc.auth.me.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !BYPASS_AUTH, // Don't query if bypassing auth
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      utils.auth.me.setData(undefined, null);
    },
  });

  const logout = useCallback(async () => {
    if (BYPASS_AUTH) {
      console.log("[Auth] Logout called but auth is bypassed");
      return;
    }
    try {
      await logoutMutation.mutateAsync();
    } catch (error: unknown) {
      if (
        error instanceof TRPCClientError &&
        error.data?.code === "UNAUTHORIZED"
      ) {
        return;
      }
      throw error;
    } finally {
      utils.auth.me.setData(undefined, null);
      await utils.auth.me.invalidate();
    }
  }, [logoutMutation, utils]);

  const state = useMemo(() => {
    // If bypassing auth, return mock user
    if (BYPASS_AUTH) {
      localStorage.setItem(
        "manus-runtime-user-info",
        JSON.stringify(MOCK_USER)
      );
      return {
        user: MOCK_USER,
        loading: false,
        error: null,
        isAuthenticated: true,
      };
    }

    localStorage.setItem(
      "manus-runtime-user-info",
      JSON.stringify(meQuery.data)
    );
    return {
      user: meQuery.data ?? null,
      loading: meQuery.isLoading || logoutMutation.isPending,
      error: meQuery.error ?? logoutMutation.error ?? null,
      isAuthenticated: Boolean(meQuery.data),
    };
  }, [
    meQuery.data,
    meQuery.error,
    meQuery.isLoading,
    logoutMutation.error,
    logoutMutation.isPending,
  ]);

  useEffect(() => {
    if (BYPASS_AUTH) return; // Skip redirect when bypassing
    if (!redirectOnUnauthenticated) return;
    if (meQuery.isLoading || logoutMutation.isPending) return;
    if (state.user) return;
    if (typeof window === "undefined") return;
    if (window.location.pathname === redirectPath) return;

    window.location.href = redirectPath
  }, [
    redirectOnUnauthenticated,
    redirectPath,
    logoutMutation.isPending,
    meQuery.isLoading,
    state.user,
  ]);

  return {
    ...state,
    refresh: () => BYPASS_AUTH ? Promise.resolve() : meQuery.refetch(),
    logout,
  };
}
