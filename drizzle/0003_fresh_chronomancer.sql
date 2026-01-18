CREATE TABLE `certificates` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`certificateId` varchar(50) NOT NULL,
	`certificateUrl` text NOT NULL,
	`averageScore` int NOT NULL,
	`completionDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `certificates_id` PRIMARY KEY(`id`),
	CONSTRAINT `certificates_certificateId_unique` UNIQUE(`certificateId`)
);
