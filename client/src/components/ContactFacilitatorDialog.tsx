import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ContactFacilitatorDialogProps {
  facilitatorId: number;
  facilitatorName: string;
}

export default function ContactFacilitatorDialog({
  facilitatorId,
  facilitatorName,
}: ContactFacilitatorDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const contactMutation = trpc.facilitators.sendContactMessage.useMutation({
    onSuccess: () => {
      toast.success("Message sent successfully!", {
        description: `Your message has been sent to ${facilitatorName}. They will contact you soon.`,
      });
      setOpen(false);
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    },
    onError: (error) => {
      toast.error("Failed to send message", {
        description: error.message || "Please try again later.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast.error("Please fill in all required fields");
      return;
    }

    contactMutation.mutate({
      facilitatorId,
      senderName: name,
      senderEmail: email,
      senderPhone: phone || undefined,
      message,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
          <Mail className="w-4 h-4 mr-2" />
          Contact Me
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Contact {facilitatorName}</DialogTitle>
          <DialogDescription>
            Send a message to {facilitatorName}. They will receive your contact information and
            respond directly to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">
              Your Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Your Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="I'm interested in learning more about your services..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-[#FA9433] hover:bg-[#FA9433]/90"
              disabled={contactMutation.isPending}
            >
              {contactMutation.isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
