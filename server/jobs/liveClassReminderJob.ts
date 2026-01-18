/**
 * Scheduled job to send live class reminder emails
 * 
 * This job should be run every 5 minutes to check for upcoming sessions
 * and send 24-hour and 1-hour reminder emails to registered trainees.
 * 
 * To set up this job in production:
 * 1. Use a cron service or task scheduler
 * 2. Run: node -r tsx/register server/jobs/liveClassReminderJob.ts
 * 3. Schedule to run every 5 minutes (cron: star-slash-5 star star star star)
 */

import { processLiveClassReminders } from '../liveClassNotifications';

async function main() {
  console.log('[Live Class Reminder Job] Starting at', new Date().toISOString());
  
  try {
    await processLiveClassReminders();
    console.log('[Live Class Reminder Job] Completed successfully');
  } catch (error) {
    console.error('[Live Class Reminder Job] Error:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  main().then(() => process.exit(0));
}

export { main as runLiveClassReminderJob };
