// Auth removed - using mock user
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  GraduationCap, 
  Video, 
  FileText, 
  Award, 
  Users, 
  MessageSquare, 
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  BookOpen,
  Headphones
} from "lucide-react";
import { useLocation } from "wouter";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { KeyRound } from "lucide-react";
import { getLoginUrl } from "@/const";

export default function Home() {
  const user = { id: 1, name: "Demo Trainee" }; // Mock user - auth removed
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <div className="flex-1">
        {/* Hero Section */}
        <section className="relative py-12 md:py-20 px-4 bg-gradient-to-br from-[#1a365d] via-[#2d3748] to-[#1a202c]">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#FA9433]/20 border border-[#FA9433]/30 rounded-full">
                <GraduationCap className="w-5 h-5 text-[#FA9433]" />
                <span className="text-sm font-medium text-white">SoundBridge Health Facilitator Certification</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Welcome to Your
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FA9433] to-orange-300">
                  Facilitator Training Journey
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
                Master the SoundBridge Health music-based intervention protocol through our comprehensive 
                hybrid training program. Combine self-paced video learning with live instructor-led sessions 
                to become a certified facilitator.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="bg-[#FA9433] hover:bg-[#e8862e] text-white text-lg px-8 py-6"
                  onClick={() => setLocation("/training")}
                >
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Start Training
                </Button>
                {user && (
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                    onClick={() => setLocation("/profile")}
                  >
                    <Target className="w-5 h-5 mr-2" />
                    View My Progress
                  </Button>
                )}
              </div>
              
              {/* Forgot Password Link */}
              {!user && (
                <div className="flex justify-center pt-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="link" 
                        className="text-white/70 hover:text-white text-base underline-offset-4"
                      >
                        <KeyRound className="w-4 h-4 mr-2" />
                        Forgot your password?
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                          <KeyRound className="w-5 h-5 text-[#FA9433]" />
                          Reset Your Password
                        </DialogTitle>
                        <DialogDescription className="text-left pt-4 space-y-4">
                          <p className="text-base">
                            Follow these simple steps to reset your password:
                          </p>
                          
                          <ol className="list-decimal list-inside space-y-3 text-sm">
                            <li className="pl-2">
                              <span className="font-semibold">Click the button below</span> to go to the login page
                            </li>
                            <li className="pl-2">
                              <span className="font-semibold">Look for "Forgot Password?"</span> link on the login form
                            </li>
                            <li className="pl-2">
                              <span className="font-semibold">Enter your email address</span> that you used to register
                            </li>
                            <li className="pl-2">
                              <span className="font-semibold">Check your email</span> for password reset instructions
                            </li>
                            <li className="pl-2">
                              <span className="font-semibold">Create a new password</span> (minimum 12 characters with letters, numbers, and symbols)
                            </li>
                          </ol>
                          
                          <div className="bg-muted/50 p-4 rounded-lg border border-border">
                            <p className="text-sm font-medium mb-2">Need Help?</p>
                            <p className="text-xs text-muted-foreground">
                              If you don't receive the reset email within 5 minutes, check your spam folder or contact support.
                            </p>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-3 pt-4">
                        <Button
                          className="w-full bg-[#FA9433] hover:bg-[#e8862e]"
                          onClick={() => {
                            window.location.href = getLoginUrl();
                          }}
                        >
                          Go to Login Page
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Program Overview */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What You'll Learn
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                A comprehensive curriculum designed to prepare you for delivering evidence-based 
                music therapy interventions for anxiety and depression.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center mb-4">
                    <BookOpen className="w-6 h-6 text-purple-400" />
                  </div>
                  <CardTitle className="text-white">Protocol Fundamentals</CardTitle>
                  <CardDescription>
                    Understand the science behind music-based interventions and their clinical applications
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center mb-4">
                    <Headphones className="w-6 h-6 text-blue-400" />
                  </div>
                  <CardTitle className="text-white">Clinical Foundations</CardTitle>
                  <CardDescription>
                    Master anxiety and depression assessment, treatment approaches, and patient engagement
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-green-400" />
                  </div>
                  <CardTitle className="text-white">Facilitation Skills</CardTitle>
                  <CardDescription>
                    Develop expertise in session delivery, patient communication, and therapeutic rapport
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center mb-4">
                    <Target className="w-6 h-6 text-orange-400" />
                  </div>
                  <CardTitle className="text-white">Practical Application</CardTitle>
                  <CardDescription>
                    Learn session planning, documentation, and outcome measurement techniques
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center mb-4">
                    <FileText className="w-6 h-6 text-pink-400" />
                  </div>
                  <CardTitle className="text-white">Ethics & Compliance</CardTitle>
                  <CardDescription>
                    Understand HIPAA, ethical considerations, and professional boundaries in telehealth
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-4">
                    <Award className="w-6 h-6 text-cyan-400" />
                  </div>
                  <CardTitle className="text-white">Certification Prep</CardTitle>
                  <CardDescription>
                    Complete assessments and live reviews to demonstrate competency and earn certification
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-background to-[#1a365d]/20">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                How the Training Works
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                A flexible hybrid approach combining self-paced learning with live instruction
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FA9433] flex items-center justify-center text-white font-bold">
                      1
                    </div>
                    <CardTitle className="text-white">Self-Paced Video Modules</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Watch Training Videos</p>
                      <p className="text-white/60 text-sm">Complete 10 comprehensive modules at your own pace</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Review Transcripts</p>
                      <p className="text-white/60 text-sm">Access full text transcripts for reference and study</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Pass Assessments</p>
                      <p className="text-white/60 text-sm">Demonstrate understanding with 80% or higher on each module</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FA9433] flex items-center justify-center text-white font-bold">
                      2
                    </div>
                    <CardTitle className="text-white">Live Instructor Sessions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Users className="w-5 h-5 text-indigo-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Join Group Webinars</p>
                      <p className="text-white/60 text-sm">Attend 3 live review sessions with expert instructors</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-cyan-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Interactive Q&A</p>
                      <p className="text-white/60 text-sm">Ask questions, discuss challenges, and learn from peers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Video className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Watch Recordings</p>
                      <p className="text-white/60 text-sm">Access session recordings if you miss a live class</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <div className="bg-card/30 backdrop-blur border border-white/10 rounded-lg p-6 md:p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">Training Timeline</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-purple-400">1-3</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Modules 1-3</h4>
                  <p className="text-white/60 text-sm mb-3">Complete first 3 modules</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-indigo-300">Live Review Session 1</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-blue-400">4-6</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Modules 4-6</h4>
                  <p className="text-white/60 text-sm mb-3">Continue through mid-program</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-indigo-300">Live Review Session 2</span>
                  </div>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-green-400">7-10</span>
                  </div>
                  <h4 className="text-white font-semibold mb-2">Modules 7-10</h4>
                  <p className="text-white/60 text-sm mb-3">Complete final modules</p>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-full">
                    <Users className="w-4 h-4 text-indigo-400" />
                    <span className="text-xs text-indigo-300">Live Review Session 3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Portal Features */}
        <section className="py-12 md:py-16 px-4 bg-background">
          <div className="container max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Portal Features
              </h2>
              <p className="text-lg text-white/70 max-w-2xl mx-auto">
                Everything you need to succeed in one comprehensive platform
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-card/50 backdrop-blur border-white/10 hover:border-[#FA9433]/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Progress Analytics</h3>
                      <p className="text-white/60 text-sm">
                        Track your learning journey with detailed metrics, completion rates, assessment scores, 
                        and study streaks to stay motivated.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10 hover:border-[#FA9433]/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Discussion Forum</h3>
                      <p className="text-white/60 text-sm">
                        Connect with fellow trainees, ask questions, share insights, and learn from the 
                        community throughout your journey.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10 hover:border-[#FA9433]/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-green-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Digital Certificates</h3>
                      <p className="text-white/60 text-sm">
                        Earn your official SoundBridge Health Facilitator Certificate upon successful 
                        completion of all requirements.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-card/50 backdrop-blur border-white/10 hover:border-[#FA9433]/30 transition-colors">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-orange-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Flexible Learning</h3>
                      <p className="text-white/60 text-sm">
                        Learn at your own pace with 24/7 access to all materials. Pick up right where 
                        you left off on any device.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Certification Requirements */}
        <section className="py-12 md:py-16 px-4 bg-gradient-to-b from-background to-[#1a365d]/20">
          <div className="container max-w-4xl mx-auto">
            <Card className="bg-gradient-to-br from-[#FA9433]/10 to-orange-500/10 border-[#FA9433]/30 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-[#FA9433]/20 flex items-center justify-center mx-auto mb-4">
                  <Award className="w-8 h-8 text-[#FA9433]" />
                </div>
                <CardTitle className="text-2xl md:text-3xl text-white">
                  Certification Requirements
                </CardTitle>
                <CardDescription className="text-white/70 text-base">
                  Complete all requirements to earn your facilitator certification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Complete All 10 Modules</p>
                      <p className="text-white/60 text-sm">Watch videos, review transcripts, and master the content</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Pass All Assessments (80% or Higher)</p>
                      <p className="text-white/60 text-sm">Demonstrate competency on each module assessment</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Attend 3 Live Review Sessions</p>
                      <p className="text-white/60 text-sm">Participate in instructor-led group webinars (or watch recordings)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-medium">Accept Terms of Service</p>
                      <p className="text-white/60 text-sm">Review and agree to the program terms and conditions</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-20 px-4 bg-gradient-to-br from-[#1a365d] via-[#2d3748] to-[#1a202c]">
          <div className="container max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
              Join our community of certified facilitators making a difference in mental health care 
              through evidence-based music interventions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-[#FA9433] hover:bg-[#e8862e] text-white text-lg px-8 py-6"
                onClick={() => setLocation("/training")}
              >
                <GraduationCap className="w-5 h-5 mr-2" />
                Start Training Now
              </Button>
              {user && (
                <>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-6"
                    onClick={() => setLocation("/forum")}
                  >
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Join Discussion
                  </Button>
                </>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
