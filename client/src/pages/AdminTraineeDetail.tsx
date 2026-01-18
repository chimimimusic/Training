import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, User, Mail, Phone, MapPin, Calendar, Award, BookOpen, CheckCircle, Clock } from "lucide-react";
import { useLocation, useRoute } from "wouter";
import Header from "@/components/Header";

export default function AdminTraineeDetail() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute("/admin/trainee/:id");
  
  const traineeId = params?.id ? parseInt(params.id) : null;

  const { data: traineeData, isLoading } = trpc.admin.traineeProgressWithProfile.useQuery(
    { userId: traineeId! },
    { enabled: !!traineeId }
  );

  if (user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading trainee details...</div>
        </div>
      </div>
    );
  }

  if (!traineeData) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Trainee not found</div>
        </div>
      </div>
    );
  }

  const { user: trainee, progress, stats } = traineeData;

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

  const getModuleStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "in_progress":
        return "text-yellow-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/progress")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">{trainee.name || "Trainee Details"}</h1>
              <p className="text-white/70">Complete profile and progress information</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation(`/profile/${trainee.id}`)}
            >
              Edit Profile
            </Button>
          </div>

          {/* Profile Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col items-center gap-4">
                  {trainee.profileImageUrl ? (
                    <img
                      src={trainee.profileImageUrl}
                      alt={trainee.name || ""}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-purple-500/20 flex items-center justify-center">
                      <User className="w-12 h-12 text-purple-400" />
                    </div>
                  )}
                  <div className="text-center">
                    <h3 className="text-xl font-bold">{trainee.name || "N/A"}</h3>
                    <Badge className={getStatusBadgeColor(trainee.status)}>
                      {trainee.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{trainee.email || "N/A"}</span>
                  </div>
                  {trainee.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">{trainee.phone}</span>
                    </div>
                  )}
                  {(trainee.city || trainee.state) && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {[trainee.city, trainee.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Enrolled: {new Date(trainee.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {trainee.age && (
                  <div className="pt-4 border-t border-white/10">
                    <p className="text-sm text-muted-foreground">Age: {trainee.age}</p>
                  </div>
                )}
                {trainee.gender && (
                  <div>
                    <p className="text-sm text-muted-foreground">Gender: {trainee.gender}</p>
                  </div>
                )}
                {trainee.highestEducation && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Education: {trainee.highestEducation.replace(/_/g, " ").toUpperCase()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress Stats */}
            <Card className="bg-card/50 backdrop-blur border-white/10 md:col-span-2">
              <CardHeader>
                <CardTitle>Progress Overview</CardTitle>
                <CardDescription>Training completion statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Completion</span>
                        <span className="text-2xl font-bold">{stats.completionPercentage}%</span>
                      </div>
                      <Progress value={stats.completionPercentage} className="h-3" />
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-muted-foreground">Modules</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {stats.completedModules} / {stats.totalModules}
                        </p>
                      </div>

                      <div className="p-4 bg-muted/20 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-blue-400" />
                          <span className="text-sm text-muted-foreground">Days Enrolled</span>
                        </div>
                        <p className="text-2xl font-bold">{stats.daysSinceEnrollment}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Award className="w-5 h-5 text-yellow-400" />
                        <span className="text-sm font-medium">Status</span>
                      </div>
                      <p className="text-lg">
                        {stats.completionPercentage === 100
                          ? "Training Completed!"
                          : stats.completionPercentage > 0
                          ? "In Progress"
                          : "Not Started"}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-green-400" />
                        <span className="text-sm font-medium">Last Activity</span>
                      </div>
                      <p className="text-lg">
                        {stats.lastActivityDate
                          ? new Date(stats.lastActivityDate).toLocaleDateString()
                          : "No activity yet"}
                      </p>
                    </div>

                    <div className="p-4 bg-muted/20 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-purple-400" />
                        <span className="text-sm font-medium">Profile</span>
                      </div>
                      <p className="text-lg">
                        {trainee.profileCompletedAt ? "Complete" : "Incomplete"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Module Progress Details */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle>Module-by-Module Progress</CardTitle>
              <CardDescription>Detailed breakdown of training modules</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {progress.map((p) => (
                  <div
                    key={p.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${getModuleStatusColor(p.status)}`}>
                          Module {p.moduleId}
                        </span>
                        <Badge
                          className={
                            p.status === "completed"
                              ? "bg-green-500/20 text-green-400"
                              : p.status === "in_progress"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : "bg-gray-500/20 text-gray-400"
                          }
                        >
                          {p.status.replace("_", " ")}
                        </Badge>
                      </div>
                      {p.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed: {new Date(p.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Video</p>
                        <p className={p.videoWatched ? "text-green-400" : "text-gray-400"}>
                          {p.videoWatched ? "✓" : "—"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Transcript</p>
                        <p className={p.transcriptViewed ? "text-green-400" : "text-gray-400"}>
                          {p.transcriptViewed ? "✓" : "—"}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-muted-foreground mb-1">Assessment</p>
                        <p className={p.assessmentCompleted ? "text-green-400" : "text-gray-400"}>
                          {p.assessmentCompleted
                            ? `${p.assessmentScore || 0} pts`
                            : "—"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
