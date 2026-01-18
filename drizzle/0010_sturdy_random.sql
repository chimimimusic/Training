CREATE TABLE `profileAuditLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`changedBy` int NOT NULL,
	`tableName` varchar(50) NOT NULL,
	`recordId` int,
	`fieldName` varchar(100) NOT NULL,
	`oldValue` text,
	`newValue` text,
	`changeType` enum('create','update','delete') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `profileAuditLog_id` PRIMARY KEY(`id`)
);
