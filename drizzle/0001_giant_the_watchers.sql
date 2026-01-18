CREATE TABLE `assessmentOptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` int NOT NULL,
	`optionLetter` varchar(1) NOT NULL,
	`optionText` text NOT NULL,
	`isCorrect` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessmentOptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleId` int NOT NULL,
	`questionNumber` int NOT NULL,
	`questionText` text NOT NULL,
	`questionType` enum('multiple_choice','short_answer') NOT NULL,
	`correctAnswer` text,
	`points` int NOT NULL DEFAULT 10,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `engagementLogs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int,
	`eventType` enum('login','logout','video_play','video_pause','video_complete','transcript_view','assessment_start','assessment_submit','page_view') NOT NULL,
	`eventData` json,
	`sessionId` varchar(64),
	`ipAddress` varchar(45),
	`userAgent` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `engagementLogs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liveClassAttendance` (
	`id` int AUTO_INCREMENT NOT NULL,
	`liveClassId` int NOT NULL,
	`userId` int NOT NULL,
	`registrationStatus` enum('registered','attended','missed','cancelled') NOT NULL DEFAULT 'registered',
	`joinedAt` timestamp,
	`leftAt` timestamp,
	`attendanceDurationMinutes` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `liveClassAttendance_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `liveClasses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`classType` enum('review_3','review_6','review_9') NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`instructorId` int NOT NULL,
	`scheduledAt` timestamp NOT NULL,
	`durationMinutes` int NOT NULL DEFAULT 60,
	`zoomLink` text,
	`meetingId` varchar(50),
	`passcode` varchar(20),
	`maxParticipants` int,
	`status` enum('scheduled','in_progress','completed','cancelled') NOT NULL DEFAULT 'scheduled',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `liveClasses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `modules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`moduleNumber` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`youtubeVideoId` varchar(20) NOT NULL,
	`videoDurationMinutes` int,
	`transcriptContent` text,
	`orderIndex` int NOT NULL,
	`isPublished` boolean NOT NULL DEFAULT true,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `modules_id` PRIMARY KEY(`id`),
	CONSTRAINT `modules_moduleNumber_unique` UNIQUE(`moduleNumber`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`notificationType` enum('module_unlock','assessment_graded','live_class_reminder','certification_complete') NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`isRead` boolean NOT NULL DEFAULT false,
	`readAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `onboardingDocuments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`documentType` enum('terms_of_service','baa_agreement','treatment_assessment','background_check') NOT NULL,
	`documentContent` text,
	`status` enum('pending','completed','rejected') NOT NULL DEFAULT 'pending',
	`signedAt` timestamp,
	`signatureData` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `onboardingDocuments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `patientAppointments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`facilitatorId` int NOT NULL,
	`patientName` varchar(255),
	`patientEmail` varchar(320),
	`patientPhone` varchar(20),
	`appointmentDate` timestamp NOT NULL,
	`durationMinutes` int NOT NULL DEFAULT 30,
	`status` enum('scheduled','completed','cancelled','no_show') NOT NULL DEFAULT 'scheduled',
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `patientAppointments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userAssessmentResponses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`assessmentId` int NOT NULL,
	`moduleId` int NOT NULL,
	`attemptNumber` int NOT NULL,
	`selectedAnswer` text NOT NULL,
	`isCorrect` boolean NOT NULL,
	`pointsEarned` int NOT NULL,
	`answeredAt` timestamp NOT NULL DEFAULT (now()),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `userAssessmentResponses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userModuleProgress` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`moduleId` int NOT NULL,
	`status` enum('not_started','in_progress','completed') NOT NULL DEFAULT 'not_started',
	`videoWatched` boolean NOT NULL DEFAULT false,
	`videoWatchPercentage` int NOT NULL DEFAULT 0,
	`transcriptViewed` boolean NOT NULL DEFAULT false,
	`assessmentCompleted` boolean NOT NULL DEFAULT false,
	`assessmentScore` int,
	`assessmentAttempts` int NOT NULL DEFAULT 0,
	`timeSpentMinutes` int NOT NULL DEFAULT 0,
	`startedAt` timestamp,
	`completedAt` timestamp,
	`lastAccessedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userModuleProgress_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('admin','instructor','provider','trainee','facilitator') NOT NULL DEFAULT 'trainee';--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `profileImageUrl` text;--> statement-breakpoint
ALTER TABLE `users` ADD `bio` text;--> statement-breakpoint
ALTER TABLE `users` ADD `specializations` text;--> statement-breakpoint
ALTER TABLE `users` ADD `calendarLink` text;--> statement-breakpoint
ALTER TABLE `users` ADD `providerId` int;--> statement-breakpoint
ALTER TABLE `users` ADD `status` enum('pending','active','suspended','completed') DEFAULT 'pending' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `agreedToTerms` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `termsAgreedAt` timestamp;--> statement-breakpoint
ALTER TABLE `users` ADD `agreedToBaa` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `baaAgreedAt` timestamp;