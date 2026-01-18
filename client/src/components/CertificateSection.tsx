import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function CertificateSection() {
  const { data: certificate, isLoading: certLoading } = trpc.certificates.getMyCertificate.useQuery();
  const { data: eligibility, isLoading: eligLoading } = trpc.certificates.checkEligibility.useQuery();
  const generateMutation = trpc.certificates.generate.useMutation({
    onSuccess: () => {
      toast.success("Certificate generated successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (certLoading || eligLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Completion Certificate
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  // If certificate exists, show it
  if (certificate) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#FA9433]" />
            Completion Certificate
          </CardTitle>
          <CardDescription>
            Congratulations! You have completed the facilitator training program.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Certificate ID</p>
              <p className="font-medium">{certificate.certificateId}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Average Score</p>
              <p className="font-medium">{certificate.averageScore}%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Completion Date</p>
              <p className="font-medium">
                {new Date(certificate.completionDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium text-green-600">Certified</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => window.open(certificate.certificateUrl, '_blank')}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              View Certificate
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // If eligible but no certificate, show generate button
  if (eligibility?.eligible) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-[#FA9433]" />
            Completion Certificate
          </CardTitle>
          <CardDescription>
            You've completed all modules! Generate your certificate now.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Modules Completed</p>
              <p className="font-medium">{eligibility.completedModules}/10</p>
            </div>
            <div>
              <p className="text-muted-foreground">Average Score</p>
              <p className="font-medium">{eligibility.averageScore}%</p>
            </div>
          </div>

          <Button
            onClick={() => generateMutation.mutate()}
            disabled={generateMutation.isPending}
            className="w-full"
          >
            {generateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Certificate...
              </>
            ) : (
              <>
                <Award className="mr-2 h-4 w-4" />
                Generate Certificate
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Not eligible yet
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Completion Certificate
        </CardTitle>
        <CardDescription>
          Complete all 10 modules with passing scores to earn your certificate.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {eligibility?.completedModules || 0}/10 modules completed
            </span>
          </div>
          {eligibility && eligibility.completedModules < 10 && (
            <p className="text-muted-foreground">
              Complete {10 - eligibility.completedModules} more module{10 - eligibility.completedModules !== 1 ? 's' : ''} to unlock your certificate.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
