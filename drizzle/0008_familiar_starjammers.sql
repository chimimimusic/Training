CREATE TABLE `userEducation` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`degree` varchar(100) NOT NULL,
	`fieldOfStudy` varchar(200),
	`institution` varchar(200) NOT NULL,
	`graduationYear` int,
	`isCurrentlyEnrolled` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userEducation_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userEmployment` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`jobTitle` varchar(200) NOT NULL,
	`employer` varchar(200) NOT NULL,
	`startDate` varchar(10) NOT NULL,
	`endDate` varchar(10),
	`isCurrentJob` boolean DEFAULT false,
	`responsibilities` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userEmployment_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `firstName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `lastName` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `streetAddress` text;--> statement-breakpoint
ALTER TABLE `users` ADD `unitNumber` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `city` varchar(100);--> statement-breakpoint
ALTER TABLE `users` ADD `state` varchar(2);--> statement-breakpoint
ALTER TABLE `users` ADD `zipCode` varchar(10);--> statement-breakpoint
ALTER TABLE `users` ADD `recoveryEmail` varchar(320);--> statement-breakpoint
ALTER TABLE `users` ADD `age` int;--> statement-breakpoint
ALTER TABLE `users` ADD `gender` varchar(50);--> statement-breakpoint
ALTER TABLE `users` ADD `highestEducation` enum('phd','masters','lcsw','bachelors','associates','some_college','high_school','other');--> statement-breakpoint
ALTER TABLE `users` ADD `profileCompletedAt` timestamp;