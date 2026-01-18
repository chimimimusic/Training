import { Link } from "wouter";
import { GraduationCap, Heart, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PublicHome() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a3a52] to-[#2d5a7b]">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <img 
              src="/soundbridge-logo-white.png" 
              alt="SoundBridge Health" 
              className="h-8 w-auto hover:opacity-80 transition-opacity"
            />
          </Link>
          <Link href="/login">
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="inline-block px-6 py-2 bg-[#2d5a7b] rounded-full mb-8">
          <span className="text-[#FA9433] font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            SoundBridge Health Facilitator Certification
          </span>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Healing Through the <span className="text-[#FA9433]">Power of Music</span>
        </h1>
        
        <p className="text-xl text-white/90 max-w-3xl mx-auto mb-12">
          Evidence-based music interventions for anxiety, depression, and emotional wellness. 
          Access our platform to begin your healing journey or become a certified facilitator.
        </p>

        <div className="flex gap-4 justify-center">
          <Link href="/patient-intake">
            <Button size="lg" className="bg-[#FA9433] hover:bg-[#e8832d] text-white px-8">
              Start Assessment
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              Sign In
            </Button>
          </Link>
        </div>
      </section>

      {/* 4 Portal Cards */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          One Platform, Complete Care
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Patient Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all">
            <div className="bg-blue-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Patient Portal</h3>
            <p className="text-white/80 text-sm mb-4">
              Track your progress, schedule sessions, and access your personalized care plan.
            </p>
            <Link href="/patient-intake">
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white">
                Get Started
              </Button>
            </Link>
          </Card>

          {/* Training Academy */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all">
            <div className="bg-green-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Training Academy</h3>
            <p className="text-white/80 text-sm mb-4">
              Become a certified facilitator through our comprehensive training program.
            </p>
            <Link href="/training">
              <Button className="w-full bg-green-500 hover:bg-green-600 text-white">
                Start Training
              </Button>
            </Link>
          </Card>

          {/* Facilitator Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all">
            <div className="bg-purple-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Facilitator Portal</h3>
            <p className="text-white/80 text-sm mb-4">
              Manage your patients, track sessions, and deliver exceptional care.
            </p>
            <Link href="/patient-sessions">
              <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                Access Portal
              </Button>
            </Link>
          </Card>

          {/* Provider Portal */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 p-6 hover:bg-white/15 transition-all">
            <div className="bg-orange-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Provider Portal</h3>
            <p className="text-white/80 text-sm mb-4">
              Oversee your organization's facilitators, analytics, and compliance.
            </p>
            <Link href="/provider">
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">
                Coming Soon
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20">
        <div className="text-center text-white/60 text-sm">
          <p>© 2026 SoundBridge Health. All rights reserved.</p>
          <p className="mt-2">
            Questions? Contact us at{" "}
            <a href="mailto:rhtp@soundbridgehealth.com" className="text-[#FA9433] hover:underline">
              rhtp@soundbridgehealth.com
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
