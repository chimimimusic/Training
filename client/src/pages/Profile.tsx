import { useAuth } from "@/_core/hooks/useAuth";
import EditProfileDialog from "@/components/EditProfileDialog";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/lib/trpc";
import { Award, Calendar, CheckCircle2, Clock, Edit, ExternalLink, Mail, User, TrendingUp } from "lucide-react";
import { CertificateSection } from "@/components/CertificateSection";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Profile() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: modules } = trpc.modules.getAll.useQuery();
  const { data: allProgress } = trpc.modules.getAllProgress.useQuery();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  const completedModules = allProgress?.filter((p) => p.status === "completed") || [];
  const inProgressModules = allProgress?.filter((p) => p.status === "in_progress") || [];
  const totalModules = modules?.length || 10;
  const completionPercentage = Math.round((completedModules.length / totalModules) * 100);

  const totalAssessmentScore = completedModules.reduce(
    (sum, p) => sum + (p.assessmentScore || 0),
    0
  );
  const averageScore =
    completedModules.length > 0 ? Math.round(totalAssessmentScore / completedModules.length) : 0;

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "instructor":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "provider":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "facilitator":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-400";
    if (score >= 80) return "text-blue-400";
    if (score >= 70) return "text-yellow-400";
    return "text-red-400";
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-6xl mx-auto space-y-4 md:space-y-6">
          {/* Profile Header */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
                <Avatar className="w-24 h-24 border-4 border-[#FA9433]">
                  {user.profileImageUrl && (
                    <AvatarImage src={user.profileImageUrl} alt={user.name || "User"} />
                  )}
                  <AvatarFallback className="bg-[#FA9433] text-white text-2xl font-bold">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-3">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{user.name || "User"}</h1>
                    <div className="flex flex-wrap gap-3 items-center text-sm text-white/70">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {user.email || "No email"}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Joined {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRoleBadgeColor(user.role)} variant="outline">
                      <User className="w-3 h-3 mr-1" />
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                    {user.agreedToTerms && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30" variant="outline">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Terms Accepted
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                  <Button
                    variant="outline"
                    className="border-white/20 hover:bg-white/10"
                    onClick={() => setLocation("/profile/edit")}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  {user.calendarLink && (
                    <Button
                      variant="outline"
                      className="border-[#FA9433]/50 hover:bg-[#FA9433]/10 text-[#FA9433]"
                      onClick={() => window.open(user.calendarLink!, "_blank")}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      View Calendar
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="border-purple-500/50 hover:bg-purple-500/10 text-purple-400"
                    onClick={() => setLocation("/analytics")}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
                <Award className="h-4 w-4 text-[#FA9433]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{completionPercentage}%</div>
                <Progress value={completionPercentage} className="h-2 mb-2" />
                <p className="text-xs text-white/60">
                  {completedModules.length} of {totalModules} modules completed
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl md:text-3xl font-bold mb-2 ${getScoreColor(averageScore)}`}>
                  {averageScore}%
                </div>
                <p className="text-xs text-white/60">
                  Across {completedModules.length} completed assessments
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Clock className="h-4 w-4 text-orange-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">
                  {inProgressModules.length}
                </div>
                <p className="text-xs text-white/60">Modules currently being worked on</p>
              </CardContent>
            </Card>
          </div>

          {/* Certificate Section */}
          <CertificateSection />

          {/* Module Breakdown */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle>Module Progress & Scores</CardTitle>
              <CardDescription>Detailed breakdown of your performance in each module</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {modules?.map((module) => {
                  const progress = allProgress?.find((p) => p.moduleId === module.id);
                  const isCompleted = progress?.status === "completed";
                  const isInProgress = progress?.status === "in_progress";

                  return (
                    <div key={module.id}>
                      <div className="flex items-start gap-4">
                        <div
                          className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            isCompleted
                              ? "bg-green-500/20 text-green-400"
                              : isInProgress
                              ? "bg-orange-500/20 text-orange-400"
                              : "bg-white/5 text-white/40"
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="w-6 h-6" />
                          ) : (
                            <span className="text-lg font-bold">{module.moduleNumber}</span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h3 className="font-semibold text-white">{module.title}</h3>
                              <p className="text-sm text-white/60">{module.description}</p>
                            </div>
                            {isCompleted && progress?.assessmentScore !== null && (
                              <div className="text-right flex-shrink-0">
                                <div
                                  className={`text-2xl font-bold ${getScoreColor(
                                    progress.assessmentScore
                                  )}`}
                                >
                                  {progress.assessmentScore}%
                                </div>
                                <div className="text-xs text-white/50">Assessment Score</div>
                              </div>
                            )}
                          </div>

                          {progress && (
                            <div className="flex flex-wrap gap-3 text-xs">
                              {progress.videoWatched && (
                                <span className="text-green-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Video Watched
                                </span>
                              )}
                              {progress.transcriptViewed && (
                                <span className="text-blue-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Transcript Viewed
                                </span>
                              )}
                              {progress.assessmentCompleted && (
                                <span className="text-purple-400 flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3" />
                                  Assessment Completed
                                </span>
                              )}
                              {progress.completedAt && (
                                <span className="text-white/50 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Completed {new Date(progress.completedAt).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}

                          {!progress && (
                            <div className="text-sm text-white/40">Not started yet</div>
                          )}
                        </div>
                      </div>

                      {module.moduleNumber < (modules?.length || 10) && (
                        <Separator className="my-4 bg-white/10" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Certification Status */}
          {completionPercentage === 100 && (
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Award className="w-8 h-8 text-green-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Congratulations! Training Complete
                    </h3>
                    <p className="text-white/70">
                      You've successfully completed all 10 modules. Your certificate is ready!
                    </p>
                  </div>
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    Download Certificate
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <EditProfileDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        currentProfileImageUrl={user.profileImageUrl}
        currentCalendarLink={user.calendarLink}
        currentBio={user.bio}
        currentSpecializations={user.specializations}
      />
    </div>
  );
}
