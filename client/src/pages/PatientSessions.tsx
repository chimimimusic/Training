import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { Plus, Video, Calendar, CheckCircle2, Circle, Clock, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useLocation } from "wouter";

export default function PatientSessions() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [newPatientOpen, setNewPatientOpen] = useState(false);
  const [newSessionOpen, setNewSessionOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<number | null>(null);

  const { data: patients, refetch: refetchPatients } = trpc.patientSessions.getMyPatients.useQuery();

  const createPatient = trpc.patientSessions.createPatient.useMutation({
    onSuccess: () => {
      toast.success("Patient added successfully");
      setNewPatientOpen(false);
      refetchPatients();
      setNewPatientForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        referralSource: "",
        notes: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add patient");
    },
  });

  const createSession = trpc.patientSessions.createSession.useMutation({
    onSuccess: () => {
      toast.success("Session scheduled successfully");
      setNewSessionOpen(false);
      refetchPatients();
      setNewSessionForm({
        patientId: 0,
        sessionNumber: 1,
        scheduledAt: "",
        notes: "",
      });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to schedule session");
    },
  });

  const [newPatientForm, setNewPatientForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    referralSource: "",
    notes: "",
  });

  const [newSessionForm, setNewSessionForm] = useState({
    patientId: 0,
    sessionNumber: 1,
    scheduledAt: "",
    notes: "",
  });

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user || (user.role !== "facilitator" && user.role !== "admin")) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Only certified facilitators can access patient sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/")}>Go to Home</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleAddPatient = () => {
    if (!newPatientForm.firstName || !newPatientForm.lastName || !newPatientForm.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    createPatient.mutate(newPatientForm);
  };

  const handleScheduleSession = () => {
    if (!newSessionForm.patientId || !newSessionForm.sessionNumber) {
      toast.error("Please select a patient and session number");
      return;
    }
    createSession.mutate(newSessionForm);
  };

  const openScheduleDialog = (patientId: number) => {
    setSelectedPatient(patientId);
    setNewSessionForm({ ...newSessionForm, patientId });
    setNewSessionOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-gradient-to-b from-[#0B3F87] to-[#1a5fb4] py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Patient Sessions</h1>
              <p className="text-white/70">Manage your patient sessions and schedule appointments</p>
            </div>
            
            <Dialog open={newPatientOpen} onOpenChange={setNewPatientOpen}>
              <DialogTrigger asChild>
                <Button style={{ backgroundColor: '#FA9433' }} className="text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Patient
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#1a2332] border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Add New Patient</DialogTitle>
                  <DialogDescription className="text-white/70">
                    Enter patient information to begin the 10-session protocol
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name *</Label>
                      <Input
                        id="firstName"
                        value={newPatientForm.firstName}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, firstName: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={newPatientForm.lastName}
                        onChange={(e) => setNewPatientForm({ ...newPatientForm, lastName: e.target.value })}
                        className="bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-white">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newPatientForm.email}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-white">Phone</Label>
                    <Input
                      id="phone"
                      value={newPatientForm.phone}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth" className="text-white">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={newPatientForm.dateOfBirth}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, dateOfBirth: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="referralSource" className="text-white">Referral Source</Label>
                    <Input
                      id="referralSource"
                      value={newPatientForm.referralSource}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, referralSource: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-white">Notes</Label>
                    <Textarea
                      id="notes"
                      value={newPatientForm.notes}
                      onChange={(e) => setNewPatientForm({ ...newPatientForm, notes: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      rows={3}
                    />
                  </div>
                  <Button
                    onClick={handleAddPatient}
                    disabled={createPatient.isPending}
                    style={{ backgroundColor: '#FA9433' }}
                    className="w-full text-white"
                  >
                    {createPatient.isPending ? "Adding..." : "Add Patient"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Patients List */}
          {!patients || patients.length === 0 ? (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="py-12 text-center">
                <p className="text-white/70 mb-4">No patients yet. Add your first patient to get started.</p>
                <Button
                  onClick={() => setNewPatientOpen(true)}
                  style={{ backgroundColor: '#FA9433' }}
                  className="text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Patient
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {patients.map((item: any) => {
                const patient = item.patient;
                return (
                  <Card key={patient.id} className="bg-card/50 backdrop-blur border-white/10">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-xl">
                            {patient.firstName} {patient.lastName}
                          </CardTitle>
                          <CardDescription className="text-white/70">
                            {patient.email} {patient.phone && `• ${patient.phone}`}
                          </CardDescription>
                        </div>
                        <Button
                          onClick={() => openScheduleDialog(patient.id)}
                          style={{ backgroundColor: '#FA9433' }}
                          className="text-white"
                          size="sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Session
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-white/70 mb-4">
                        {patient.referralSource && (
                          <span>Referred by: {patient.referralSource}</span>
                        )}
                      </div>
                      
                      {/* Session Progress */}
                      <div className="grid grid-cols-10 gap-2">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <div
                            key={num}
                            className="flex flex-col items-center gap-1"
                          >
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs">
                              {num}
                            </div>
                            <span className="text-xs text-white/50">Pending</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Schedule Session Dialog */}
          <Dialog open={newSessionOpen} onOpenChange={setNewSessionOpen}>
            <DialogContent className="bg-[#1a2332] border-white/10">
              <DialogHeader>
                <DialogTitle className="text-white">Schedule Session</DialogTitle>
                <DialogDescription className="text-white/70">
                  Schedule a session from the 10-session protocol
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="sessionNumber" className="text-white">Session Number *</Label>
                  <Select
                    value={newSessionForm.sessionNumber.toString()}
                    onValueChange={(value) => setNewSessionForm({ ...newSessionForm, sessionNumber: parseInt(value) })}
                  >
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select session number" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          Session {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="scheduledAt" className="text-white">Scheduled Date & Time</Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={newSessionForm.scheduledAt}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, scheduledAt: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="sessionNotes" className="text-white">Notes</Label>
                  <Textarea
                    id="sessionNotes"
                    value={newSessionForm.notes}
                    onChange={(e) => setNewSessionForm({ ...newSessionForm, notes: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    rows={3}
                  />
                </div>
                <Button
                  onClick={handleScheduleSession}
                  disabled={createSession.isPending}
                  style={{ backgroundColor: '#FA9433' }}
                  className="w-full text-white"
                >
                  {createSession.isPending ? "Scheduling..." : "Schedule Session"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}
