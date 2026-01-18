CREATE TABLE `moduleSections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`sectionNumber` int NOT NULL,
	`title` text NOT NULL,
	`youtubeVideoId` varchar(20) NOT NULL,
	`videoDurationMinutes` int,
	`transcriptContent` text,
	`orderIndex` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `moduleSections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userSectionProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sectionId` int NOT NULL,
	`videoWatched` boolean NOT NULL DEFAULT false,
	`transcriptViewed` boolean NOT NULL DEFAULT false,
	`assessmentCompleted` boolean NOT NULL DEFAULT false,
	`assessmentScore` int,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userSectionProgress_id` PRIMARY KEY(`id`)
);
