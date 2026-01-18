import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export default function ComingSoon({ title, description, icon, color }: ComingSoonProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="flex justify-center mb-8">
          <div className={`${color} w-24 h-24 rounded-2xl flex items-center justify-center`}>
            {icon}
          </div>
        </div>

        <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
        <p className="text-xl text-white/80 mb-8">{description}</p>

        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">Coming Soon</h2>
          <p className="text-white/70 mb-6">
            We're working hard to bring you this portal. Stay tuned for updates!
          </p>
          <p className="text-white/60 text-sm">
            Want to be notified when this portal launches?{" "}
            <a href="mailto:support@soundbridge.health" className="text-[#FA9433] hover:underline">
              Contact us
            </a>
          </p>
        </div>

        <Link href="/portals">
          <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Portals
          </Button>
        </Link>
      </div>
    </div>
  );
}
