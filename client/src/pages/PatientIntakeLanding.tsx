import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function PatientIntakeLanding() {
  return (
    <div className="min-h-screen bg-[#1a5490] flex flex-col">
      {/* Hero Section - Centered */}
      <section className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src="/soundbridge-logo-white.png" 
            alt="SoundBridge Health" 
            className="h-16 w-auto mx-auto"
          />
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Welcome to SoundBridge
        </h1>
        
        {/* Subheading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white mb-12">
          Find out if you qualify!
        </h2>

        {/* CTA Button */}
        <Link href="/assessment/patient-intake">
          <Button 
            size="lg" 
            className="bg-[#FA9433] hover:bg-[#e8832d] text-white px-12 py-6 text-xl rounded-lg shadow-lg"
          >
            Start Assessment →
          </Button>
        </Link>

        {/* Info Text */}
        <p className="text-white/80 text-lg mt-8">
          Takes 5-10 minutes • Complete in-office with your physician
        </p>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8">
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
