CREATE TABLE `contactMessages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`facilitatorId` int NOT NULL,
	`senderName` varchar(255) NOT NULL,
	`senderEmail` varchar(320) NOT NULL,
	`senderPhone` varchar(20),
	`message` text NOT NULL,
	`status` enum('unread','read','replied') NOT NULL DEFAULT 'unread',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `contactMessages_id` PRIMARY KEY(`id`)
);
