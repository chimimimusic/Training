import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { toast } from "sonner";

interface Question {
  id: string;
  text: string;
  type: "text" | "number" | "date" | "select" | "multi-select" | "title";
  fields?: string[];
  options?: string[];
  scored?: boolean; // Whether this question contributes to the score
}

const questions: Question[] = [
  { id: "name", text: "Tell me your name", type: "text", fields: ["First Name", "Last Name"], scored: false },
  { id: "age", text: "How old are you?", type: "number", scored: false },
  { id: "date", text: "What is today's date?", type: "date", scored: false },
  { id: "gender", text: "What is your gender?", type: "select", options: ["Male", "Female", "LGBTQ", "I'd prefer not to say"], scored: false },
  { id: "title1", text: "Great! Let's move on!", type: "title", scored: false },
  { id: "depression", text: "Have you ever suffered from depression?", type: "select", options: ["Yes", "No"], scored: true },
  { id: "anxiety", text: "Anxiety", type: "select", options: ["Yes", "No"], scored: true },
  { id: "ptsd", text: "PTSD", type: "select", options: ["Yes", "No"], scored: true },
  { id: "medication", text: "Tell me if you are taking anything for these symptoms?", type: "select", options: ["Yes", "No"], scored: true },
  { id: "title2", text: "Rate what you are feeling today on a scale from 1-5 with 5 being the most severe", type: "title", scored: false },
  { id: "sadness", text: "Sadness", type: "select", options: ["1", "2", "3", "4", "5"], scored: true },
  { id: "anxious", text: "Anxious", type: "select", options: ["1", "2", "3", "4", "5"], scored: true },
  { id: "irritable", text: "Irritable", type: "select", options: ["1", "2", "3", "4", "5"], scored: true },
  { id: "fatigue", text: "Fatigue due to lack of sleep", type: "select", options: ["1", "2", "3", "4", "5"], scored: true },
  { id: "motivation", text: "Lack of motivation", type: "select", options: ["1", "2", "3", "4", "5"], scored: true },
  { id: "title3", text: "Fabulous! Let's continue to the next section", type: "title", scored: false },
  { id: "enjoysMusic", text: "Do you enjoy listening to music?", type: "select", options: ["Yes", "No"], scored: true },
  { id: "musicFrequency", text: "How often do you listen to music?", type: "select", options: ["Daily", "Weekly", "Occasionally", "Rarely", "Never"], scored: true },
  { id: "musicGenres", text: "What genres of music do you prefer? (select all that apply)?", type: "multi-select", options: ["Classical", "Jazz", "Rock", "Pop", "Rap", "Electronic", "Country", "Folk"], scored: true },
  { id: "musicalExperience", text: "Do you have any experience playing a musical instrument or singing?", type: "select", options: ["Yes", "No"], scored: true },
  { id: "formalTraining", text: "Do you have any formal music training?", type: "select", options: ["Yes", "No"], scored: true },
  { id: "trainingExperience", text: "If yes, how did you find the experience?", type: "select", options: ["Very helpful", "Helpful", "Neutral", "Not Helpful", "Harmful"], scored: true },
  { id: "musicSoothing", text: "Do you find music to be soothing or calming?", type: "select", options: ["Always", "Often", "Sometimes", "Rarely", "Never"], scored: true },
  { id: "musicEmotions", text: "Do you feel that music can help you express emotions that are hard to talk about?", type: "select", options: ["Strongly Agree", "Agree", "Neutral", "Disagree", "Strongly Disagree"], scored: true },
  { id: "openness", text: "How open are you to trying music therapy as part of your treatment plan?", type: "select", options: ["Very Open", "Open", "Neutral", "Reluctant", "Very Reluctant"], scored: true },
  { id: "processing", text: "Please wait while we process your assessment", type: "title", scored: false }
];

