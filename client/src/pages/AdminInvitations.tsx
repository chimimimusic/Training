import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Mail, UserPlus, XCircle, CheckCircle, Clock, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminInvitations() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");

  const { data: invitations, refetch } = trpc.admin.getAllInvitations.useQuery();
  const createInvitation = trpc.admin.createInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation sent", { description: "Email has been added to the whitelist" });
      setEmail("");
      setNotes("");
      refetch();
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    }
  });

  const revokeInvitation = trpc.admin.revokeInvitation.useMutation({
    onSuccess: () => {
      toast.success("Invitation revoked", { description: "Email access has been revoked" });
      refetch();
    },
    onError: (error) => {
      toast.error("Error", { description: error.message });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    createInvitation.mutate({ email, notes: notes || undefined });
  };

  const handleRevoke = (email: string) => {
    if (confirm(`Are you sure you want to revoke access for ${email}?`)) {
      revokeInvitation.mutate({ email });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case "accepted":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200"><CheckCircle className="w-3 h-3 mr-1" />Accepted</Badge>;
      case "revoked":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200"><XCircle className="w-3 h-3 mr-1" />Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container max-w-6xl py-8">
      <Button
        variant="ghost"
        onClick={() => setLocation('/admin')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Admin Dashboard
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Email Invitations</h1>
        <p className="text-muted-foreground">
          Manage access to the training portal. Only invited email addresses can log in.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Invite New User
            </CardTitle>
            <CardDescription>
              Add an email address to the whitelist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Email Address</label>
                <Input
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Notes (Optional)</label>
                <Textarea
                  placeholder="Add notes about this invitation..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
              <Button type="submit" className="w-full" disabled={createInvitation.isPending}>
                {createInvitation.isPending ? "Sending..." : "Send Invitation"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Invitation Statistics</CardTitle>
            <CardDescription>Overview of all invitations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-700" />
                <span className="font-medium text-yellow-900">Pending</span>
              </div>
              <span className="text-2xl font-bold text-yellow-700">
                {invitations?.filter(i => i.status === "pending").length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-700" />
                <span className="font-medium text-green-900">Accepted</span>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {invitations?.filter(i => i.status === "accepted").length || 0}
              </span>
            </div>
            <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center gap-2">
                <XCircle className="w-5 h-5 text-red-700" />
                <span className="font-medium text-red-900">Revoked</span>
              </div>
              <span className="text-2xl font-bold text-red-700">
                {invitations?.filter(i => i.status === "revoked").length || 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            All Invitations
          </CardTitle>
          <CardDescription>
            {invitations?.length || 0} total invitations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Invited At</TableHead>
                  <TableHead>Accepted At</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invitations && invitations.length > 0 ? (
                  invitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium">{invitation.email}</TableCell>
                      <TableCell>{getStatusBadge(invitation.status)}</TableCell>
                      <TableCell>
                        {invitation.invitedAt ? new Date(invitation.invitedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell>
                        {invitation.acceptedAt ? new Date(invitation.acceptedAt).toLocaleDateString() : "-"}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {invitation.notes || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        {invitation.status !== "revoked" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevoke(invitation.email)}
                            disabled={revokeInvitation.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Revoke
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No invitations yet. Add your first invitation above.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
