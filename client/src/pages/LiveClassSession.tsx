import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Calendar, Clock, Users, Video, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { useState, useEffect } from "react";

export default function LiveClassSession() {
  const [, params] = useRoute("/live-class/:id");
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  
  const liveClassId = params?.id ? parseInt(params.id) : 0;
  const [hasJoined, setHasJoined] = useState(false);
  
  const { data: liveClass, isLoading } = trpc.liveClasses.getById.useQuery(
    { liveClassId },
    { enabled: liveClassId > 0 }
  );
  
  const { data: userRegistration } = trpc.liveClasses.myClasses.useQuery();
  const registerMutation = trpc.liveClasses.register.useMutation();
  
  const isRegistered = userRegistration?.some(
    (reg) => reg.liveClassAttendance.liveClassId === liveClassId
  );
  
  const isFull = liveClass && (liveClass.currentParticipants ?? 0) >= (liveClass.maxParticipants ?? 50);
  const isLive = liveClass?.status === "live";
  const isCompleted = liveClass?.status === "completed";
  const isCancelled = liveClass?.status === "cancelled";
  
  useEffect(() => {
    if (liveClass && isRegistered && hasJoined) {
      // Track attendance when user joins
      // This would be handled by Zoom webhook in production
    }
  }, [hasJoined, liveClass, isRegistered]);
  
  if (liveClassId === 0) {
    setLocation("/training");
    return null;
  }
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading session...</div>
        </div>
      </div>
    );
  }
  
  if (!liveClass) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="bg-card/50 backdrop-blur border-white/10 max-w-md">
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h3 className="text-xl font-semibold text-white mb-2">Session Not Found</h3>
              <p className="text-white/60 mb-4">This live class session could not be found.</p>
              <Button onClick={() => setLocation("/training")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Training
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  const handleRegister = async () => {
    try {
      await registerMutation.mutateAsync({ liveClassId });
      toast.success("Successfully registered for the session!");
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    }
  };
  
  const handleJoinSession = () => {
    if (!isRegistered) {
      toast.error("Please register first before joining");
      return;
    }
    
    if (!liveClass.zoomJoinUrl) {
      toast.error("Zoom meeting link is not available yet");
      return;
    }
    
    setHasJoined(true);
    // Open Zoom in new window
    window.open(liveClass.zoomJoinUrl, "_blank");
  };
  
  const getStatusBadge = () => {
    if (isCancelled) {
      return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Cancelled</Badge>;
    }
    if (isCompleted) {
      return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Completed</Badge>;
    }
    if (isLive) {
      return <Badge className="bg-green-500/20 text-green-400 border-green-500/30 animate-pulse">Live Now</Badge>;
    }
    return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Scheduled</Badge>;
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={() => setLocation("/training")}
            className="text-white/70 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Training
          </Button>
          
          {/* Session Header */}
          <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 backdrop-blur">
            <CardHeader>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-purple-500/30 flex items-center justify-center">
                    <Video className="w-8 h-8 text-purple-300" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl md:text-3xl text-white mb-2">
                      {liveClass.title}
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      {liveClass.description}
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge()}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Session Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 text-white/80">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-white/60">Date & Time</div>
                    <div className="font-semibold">
                      {new Date(liveClass.scheduledAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-sm">
                      {new Date(liveClass.scheduledAt).toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-white/80">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-white/60">Duration</div>
                    <div className="font-semibold">{liveClass.durationMinutes} minutes</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-white/80">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <div className="text-sm text-white/60">Participants</div>
                    <div className="font-semibold">
                      {liveClass.currentParticipants} / {liveClass.maxParticipants}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Zoom Meeting Info */}
              {liveClass.zoomMeetingId && (
                <div className="bg-white/5 rounded-lg p-4 space-y-2">
                  <div className="text-sm text-white/60">Zoom Meeting Details</div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div>
                      <span className="text-white/60">Meeting ID:</span>
                      <span className="ml-2 font-mono text-white">{liveClass.zoomMeetingId}</span>
                    </div>
                    {liveClass.zoomPasscode && (
                      <div>
                        <span className="text-white/60">Passcode:</span>
                        <span className="ml-2 font-mono text-white">{liveClass.zoomPasscode}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Registration Status */}
              {isRegistered && (
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">You're registered for this session</span>
                </div>
              )}
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                {!isRegistered && !isCancelled && !isCompleted && (
                  <Button
                    onClick={handleRegister}
                    disabled={isFull || registerMutation.isPending}
                    className="bg-purple-600 hover:bg-purple-700 flex-1"
                  >
                    {isFull ? "Session Full" : registerMutation.isPending ? "Registering..." : "Register for Session"}
                  </Button>
                )}
                
                {isRegistered && !isCancelled && !isCompleted && (
                  <Button
                    onClick={handleJoinSession}
                    disabled={!liveClass.zoomJoinUrl}
                    className="bg-green-600 hover:bg-green-700 flex-1"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    {isLive ? "Join Live Session" : "Join Session"}
                  </Button>
                )}
              </div>
              
              {/* Info Messages */}
              {!isRegistered && !isCancelled && !isCompleted && (
                <p className="text-sm text-white/60">
                  Register to receive session reminders and access the Zoom meeting link.
                </p>
              )}
              
              {isCancelled && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                  <p className="text-red-400">This session has been cancelled. Please check for rescheduled sessions.</p>
                </div>
              )}
              
              {isCompleted && (
                <div className="bg-gray-500/10 border border-gray-500/30 rounded-lg p-4">
                  <p className="text-gray-400">This session has ended. Recordings may be available in your training materials.</p>
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* What to Expect */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">What to Expect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-white/70">
              <p>
                This live review session is a group webinar where you'll review key concepts from the previous modules
                with an instructor and fellow trainees.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Interactive Q&A with the instructor</li>
                <li>Review of challenging topics and assessments</li>
                <li>Practical demonstrations and case studies</li>
                <li>Opportunity to connect with other trainees</li>
              </ul>
              <p className="text-sm text-white/60 mt-4">
                <strong>Note:</strong> Make sure you have Zoom installed on your device before the session starts.
                The meeting link will become active 15 minutes before the scheduled time.
              </p>
            </CardContent>
          </Card>
          
          {/* Session Recording (if available) */}
          {isCompleted && liveClass.recordingUrl && (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Session Recording</CardTitle>
                <CardDescription className="text-white/60">
                  Missed the live session? Watch the recording to catch up on what you missed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <a
                  href={liveClass.recordingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <Video className="w-5 h-5" />
                  Watch Recording
                </a>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
