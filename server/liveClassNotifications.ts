import { notifyOwner } from "./_core/notification";
import * as db from "./db";

interface LiveClassReminderData {
  sessionTitle: string;
  sessionDate: Date;
  sessionDuration: number;
  zoomMeetingId: string;
  zoomPasscode?: string;
  zoomJoinUrl: string;
  traineeEmail: string;
  traineeName: string;
}

/**
 * Generate .ics calendar invite content
 */
function generateCalendarInvite(data: LiveClassReminderData): string {
  const startDate = new Date(data.sessionDate);
  const endDate = new Date(startDate.getTime() + data.sessionDuration * 60000);
  
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//SoundBridge Health//Live Class//EN
BEGIN:VEVENT
UID:${Date.now()}-${Math.random().toString(36).substr(2, 9)}@soundbridgehealth.com
DTSTAMP:${formatDate(new Date())}
DTSTART:${formatDate(startDate)}
DTEND:${formatDate(endDate)}
SUMMARY:${data.sessionTitle}
DESCRIPTION:Join the live review session via Zoom\\n\\nMeeting ID: ${data.zoomMeetingId}${data.zoomPasscode ? `\\nPasscode: ${data.zoomPasscode}` : ''}\\n\\nJoin URL: ${data.zoomJoinUrl}
LOCATION:${data.zoomJoinUrl}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;
}

/**
 * Send 24-hour reminder email
 */
export async function send24HourReminder(data: LiveClassReminderData): Promise<boolean> {
  const calendarInvite = generateCalendarInvite(data);
  
  const emailContent = `
Dear ${data.traineeName},

This is a reminder that your live review session is scheduled for tomorrow:

**${data.sessionTitle}**
Date: ${data.sessionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${data.sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
Duration: ${data.sessionDuration} minutes

**Zoom Meeting Details:**
Meeting ID: ${data.zoomMeetingId}
${data.zoomPasscode ? `Passcode: ${data.zoomPasscode}` : ''}

Join URL: ${data.zoomJoinUrl}

**What to Prepare:**
- Review the modules covered in this session
- Prepare any questions you'd like to ask
- Test your Zoom connection before the session starts
- Have a quiet space ready for the live class

We look forward to seeing you tomorrow!

Best regards,
SoundBridge Health Training Team

---
Calendar invite attached. Add this to your calendar so you don't miss the session!
`;

  // In a real implementation, you would send this via email service
  // For now, we'll notify the owner that a reminder should be sent
  return await notifyOwner({
    title: `24h Reminder: ${data.sessionTitle}`,
    content: `Reminder email should be sent to ${data.traineeEmail}:\n\n${emailContent}`,
  });
}

/**
 * Send 1-hour reminder email
 */
export async function send1HourReminder(data: LiveClassReminderData): Promise<boolean> {
  const emailContent = `
Dear ${data.traineeName},

Your live review session starts in 1 hour!

**${data.sessionTitle}**
Time: ${data.sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}

**Quick Join:**
${data.zoomJoinUrl}

Meeting ID: ${data.zoomMeetingId}
${data.zoomPasscode ? `Passcode: ${data.zoomPasscode}` : ''}

The meeting link will become active 15 minutes before the scheduled start time.

See you soon!

SoundBridge Health Training Team
`;

  return await notifyOwner({
    title: `1h Reminder: ${data.sessionTitle}`,
    content: `Reminder email should be sent to ${data.traineeEmail}:\n\n${emailContent}`,
  });
}

/**
 * Send registration confirmation email
 */
export async function sendRegistrationConfirmation(data: LiveClassReminderData): Promise<boolean> {
  const calendarInvite = generateCalendarInvite(data);
  
  const emailContent = `
Dear ${data.traineeName},

You've successfully registered for the following live review session:

**${data.sessionTitle}**
Date: ${data.sessionDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${data.sessionDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
Duration: ${data.sessionDuration} minutes

**Zoom Meeting Details:**
Meeting ID: ${data.zoomMeetingId}
${data.zoomPasscode ? `Passcode: ${data.zoomPasscode}` : ''}

Join URL: ${data.zoomJoinUrl}

**What to Expect:**
- Interactive Q&A with the instructor
- Review of challenging topics and assessments
- Practical demonstrations and case studies
- Opportunity to connect with other trainees

You'll receive reminder emails 24 hours and 1 hour before the session starts.

Add this session to your calendar using the attached invite!

Best regards,
SoundBridge Health Training Team
`;

  return await notifyOwner({
    title: `Registration Confirmed: ${data.sessionTitle}`,
    content: `Confirmation email should be sent to ${data.traineeEmail}:\n\n${emailContent}`,
  });
}

/**
 * Check for upcoming sessions and send reminders
 * This function should be called by a scheduled job
 */
export async function processLiveClassReminders() {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
  
  // Get all scheduled sessions
  const sessions = await db.getAllLiveSessions();
  
  for (const session of sessions) {
    if (session.status !== 'scheduled') continue;
    
    const sessionDate = new Date(session.scheduledAt);
    
    // Get all registered participants
    const participants = await db.getSessionParticipants(session.id);
    
    for (const participant of participants) {
      if (participant.liveClassAttendance.registrationStatus !== 'registered') continue;
      
      const reminderData: LiveClassReminderData = {
        sessionTitle: session.title,
        sessionDate,
        sessionDuration: session.durationMinutes,
        zoomMeetingId: session.zoomMeetingId || '',
        zoomPasscode: session.zoomPasscode || undefined,
        zoomJoinUrl: session.zoomJoinUrl || '',
        traineeEmail: participant.users.email || '',
        traineeName: participant.users.name || 'Trainee',
      };
      
      // Check if 24-hour reminder should be sent
      const timeTo24h = sessionDate.getTime() - in24Hours.getTime();
      if (timeTo24h >= 0 && timeTo24h < 5 * 60 * 1000) { // Within 5 minutes of 24h mark
        await send24HourReminder(reminderData);
      }
      
      // Check if 1-hour reminder should be sent
      const timeTo1h = sessionDate.getTime() - in1Hour.getTime();
      if (timeTo1h >= 0 && timeTo1h < 5 * 60 * 1000) { // Within 5 minutes of 1h mark
        await send1HourReminder(reminderData);
      }
    }
  }
}
