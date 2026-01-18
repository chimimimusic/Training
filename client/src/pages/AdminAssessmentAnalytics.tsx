import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, TrendingDown, BarChart3, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

export default function AdminAssessmentAnalytics() {
  const [, setLocation] = useLocation();
  const [selectedModule, setSelectedModule] = useState<number | undefined>(undefined);

  const { data: moduleSummary, isLoading: summaryLoading } = trpc.admin.assessmentAnalytics.getModuleSummary.useQuery();
  const { data: questionAnalytics, isLoading: analyticsLoading } = trpc.admin.assessmentAnalytics.getQuestionAnalytics.useQuery({ moduleId: selectedModule });
  const { data: lowPerformanceQuestions, isLoading: lowPerfLoading } = trpc.admin.assessmentAnalytics.getLowPerformanceQuestions.useQuery();

  return (
    <div className="container mx-auto py-8">
      <Button
        variant="ghost"
        onClick={() => setLocation('/admin')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Admin Dashboard
      </Button>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Assessment Analytics</h1>
        <p className="text-muted-foreground">
          Question-level performance metrics and common wrong answers
        </p>
      </div>

      {/* Module Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Modules</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{moduleSummary?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              With assessment data
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Success Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {moduleSummary && moduleSummary.length > 0
                ? Math.round(
                    moduleSummary.reduce((sum, m) => sum + (m.avgPercentCorrect || 0), 0) /
                      moduleSummary.length
                  )
                : 0}%
            </div>
            <p className="text-xs text-muted-foreground">
              Across all questions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Performance Questions</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowPerformanceQuestions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              Below 50% success rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Module Filter */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filter by Module</CardTitle>
          <CardDescription>Select a module to view detailed question analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <Select
            value={selectedModule?.toString() || "all"}
            onValueChange={(value) => setSelectedModule(value === "all" ? undefined : parseInt(value))}
          >
            <SelectTrigger className="w-full md:w-[300px]">
              <SelectValue placeholder="All Modules" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {moduleSummary?.map((module) => (
                <SelectItem key={module.moduleId} value={module.moduleId.toString()}>
                  Module {module.moduleId}: {module.moduleTitle}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Low Performance Questions Alert */}
      {lowPerformanceQuestions && lowPerformanceQuestions.length > 0 && (
        <Card className="mb-8 border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Questions Requiring Attention
            </CardTitle>
            <CardDescription>
              These questions have less than 50% correct responses and may need content clarification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Module</TableHead>
                  <TableHead>Question</TableHead>
                  <TableHead className="text-right">Success Rate</TableHead>
                  <TableHead className="text-right">Total Attempts</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowPerformanceQuestions.map((q) => (
                  <TableRow key={q.assessmentId}>
                    <TableCell className="font-medium">
                      Module {q.moduleId}
                    </TableCell>
                    <TableCell className="max-w-md">{q.questionText}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="destructive">{q.percentCorrect}%</Badge>
                    </TableCell>
                    <TableCell className="text-right">{q.totalAttempts}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Question Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Question Performance Details</CardTitle>
          <CardDescription>
            Success rates and common wrong answers for each question
          </CardDescription>
        </CardHeader>
        <CardContent>
          {analyticsLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading analytics...</div>
          ) : !questionAnalytics || questionAnalytics.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assessment data available yet
            </div>
          ) : (
            <div className="space-y-6">
              {questionAnalytics.map((qa) => (
                <div key={qa.assessmentId} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">Module {qa.moduleId}</Badge>
                        <Badge
                          variant={
                            qa.percentCorrect >= 80
                              ? "default"
                              : qa.percentCorrect >= 60
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {qa.percentCorrect}% Correct
                        </Badge>
                      </div>
                      <p className="font-medium">{qa.questionText}</p>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      {qa.totalAttempts} attempts
                    </div>
                  </div>

                  {qa.wrongAnswers && qa.wrongAnswers.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm font-medium mb-2 text-muted-foreground">
                        Common Wrong Answers:
                      </p>
                      <div className="space-y-2">
                        {qa.wrongAnswers.map((wa, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{wa.letter}</Badge>
                              <span>{wa.text}</span>
                            </div>
                            <span className="text-muted-foreground">{wa.count} times</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