export default function PatientIntakeAssessment() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setLocation] = useLocation();

  const submitMutation = trpc.patientIntake.submitAssessment.useMutation({
    onSuccess: (data: { id: number; passed: boolean; score: number }) => {
      toast.success(data.passed ? "Assessment Passed!" : "Assessment Complete");
      setLocation(`/assessment-result/${data.id}`);
    },
    onError: (error: any) => {
      toast.error("Failed to submit assessment: " + error.message);
      setIsProcessing(false);
    },
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleNext = async () => {
    // Validate current question
    if (currentQuestion.type !== "title") {
      if (currentQuestion.type === "text" && currentQuestion.fields) {
        for (const field of currentQuestion.fields) {
          if (!responses[field]?.trim()) {
            toast.error("Please complete all fields");
            return;
          }
        }
      } else if (!responses[currentQuestion.id]) {
        toast.error("Please answer this question");
        return;
      }
    }

    // Handle title screens
    if (currentQuestion.type === "title") {
      if (currentQuestion.text.includes("Please wait while we process")) {
        setIsProcessing(true);
        
        // Calculate score
        const score = calculateScore(responses);
        const passed = score >= 60; // 80% of 75 points

        // Submit to database
        await submitMutation.mutateAsync({
          firstName: responses["First Name"],
          lastName: responses["Last Name"],
          age: parseInt(responses.age),
          assessmentDate: responses.date,
          gender: responses.gender,
          hasDepression: responses.depression === "Yes",
          hasAnxiety: responses.anxiety === "Yes",
          hasPTSD: responses.ptsd === "Yes",
          takingMedication: responses.medication === "Yes",
          sadnessLevel: parseInt(responses.sadness),
          anxietyLevel: parseInt(responses.anxious),
          irritabilityLevel: parseInt(responses.irritable),
          fatigueLevel: parseInt(responses.fatigue),
          motivationLevel: parseInt(responses.motivation),
          enjoysMusic: responses.enjoysMusic === "Yes",
          musicFrequency: responses.musicFrequency,
          musicGenres: responses.musicGenres || "",
          hasMusicalExperience: responses.musicalExperience === "Yes",
          hasFormalTraining: responses.formalTraining === "Yes",
          trainingExperience: responses.trainingExperience || null,
          musicSoothing: responses.musicSoothing,
          musicExpressesEmotions: responses.musicEmotions,
          opennessToMusicTherapy: responses.openness,
          totalScore: score,
          passed,
        });

        // Also submit to Google Sheets (backup)
        try {
          const now = new Date();
          const pad = (n: number) => n.toString().padStart(2, '0');
          const ts = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}`;
          const sheetName = `${responses["First Name"]}_${responses["Last Name"]}_${ts}`.replace(/\\s+/g, "_");

          await fetch("https://script.google.com/macros/s/AKfycbyMB9TM0iB9_m7EJJBpgfc2pi_PhcnENVOCegpPofoJDwKby60SZJxaGmRka1IYn-0biw/exec", {
            method: "POST",
            body: JSON.stringify({ ...responses, sheetName, score, passed }),
            headers: { "Content-Type": "application/json" }
          });
        } catch (e) {
          console.error("Google Sheets backup failed:", e);
        }

        return;
      } else {
        // Auto-advance for normal title screens
        setTimeout(() => {
          setCurrentQuestionIndex(prev => prev + 1);
        }, 1500);
        return;
      }
    }

    // Move to next question
    setCurrentQuestionIndex(prev => prev + 1);
  };

  const calculateScore = (responses: Record<string, any>): number => {
    let score = 0;
    
    // Each scored question is worth 3 points (25 scored questions × 3 = 75 points)
    questions.forEach(q => {
      if (q.scored && responses[q.id]) {
        score += 3;
      }
    });

    return score;
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
        <Card className="bg-white p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold mb-4">Processing Your Assessment</h2>
          <Progress value={100} className="mb-4" />
          <p className="text-gray-600">Please wait...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
      <div className="max-w-lg w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <img 
            src="https://kajabi-storefronts-production.kajabi-cdn.com/kajabi-storefronts-production/file-uploads/themes/2160130164/settings_images/e07477a-5874-408e-4c82-010c04c3fae2_female_avatar_200x400_copy.png"
            alt="SoundBridge"
            className="w-24 h-auto"
          />
        </div>

        {/* Question Card */}
        <Card className="bg-white p-8">
          <h2 className="text-2xl font-bold text-center mb-6">
            {currentQuestion.text}
          </h2>

          {/* Input based on question type */}
          <div className="space-y-4 mb-6">
            {currentQuestion.type === "text" && currentQuestion.fields && (
              <>
                {currentQuestion.fields.map(field => (
                  <Input
                    key={field}
                    placeholder={field}
                    value={responses[field] || ""}
                    onChange={(e) => setResponses(prev => ({ ...prev, [field]: e.target.value }))}
                  />
                ))}
              </>
            )}

            {currentQuestion.type === "number" && (
              <Input
                type="number"
                value={responses[currentQuestion.id] || ""}
                onChange={(e) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              />
            )}

            {currentQuestion.type === "date" && (
              <Input
                type="date"
                value={responses[currentQuestion.id] || ""}
                onChange={(e) => setResponses(prev => ({ ...prev, [currentQuestion.id]: e.target.value }))}
              />
            )}

            {currentQuestion.type === "select" && currentQuestion.options && (
            <Select
              value={responses[currentQuestion.id] || ""}
              onValueChange={(value) => setResponses(prev => ({ ...prev, [currentQuestion.id]: value }))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Please select an option" />
              </SelectTrigger>
              <SelectContent>
                {currentQuestion.options.map(option => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            )}

            {currentQuestion.type === "multi-select" && currentQuestion.options && (
              <div className="space-y-2">
                {currentQuestion.options.map(option => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(responses[currentQuestion.id] || "").includes(option)}
                      onChange={(e) => {
                        const current = responses[currentQuestion.id] || "";
                        const selected = current ? current.split(", ") : [];
                        if (e.target.checked) {
                          selected.push(option);
                        } else {
                          const index = selected.indexOf(option);
                          if (index > -1) selected.splice(index, 1);
                        }
                        setResponses(prev => ({ ...prev, [currentQuestion.id]: selected.join(", ") }));
                      }}
                    />
                    {option}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Progress */}
          {currentQuestion.type !== "title" && (
            <Progress value={progress} className="mb-4" />
          )}

          {/* Next Button */}
          {currentQuestion.type !== "title" && (
            <Button 
              onClick={handleNext}
              className="w-full bg-[#FA9433] hover:bg-[#e8832d] text-white"
            >
              Continue
            </Button>
          )}
        </Card>
      </div>
    </div>
  );
}
