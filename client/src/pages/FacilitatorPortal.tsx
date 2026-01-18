import ComingSoon from "./ComingSoon";
import { Users } from "lucide-react";

export default function FacilitatorPortal() {
  return (
    <ComingSoon
      title="Facilitator Portal"
      description="Manage your patients, track sessions, and deliver exceptional care."
      icon={<Users className="h-12 w-12 text-white" />}
      color="bg-purple-500"
    />
  );
}
