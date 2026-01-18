import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { CheckCircle2, Circle, Lock, PlayCircle, Video, Calendar, Menu, X } from "lucide-react";
import { useLocation, Link } from "wouter";
import Header from "@/components/Header";
import { ProfileCompletenessBanner } from "@/components/ProfileCompletenessBanner";
import { toast } from "sonner";

// Mock user for public access (auth removed)
const user = {
  id: 1,
  name: "Demo Trainee",
  email: "demo@soundbridge.health",
  role: "trainee",
  status: "active",
  agreedToTerms: true,
};

export default function Training() {
  const [, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { data: modules } = trpc.modules.getUnlockStatus.useQuery();
  const { data: allProgress } = trpc.modules.getAllProgress.useQuery();
  const { data: liveClasses } = trpc.liveClasses.upcoming.useQuery();
  const { data: userLiveClasses } = trpc.liveClasses.myClasses.useQuery();
  const { data: profileCheck } = trpc.profileCompleteness.check.useQuery();
  const { data: completeness } = trpc.profileCompleteness.getCompleteness.useQuery();

  const getModuleProgress = (moduleId: number) => {
    return allProgress?.find((p) => p.moduleId === moduleId);
  };

  const calculateOverallProgress = () => {
    if (!modules || !allProgress) return 0;
    const completed = allProgress.filter((p) => p.status === "completed").length;
    return Math.round((completed / modules.length) * 100);
  };

  const getModuleStatus = (moduleNumber: number, moduleId: number): "completed" | "in_progress" | "unlocked" | "locked" => {
    const progress = getModuleProgress(moduleId);
    
    if (progress?.status === "completed") return "completed";
    if (progress?.status === "in_progress") return "in_progress";
    
    // TESTING MODE: All modules unlocked for free testing
    return "unlocked";
    
    // PRODUCTION MODE: Uncomment below to enable prerequisites
    // // Module 1 is always unlocked
    // if (moduleNumber === 1 || moduleId === 1) return "unlocked";
    // 
    // // Check if previous module is completed
    // const previousModuleId = moduleId - 1;
    // const prevProgress = allProgress?.find(p => p.moduleId === previousModuleId);
    // 
    // if (!prevProgress) return "locked";
    // 
    // // Check completion requirements: video watched + assessment passed (80%+)
    // const isVideoWatched = prevProgress.videoWatched;
    // const isAssessmentPassed = prevProgress.assessmentCompleted && 
    //                             prevProgress.assessmentScore && 
    //                             prevProgress.assessmentScore >= 80;
    // 
    // if (isVideoWatched && isAssessmentPassed) {
    //   return "unlocked";
    // }
    // 
    // return "locked";
  };

  const handleModuleClick = async (moduleId: number, status: string) => {
    if (status === "locked") {
      toast.error("This module is locked. Complete the previous module first.");
      return;
    }
    setLocation(`/module/${moduleId}`);
  };

  const completedCount = allProgress?.filter((p) => p.status === "completed").length || 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Mobile Progress Toggle Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-orange-500 hover:bg-orange-600 text-white p-4 rounded-full shadow-lg"
        aria-label="Toggle progress sidebar"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      
      <div className="flex flex-1 relative">
        {/* Left Sidebar - Progress Tracker */}
        <aside className={`
          w-80 border-r border-white/10 bg-card/30 backdrop-blur p-6 space-y-6
          lg:relative lg:translate-x-0
          fixed inset-y-0 left-0 z-40 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Your Progress</h2>
            <p className="text-white/60 text-sm">
              Track your journey through the certification program
            </p>
          </div>

          {/* Overall Progress */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Overall Completion</span>
                  <span className="font-bold text-white">{calculateOverallProgress()}%</span>
                </div>
                <Progress value={calculateOverallProgress()} className="h-3" />
                <div className="flex items-center justify-between text-xs text-white/50">
                  <span>{completedCount} of {modules?.length || 10} modules</span>
                  <span>{(modules?.length || 10) - completedCount} remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Module Progress List */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-white/70 uppercase tracking-wide">
              Module Status
            </h3>
            <div className="space-y-2">
              {modules?.map((module) => {
                const status = getModuleStatus(module.moduleNumber, module.id);
                const progress = getModuleProgress(module.id);

                return (
                  <button
                    key={module.id}
                    onClick={() => {
                      if (status !== "locked" && profileCheck?.canAccess) {
                        setLocation(`/module/${module.id}`);
                      }
                    }}
                    disabled={status === "locked" || !profileCheck?.canAccess}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                      status === "locked"
                        ? "opacity-40 cursor-not-allowed"
                        : "hover:bg-white/5 cursor-pointer"
                    } ${
                      status === "in_progress"
                        ? "bg-orange-500/10 border border-orange-500/20"
                        : ""
                    }`}
                  >
                    {/* Status Icon */}
                    <div className="flex-shrink-0">
                      {status === "completed" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                      ) : status === "in_progress" ? (
                        <Circle className="w-5 h-5 text-orange-400 fill-orange-400/20" />
                      ) : status === "locked" ? (
                        <Lock className="w-5 h-5 text-white/30" />
                      ) : (
                        <Circle className="w-5 h-5 text-white/40" />
                      )}
                    </div>

                    {/* Module Info */}
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        status === "completed" ? "text-[#FA9433]" : "text-white"
                      }`}>
                        Module {module.moduleNumber}
                      </div>
                      <div className={`text-xs ${
                        status === "completed" ? "text-[#FA9433]/70" : "text-white/50"
                      }`}>
                        {status === "completed"
                          ? "Completed"
                          : status === "in_progress"
                          ? "In Progress"
                          : status === "locked"
                          ? "Locked"
                          : "Not Started"}
                      </div>
                    </div>

                    {/* Progress Indicators */}
                    {progress && status !== "locked" && (
                      <div className="flex gap-1 text-xs">
                        {progress.videoWatched && (
                          <span className="text-green-400">📹</span>
                        )}
                        {progress.transcriptViewed && (
                          <span className="text-blue-400">📄</span>
                        )}
                        {progress.assessmentCompleted && (
                          <span className="text-purple-400">✓</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Certification Status */}
          {completedCount === modules?.length && (
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                  <h3 className="font-bold text-white">Ready for Certification!</h3>
                  <p className="text-sm text-white/70">
                    You've completed all modules. Contact your instructor for final certification.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </aside>

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-4 md:space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Facilitator Training</h1>
              <p className="text-sm md:text-base text-white/70">Complete all 10 modules to earn your certification</p>
            </div>
            
            {/* Profile Completeness Banner */}
            {completeness && !completeness.isComplete && (
              <ProfileCompletenessBanner
                isComplete={completeness.isComplete}
                percentage={completeness.percentage}
                missingFields={completeness.missingFields}
                missingEducation={completeness.missingEducation}
                missingEmployment={completeness.missingEmployment}
              />
            )}

            {/* Module Cards with Live Classes */}
            <div className="grid gap-4">
              {modules?.map((module, index) => {
                const status = getModuleStatus(module.moduleNumber, module.id);
                const progress = getModuleProgress(module.id);

                const liveClassAfterModule = 
                  module.moduleNumber === 4 ? liveClasses?.find(lc => lc.classType === 'review_3') :
                  module.moduleNumber === 7 ? liveClasses?.find(lc => lc.classType === 'review_6') :
                  module.moduleNumber === 10 ? liveClasses?.find(lc => lc.classType === 'review_9') :
                  null;
                
                const hasRegistered = liveClassAfterModule ? 
                  userLiveClasses?.some(ulc => ulc.liveClassAttendance.liveClassId === liveClassAfterModule.id) : 
                  false;

                return (
                  <React.Fragment key={module.id}>
                  <Card
                    key={module.id}
                    className={`bg-card/50 backdrop-blur border-white/10 transition-all ${
                      status === "locked" ? "opacity-50" : "hover:bg-card/70 cursor-pointer"
                    }`}
                    onClick={() => handleModuleClick(module.id, status)}
                  >
                    <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 md:p-6">
                      {/* Module Icon */}
                      <div
                        className={`flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-xl sm:text-2xl font-bold ${
                          status === "completed"
                            ? "bg-green-500/20 text-green-400"
                            : status === "in_progress"
                            ? "bg-orange-500/20 text-orange-400"
                            : status === "locked"
                            ? "bg-white/5 text-white/30"
                            : "bg-blue-500/20 text-blue-400"
                        }`}
                      >
                        {status === "completed" ? (
                          <CheckCircle2 className="w-6 h-6 sm:w-8 sm:h-8" />
                        ) : status === "locked" ? (
                          <Lock className="w-6 h-6 sm:w-8 sm:h-8" />
                        ) : (
                          <PlayCircle className="w-6 h-6 sm:w-8 sm:h-8" />
                        )}
                      </div>

                      {/* Module Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : status === "in_progress"
                                ? "bg-orange-500/20 text-orange-400"
                                : "bg-white/10 text-white/50"
                            }`}
                          >
                            Module {module.moduleNumber}
                          </span>
                          {status === "in_progress" && (
                            <span className="text-xs text-orange-400">In Progress</span>
                          )}
                          {status === "locked" && (
                            <span className="text-xs text-white/40">Locked</span>
                          )}
                        </div>
                        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">{module.title}</h3>
                        <p className="text-white/60 text-xs sm:text-sm">{module.description}</p>

                        {/* Progress Indicators */}
                        {progress && status !== "locked" && (
                          <div className="flex flex-wrap gap-2 sm:gap-4 mt-3 text-xs sm:text-sm">
                            {progress.videoWatched && (
                              <span className="text-green-400 flex items-center gap-1">
                                ✓ Video watched
                              </span>
                            )}
                            {progress.transcriptViewed && (
                              <span className="text-blue-400 flex items-center gap-1">
                                ✓ Transcript viewed
                              </span>
                            )}
                            {progress.assessmentCompleted && (
                              <span className="text-purple-400 flex items-center gap-1">
                                ✓ Assessment: {progress.assessmentScore} points
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      {status !== "locked" && (
                        <Button
                          variant={status === "completed" ? "outline" : "default"}
                          className="w-full sm:w-auto"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/module/${module.id}`);
                          }}
                        >
                          {status === "completed" ? "Review" : "Continue"}
                        </Button>
                      )}
                    </CardContent>
                  </Card>

                  {/* Live Class Card after modules 4, 7, 10 */}
                  {liveClassAfterModule && (
                    <Card
                      key={`live-${liveClassAfterModule.id}`}
                      className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 backdrop-blur"
                    >
                      <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 md:p-6">
                        {/* Icon */}
                        <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-purple-500/30 flex items-center justify-center">
                          <Video className="w-6 h-6 sm:w-8 sm:h-8 text-purple-300" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                            <span className="text-xs font-semibold px-2 py-1 rounded-full bg-purple-500/30 text-purple-300">
                              Live Review Session
                            </span>
                            {hasRegistered && (
                              <span className="text-xs text-green-400 flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Registered
                              </span>
                            )}
                          </div>
                          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-1">{liveClassAfterModule.title}</h3>
                          <p className="text-white/60 text-xs sm:text-sm mb-2">{liveClassAfterModule.description}</p>
                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-white/50">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(liveClassAfterModule.scheduledAt).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </span>
                            <span>{liveClassAfterModule.durationMinutes} minutes</span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <Button
                          variant={hasRegistered ? "outline" : "default"}
                          className={`w-full sm:w-auto ${hasRegistered ? "" : "bg-purple-600 hover:bg-purple-700"}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/live-class/${liveClassAfterModule.id}`);
                          }}
                        >
                          {hasRegistered ? "View Session" : "Join Live Class"}
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                  </React.Fragment>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
