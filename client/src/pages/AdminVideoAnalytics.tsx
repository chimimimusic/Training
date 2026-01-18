import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import { ArrowLeft, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminVideoAnalytics() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [moduleFilter, setModuleFilter] = useState<string>("all");

  const { data: videoProgress, isLoading } = trpc.admin.getAllVideoProgress.useQuery();
  const { data: modules } = trpc.modules.getAll.useQuery();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    setLocation("/");
    return null;
  }

  // Filter video progress data
  const filteredProgress = videoProgress?.filter(vp => {
    const matchesSearch = searchQuery === "" || 
      vp.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vp.userEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vp.moduleTitle?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesModule = moduleFilter === "all" || vp.moduleId === parseInt(moduleFilter);
    
    return matchesSearch && matchesModule;
  });

  // Calculate summary statistics
  const totalViews = filteredProgress?.length || 0;
  const avgWatchPercentage = filteredProgress && filteredProgress.length > 0
    ? Math.round(filteredProgress.reduce((sum, vp) => sum + (vp.watchPercentage || 0), 0) / filteredProgress.length)
    : 0;
  const totalWatchTime = filteredProgress
    ? Math.round(filteredProgress.reduce((sum, vp) => sum + (vp.totalWatchTimeSeconds || 0), 0) / 3600) // Convert to hours
    : 0;
  const completedViews = filteredProgress?.filter(vp => (vp.watchPercentage || 0) >= 95).length || 0;

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: any) => {
    if (!date) return "Never";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const exportToCSV = () => {
    if (!filteredProgress || filteredProgress.length === 0) return;

    const headers = ["User Name", "User Email", "Module", "Watch %", "Total Watch Time", "Last Watched", "Completions"];
    const rows = filteredProgress.map(vp => [
      vp.userName || "Unknown",
      vp.userEmail || "Unknown",
      vp.moduleTitle || `Module ${vp.moduleId}`,
      `${vp.watchPercentage}%`,
      formatDuration(vp.totalWatchTimeSeconds || 0),
      formatDate(vp.lastWatchedAt),
      vp.completionCount || 0
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `video-analytics-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 container py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLocation("/admin")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">Video Analytics</h1>
                <p className="text-white/60">Track video engagement across all users</p>
              </div>
            </div>
            <Button onClick={exportToCSV} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Total Video Views</CardDescription>
                <CardTitle className="text-3xl">{totalViews}</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Avg Watch Percentage</CardDescription>
                <CardTitle className="text-3xl">{avgWatchPercentage}%</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Total Watch Time</CardDescription>
                <CardTitle className="text-3xl">{totalWatchTime}h</CardTitle>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardHeader className="pb-2">
                <CardDescription>Completed Views</CardDescription>
                <CardTitle className="text-3xl">{completedViews}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filters */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user name, email, or module..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={moduleFilter} onValueChange={setModuleFilter}>
                  <SelectTrigger className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Filter by module" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Modules</SelectItem>
                    {modules?.map((module) => (
                      <SelectItem key={module.id} value={module.id.toString()}>
                        Module {module.moduleNumber}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle>Video Progress Details</CardTitle>
              <CardDescription>
                Showing {filteredProgress?.length || 0} of {videoProgress?.length || 0} records
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">Loading...</div>
              ) : filteredProgress && filteredProgress.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Module</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Watch Time</TableHead>
                        <TableHead>Last Watched</TableHead>
                        <TableHead>Completions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProgress.map((vp, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{vp.userName || "Unknown"}</div>
                              <div className="text-sm text-muted-foreground">{vp.userEmail || "No email"}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">
                              {vp.moduleTitle || `Module ${vp.moduleId}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Progress value={vp.watchPercentage || 0} className="flex-1" />
                                <span className="text-sm font-medium w-12 text-right">
                                  {vp.watchPercentage || 0}%
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {formatDuration(vp.totalWatchTimeSeconds || 0)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(vp.lastWatchedAt)}
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 text-sm font-medium">
                              {vp.completionCount || 0}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No video progress data found
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
