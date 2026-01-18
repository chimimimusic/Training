import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { 
  TrendingUp, 
  Clock, 
  Award, 
  Video, 
  Users, 
  Target,
  Flame,
  CheckCircle2
} from "lucide-react";

export default function Analytics() {
  const { user } = useAuth();
  
  const { data: metrics, isLoading: metricsLoading } = trpc.analytics.myMetrics.useQuery();
  const { data: moduleBreakdown, isLoading: breakdownLoading } = trpc.analytics.moduleBreakdown.useQuery();
  
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white/60">Please log in to view your analytics</p>
        </div>
      </div>
    );
  }
  
  if (metricsLoading || breakdownLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-white">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  const overall = metrics?.overall;
  const assessmentScores = metrics?.assessmentScores || [];
  const videoCompletion = metrics?.videoCompletion || [];
  const timeSpent = metrics?.timeSpent || [];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Progress Analytics</h1>
            <p className="text-white/70">Track your learning journey and performance metrics</p>
          </div>
          
          {/* Overall Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-purple-500/20 to-indigo-500/20 border-purple-500/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Target className="w-8 h-8 text-purple-400" />
                  <span className="text-3xl font-bold text-white">{overall?.progressPercentage}%</span>
                </div>
                <p className="text-white/70 text-sm">Overall Progress</p>
                <p className="text-white/50 text-xs mt-1">
                  {overall?.completedModules} of {overall?.totalModules} modules
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Award className="w-8 h-8 text-green-400" />
                  <span className="text-3xl font-bold text-white">{overall?.averageScore}%</span>
                </div>
                <p className="text-white/70 text-sm">Average Score</p>
                <p className="text-white/50 text-xs mt-1">
                  Across {assessmentScores.length} assessments
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="w-8 h-8 text-blue-400" />
                  <span className="text-3xl font-bold text-white">{overall?.totalTimeMinutes}</span>
                </div>
                <p className="text-white/70 text-sm">Minutes Studied</p>
                <p className="text-white/50 text-xs mt-1">
                  Total learning time
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border-orange-500/30 backdrop-blur">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <Flame className="w-8 h-8 text-orange-400" />
                  <span className="text-3xl font-bold text-white">{overall?.currentStreak}</span>
                </div>
                <p className="text-white/70 text-sm">Day Streak</p>
                <p className="text-white/50 text-xs mt-1">
                  Max: {overall?.maxStreak} days
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Assessment Scores Chart */}
          {assessmentScores.length > 0 && (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Assessment Performance Trend
                </CardTitle>
                <CardDescription className="text-white/60">
                  Your scores across completed modules
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessmentScores.map((assessment: any) => (
                    <div key={assessment.moduleId} className="flex items-center gap-4">
                      <div className="w-32 text-white/70 text-sm truncate">
                        {assessment.moduleTitle || `Module ${assessment.moduleId}`}
                      </div>
                      <div className="flex-1">
                        <div className="h-8 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className={`h-full flex items-center justify-end px-3 text-white text-sm font-semibold transition-all ${
                              assessment.score >= 80
                                ? "bg-gradient-to-r from-green-500/60 to-green-400/60"
                                : "bg-gradient-to-r from-yellow-500/60 to-yellow-400/60"
                            }`}
                            style={{ width: `${assessment.score}%` }}
                          >
                            {assessment.score}%
                          </div>
                        </div>
                      </div>
                      <div className="w-24 text-white/50 text-xs text-right">
                        {new Date(assessment.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Video Completion & Time Spent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Video Completion */}
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-blue-400" />
                  Video Completion Rate
                </CardTitle>
                <CardDescription className="text-white/60">
                  Progress through video content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {videoCompletion.slice(0, 10).map((module: any) => (
                    <div key={module.moduleId} className="flex items-center gap-4">
                      <div className="w-20 text-white/70 text-sm">
                        Module {module.moduleId}
                      </div>
                      <div className="flex-1">
                        <div className="h-6 bg-white/5 rounded-lg overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500/60 to-cyan-400/60 flex items-center justify-end px-2 text-white text-xs font-semibold"
                            style={{ width: `${module.videoWatchPercentage}%` }}
                          >
                            {module.videoWatchPercentage > 10 && `${module.videoWatchPercentage}%`}
                          </div>
                        </div>
                      </div>
                      {module.videoWatched && (
                        <CheckCircle2 className="w-4 h-4 text-green-400" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Time Spent */}
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Time Spent per Module
                </CardTitle>
                <CardDescription className="text-white/60">
                  Learning time breakdown
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {timeSpent
                    .sort((a: any, b: any) => b.timeSpentMinutes - a.timeSpentMinutes)
                    .slice(0, 10)
                    .map((module: any) => (
                      <div key={module.moduleId} className="flex items-center gap-4">
                        <div className="w-20 text-white/70 text-sm">
                          Module {module.moduleId}
                        </div>
                        <div className="flex-1">
                          <div className="h-6 bg-white/5 rounded-lg overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-purple-500/60 to-pink-400/60 flex items-center justify-end px-2 text-white text-xs font-semibold"
                              style={{ 
                                width: `${Math.min((module.timeSpentMinutes / Math.max(...timeSpent.map((m: any) => m.timeSpentMinutes))) * 100, 100)}%` 
                              }}
                            >
                              {module.timeSpentMinutes}m
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Live Session Attendance */}
          {overall && overall.liveSessionsAttended > 0 && (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" />
                  Live Session Attendance
                </CardTitle>
                <CardDescription className="text-white/60">
                  Participation in instructor-led sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="text-4xl font-bold text-white">
                    {overall.liveSessionsAttended}
                  </div>
                  <div className="text-white/70">
                    live sessions attended
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Module Breakdown Table */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Module-by-Module Breakdown</CardTitle>
              <CardDescription className="text-white/60">
                Detailed progress across all training modules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-white/70 font-semibold">Module</th>
                      <th className="text-center py-3 px-4 text-white/70 font-semibold">Status</th>
                      <th className="text-center py-3 px-4 text-white/70 font-semibold">Video</th>
                      <th className="text-center py-3 px-4 text-white/70 font-semibold">Assessment</th>
                      <th className="text-center py-3 px-4 text-white/70 font-semibold">Time</th>
                      <th className="text-center py-3 px-4 text-white/70 font-semibold">Completed</th>
                    </tr>
                  </thead>
                  <tbody>
                    {moduleBreakdown?.map((module: any) => (
                      <tr key={module.moduleId} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-3 px-4 text-white">
                          <div className="font-medium">{module.moduleTitle}</div>
                          <div className="text-xs text-white/50">Module {module.moduleId}</div>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                            module.status === 'completed' 
                              ? 'bg-green-500/20 text-green-400'
                              : module.status === 'in_progress'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-white/10 text-white/50'
                          }`}>
                            {module.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {module.videoWatched ? (
                            <CheckCircle2 className="w-5 h-5 text-green-400 mx-auto" />
                          ) : (
                            <span className="text-white/50">{module.videoWatchPercentage}%</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {module.assessmentPassed ? (
                            <div className="flex flex-col items-center">
                              <CheckCircle2 className="w-5 h-5 text-green-400" />
                              <span className="text-xs text-white/50">{module.assessmentScore}%</span>
                            </div>
                          ) : module.assessmentScore !== null ? (
                            <span className="text-red-400">{module.assessmentScore}%</span>
                          ) : (
                            <span className="text-white/30">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center text-white/70">
                          {module.timeSpentMinutes}m
                        </td>
                        <td className="py-3 px-4 text-center text-white/50 text-xs">
                          {module.completedAt 
                            ? new Date(module.completedAt).toLocaleDateString()
                            : '—'
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
