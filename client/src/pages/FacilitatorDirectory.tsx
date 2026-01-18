import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContactFacilitatorDialog from "@/components/ContactFacilitatorDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Calendar, ExternalLink, Mail, Search, User } from "lucide-react";
import { useState } from "react";

export default function FacilitatorDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const { data: facilitators, isLoading } = trpc.facilitators.list.useQuery();

  const getInitials = (name: string | null) => {
    if (!name) return "F";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredFacilitators = facilitators?.filter((facilitator) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    const nameMatch = facilitator.name?.toLowerCase().includes(query);
    const specializationsMatch = facilitator.specializations?.toLowerCase().includes(query);
    const bioMatch = facilitator.bio?.toLowerCase().includes(query);
    
    return nameMatch || specializationsMatch || bioMatch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
          {/* Page Header */}
          <div className="text-center space-y-2 md:space-y-4">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Find Your Facilitator</h1>
            <p className="text-base md:text-lg lg:text-xl text-white/70 max-w-2xl mx-auto px-4">
              Connect with certified Sound Bridge Health facilitators for personalized music-based intervention sessions
            </p>
          </div>

          {/* Search Bar */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <Input
                  type="text"
                  placeholder="Search by name, specialization, or expertise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-white/50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-12">
              <div className="text-white/70">Loading facilitators...</div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredFacilitators?.length === 0 && (
            <Card className="bg-card/50 backdrop-blur border-white/10">
              <CardContent className="py-12 text-center">
                <User className="w-16 h-16 mx-auto mb-4 text-white/30" />
                <h3 className="text-xl font-semibold text-white mb-2">
                  {searchQuery ? "No facilitators found" : "No facilitators available"}
                </h3>
                <p className="text-white/60">
                  {searchQuery
                    ? "Try adjusting your search terms"
                    : "Check back soon for certified facilitators"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Facilitator Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredFacilitators?.map((facilitator) => (
              <Card
                key={facilitator.id}
                className="bg-card/50 backdrop-blur border-white/10 hover:border-[#FA9433]/50 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-start gap-3 md:gap-4">
                    <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 md:border-4 border-[#FA9433]">
                      {facilitator.profileImageUrl && (
                        <AvatarImage
                          src={facilitator.profileImageUrl}
                          alt={facilitator.name || "Facilitator"}
                        />
                      )}
                      <AvatarFallback className="bg-[#FA9433] text-white text-xl font-bold">
                        {getInitials(facilitator.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-white text-lg md:text-xl mb-2">
                        {facilitator.name || "Facilitator"}
                      </CardTitle>
                      
                      {facilitator.email && (
                        <div className="flex items-center gap-2 text-sm text-white/60 mb-2">
                          <Mail className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{facilitator.email}</span>
                        </div>
                      )}

                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                        Certified Facilitator
                      </Badge>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Specializations */}
                  {facilitator.specializations && (
                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-2">
                        Specializations
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {facilitator.specializations.split(",").map((spec, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="bg-blue-500/10 text-blue-400 border-blue-500/30"
                          >
                            {spec.trim()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Bio */}
                  {facilitator.bio && (
                    <div>
                      <h4 className="text-sm font-semibold text-white/80 mb-2">About</h4>
                      <p className="text-sm text-white/70 line-clamp-3">{facilitator.bio}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <ContactFacilitatorDialog
                      facilitatorId={facilitator.id}
                      facilitatorName={facilitator.name || "Facilitator"}
                    />
                    
                    {facilitator.calendarLink ? (
                      <Button
                        className="w-full bg-[#FA9433] hover:bg-[#FA9433]/90 text-white"
                        onClick={() => window.open(facilitator.calendarLink!, "_blank")}
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Appointment
                        <ExternalLink className="w-3 h-3 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        disabled
                        className="w-full border-white/20 text-white/40 cursor-not-allowed"
                      >
                        <Calendar className="w-4 h-4 mr-2" />
                        Calendar Not Available
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardHeader>
              <CardTitle className="text-white">How It Works</CardTitle>
              <CardDescription className="text-white/70">
                Getting started with Sound Bridge Health is easy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#FA9433]/20 flex items-center justify-center text-[#FA9433] font-bold text-xl mb-3">
                    1
                  </div>
                  <h3 className="font-semibold text-white">Browse Facilitators</h3>
                  <p className="text-sm text-white/70">
                    Review profiles, specializations, and experience to find the right match for your needs
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#FA9433]/20 flex items-center justify-center text-[#FA9433] font-bold text-xl mb-3">
                    2
                  </div>
                  <h3 className="font-semibold text-white">Schedule Appointment</h3>
                  <p className="text-sm text-white/70">
                    Click "Schedule Appointment" to access their calendar and book a convenient time
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-[#FA9433]/20 flex items-center justify-center text-[#FA9433] font-bold text-xl mb-3">
                    3
                  </div>
                  <h3 className="font-semibold text-white">Begin Your Journey</h3>
                  <p className="text-sm text-white/70">
                    Start your personalized Sound Bridge Protocol sessions and develop lasting coping skills
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
