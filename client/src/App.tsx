import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Onboarding from "./pages/Onboarding";
import Training from "./pages/Training";
import Profile from "@/pages/Profile";
import ProfileEdit from "@/pages/ProfileEdit";
import FacilitatorDirectory from "@/pages/FacilitatorDirectory";
import ModuleDetail from "./pages/ModuleDetail";
import LiveClassSession from "./pages/LiveClassSession";
import DiscussionForum from "./pages/DiscussionForum";
import DiscussionTopic from "./pages/DiscussionTopic";
import Analytics from "./pages/Analytics";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminTraineeProgress from "@/pages/AdminTraineeProgress";
import AdminTraineeDetail from "@/pages/AdminTraineeDetail";
import AdminProgressExport from "@/pages/AdminProgressExport";
import AdminProfileView from "@/pages/AdminProfileView";
import AdminProfileExport from "@/pages/AdminProfileExport";
import AdminAssessmentAnalytics from "@/pages/AdminAssessmentAnalytics";
import AdminPatientAssessments from "@/pages/AdminPatientAssessments";
import AdminVideoAnalytics from "@/pages/AdminVideoAnalytics";
import AdminInvitations from "@/pages/AdminInvitations";
import InstructorDashboard from "./pages/InstructorDashboard";
import InstructorLiveClasses from "./pages/InstructorLiveClasses";
import ProviderDashboard from "./pages/ProviderDashboard";
import PatientSessions from "./pages/PatientSessions";
import PublicHome from "./pages/PublicHome";
import PatientIntakeLanding from "./pages/PatientIntakeLanding";
import PortalSelection from "./pages/PortalSelection";
import FacilitatorPortal from "./pages/FacilitatorPortal";
import ProviderPortalComingSoon from "./pages/ProviderPortalComingSoon";
import PatientIntakeAssessment from "./pages/PatientIntakeAssessment";
import AssessmentResult from "./pages/AssessmentResult";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/home" component={Home} />
      <Route path="/patient-intake" component={PatientIntakeLanding} />
      <Route path="/portals" component={PortalSelection} />
      <Route path="/facilitator" component={FacilitatorPortal} />
      <Route path="/assessment/patient-intake" component={PatientIntakeAssessment} />
      <Route path="/assessment-result/:id" component={AssessmentResult} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/training" component={Training} />
      <Route path="/module/:id" component={ModuleDetail} />
        <Route path="/live-class/:id" component={LiveClassSession} />
        <Route path="/forum" component={DiscussionForum} />
        <Route path="/forum/topic/:id" component={DiscussionTopic} />
        <Route path="/analytics" component={Analytics} />
        <Route path="/admin" component={AdminDashboard} />
        <Route path="/admin/dashboard" component={AdminDashboard} />
        <Route path="/admin/progress" component={AdminTraineeProgress} />
        <Route path="/admin/trainee/:id" component={AdminTraineeDetail} />
        <Route path="/admin/progress/export" component={AdminProgressExport} />
        <Route path="/admin/export" component={AdminProfileExport} />
        <Route path="/admin/assessment-analytics" component={AdminAssessmentAnalytics} />
        <Route path="/admin/patient-assessments" component={AdminPatientAssessments} />
        <Route path="/admin/video-analytics" component={AdminVideoAnalytics} />
        <Route path="/admin/invitations" component={AdminInvitations} />
        <Route path="/patient-sessions" component={PatientSessions} />
        <Route path="/admin/profile/:id" component={AdminProfileView} />
        <Route path="/instructor" component={InstructorDashboard} />
      <Route path="/instructor/live-classes" component={InstructorLiveClasses} />
      <Route path="/provider" component={ProviderDashboard} />
      <Route path="/profile" component={Profile} />
      <Route path="/profile/edit" component={ProfileEdit} />
      <Route path="/facilitators" component={FacilitatorDirectory} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
