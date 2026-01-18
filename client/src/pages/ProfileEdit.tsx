import { useAuth } from "@/_core/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, Plus, Trash2, Save, CheckCircle2, Circle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ProfileEdit() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const utils = trpc.useUtils();

  const { data: profileData } = trpc.profile.getMyProfile.useQuery();
  const { data: completeness } = trpc.profileCompleteness.getCompleteness.useQuery();
  const updateProfile = trpc.profile.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      utils.profile.getMyProfile.invalidate();
      utils.profileCompleteness.getCompleteness.invalidate();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update profile");
    },
  });

  const addEducation = trpc.profile.addEducation.useMutation({
    onSuccess: () => {
      toast.success("Education added");
      utils.profile.getMyProfile.invalidate();
      utils.profileCompleteness.getCompleteness.invalidate();
      setNewEducation({ degree: "", institution: "", fieldOfStudy: "", graduationYear: undefined, isCurrentlyEnrolled: false });
    },
  });

  const deleteEducation = trpc.profile.deleteEducation.useMutation({
    onSuccess: () => {
      toast.success("Education deleted");
      utils.profile.getMyProfile.invalidate();
      utils.profileCompleteness.getCompleteness.invalidate();
    },
  });

  const addEmployment = trpc.profile.addEmployment.useMutation({
    onSuccess: () => {
      toast.success("Employment added");
      utils.profile.getMyProfile.invalidate();
      utils.profileCompleteness.getCompleteness.invalidate();
      setNewEmployment({ jobTitle: "", employer: "", startDate: "", endDate: "", isCurrentJob: false, responsibilities: "" });
    },
  });

  const deleteEmployment = trpc.profile.deleteEmployment.useMutation({
    onSuccess: () => {
      toast.success("Employment deleted");
      utils.profile.getMyProfile.invalidate();
      utils.profileCompleteness.getCompleteness.invalidate();
    },
  });

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    streetAddress: "",
    unitNumber: "",
    city: "",
    state: "",
    zipCode: "",
    recoveryEmail: "",
    age: undefined as number | undefined,
    gender: "",
    highestEducation: undefined as "phd" | "masters" | "lcsw" | "bachelors" | "associates" | "some_college" | "high_school" | "other" | undefined,
  });

  const [newEducation, setNewEducation] = useState({
    degree: "",
    institution: "",
    fieldOfStudy: "",
    graduationYear: undefined as number | undefined,
    isCurrentlyEnrolled: false,
  });

  const [newEmployment, setNewEmployment] = useState({
    jobTitle: "",
    employer: "",
    startDate: "",
    endDate: "",
    isCurrentJob: false,
    responsibilities: "",
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        phone: profileData.phone || "",
        streetAddress: profileData.streetAddress || "",
        unitNumber: profileData.unitNumber || "",
        city: profileData.city || "",
        state: profileData.state || "",
        zipCode: profileData.zipCode || "",
        recoveryEmail: profileData.recoveryEmail || "",
        age: profileData.age || undefined,
        gender: profileData.gender || "",
        highestEducation: profileData.highestEducation || undefined,
      });
    }
  }, [profileData]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-white">Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    setLocation("/");
    return null;
  }

  const handleSaveProfile = () => {
    updateProfile.mutate(formData);
  };

  const handleAddEducation = () => {
    if (!newEducation.degree || !newEducation.institution) {
      toast.error("Please fill in required fields");
      return;
    }
    addEducation.mutate(newEducation);
  };

  const handleAddEmployment = () => {
    if (!newEmployment.jobTitle || !newEmployment.employer || !newEmployment.startDate) {
      toast.error("Please fill in required fields");
      return;
    }
    // Remove endDate if it's empty (current job)
    const employmentData: any = { ...newEmployment };
    if (!employmentData.endDate) {
      delete employmentData.endDate;
    }
    addEmployment.mutate(employmentData);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 p-4 md:p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => setLocation("/profile")} className="text-white hover:text-[#FA9433]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Profile
            </Button>
          </div>

          {/* Profile Completion Progress */}
          {completeness && (
            <Card className={`bg-card/50 backdrop-blur border-2 ${
              completeness.isComplete 
                ? 'border-green-500/50' 
                : 'border-orange-500/50'
            }`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center gap-2">
                    {completeness.isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-orange-500" />
                    )}
                    Profile Completion: {completeness.percentage}%
                  </CardTitle>
                  <div className="text-2xl font-bold text-white">
                    {completeness.percentage}%
                  </div>
                </div>
                <CardDescription>
                  {completeness.isComplete 
                    ? 'Your profile is complete! You have full access to training modules.' 
                    : 'Complete all required sections below to access training modules.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-sm text-white/70 font-semibold mb-2">Required Items:</div>
                  
                  {/* Profile Fields */}
                  <div className="flex items-center gap-2">
                    {completeness.missingFields.length === 0 ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    )}
                    <span className={completeness.missingFields.length === 0 ? 'text-green-400' : 'text-orange-400'}>
                      Personal Information (9 fields)
                      {completeness.missingFields.length > 0 && (
                        <span className="text-sm text-white/50 ml-2">
                          Missing: {completeness.missingFields.join(', ')}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Education */}
                  <div className="flex items-center gap-2">
                    {!completeness.missingEducation ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    )}
                    <span className={!completeness.missingEducation ? 'text-green-400' : 'text-orange-400'}>
                      Education History (at least 1 entry required)
                    </span>
                  </div>

                  {/* Employment */}
                  <div className="flex items-center gap-2">
                    {!completeness.missingEmployment ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-orange-500 flex-shrink-0" />
                    )}
                    <span className={!completeness.missingEmployment ? 'text-green-400' : 'text-orange-400'}>
                      Employment History (at least 1 entry required)
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Personal Information */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription>Basic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-white">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="age" className="text-white">Age *</Label>
                  <Input
                    id="age"
                    type="number"
                    min="18"
                    max="120"
                    value={formData.age || ""}
                    onChange={(e) => setFormData({ ...formData, age: e.target.value ? parseInt(e.target.value) : undefined })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-white">Gender</Label>
                  <Input
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="e.g., Male, Female, Non-binary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="recoveryEmail" className="text-white">Recovery Email</Label>
                <Input
                  id="recoveryEmail"
                  type="email"
                  value={formData.recoveryEmail}
                  onChange={(e) => setFormData({ ...formData, recoveryEmail: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="backup@example.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="streetAddress" className="text-white">Street Address *</Label>
                <Input
                  id="streetAddress"
                  value={formData.streetAddress}
                  onChange={(e) => setFormData({ ...formData, streetAddress: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="123 Main Street"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="unitNumber" className="text-white">Unit/Apt #</Label>
                  <Input
                    id="unitNumber"
                    value={formData.unitNumber}
                    onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Apt 4B"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-white">City *</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-white">State *</Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AL">AL - Alabama</SelectItem>
                      <SelectItem value="AK">AK - Alaska</SelectItem>
                      <SelectItem value="AZ">AZ - Arizona</SelectItem>
                      <SelectItem value="AR">AR - Arkansas</SelectItem>
                      <SelectItem value="CA">CA - California</SelectItem>
                      <SelectItem value="CO">CO - Colorado</SelectItem>
                      <SelectItem value="CT">CT - Connecticut</SelectItem>
                      <SelectItem value="DE">DE - Delaware</SelectItem>
                      <SelectItem value="FL">FL - Florida</SelectItem>
                      <SelectItem value="GA">GA - Georgia</SelectItem>
                      <SelectItem value="HI">HI - Hawaii</SelectItem>
                      <SelectItem value="ID">ID - Idaho</SelectItem>
                      <SelectItem value="IL">IL - Illinois</SelectItem>
                      <SelectItem value="IN">IN - Indiana</SelectItem>
                      <SelectItem value="IA">IA - Iowa</SelectItem>
                      <SelectItem value="KS">KS - Kansas</SelectItem>
                      <SelectItem value="KY">KY - Kentucky</SelectItem>
                      <SelectItem value="LA">LA - Louisiana</SelectItem>
                      <SelectItem value="ME">ME - Maine</SelectItem>
                      <SelectItem value="MD">MD - Maryland</SelectItem>
                      <SelectItem value="MA">MA - Massachusetts</SelectItem>
                      <SelectItem value="MI">MI - Michigan</SelectItem>
                      <SelectItem value="MN">MN - Minnesota</SelectItem>
                      <SelectItem value="MS">MS - Mississippi</SelectItem>
                      <SelectItem value="MO">MO - Missouri</SelectItem>
                      <SelectItem value="MT">MT - Montana</SelectItem>
                      <SelectItem value="NE">NE - Nebraska</SelectItem>
                      <SelectItem value="NV">NV - Nevada</SelectItem>
                      <SelectItem value="NH">NH - New Hampshire</SelectItem>
                      <SelectItem value="NJ">NJ - New Jersey</SelectItem>
                      <SelectItem value="NM">NM - New Mexico</SelectItem>
                      <SelectItem value="NY">NY - New York</SelectItem>
                      <SelectItem value="NC">NC - North Carolina</SelectItem>
                      <SelectItem value="ND">ND - North Dakota</SelectItem>
                      <SelectItem value="OH">OH - Ohio</SelectItem>
                      <SelectItem value="OK">OK - Oklahoma</SelectItem>
                      <SelectItem value="OR">OR - Oregon</SelectItem>
                      <SelectItem value="PA">PA - Pennsylvania</SelectItem>
                      <SelectItem value="RI">RI - Rhode Island</SelectItem>
                      <SelectItem value="SC">SC - South Carolina</SelectItem>
                      <SelectItem value="SD">SD - South Dakota</SelectItem>
                      <SelectItem value="TN">TN - Tennessee</SelectItem>
                      <SelectItem value="TX">TX - Texas</SelectItem>
                      <SelectItem value="UT">UT - Utah</SelectItem>
                      <SelectItem value="VT">VT - Vermont</SelectItem>
                      <SelectItem value="VA">VA - Virginia</SelectItem>
                      <SelectItem value="WA">WA - Washington</SelectItem>
                      <SelectItem value="WV">WV - West Virginia</SelectItem>
                      <SelectItem value="WI">WI - Wisconsin</SelectItem>
                      <SelectItem value="WY">WY - Wyoming</SelectItem>
                      <SelectItem value="DC">DC - District of Columbia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode" className="text-white">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="bg-white/5 border-white/10 text-white"
                  placeholder="12345"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="highestEducation" className="text-white">Highest Education Level</Label>
                <Select
                  value={formData.highestEducation}
                  onValueChange={(value) => setFormData({ ...formData, highestEducation: value as any })}
                >
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Select education level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="phd">PhD / Doctorate</SelectItem>
                    <SelectItem value="masters">Master's Degree</SelectItem>
                    <SelectItem value="lcsw">LCSW Certification</SelectItem>
                    <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
                    <SelectItem value="associates">Associate's Degree</SelectItem>
                    <SelectItem value="some_college">Some College</SelectItem>
                    <SelectItem value="high_school">High School Diploma</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button onClick={handleSaveProfile} disabled={updateProfile.isPending} className="w-full bg-[#FA9433] hover:bg-[#FA9433]/80">
                <Save className="w-4 h-4 mr-2" />
                {updateProfile.isPending ? "Saving..." : "Save Personal Information"}
              </Button>
            </CardContent>
          </Card>

          {/* Education History */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Education History</CardTitle>
              <CardDescription>Add your educational background</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Education */}
              {profileData?.education && profileData.education.length > 0 && (
                <div className="space-y-4">
                  {profileData.education.map((edu) => (
                    <div key={edu.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-semibold">{edu.degree}</h4>
                          <p className="text-white/70">{edu.institution}</p>
                          {edu.fieldOfStudy && <p className="text-white/60 text-sm">{edu.fieldOfStudy}</p>}
                          {edu.graduationYear && <p className="text-white/60 text-sm">Graduated: {edu.graduationYear}</p>}
                          {edu.isCurrentlyEnrolled && <p className="text-[#FA9433] text-sm">Currently Enrolled</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEducation.mutate({ id: edu.id })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Education */}
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-semibold">Add Education</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Degree *</Label>
                    <Input
                      value={newEducation.degree}
                      onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., Bachelor of Science"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Institution *</Label>
                    <Input
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., University of California"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Field of Study</Label>
                    <Input
                      value={newEducation.fieldOfStudy}
                      onChange={(e) => setNewEducation({ ...newEducation, fieldOfStudy: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., Psychology"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Graduation Year</Label>
                    <Input
                      type="number"
                      min="1950"
                      max="2100"
                      value={newEducation.graduationYear || ""}
                      onChange={(e) => setNewEducation({ ...newEducation, graduationYear: e.target.value ? parseInt(e.target.value) : undefined })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="2020"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="currentlyEnrolled"
                    checked={newEducation.isCurrentlyEnrolled}
                    onChange={(e) => setNewEducation({ ...newEducation, isCurrentlyEnrolled: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="currentlyEnrolled" className="text-white cursor-pointer">Currently Enrolled</Label>
                </div>
                <Button onClick={handleAddEducation} disabled={addEducation.isPending} className="bg-[#FA9433] hover:bg-[#FA9433]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  {addEducation.isPending ? "Adding..." : "Add Education"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Employment History */}
          <Card className="bg-card/50 backdrop-blur border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Employment History</CardTitle>
              <CardDescription>Add your work experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Existing Employment */}
              {profileData?.employment && profileData.employment.length > 0 && (
                <div className="space-y-4">
                  {profileData.employment.map((job) => (
                    <div key={job.id} className="p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-white font-semibold">{job.jobTitle}</h4>
                          <p className="text-white/70">{job.employer}</p>
                          <p className="text-white/60 text-sm">
                            {job.startDate} - {job.isCurrentJob ? "Present" : job.endDate}
                          </p>
                          {job.responsibilities && <p className="text-white/60 text-sm mt-2">{job.responsibilities}</p>}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteEmployment.mutate({ id: job.id })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Employment */}
              <div className="space-y-4 p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-white font-semibold">Add Employment</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Job Title *</Label>
                    <Input
                      value={newEmployment.jobTitle}
                      onChange={(e) => setNewEmployment({ ...newEmployment, jobTitle: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., Clinical Social Worker"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Employer *</Label>
                    <Input
                      value={newEmployment.employer}
                      onChange={(e) => setNewEmployment({ ...newEmployment, employer: e.target.value })}
                      className="bg-white/5 border-white/10 text-white"
                      placeholder="e.g., ABC Healthcare"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">Start Date *</Label>
                    <DatePicker
                      selected={newEmployment.startDate ? new Date(newEmployment.startDate + "-01") : null}
                      onChange={(date: Date | null) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          setNewEmployment({ ...newEmployment, startDate: `${year}-${month}` });
                        } else {
                          setNewEmployment({ ...newEmployment, startDate: "" });
                        }
                      }}
                      dateFormat="MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                      placeholderText="Select start month"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-white">End Date</Label>
                    <DatePicker
                      selected={newEmployment.endDate ? new Date(newEmployment.endDate + "-01") : null}
                      onChange={(date: Date | null) => {
                        if (date) {
                          const year = date.getFullYear();
                          const month = String(date.getMonth() + 1).padStart(2, '0');
                          setNewEmployment({ ...newEmployment, endDate: `${year}-${month}` });
                        } else {
                          setNewEmployment({ ...newEmployment, endDate: "" });
                        }
                      }}
                      dateFormat="MM/yyyy"
                      showMonthDropdown
                      showYearDropdown
                      dropdownMode="select"
                      scrollableYearDropdown
                      yearDropdownItemNumber={100}
                      className="w-full bg-white/5 border border-white/10 text-white rounded-md px-3 py-2"
                      placeholderText="Select end month"
                      disabled={newEmployment.isCurrentJob}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-white">Responsibilities</Label>
                  <Textarea
                    value={newEmployment.responsibilities}
                    onChange={(e) => setNewEmployment({ ...newEmployment, responsibilities: e.target.value })}
                    className="bg-white/5 border-white/10 text-white"
                    placeholder="Describe your key responsibilities..."
                    rows={3}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="currentJob"
                    checked={newEmployment.isCurrentJob}
                    onChange={(e) => setNewEmployment({ ...newEmployment, isCurrentJob: e.target.checked, endDate: e.target.checked ? "" : newEmployment.endDate })}
                    className="rounded"
                  />
                  <Label htmlFor="currentJob" className="text-white cursor-pointer">Current Job</Label>
                </div>
                <Button onClick={handleAddEmployment} disabled={addEmployment.isPending} className="bg-[#FA9433] hover:bg-[#FA9433]/80">
                  <Plus className="w-4 h-4 mr-2" />
                  {addEmployment.isPending ? "Adding..." : "Add Employment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
