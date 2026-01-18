import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle } from "lucide-react";
import { useLocation } from "wouter";

interface ProfileCompletenessBannerProps {
  isComplete: boolean;
  percentage: number;
  missingFields: string[];
  missingEducation: boolean;
  missingEmployment: boolean;
}

export function ProfileCompletenessBanner({
  isComplete,
  percentage,
  missingFields,
  missingEducation,
  missingEmployment,
}: ProfileCompletenessBannerProps) {
  const [, setLocation] = useLocation();

  if (isComplete) {
    return null; // Don't show banner if profile is complete
  }

  const getFieldLabel = (field: string): string => {
    const labels: Record<string, string> = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phone: 'Phone Number',
      age: 'Age',
      streetAddress: 'Street Address',
      city: 'City',
      state: 'State',
      zipCode: 'ZIP Code',
      highestEducation: 'Highest Education Level',
    };
    return labels[field] || field;
  };

  const missingItems: string[] = [
    ...missingFields.map(getFieldLabel),
    ...(missingEducation ? ['At least one education entry'] : []),
    ...(missingEmployment ? ['At least one employment entry'] : []),
  ];

  return (
    <Alert className="bg-yellow-500/10 border-yellow-500/50 mb-6">
      <AlertTriangle className="h-5 w-5 text-yellow-500" />
      <AlertTitle className="text-yellow-500 font-semibold mb-2">
        Profile Incomplete ({percentage}%)
      </AlertTitle>
      <AlertDescription className="text-white/80 space-y-3">
        <Progress value={percentage} className="h-2" />
        <p>
          Your profile must be 100% complete to access training modules. Please complete the following:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {missingItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <Button
          onClick={() => setLocation('/profile/edit')}
          className="bg-yellow-500 hover:bg-yellow-600 text-black mt-2"
        >
          Complete Profile
        </Button>
      </AlertDescription>
    </Alert>
  );
}
