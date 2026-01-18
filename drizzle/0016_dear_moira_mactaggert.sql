ALTER TABLE `modules` MODIFY COLUMN `youtubeVideoId` varchar(20);--> statement-breakpoint
ALTER TABLE `modules` ADD `videoUrl` text;--> statement-breakpoint
ALTER TABLE `modules` ADD `videoType` enum('youtube','direct') DEFAULT 'youtube';