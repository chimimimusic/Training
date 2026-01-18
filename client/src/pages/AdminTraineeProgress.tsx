import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Download, User, TrendingUp, Clock, Award, Search, Filter } from "lucide-react";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminTraineeProgress() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [progressFilter, setProgressFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("name");

  const { data: analytics } = trpc.admin.traineeAnalytics.useQuery();
  const { data: trainees } = trpc.admin.allTraineesWithProgress.useQuery();

  if (user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  // Filter and sort trainees
  const filteredAndSortedTrainees = useMemo(() => {
    if (!trainees) return [];

    let filtered = trainees;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.name?.toLowerCase().includes(query) ||
          t.email?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((t) => t.status === statusFilter);
    }

    // Progress filter
    if (progressFilter !== "all") {
      if (progressFilter === "not_started") {
        filtered = filtered.filter((t) => t.completionPercentage === 0);
      } else if (progressFilter === "in_progress") {
        filtered = filtered.filter(
          (t) => t.completionPercentage > 0 && t.completionPercentage < 100
        );
      } else if (progressFilter === "completed") {
        filtered = filtered.filter((t) => t.completionPercentage === 100);
      }
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || "").localeCompare(b.name || "");
        case "progress":
          return b.completionPercentage - a.completionPercentage;
        case "enrollment":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case "activity":
          if (!a.lastActivity && !b.lastActivity) return 0;
          if (!a.lastActivity) return 1;
          if (!b.lastActivity) return -1;
          return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [trainees, searchQuery, statusFilter, progressFilter, sortBy]);

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
            <Button variant="ghost" size="icon" onClick={() => setLocation("/admin/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white">Trainee Progress Monitoring</h1>
              <p className="text-white/70">Track and analyze trainee performance</p>
            </div>
            <Button
              variant="outline"
              onClick={() => setLocation("/admin/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>

          {/* Analytics Cards */}
          {analytics && (
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trainees</CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.totalTrainees}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.activeTrainees} active
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.avgCompletionRate}%</div>
                  <Progress value={analytics.avgCompletionRate} className="h-2 mt-2" />
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Time to Complete</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.avgDaysToComplete}</div>
                  <p className="text-xs text-muted-foreground mt-1">days</p>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Completed</CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{analytics.completedTrainees}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {analytics.totalTrainees > 0
                      ? Math.round((analytics.completedTrainees / analytics.totalTrainees) * 100)
                      : 0}% of total
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters and Search */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-background border-white/20"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="bg-background border-white/20">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={progressFilter} onValueChange={setProgressFilter}>
                  <SelectTrigger className="bg-background border-white/20">
                    <SelectValue placeholder="Filter by progress" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Progress</SelectItem>
                    <SelectItem value="not_started">Not Started (0%)</SelectItem>
                    <SelectItem value="in_progress">In Progress (1-99%)</SelectItem>
                    <SelectItem value="completed">Completed (100%)</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-background border-white/20">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="progress">Progress (High to Low)</SelectItem>
                    <SelectItem value="enrollment">Enrollment Date (Newest)</SelectItem>
                    <SelectItem value="activity">Last Activity (Recent)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedTrainees.length} of {trainees?.length || 0} trainees
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("all");
                    setProgressFilter("all");
                    setSortBy("name");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trainee Progress Table */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Trainee Progress</CardTitle>
                  <CardDescription>Detailed progress tracking for all trainees</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLocation("/admin/progress/export")}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </Button>
              </div>
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
                      <TableHead>Modules</TableHead>
                      <TableHead>Avg Score</TableHead>
                      <TableHead>Last Activity</TableHead>
                      <TableHead>Days Enrolled</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAndSortedTrainees.map((trainee) => (
                      <TableRow key={trainee.id} className="border-white/10">
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {trainee.profileImageUrl ? (
                              <img
                                src={trainee.profileImageUrl}
                                alt={trainee.name || ""}
                                className="w-8 h-8 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                <User className="w-4 h-4 text-purple-400" />
                              </div>
                            )}
                            {trainee.name || "N/A"}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {trainee.email || "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadgeColor(trainee.status)}>
                            {trainee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={trainee.completionPercentage} className="h-2 w-24" />
                            <span className="text-sm font-medium">
                              {trainee.completionPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {trainee.completedModules} / {trainee.totalModules}
                        </TableCell>
                        <TableCell className="text-sm font-medium">
                          {trainee.avgAssessmentScore > 0 ? (
                            <span className={trainee.avgAssessmentScore >= 80 ? "text-green-400" : trainee.avgAssessmentScore >= 60 ? "text-yellow-400" : "text-red-400"}>
                              {trainee.avgAssessmentScore}%
                            </span>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {trainee.lastActivity
                            ? new Date(trainee.lastActivity).toLocaleDateString()
                            : "Never"}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {trainee.daysSinceEnrollment}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/admin/profile/${trainee.id}`)}
                            >
                              View Profile
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setLocation(`/admin/trainee/${trainee.id}`)}
                            >
                              View Progress
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
