import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Onboarding() {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = () => {
    if (agreedToTerms) {
      setIsSubmitting(true);
      // Store agreement in localStorage for now (no auth)
      localStorage.setItem("soundbridge_agreed_to_terms", "true");
      // Redirect to training
      setTimeout(() => {
        setLocation("/training");
      }, 500);
    }
  };

  // Check if already agreed
  const alreadyAgreed = localStorage.getItem("soundbridge_agreed_to_terms") === "true";
  
  if (alreadyAgreed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardHeader>
            <CardTitle>Already Completed</CardTitle>
            <CardDescription>You have already agreed to the Terms of Service</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/training")}>Go to Training</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">Welcome to SoundBridge Health</h1>
          <p className="text-white/70">Facilitator Training Program</p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
            <CardDescription>Please read and accept our Terms of Service</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-64 overflow-y-auto custom-scrollbar p-4 bg-muted/20 rounded-lg">
              <div className="space-y-4 text-sm text-muted-foreground">
                <h3 className="font-semibold text-foreground">1. Agreement to Terms</h3>
                <p>
                  By accessing and using the SoundBridge Health Facilitator Training Portal, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.
                </p>

                <h3 className="font-semibold text-foreground">2. Training Program Requirements</h3>
                <p>
                  You agree to complete all 10 training modules, pass all assessments with a minimum score of 70%, and attend the three required live instructor-led classes after modules 3, 6, and 9.
                </p>

                <h3 className="font-semibold text-foreground">3. Professional Conduct</h3>
                <p>
                  As a facilitator trainee, you agree to maintain professional standards, respect patient confidentiality, and adhere to all ethical guidelines outlined in the training materials.
                </p>

                <h3 className="font-semibold text-foreground">4. Intellectual Property</h3>
                <p>
                  All training materials, videos, transcripts, and assessments are the intellectual property of SoundBridge Health. You may not reproduce, distribute, or share these materials without written permission.
                </p>

                <h3 className="font-semibold text-foreground">5. Certification</h3>
                <p>
                  Upon successful completion of the training program, you will receive certification as a SoundBridge Health Facilitator. This certification may be revoked if you violate these terms or fail to maintain professional standards.
                </p>

                <h3 className="font-semibold text-foreground">6. Non-Circumvention</h3>
                <p>
                  You agree not to circumvent, bypass, or attempt to circumvent or bypass SoundBridge Health in any business dealings, transactions, or relationships with patients, healthcare providers, or other parties introduced or made known to you through this training program or the SoundBridge Health platform. This obligation continues for a period of two (2) years following completion or termination of your participation in the program.
                </p>

                <h3 className="font-semibold text-foreground">7. Indemnification</h3>
                <p>
                  You agree to indemnify, defend, and hold harmless SoundBridge Health, its officers, directors, employees, agents, and affiliates from and against any and all claims, damages, obligations, losses, liabilities, costs, and expenses (including reasonable attorneys fees) arising from: (a) your use of the training portal and materials; (b) your provision of services as a certified facilitator; (c) your violation of these Terms of Service; (d) your violation of any third-party rights, including intellectual property rights or privacy rights; or (e) any negligent or wrongful conduct on your part.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={agreedToTerms}
                onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)}
              />
              <label
                htmlFor="terms"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                I have read and agree to the Terms of Service
              </label>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleSubmit}
            disabled={!agreedToTerms || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Continue to Training"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
