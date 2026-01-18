import { useParams, Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function AssessmentResult() {
  const params = useParams<{ id: string }>();
  const assessmentId = parseInt(params.id);

  const { data: assessment, isLoading } = trpc.patientIntake.getAssessmentResult.useQuery({
    id: assessmentId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
        <Card className="bg-white p-8 max-w-md w-full text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#FA9433]" />
          <p className="text-gray-600">Loading your results...</p>
        </Card>
      </div>
    );
  }

  if (!assessment) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
        <Card className="bg-white p-8 max-w-md w-full text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">Assessment Not Found</h2>
          <Link href="/patient-intake">
            <Button className="bg-[#FA9433] hover:bg-[#e8832d]">
              Take Assessment
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const passed = assessment.passed;
  const score = assessment.totalScore;
  const percentage = Math.round((score / 75) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center gap-1">
            <span className="text-3xl font-bold text-white">Sound</span>
            <div className="flex flex-col">
              <div className="h-1.5 w-8 bg-[#FA9433]"></div>
              <div className="h-1.5 w-8 bg-[#FA9433] mt-1"></div>
            </div>
            <span className="text-3xl font-bold text-white">Bridge health</span>
          </div>
        </div>

        {/* Result Card */}
        <Card className="bg-white p-12 text-center">
          {passed ? (
            <>
              <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-green-600 mb-4">
                Congratulations!
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                You've qualified for SoundBridge music therapy treatment
              </p>
            </>
          ) : (
            <>
              <XCircle className="h-20 w-20 text-orange-500 mx-auto mb-6" />
              <h1 className="text-4xl font-bold text-orange-600 mb-4">
                Assessment Complete
              </h1>
              <p className="text-xl text-gray-700 mb-6">
                Thank you for completing the assessment
              </p>
            </>
          )}

          {/* Score Display */}
          <div className="bg-gray-50 rounded-lg p-6 mb-8">
            <div className="text-5xl font-bold text-[#FA9433] mb-2">
              {percentage}%
            </div>
            <div className="text-gray-600">
              Score: {score} out of 75 points
            </div>
            {!passed && (
              <div className="text-sm text-gray-500 mt-2">
                (80% or higher required to qualify)
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="text-left bg-blue-50 rounded-lg p-6 mb-6">
            <h3 className="font-bold text-lg mb-3">What's Next?</h3>
            {passed ? (
              <ul className="space-y-2 text-gray-700">
                <li>✓ Your assessment has been approved</li>
                <li>✓ A SoundBridge coordinator will contact you within 24-48 hours</li>
                <li>✓ We'll help you schedule your first session with a certified facilitator</li>
                <li>✓ Check your email for next steps and onboarding information</li>
              </ul>
            ) : (
              <ul className="space-y-2 text-gray-700">
                <li>• Your assessment is under review</li>
                <li>• Our team will evaluate your responses</li>
                <li>• You'll receive an email within 2-3 business days</li>
                <li>• We may recommend alternative treatment options</li>
              </ul>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <Button className="w-full bg-[#FA9433] hover:bg-[#e8832d] text-white">
                Return to Homepage
              </Button>
            </Link>
            <a href="mailto:support@soundbridge.health">
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </a>
          </div>

          {/* Reference Number */}
          <div className="mt-6 text-sm text-gray-500">
            Reference ID: {assessment.id}
          </div>
        </Card>
      </div>
    </div>
  );
}
