import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { trpc } from "@/lib/trpc";
import { 
  GraduationCap, 
  LayoutDashboard, 
  LogOut, 
  Settings, 
  User,
  Users,
  Stethoscope,
  MessageSquare
} from "lucide-react";
import { useLocation } from "wouter";

export default function Header() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const logout = trpc.auth.logout.useMutation({
    onSuccess: () => {
      // Force full page reload to clear auth state
      window.location.href = "/";
    },
  });

  const handleLogout = () => {
    logout.mutate();
  };

  const getRoleIcon = () => {
    switch (user?.role) {
      case "admin":
        return <Settings className="w-4 h-4" />;
      case "instructor":
        return <Users className="w-4 h-4" />;
      case "provider":
        return <Stethoscope className="w-4 h-4" />;
      case "facilitator":
        return <GraduationCap className="w-4 h-4" />;
      default:
        return <User className="w-4 h-4" />;
    }
  };

  const getRoleDashboard = () => {
    switch (user?.role) {
      case "admin":
        return { path: "/admin", label: "Admin Dashboard" };
      case "instructor":
        return { path: "/instructor", label: "Instructor Dashboard" };
      case "provider":
        return { path: "/provider", label: "Provider Dashboard" };
      default:
        return null;
    }
  };

  const dashboard = getRoleDashboard();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => setLocation("/")}
          className="hover:opacity-80 transition-opacity"
        >
          <img 
            src="/soundbridge-logo-white.png" 
            alt="SoundBridge Health" 
            className="h-8 w-auto"
          />
        </button>

        {/* Navigation */}
        <nav className="flex items-center gap-3">
          {/* Training Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/training")}
            className="text-white/80 hover:text-white"
          >
            <GraduationCap className="w-4 h-4 mr-2" />
            Training
          </Button>

          {/* Forum Link */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/forum")}
            className="text-white/80 hover:text-white"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Forum
          </Button>

          {/* Patient Sessions Link - Only for facilitators */}
          {user?.role === 'facilitator' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/patient-sessions")}
              className="text-white/80 hover:text-white"
            >
              <Users className="w-4 h-4 mr-2" />
              Patient Sessions
            </Button>
          )}

          {/* Role-based Dashboard Link */}
          {dashboard && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation(dashboard.path)}
              className="text-white/80 hover:text-white"
            >
              <LayoutDashboard className="w-4 h-4 mr-2" />
              {dashboard.label}
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                {getRoleIcon()}
                <span className="hidden sm:inline">{user?.name || "User"}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">{user?.name}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <p className="text-xs text-muted-foreground capitalize">
                    Role: {user?.role}
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setLocation("/profile")}>
                <User className="mr-2 h-4 w-4" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLocation("/training")}>
                <GraduationCap className="mr-2 h-4 w-4" />
                My Training
              </DropdownMenuItem>
              {dashboard && (
                <DropdownMenuItem onClick={() => setLocation(dashboard.path)}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {dashboard.label}
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
