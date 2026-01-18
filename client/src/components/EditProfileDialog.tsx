import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { storagePut } from "@/lib/storage";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentProfileImageUrl?: string | null;
  currentCalendarLink?: string | null;
  currentBio?: string | null;
  currentSpecializations?: string | null;
}

export default function EditProfileDialog({
  open,
  onOpenChange,
  currentProfileImageUrl,
  currentCalendarLink,
  currentBio,
  currentSpecializations,
}: EditProfileDialogProps) {
  const [profileImageUrl, setProfileImageUrl] = useState(currentProfileImageUrl || "");
  const [calendarLink, setCalendarLink] = useState(currentCalendarLink || "");
  const [bio, setBio] = useState(currentBio || "");
  const [specializations, setSpecializations] = useState(currentSpecializations || "");
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const updateProfile = trpc.auth.updateProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      utils.auth.me.invalidate();
      onOpenChange(false);
    },
    onError: (error) => {
      toast.error(`Failed to update profile: ${error.message}`);
    },
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setUploading(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      
      // Generate unique filename
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(7);
      const fileExtension = file.name.split(".").pop();
      const fileName = `profile-${timestamp}-${randomSuffix}.${fileExtension}`;
      
      const { url } = await storagePut(fileName, buffer, file.type);
      setProfileImageUrl(url);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = () => {
    updateProfile.mutate({
      profileImageUrl: profileImageUrl || null,
      calendarLink: calendarLink || null,
      bio: bio || null,
      specializations: specializations || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile picture and calendar link for patient scheduling
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Profile Picture Upload */}
          <div className="space-y-2">
            <Label htmlFor="profile-image">Profile Picture</Label>
            <div className="flex items-center gap-4">
              {profileImageUrl && (
                <img
                  src={profileImageUrl}
                  alt="Profile preview"
                  className="w-20 h-20 rounded-full object-cover border-2 border-[#FA9433]"
                />
              )}
              <div className="flex-1">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={uploading}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 5MB. JPG, PNG, or GIF
                </p>
              </div>
              {uploading && <Loader2 className="w-4 h-4 animate-spin" />}
            </div>
          </div>

          {/* Calendar Link */}
          <div className="space-y-2">
            <Label htmlFor="calendar-link">Calendar Link</Label>
            <Input
              id="calendar-link"
              type="url"
              placeholder="https://calendly.com/your-link"
              value={calendarLink}
              onChange={(e) => setCalendarLink(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Add your Calendly, Google Calendar, or other scheduling link
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell patients about yourself..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
            />
          </div>

          {/* Specializations */}
          <div className="space-y-2">
            <Label htmlFor="specializations">Specializations (Optional)</Label>
            <Input
              id="specializations"
              placeholder="e.g., Anxiety, Depression, PTSD"
              value={specializations}
              onChange={(e) => setSpecializations(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateProfile.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={updateProfile.isPending || uploading}
            className="bg-[#FA9433] hover:bg-[#FA9433]/90"
          >
            {updateProfile.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
