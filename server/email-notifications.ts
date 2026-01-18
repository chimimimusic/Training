import { notifyOwner } from './_core/notification';

/**
 * Email notification templates and sending logic for LMS milestones
 */

interface EmailNotificationParams {
  recipientEmail: string;
  recipientName: string;
  subject: string;
  body: string;
}

/**
 * Send email notification using the owner notification system
 * Note: In production, you would integrate with a proper email service like SendGrid or AWS SES
 * For now, we'll send notifications to the owner as a proof of concept
 */
async function sendEmail(params: EmailNotificationParams): Promise<boolean> {
  const { recipientEmail, recipientName, subject, body } = params;
  
  // Format notification for owner
  const ownerNotification = {
    title: `Email Notification: ${subject}`,
    content: `
To: ${recipientName} (${recipientEmail})
Subject: ${subject}

${body}
    `.trim()
  };
  
  return await notifyOwner(ownerNotification);
}

/**
 * Send module completion notification
 */
export async function sendModuleCompletionEmail(
  userName: string,
  userEmail: string,
  moduleTitle: string,
  moduleNumber: number
): Promise<boolean> {
  return await sendEmail({
    recipientEmail: userEmail,
    recipientName: userName,
    subject: `Module ${moduleNumber} Completed - ${moduleTitle}`,
    body: `
Congratulations ${userName}!

You have successfully completed Module ${moduleNumber}: ${moduleTitle}.

Your progress has been saved and you can now proceed to the next module in your facilitator training journey.

Keep up the great work!

Best regards,
SoundBridge Health Team
    `.trim()
  });
}

/**
 * Send assessment pass notification
 */
export async function sendAssessmentPassEmail(
  userName: string,
  userEmail: string,
  moduleTitle: string,
  moduleNumber: number,
  score: number,
  totalPoints: number
): Promise<boolean> {
  const percentage = Math.round((score / totalPoints) * 100);
  
  return await sendEmail({
    recipientEmail: userEmail,
    recipientName: userName,
    subject: `Assessment Passed - Module ${moduleNumber}`,
    body: `
Great work, ${userName}!

You have passed the assessment for Module ${moduleNumber}: ${moduleTitle}.

Your Score: ${score}/${totalPoints} (${percentage}%)
Passing Score: 80%

You have successfully demonstrated your understanding of the material and can now continue to the next module.

Best regards,
SoundBridge Health Team
    `.trim()
  });
}

/**
 * Send assessment fail notification
 */
export async function sendAssessmentFailEmail(
  userName: string,
  userEmail: string,
  moduleTitle: string,
  moduleNumber: number,
  score: number,
  totalPoints: number,
  attemptsRemaining: number
): Promise<boolean> {
  const percentage = Math.round((score / totalPoints) * 100);
  
  return await sendEmail({
    recipientEmail: userEmail,
    recipientName: userName,
    subject: `Assessment Result - Module ${moduleNumber}`,
    body: `
Hi ${userName},

You have completed an assessment for Module ${moduleNumber}: ${moduleTitle}.

Your Score: ${score}/${totalPoints} (${percentage}%)
Required Score: 80%

${attemptsRemaining > 0 
  ? `You have ${attemptsRemaining} attempt(s) remaining. We encourage you to review the module materials and try again.`
  : 'You have used all available attempts. Please contact your instructor for assistance.'
}

Tips for success:
- Review the video content carefully
- Read through the transcript for key concepts
- Take notes on important facilitator techniques

Best regards,
SoundBridge Health Team
    `.trim()
  });
}

/**
 * Send certificate ready notification
 */
export async function sendCertificateReadyEmail(
  userName: string,
  userEmail: string,
  certificateUrl: string,
  averageScore: number,
  completionDate: Date
): Promise<boolean> {
  return await sendEmail({
    recipientEmail: userEmail,
    recipientName: userName,
    subject: 'Congratulations! Your Facilitator Certificate is Ready',
    body: `
Congratulations, ${userName}!

You have successfully completed all 10 modules of the SoundBridge Health Facilitator Training Program!

Program Statistics:
- Average Score: ${averageScore}%
- Completion Date: ${completionDate.toLocaleDateString()}

Your certificate is now available for download:
${certificateUrl}

You are now certified to facilitate music-based intervention sessions. We're proud of your dedication and look forward to the positive impact you'll make.

Best regards,
SoundBridge Health Team
    `.trim()
  });
}

/**
 * Send welcome/onboarding email
 */
export async function sendWelcomeEmail(
  userName: string,
  userEmail: string
): Promise<boolean> {
  return await sendEmail({
    recipientEmail: userEmail,
    recipientName: userName,
    subject: 'Welcome to SoundBridge Health Facilitator Training',
    body: `
Welcome, ${userName}!

Thank you for joining the SoundBridge Health Facilitator Training Program. We're excited to have you on this journey to become a certified facilitator of music-based interventions.

Your training consists of 10 comprehensive modules covering:
- The SoundBridge Health protocol
- Music-based intervention fundamentals
- Participant engagement techniques
- Clinical applications and best practices

Getting Started:
1. Complete all 10 training modules
2. Pass each assessment with 80% or higher
3. Attend the 3 live instructor-led review sessions
4. Receive your facilitator certification

You can access your training dashboard at any time to track your progress.

Best regards,
SoundBridge Health Team
    `.trim()
  });
}
