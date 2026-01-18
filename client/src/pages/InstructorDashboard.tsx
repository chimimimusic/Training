import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Users, BookOpen } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedTrainee, setSelectedTrainee] = useState<number | null>(null);

  const { data: trainees } = trpc.instructor.trainees.useQuery();
  const { data: traineeProgress } = trpc.instructor.traineeProgress.useQuery(
    { userId: selectedTrainee! },
    { enabled: !!selectedTrainee }
  );

  if (user?.role !== "instructor" && user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  const calculateProgress = (progress: any[]) => {
    if (!progress || progress.length === 0) return 0;
    const completed = progress.filter((p) => p.status === "completed").length;
    return Math.round((completed / 10) * 100);
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
            <h1 className="text-4xl font-bold text-white">Instructor Dashboard</h1>
            <p className="text-white/70">Monitor trainee progress and manage live classes</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{trainees?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">Active trainees</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-white/10 cursor-pointer hover:bg-card/70 transition-colors" onClick={() => setLocation('/instructor/live-classes')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">3</div>
              <p className="text-xs text-muted-foreground mt-1">Live review sessions</p>
              <Button variant="link" className="text-purple-400 hover:text-purple-300 p-0 h-auto mt-2">
                Manage Sessions →
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Trainee List */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>Trainee Progress</CardTitle>
            <CardDescription>View detailed progress for each trainee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-white/10">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainees?.map((trainee) => (
                    <TableRow key={trainee.id} className="border-white/10">
                      <TableCell className="font-medium">{trainee.name || "N/A"}</TableCell>
                      <TableCell>{trainee.email || "N/A"}</TableCell>
                      <TableCell>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            trainee.status === "active"
                              ? "bg-green-500/20 text-green-400"
                              : "bg-gray-500/20 text-gray-400"
                          }`}
                        >
                          {trainee.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={0} className="h-2 w-24" />
                          <span className="text-xs text-muted-foreground">0%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedTrainee(trainee.id)}
                        >
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Selected Trainee Details */}
        {selectedTrainee && traineeProgress && (
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle>Trainee Module Progress</CardTitle>
              <CardDescription>
                Detailed progress for {trainees?.find((t) => t.id === selectedTrainee)?.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {traineeProgress.map((progress) => (
                  <div
                    key={progress.id}
                    className="flex items-center justify-between p-4 bg-muted/20 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">Module {progress.moduleId}</div>
                      <div className="text-sm text-muted-foreground">
                        Status: {progress.status}
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm">
                      {progress.videoWatched && <span className="text-green-400">✓ Video</span>}
                      {progress.transcriptViewed && (
                        <span className="text-green-400">✓ Transcript</span>
                      )}
                      {progress.assessmentCompleted && (
                        <span className="text-green-400">
                          ✓ Assessment ({progress.assessmentScore} pts)
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Live Classes */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>Live Review Classes</CardTitle>
            <CardDescription>Manage scheduled instructor-led sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium">Review Session 1 (After Module 3)</div>
                <div className="text-sm text-muted-foreground">Not scheduled yet</div>
              </div>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium">Review Session 2 (After Module 6)</div>
                <div className="text-sm text-muted-foreground">Not scheduled yet</div>
              </div>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
              <div>
                <div className="font-medium">Review Session 3 (After Module 9)</div>
                <div className="text-sm text-muted-foreground">Not scheduled yet</div>
              </div>
              <Button variant="outline" size="sm">
                Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
