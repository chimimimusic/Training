import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Download, FileText, FileSpreadsheet, ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { toast } from "sonner";

export default function AdminProfileExport() {
  const [, setLocation] = useLocation();
  const { data: profiles, isLoading } = trpc.profile.getAllProfiles.useQuery();

  const exportBasicCSV = trpc.admin.exportProfilesCSV.useQuery(
    {},
    { enabled: false }
  );

  const exportDetailedCSV = trpc.admin.exportDetailedProfilesCSV.useQuery(
    {},
    { enabled: false }
  );

  const exportHTML = trpc.admin.exportProfilesHTML.useQuery(
    {},
    { enabled: false }
  );

  const handleExportBasicCSV = async () => {
    try {
      const result = await exportBasicCSV.refetch();
      if (result.data) {
        downloadFile(result.data, 'trainee-profiles-basic.csv', 'text/csv');
        toast.success('Basic profile CSV exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export basic CSV');
    }
  };

  const handleExportDetailedCSV = async () => {
    try {
      const result = await exportDetailedCSV.refetch();
      if (result.data) {
        downloadFile(result.data, 'trainee-profiles-detailed.csv', 'text/csv');
        toast.success('Detailed profile CSV exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export detailed CSV');
    }
  };

  const handleExportHTML = async () => {
    try {
      const result = await exportHTML.refetch();
      if (result.data) {
        downloadFile(result.data, 'trainee-profiles.html', 'text/html');
        toast.success('HTML report exported successfully');
      }
    } catch (error) {
      toast.error('Failed to export HTML');
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Loading profiles...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#2a4a6f] to-[#1e3a5f] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setLocation('/admin')}
          className="mb-6 text-white hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Admin Dashboard
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Export Trainee Profiles</h1>
          <p className="text-white/70">
            Download trainee profile data for compliance, reporting, or external systems
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Export Summary</CardTitle>
            <CardDescription className="text-white/70">
              Total Profiles Available: {profiles?.length || 0}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Basic CSV Export */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-green-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Basic Profile CSV</h3>
                <p className="text-white/70 text-sm mb-3">
                  Export basic profile fields including contact information, demographics, and status.
                  Ideal for quick reports and external system imports.
                </p>
                <Button
                  onClick={handleExportBasicCSV}
                  disabled={exportBasicCSV.isFetching}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportBasicCSV.isFetching ? 'Exporting...' : 'Export Basic CSV'}
                </Button>
              </div>
            </div>

            {/* Detailed CSV Export */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <FileSpreadsheet className="w-8 h-8 text-blue-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">Detailed Profile CSV</h3>
                <p className="text-white/70 text-sm mb-3">
                  Export comprehensive profile data including education history and employment records.
                  Best for background verification and certification compliance.
                </p>
                <Button
                  onClick={handleExportDetailedCSV}
                  disabled={exportDetailedCSV.isFetching}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportDetailedCSV.isFetching ? 'Exporting...' : 'Export Detailed CSV'}
                </Button>
              </div>
            </div>

            {/* HTML Export */}
            <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
              <FileText className="w-8 h-8 text-orange-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-white font-semibold mb-1">HTML Report</h3>
                <p className="text-white/70 text-sm mb-3">
                  Generate a formatted HTML document with all profile details, education, and employment.
                  Perfect for printing or PDF conversion.
                </p>
                <Button
                  onClick={handleExportHTML}
                  disabled={exportHTML.isFetching}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  <Download className="w-4 h-4 mr-2" />
                  {exportHTML.isFetching ? 'Exporting...' : 'Export HTML Report'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Export Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-white/70 text-sm space-y-2">
            <p>• All exports include only active and pending trainees (excludes deleted accounts)</p>
            <p>• CSV files can be opened in Excel, Google Sheets, or any spreadsheet application</p>
            <p>• HTML reports can be printed directly or converted to PDF using browser print function</p>
            <p>• Exports are generated in real-time and reflect current database state</p>
            <p>• For HIPAA compliance, ensure exported files are stored securely and transmitted via encrypted channels</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
