// Auth bypassed - returns mock user for public access

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

type UseAuthOptions = {
  redirectOnUnauthenticated?: boolean;
  redirectPath?: string;
};

export function useAuth(_options?: UseAuthOptions) {
  return {
    user: MOCK_USER,
    loading: false,
    error: null,
    isAuthenticated: true,
    refresh: () => Promise.resolve(),
    logout: () => {
      console.log("[Auth] Logout called - auth is bypassed");
      window.location.href = "/";
    },
  };
}
