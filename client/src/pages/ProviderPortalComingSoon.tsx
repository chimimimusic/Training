import ComingSoon from "./ComingSoon";
import { Building2 } from "lucide-react";

export default function ProviderPortalComingSoon() {
  return (
    <ComingSoon
      title="Provider Portal"
      description="Oversee your organization's facilitators, analytics, and compliance."
      icon={<Building2 className="h-12 w-12 text-white" />}
      color="bg-orange-500"
    />
  );
}
