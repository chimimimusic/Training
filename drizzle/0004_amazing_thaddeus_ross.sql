ALTER TABLE `liveClasses` ADD `calendlyLink` text;--> statement-breakpoint
ALTER TABLE `liveClasses` DROP COLUMN `zoomLink`;--> statement-breakpoint
ALTER TABLE `liveClasses` DROP COLUMN `meetingId`;--> statement-breakpoint
ALTER TABLE `liveClasses` DROP COLUMN `passcode`;