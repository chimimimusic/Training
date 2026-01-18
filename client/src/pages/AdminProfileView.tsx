import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, User, Mail, Phone, MapPin, GraduationCap, Briefcase, Calendar } from "lucide-react";
import { useLocation, useParams } from "wouter";

export default function AdminProfileView() {
  const { user: currentUser } = useAuth();
  const [, setLocation] = useLocation();
  const params = useParams();
  const userId = parseInt(params.id || "0");

  const { data: profileData, isLoading } = trpc.admin.getTraineeProfile.useQuery({ userId });
  
  const profile = profileData?.user;
  const education = profileData?.education || [];
  const employment = profileData?.employment || [];

  if (currentUser?.role !== "admin" && currentUser?.role !== "instructor") {
    setLocation("/training");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e3a5f] to-[#0f1c2e]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e3a5f] to-[#0f1c2e]">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Profile not found</div>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "instructor":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "provider":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "facilitator":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      default:
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#1e3a5f] to-[#0f1c2e]">
      <Header />
      
      <div className="flex-1 container py-8">
        <Button
          variant="ghost"
          className="mb-6 text-white/70 hover:text-white hover:bg-white/10"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid gap-6">
          {/* Profile Header */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="pt-6">
              <div className="flex items-start gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={profile.profileImageUrl || undefined} />
                  <AvatarFallback className="bg-[#FA9433] text-white text-2xl">
                    {getInitials(profile.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-white">{profile.name || "User"}</h1>
                    <Badge className={`${getRoleBadgeColor(profile.role)} border`}>
                      {profile.role}
                    </Badge>
                    <Badge className={profile.status === "active" ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400"}>
                      {profile.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-white/70">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{profile.email}</span>
                    </div>
                    {profile.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{profile.phone}</span>
                      </div>
                    )}
                    {profile.recoveryEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="text-sm">Recovery: {profile.recoveryEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <User className="w-5 h-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-white/50 mb-1">First Name</div>
                  <div className="text-white">{profile.firstName || "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Last Name</div>
                  <div className="text-white">{profile.lastName || "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Age</div>
                  <div className="text-white">{profile.age || "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Gender</div>
                  <div className="text-white">{profile.gender || "—"}</div>
                </div>
                <div>
                  <div className="text-sm text-white/50 mb-1">Education Level</div>
                  <div className="text-white">{profile.highestEducation || "—"}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          {(profile.streetAddress || profile.city || profile.state || profile.zipCode) && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-white space-y-1">
                  {profile.streetAddress && <div>{profile.streetAddress}</div>}
                  {profile.unitNumber && <div>Unit {profile.unitNumber}</div>}
                  {(profile.city || profile.state || profile.zipCode) && (
                    <div>
                      {profile.city && `${profile.city}, `}
                      {profile.state && `${profile.state} `}
                      {profile.zipCode}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Education History */}
          {education && education.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education History
                </CardTitle>
                <CardDescription className="text-white/50">
                  {education.length} {education.length === 1 ? "degree" : "degrees"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {education.map((edu: any) => (
                    <div key={edu.id} className="border-l-2 border-[#FA9433] pl-4">
                      <h4 className="font-semibold text-white">{edu.degree}</h4>
                      <div className="text-white/70">{edu.institution}</div>
                      {edu.fieldOfStudy && (
                        <div className="text-sm text-white/50">{edu.fieldOfStudy}</div>
                      )}
                      <div className="text-sm text-white/50 mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {edu.currentlyEnrolled
                          ? "Currently Enrolled"
                          : edu.graduationYear
                          ? `Graduated: ${edu.graduationYear}`
                          : "—"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Employment History */}
          {employment && employment.length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Employment History
                </CardTitle>
                <CardDescription className="text-white/50">
                  {employment.length} {employment.length === 1 ? "position" : "positions"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {employment.map((job: any) => (
                    <div key={job.id} className="border-l-2 border-[#FA9433] pl-4">
                      <h4 className="font-semibold text-white">{job.jobTitle}</h4>
                      <div className="text-white/70">{job.employer}</div>
                      <div className="text-sm text-white/50 mt-1 flex items-center gap-2">
                        <Calendar className="w-3 h-3" />
                        {job.startDate} - {job.currentJob ? "Present" : job.endDate || "—"}
                      </div>
                      {job.responsibilities && (
                        <p className="text-sm text-white/60 mt-2">{job.responsibilities}</p>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
