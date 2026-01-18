CREATE TABLE `videoProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`lastPosition` int NOT NULL DEFAULT 0,
	`watchPercentage` int NOT NULL DEFAULT 0,
	`totalWatchTimeSeconds` int NOT NULL DEFAULT 0,
	`completionCount` int NOT NULL DEFAULT 0,
	`lastWatchedAt` timestamp NOT NULL DEFAULT (now()),
	`firstWatchedAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `videoProgress_id` PRIMARY KEY(`id`)
);
