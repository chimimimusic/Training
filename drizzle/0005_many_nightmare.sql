ALTER TABLE `liveClasses` MODIFY COLUMN `durationMinutes` int NOT NULL DEFAULT 90;--> statement-breakpoint
ALTER TABLE `liveClasses` MODIFY COLUMN `maxParticipants` int DEFAULT 50;--> statement-breakpoint
ALTER TABLE `liveClasses` MODIFY COLUMN `status` enum('scheduled','live','completed','cancelled') NOT NULL DEFAULT 'scheduled';--> statement-breakpoint
ALTER TABLE `liveClasses` ADD `zoomMeetingId` varchar(20);--> statement-breakpoint
ALTER TABLE `liveClasses` ADD `zoomPasscode` varchar(20);--> statement-breakpoint
ALTER TABLE `liveClasses` ADD `zoomJoinUrl` text;--> statement-breakpoint
ALTER TABLE `liveClasses` ADD `zoomStartUrl` text;--> statement-breakpoint
ALTER TABLE `liveClasses` ADD `currentParticipants` int DEFAULT 0;--> statement-breakpoint
ALTER TABLE `liveClasses` DROP COLUMN `calendlyLink`;