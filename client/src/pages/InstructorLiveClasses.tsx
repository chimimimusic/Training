import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Plus, Calendar, Users, Video, Edit, Trash2, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { toast } from "sonner";

export default function InstructorLiveClasses() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showParticipants, setShowParticipants] = useState<number | null>(null);

  const { data: sessions, refetch } = trpc.instructor.liveSessions.useQuery();
  const { data: participants } = trpc.instructor.sessionParticipants.useQuery(
    { liveClassId: showParticipants! },
    { enabled: !!showParticipants }
  );

  const createMutation = trpc.instructor.createLiveSession.useMutation({
    onSuccess: () => {
      toast.success("Live session created successfully!");
      setIsCreateDialogOpen(false);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create session");
    },
  });

  const updateMutation = trpc.instructor.updateLiveSession.useMutation({
    onSuccess: () => {
      toast.success("Session updated successfully!");
      setIsEditDialogOpen(false);
      setSelectedSession(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update session");
    },
  });

  const markAttendanceMutation = trpc.instructor.markAttendance.useMutation({
    onSuccess: () => {
      toast.success("Attendance marked!");
      refetch();
    },
  });

  if (user?.role !== "instructor" && user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  const handleCreateSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    createMutation.mutate({
      classType: formData.get("classType") as "review_3" | "review_6" | "review_9",
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      scheduledAt: new Date(formData.get("scheduledAt") as string),
      durationMinutes: parseInt(formData.get("durationMinutes") as string),
      zoomMeetingId: formData.get("zoomMeetingId") as string,
      zoomPasscode: formData.get("zoomPasscode") as string,
      zoomJoinUrl: formData.get("zoomJoinUrl") as string,
      zoomStartUrl: formData.get("zoomStartUrl") as string,
      maxParticipants: parseInt(formData.get("maxParticipants") as string),
    });
  };

  const handleUpdateSession = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    updateMutation.mutate({
      liveClassId: selectedSession.id,
      scheduledAt: new Date(formData.get("scheduledAt") as string),
      durationMinutes: parseInt(formData.get("durationMinutes") as string),
      zoomMeetingId: formData.get("zoomMeetingId") as string,
      zoomPasscode: formData.get("zoomPasscode") as string,
      zoomJoinUrl: formData.get("zoomJoinUrl") as string,
      zoomStartUrl: formData.get("zoomStartUrl") as string,
      status: formData.get("status") as "scheduled" | "live" | "completed" | "cancelled",
      recordingUrl: formData.get("recordingUrl") as string || undefined,
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { bg: string; text: string; border: string }> = {
      scheduled: { bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
      live: { bg: "bg-green-500/20", text: "text-green-400", border: "border-green-500/30" },
      completed: { bg: "bg-gray-500/20", text: "text-gray-400", border: "border-gray-500/30" },
      cancelled: { bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    };
    const variant = variants[status] || variants.scheduled;
    
    return (
      <Badge className={`${variant.bg} ${variant.text} border ${variant.border}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setLocation("/instructor")}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">Live Class Management</h1>
                <p className="text-white/70">Schedule and manage group webinar sessions</p>
              </div>
            </div>
            
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Session
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Create New Live Session</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Schedule a new group webinar session for trainees
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateSession} className="space-y-4">
                  <div>
                    <Label htmlFor="classType" className="text-white">Session Type</Label>
                    <Select name="classType" required>
                      <SelectTrigger className="bg-background/50 border-white/10 text-white">
                        <SelectValue placeholder="Select session type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="review_3">Review Session 1 (Modules 1-3)</SelectItem>
                        <SelectItem value="review_6">Review Session 2 (Modules 4-6)</SelectItem>
                        <SelectItem value="review_9">Review Session 3 (Modules 7-9)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title" className="text-white">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      required
                      className="bg-background/50 border-white/10 text-white"
                      placeholder="Live Review Session 1 - Modules 1-3"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      className="bg-background/50 border-white/10 text-white"
                      placeholder="Interactive review of key concepts..."
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledAt" className="text-white">Date & Time</Label>
                      <Input
                        id="scheduledAt"
                        name="scheduledAt"
                        type="datetime-local"
                        required
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="durationMinutes" className="text-white">Duration (minutes)</Label>
                      <Input
                        id="durationMinutes"
                        name="durationMinutes"
                        type="number"
                        required
                        defaultValue="90"
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <h4 className="font-semibold text-white">Zoom Meeting Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="zoomMeetingId" className="text-white">Meeting ID</Label>
                        <Input
                          id="zoomMeetingId"
                          name="zoomMeetingId"
                          required
                          className="bg-background/50 border-white/10 text-white"
                          placeholder="123-456-7890"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="zoomPasscode" className="text-white">Passcode</Label>
                        <Input
                          id="zoomPasscode"
                          name="zoomPasscode"
                          className="bg-background/50 border-white/10 text-white"
                          placeholder="SBH2026"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="zoomJoinUrl" className="text-white">Join URL (for trainees)</Label>
                      <Input
                        id="zoomJoinUrl"
                        name="zoomJoinUrl"
                        required
                        className="bg-background/50 border-white/10 text-white"
                        placeholder="https://zoom.us/j/..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="zoomStartUrl" className="text-white">Start URL (for instructor)</Label>
                      <Input
                        id="zoomStartUrl"
                        name="zoomStartUrl"
                        className="bg-background/50 border-white/10 text-white"
                        placeholder="https://zoom.us/s/..."
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="maxParticipants" className="text-white">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        name="maxParticipants"
                        type="number"
                        required
                        defaultValue="50"
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                      {createMutation.isPending ? "Creating..." : "Create Session"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Sessions List */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Scheduled Sessions</CardTitle>
              <CardDescription className="text-white/60">
                Manage upcoming and past live class sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!sessions || sessions.length === 0 ? (
                <div className="text-center py-12 text-white/60">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No live sessions scheduled yet</p>
                  <p className="text-sm mt-2">Create your first session to get started</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead className="text-white/70">Session</TableHead>
                        <TableHead className="text-white/70">Date & Time</TableHead>
                        <TableHead className="text-white/70">Duration</TableHead>
                        <TableHead className="text-white/70">Participants</TableHead>
                        <TableHead className="text-white/70">Status</TableHead>
                        <TableHead className="text-white/70">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((session: any) => (
                        <TableRow key={session.id} className="border-white/10">
                          <TableCell>
                            <div className="text-white font-medium">{session.title}</div>
                            <div className="text-sm text-white/60">{session.description}</div>
                          </TableCell>
                          <TableCell className="text-white">
                            {new Date(session.scheduledAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                            <br />
                            <span className="text-sm text-white/60">
                              {new Date(session.scheduledAt).toLocaleTimeString('en-US', {
                                hour: 'numeric',
                                minute: '2-digit',
                              })}
                            </span>
                          </TableCell>
                          <TableCell className="text-white">{session.durationMinutes} min</TableCell>
                          <TableCell>
                            <Button
                              variant="link"
                              className="text-purple-400 hover:text-purple-300 p-0"
                              onClick={() => setShowParticipants(session.id)}
                            >
                              {session.currentParticipants} / {session.maxParticipants}
                            </Button>
                          </TableCell>
                          <TableCell>{getStatusBadge(session.status)}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSelectedSession(session);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              {session.zoomStartUrl && session.status === 'scheduled' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(session.zoomStartUrl, '_blank')}
                                  className="text-green-400 hover:text-green-300"
                                >
                                  <Video className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Participants Dialog */}
          <Dialog open={!!showParticipants} onOpenChange={() => setShowParticipants(null)}>
            <DialogContent className="bg-card border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Session Participants</DialogTitle>
                <DialogDescription className="text-white/60">
                  Registered trainees for this session
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                {participants && participants.length > 0 ? (
                  participants.map((p: any) => (
                    <div key={p.id} className="flex items-center justify-between p-3 bg-background/50 rounded-lg">
                      <div>
                        <div className="text-white font-medium">{p.user.name}</div>
                        <div className="text-sm text-white/60">{p.user.email}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {p.registrationStatus === 'attended' && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Attended
                          </Badge>
                        )}
                        {p.registrationStatus === 'registered' && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAttendanceMutation.mutate({
                              attendanceId: p.id,
                              status: 'attended',
                            })}
                          >
                            Mark Attended
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-white/60">
                    No participants registered yet
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Session Dialog */}
          {selectedSession && (
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="bg-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Session</DialogTitle>
                  <DialogDescription className="text-white/60">
                    Update session details and Zoom information
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleUpdateSession} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="edit-scheduledAt" className="text-white">Date & Time</Label>
                      <Input
                        id="edit-scheduledAt"
                        name="scheduledAt"
                        type="datetime-local"
                        required
                        defaultValue={new Date(selectedSession.scheduledAt).toISOString().slice(0, 16)}
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-durationMinutes" className="text-white">Duration (minutes)</Label>
                      <Input
                        id="edit-durationMinutes"
                        name="durationMinutes"
                        type="number"
                        required
                        defaultValue={selectedSession.durationMinutes}
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="edit-status" className="text-white">Status</Label>
                    <Select name="status" defaultValue={selectedSession.status}>
                      <SelectTrigger className="bg-background/50 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <h4 className="font-semibold text-white">Zoom Meeting Details</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-zoomMeetingId" className="text-white">Meeting ID</Label>
                        <Input
                          id="edit-zoomMeetingId"
                          name="zoomMeetingId"
                          required
                          defaultValue={selectedSession.zoomMeetingId || ''}
                          className="bg-background/50 border-white/10 text-white"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="edit-zoomPasscode" className="text-white">Passcode</Label>
                        <Input
                          id="edit-zoomPasscode"
                          name="zoomPasscode"
                          defaultValue={selectedSession.zoomPasscode || ''}
                          className="bg-background/50 border-white/10 text-white"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-zoomJoinUrl" className="text-white">Join URL</Label>
                      <Input
                        id="edit-zoomJoinUrl"
                        name="zoomJoinUrl"
                        required
                        defaultValue={selectedSession.zoomJoinUrl || ''}
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="edit-zoomStartUrl" className="text-white">Start URL</Label>
                      <Input
                        id="edit-zoomStartUrl"
                        name="zoomStartUrl"
                        defaultValue={selectedSession.zoomStartUrl || ''}
                        className="bg-background/50 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t border-white/10 pt-4">
                    <h4 className="font-semibold text-white">Session Recording</h4>
                    <div>
                      <Label htmlFor="edit-recordingUrl" className="text-white">Recording URL</Label>
                      <Input
                        id="edit-recordingUrl"
                        name="recordingUrl"
                        defaultValue={selectedSession.recordingUrl || ''}
                        className="bg-background/50 border-white/10 text-white"
                        placeholder="https://zoom.us/rec/share/..."
                      />
                      <p className="text-xs text-white/60 mt-1">
                        Add the Zoom recording link after the session completes. Trainees will be able to watch it on-demand.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={updateMutation.isPending} className="bg-purple-600 hover:bg-purple-700">
                      {updateMutation.isPending ? "Updating..." : "Update Session"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
}
