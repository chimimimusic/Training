CREATE TABLE `discussionLikes` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int,
	`replyId` int,
	`userId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `discussionLikes_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discussionReplies` (
	`id` int AUTO_INCREMENT NOT NULL,
	`topicId` int NOT NULL,
	`parentReplyId` int,
	`content` text NOT NULL,
	`authorId` int NOT NULL,
	`likeCount` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discussionReplies_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `discussionTopics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`category` enum('general','module_question','technical_support','success_story','best_practices') NOT NULL DEFAULT 'general',
	`moduleId` int,
	`authorId` int NOT NULL,
	`isPinned` boolean NOT NULL DEFAULT false,
	`isLocked` boolean NOT NULL DEFAULT false,
	`viewCount` int NOT NULL DEFAULT 0,
	`replyCount` int NOT NULL DEFAULT 0,
	`lastActivityAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `discussionTopics_id` PRIMARY KEY(`id`)
);
