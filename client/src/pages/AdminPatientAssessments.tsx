import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Eye, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import Header from "@/components/Header";

export default function AdminPatientAssessments() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [reviewNotes, setReviewNotes] = useState("");

  const { data: assessments, isLoading, refetch } = trpc.admin.getPendingAssessments.useQuery();

  const approveMutation = trpc.admin.approvePatientAssessment.useMutation({
    onSuccess: () => {
      toast.success("Assessment approved and patient account created!");
      setSelectedAssessment(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error("Failed to approve: " + error.message);
    },
  });

  const denyMutation = trpc.admin.denyPatientAssessment.useMutation({
    onSuccess: () => {
      toast.success("Assessment denied and patient notified");
      setSelectedAssessment(null);
      refetch();
    },
    onError: (error: any) => {
      toast.error("Failed to deny: " + error.message);
    },
  });

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container py-8">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">Admin access required</p>
            <Button onClick={() => setLocation("/")}>Go Home</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Patient Intake Assessments</h1>
            <p className="text-gray-600 mt-1">Review and approve patient applications</p>
          </div>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#FA9433]" />
            <p className="text-gray-600">Loading assessments...</p>
          </Card>
        ) : !assessments || assessments.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-600">No pending assessments</p>
          </Card>
        ) : (
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments.map((assessment: any) => (
                  <TableRow key={assessment.id}>
                    <TableCell className="font-medium">
                      {assessment.firstName} {assessment.lastName}
                    </TableCell>
                    <TableCell>{assessment.age}</TableCell>
                    <TableCell>
                      {new Date(assessment.assessmentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{assessment.totalScore}/75</span>
                        <span className="text-sm text-gray-500">
                          ({Math.round((assessment.totalScore / 75) * 100)}%)
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {assessment.status === "pending" && (
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-300">
                          Pending Review
                        </Badge>
                      )}
                      {assessment.status === "approved" && (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                          Approved
                        </Badge>
                      )}
                      {assessment.status === "denied" && (
                        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-300">
                          Denied
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedAssessment(assessment)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Review
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        )}

        {/* Review Dialog */}
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Assessment Review: {selectedAssessment?.firstName} {selectedAssessment?.lastName}
              </DialogTitle>
            </DialogHeader>

            {selectedAssessment && (
              <div className="space-y-6">
                {/* Score Summary */}
                <Card className="p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Total Score</div>
                      <div className="text-3xl font-bold text-[#FA9433]">
                        {selectedAssessment.totalScore}/75
                      </div>
                      <div className="text-sm text-gray-600">
                        {Math.round((selectedAssessment.totalScore / 75) * 100)}%
                        {selectedAssessment.passed ? " - Passed" : " - Below Threshold"}
                      </div>
                    </div>
                    {selectedAssessment.passed ? (
                      <CheckCircle className="h-16 w-16 text-green-500" />
                    ) : (
                      <XCircle className="h-16 w-16 text-red-500" />
                    )}
                  </div>
                </Card>

                {/* Demographics */}
                <div>
                  <h3 className="font-bold mb-2">Demographics</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Age:</span> {selectedAssessment.age}
                    </div>
                    <div>
                      <span className="text-gray-600">Gender:</span> {selectedAssessment.gender}
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>{" "}
                      {new Date(selectedAssessment.assessmentDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Mental Health History */}
                <div>
                  <h3 className="font-bold mb-2">Mental Health History</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Depression: {selectedAssessment.hasDepression ? "Yes" : "No"}</div>
                    <div>Anxiety: {selectedAssessment.hasAnxiety ? "Yes" : "No"}</div>
                    <div>PTSD: {selectedAssessment.hasPTSD ? "Yes" : "No"}</div>
                    <div>Taking Medication: {selectedAssessment.takingMedication ? "Yes" : "No"}</div>
                  </div>
                </div>

                {/* Symptom Severity */}
                <div>
                  <h3 className="font-bold mb-2">Symptom Severity (1-5 scale)</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Sadness: {selectedAssessment.sadnessLevel}/5</div>
                    <div>Anxiety: {selectedAssessment.anxietyLevel}/5</div>
                    <div>Irritability: {selectedAssessment.irritabilityLevel}/5</div>
                    <div>Fatigue: {selectedAssessment.fatigueLevel}/5</div>
                    <div>Lack of Motivation: {selectedAssessment.motivationLevel}/5</div>
                  </div>
                </div>

                {/* Music Preferences */}
                <div>
                  <h3 className="font-bold mb-2">Music Preferences</h3>
                  <div className="space-y-2 text-sm">
                    <div>Enjoys Music: {selectedAssessment.enjoysMusic ? "Yes" : "No"}</div>
                    <div>Frequency: {selectedAssessment.musicFrequency}</div>
                    <div>Genres: {selectedAssessment.musicGenres}</div>
                    <div>Musical Experience: {selectedAssessment.hasMusicalExperience ? "Yes" : "No"}</div>
                    <div>Formal Training: {selectedAssessment.hasFormalTraining ? "Yes" : "No"}</div>
                    <div>Music is Soothing: {selectedAssessment.musicSoothing}</div>
                    <div>Music Expresses Emotions: {selectedAssessment.musicExpressesEmotions}</div>
                    <div>Openness to Therapy: {selectedAssessment.opennessToMusicTherapy}</div>
                  </div>
                </div>

                {/* Review Notes */}
                <div>
                  <label className="font-bold block mb-2">Review Notes (Optional)</label>
                  <Textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Add any notes about this assessment..."
                    rows={3}
                  />
                </div>

                {/* Actions */}
                {selectedAssessment.status === "pending" && (
                  <div className="flex gap-3">
                    <Button
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        approveMutation.mutate({
                          assessmentId: selectedAssessment.id,
                          reviewNotes,
                        });
                      }}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve & Create Account
                    </Button>
                    <Button
                      className="flex-1 bg-red-600 hover:bg-red-700"
                      onClick={() => {
                        denyMutation.mutate({
                          assessmentId: selectedAssessment.id,
                          reviewNotes,
                        });
                      }}
                      disabled={denyMutation.isPending}
                    >
                      {denyMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Deny Assessment
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
