import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Users, GraduationCap, TrendingUp, UserCheck, Ban, CheckCircle, Trash2, RotateCcw, AlertTriangle, User, Download, BarChart3, Video, Mail } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";

export default function AdminDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [actionDialog, setActionDialog] = useState<{
    open: boolean;
    action: 'suspend' | 'activate' | 'softDelete' | 'hardDelete' | 'restore' | null;
    userId: number | null;
    userEmail: string;
  }>({ open: false, action: null, userId: null, userEmail: '' });
  const [hardDeleteEmail, setHardDeleteEmail] = useState('');

  const utils = trpc.useUtils();
  const { data: stats } = trpc.admin.stats.useQuery();
  const { data: allUsers } = trpc.admin.users.useQuery();
  
  const suspendMutation = trpc.admin.suspendUser.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.admin.users.invalidate();
      setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const activateMutation = trpc.admin.activateUser.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.admin.users.invalidate();
      setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const softDeleteMutation = trpc.admin.softDeleteUser.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.admin.users.invalidate();
      setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const restoreMutation = trpc.admin.restoreUser.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.admin.users.invalidate();
      setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const hardDeleteMutation = trpc.admin.hardDeleteUser.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
      utils.admin.users.invalidate();
      setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
      setHardDeleteEmail('');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  
  const handleAction = () => {
    if (!actionDialog.userId) return;
    
    switch (actionDialog.action) {
      case 'suspend':
        suspendMutation.mutate({ userId: actionDialog.userId });
        break;
      case 'activate':
        activateMutation.mutate({ userId: actionDialog.userId });
        break;
      case 'softDelete':
        softDeleteMutation.mutate({ userId: actionDialog.userId });
        break;
      case 'restore':
        restoreMutation.mutate({ userId: actionDialog.userId });
        break;
      case 'hardDelete':
        hardDeleteMutation.mutate({ userId: actionDialog.userId, confirmEmail: hardDeleteEmail });
        break;
    }
  };

  if (user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400";
      case "instructor":
        return "bg-blue-500/20 text-blue-400";
      case "provider":
        return "bg-purple-500/20 text-purple-400";
      case "facilitator":
        return "bg-green-500/20 text-green-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/20 text-green-400";
      case "completed":
        return "bg-blue-500/20 text-blue-400";
      case "pending":
        return "bg-yellow-500/20 text-yellow-400";
      case "suspended":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/training")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/70">System overview and user management</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All registered users</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Trainees</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.activeTrainees || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently in training</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certified Facilitators</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats?.completedFacilitators || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed training</p>
            </CardContent>
          </Card>
        </div>

        {/* User Management Table */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View and manage all users in the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Onboarding</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allUsers?.map((u) => (
                    <TableRow key={u.id} className="border-white/10">
                      <TableCell className="font-medium">{u.name || "N/A"}</TableCell>
                      <TableCell>{u.email || "N/A"}</TableCell>
                      <TableCell>
                        <Badge className={getRoleBadgeColor(u.role)}>{u.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(u.status)}>{u.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2 text-xs">
                          {u.agreedToTerms && <span className="text-green-400">✓ ToS</span>}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </TableCell>
                        <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">Actions</Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>User Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => setLocation(`/admin/profile/${user.id}`)}>
                              <User className="w-4 h-4 mr-2" />
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            
                            {u.role === 'trainee' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => setLocation(`/admin/trainee/${u.id}`)}
                                >
                                  <TrendingUp className="mr-2 h-4 w-4 text-blue-500" />
                                  View Progress
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                              </>
                            )}
                            
                            {u.deletedAt ? (
                              <DropdownMenuItem
                                onClick={() => setActionDialog({ open: true, action: 'restore', userId: u.id, userEmail: u.email || '' })}
                              >
                                <RotateCcw className="mr-2 h-4 w-4" />
                                Restore User
                              </DropdownMenuItem>
                            ) : (
                              <>
                                {u.status === 'suspended' ? (
                                  <DropdownMenuItem
                                    onClick={() => setActionDialog({ open: true, action: 'activate', userId: u.id, userEmail: u.email || '' })}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                    Activate User
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => setActionDialog({ open: true, action: 'suspend', userId: u.id, userEmail: u.email || '' })}
                                  >
                                    <Ban className="mr-2 h-4 w-4 text-yellow-500" />
                                    Suspend User
                                  </DropdownMenuItem>
                                )}
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem
                                  onClick={() => setActionDialog({ open: true, action: 'softDelete', userId: u.id, userEmail: u.email || '' })}
                                  className="text-orange-500"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete (Recoverable)
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem
                                  onClick={() => setActionDialog({ open: true, action: 'hardDelete', userId: u.id, userEmail: u.email || '' })}
                                  className="text-red-500"
                                >
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Delete Permanently
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/progress')}>
              <TrendingUp className="mr-2 h-4 w-4" />
              Trainee Progress
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/progress/export')}>
              <GraduationCap className="mr-2 h-4 w-4" />
              Export Reports
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/export')}>
              <Download className="mr-2 h-4 w-4" />
              Export Profiles
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/assessment-analytics')}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Assessment Analytics
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/video-analytics')}>
              <Video className="mr-2 h-4 w-4" />
              Video Analytics
            </Button>
            <Button variant="outline" className="justify-start" onClick={() => setLocation('/admin/invitations')}>
              <Mail className="mr-2 h-4 w-4" />
              Email Invitations
            </Button>
          </CardContent>
        </Card>
      </div>
      </div>
      
      {/* Confirmation Dialogs */}
      <AlertDialog open={actionDialog.open} onOpenChange={(open) => {
        if (!open) {
          setActionDialog({ open: false, action: null, userId: null, userEmail: '' });
          setHardDeleteEmail('');
        }
      }}>
        <AlertDialogContent className="bg-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionDialog.action === 'suspend' && 'Suspend User'}
              {actionDialog.action === 'activate' && 'Activate User'}
              {actionDialog.action === 'softDelete' && 'Delete User (Recoverable)'}
              {actionDialog.action === 'hardDelete' && 'Permanently Delete User'}
              {actionDialog.action === 'restore' && 'Restore User'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {actionDialog.action === 'suspend' && (
                <div className="space-y-2">
                  <p>Are you sure you want to suspend this user?</p>
                  <p className="text-sm">User: <span className="font-semibold">{actionDialog.userEmail}</span></p>
                  <p className="text-yellow-500">The user will not be able to log in until reactivated.</p>
                </div>
              )}
              {actionDialog.action === 'activate' && (
                <div className="space-y-2">
                  <p>Are you sure you want to activate this user?</p>
                  <p className="text-sm">User: <span className="font-semibold">{actionDialog.userEmail}</span></p>
                  <p className="text-green-500">The user will be able to log in again.</p>
                </div>
              )}
              {actionDialog.action === 'softDelete' && (
                <div className="space-y-2">
                  <p>Are you sure you want to delete this user?</p>
                  <p className="text-sm">User: <span className="font-semibold">{actionDialog.userEmail}</span></p>
                  <p className="text-orange-500">The user will be hidden from lists but can be restored later. All data will be preserved.</p>
                </div>
              )}
              {actionDialog.action === 'hardDelete' && (
                <div className="space-y-4">
                  <p className="text-red-500 font-semibold">⚠️ WARNING: This action cannot be undone!</p>
                  <p>This will permanently delete the user and ALL associated data including:</p>
                  <ul className="list-disc list-inside text-sm space-y-1 ml-2">
                    <li>Profile information</li>
                    <li>Module progress and assessment scores</li>
                    <li>Discussion posts and replies</li>
                    <li>Live class attendance records</li>
                    <li>Certificates</li>
                  </ul>
                  <div className="space-y-2 pt-2">
                    <p className="font-semibold">Type the user's email to confirm:</p>
                    <p className="text-sm text-muted-foreground">{actionDialog.userEmail}</p>
                    <Input
                      type="email"
                      placeholder="Enter email to confirm"
                      value={hardDeleteEmail}
                      onChange={(e) => setHardDeleteEmail(e.target.value)}
                      className="bg-background border-white/20"
                    />
                  </div>
                </div>
              )}
              {actionDialog.action === 'restore' && (
                <div className="space-y-2">
                  <p>Are you sure you want to restore this user?</p>
                  <p className="text-sm">User: <span className="font-semibold">{actionDialog.userEmail}</span></p>
                  <p className="text-green-500">The user will be visible again and able to log in.</p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAction}
              disabled={
                actionDialog.action === 'hardDelete' && hardDeleteEmail !== actionDialog.userEmail
              }
              className={
                actionDialog.action === 'hardDelete'
                  ? 'bg-red-500 hover:bg-red-600'
                  : actionDialog.action === 'softDelete'
                  ? 'bg-orange-500 hover:bg-orange-600'
                  : actionDialog.action === 'suspend'
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-500 hover:bg-green-600'
              }
            >
              {actionDialog.action === 'suspend' && 'Suspend'}
              {actionDialog.action === 'activate' && 'Activate'}
              {actionDialog.action === 'softDelete' && 'Delete'}
              {actionDialog.action === 'hardDelete' && 'Permanently Delete'}
              {actionDialog.action === 'restore' && 'Restore'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
