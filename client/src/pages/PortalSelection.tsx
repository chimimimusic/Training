import { Link } from "wouter";
import { GraduationCap, Heart, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/_core/hooks/useAuth";

export default function PortalSelection() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome back, {user?.name || "User"}!
          </h1>
          <p className="text-xl text-white/80">Select a portal to continue</p>
        </div>

        {/* Portal Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Patient Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 hover:bg-white/15 transition-all">
            <div className="bg-blue-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Patient Portal</h2>
            <p className="text-white/80 mb-6">
              Track your progress, schedule sessions, and access your personalized care plan.
            </p>
            <Link href="/patient">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Open Portal
              </Button>
            </Link>
          </Card>

          {/* Training Academy */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 hover:bg-white/15 transition-all">
            <div className="bg-green-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Training Academy</h2>
            <p className="text-white/80 mb-6">
              Become a certified facilitator through our comprehensive training program.
            </p>
            <Link href="/training">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Start Training
              </Button>
            </Link>
          </Card>

          {/* Facilitator Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 hover:bg-white/15 transition-all opacity-60">
            <div className="bg-purple-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Facilitator Portal</h2>
            <p className="text-white/80 mb-6">
              Manage your patients, track sessions, and deliver exceptional care.
            </p>
            <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white" disabled>
              Coming Soon
            </Button>
          </Card>

          {/* Provider Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-8 hover:bg-white/15 transition-all opacity-60">
            <div className="bg-orange-500 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-3">Provider Portal</h2>
            <p className="text-white/80 mb-6">
              Oversee your organization's facilitators, analytics, and compliance.
            </p>
            <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled>
              Coming Soon
            </Button>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/forum">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Community Forum
              </Button>
            </Link>
            <Link href="/facilitator-directory">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Find a Facilitator
              </Button>
            </Link>
            <a href="mailto:support@soundbridge.health">
              <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
                Contact Support
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
