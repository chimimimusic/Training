import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Users, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

import Header from "@/components/Header";
export default function ProviderDashboard() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const { data: myFacilitators } = trpc.provider.myFacilitators.useQuery();

  if (user?.role !== "provider" && user?.role !== "admin") {
    setLocation("/training");
    return null;
  }

  const completedCount = myFacilitators?.filter((f) => f.status === "completed").length || 0;
  const activeCount = myFacilitators?.filter((f) => f.status === "active").length || 0;

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
            <h1 className="text-4xl font-bold text-white">Provider Dashboard</h1>
            <p className="text-white/70">Track your referred facilitators' progress</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referred</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{myFacilitators?.length || 0}</div>
              <p className="text-xs text-muted-foreground mt-1">All facilitators</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Training</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Currently active</p>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certified</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{completedCount}</div>
              <p className="text-xs text-muted-foreground mt-1">Completed training</p>
            </CardContent>
          </Card>
        </div>

        {/* Facilitator List */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>Your Facilitators</CardTitle>
            <CardDescription>Track the progress of facilitators you've referred</CardDescription>
          </CardHeader>
          <CardContent>
            {myFacilitators && myFacilitators.length > 0 ? (
              <div className="rounded-md border border-white/10">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Joined</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myFacilitators.map((facilitator) => (
                      <TableRow key={facilitator.id} className="border-white/10">
                        <TableCell className="font-medium">{facilitator.name || "N/A"}</TableCell>
                        <TableCell>{facilitator.email || "N/A"}</TableCell>
                        <TableCell>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              facilitator.status === "completed"
                                ? "bg-green-500/20 text-green-400"
                                : facilitator.status === "active"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {facilitator.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={0} className="h-2 w-24" />
                            <span className="text-xs text-muted-foreground">0%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(facilitator.createdAt).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Facilitators Yet</h3>
                <p className="text-muted-foreground">
                  You haven't referred any facilitators to the training program yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* BAA Compliance */}
        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>HIPAA Compliance</CardTitle>
            <CardDescription>Business Associate Agreement status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-400" />
              <div>
                <div className="font-medium text-green-400">BAA Agreement Active</div>
                <div className="text-sm text-muted-foreground">
                  Your Business Associate Agreement is in effect
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </div>
  );
}
