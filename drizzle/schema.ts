import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, json, date } from "drizzle-orm/mysql-core";

/**
 * Core user table with role-based access control
 * Roles: admin, instructor, provider, trainee, facilitator
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["admin", "instructor", "provider", "trainee", "facilitator", "patient"]).default("trainee").notNull(),
  
  // Profile fields
  phone: varchar("phone", { length: 20 }),
  profileImageUrl: text("profileImageUrl"),
  bio: text("bio"),
  specializations: text("specializations"),
  calendarLink: text("calendarLink"), // For certified facilitators
  
  // Extended profile fields
  firstName: varchar("firstName", { length: 100 }),
  lastName: varchar("lastName", { length: 100 }),
  streetAddress: text("streetAddress"),
  unitNumber: varchar("unitNumber", { length: 20 }),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 2 }),
  zipCode: varchar("zipCode", { length: 10 }),
  recoveryEmail: varchar("recoveryEmail", { length: 320 }),
  age: int("age"),
  gender: varchar("gender", { length: 50 }),
  highestEducation: mysqlEnum("highestEducation", [
    "phd",
    "masters",
    "lcsw",
    "bachelors",
    "associates",
    "some_college",
    "high_school",
    "other"
  ]),
  profileCompletedAt: timestamp("profileCompletedAt"),
  
  // Soft delete
  deletedAt: timestamp("deletedAt"),
  
  // Provider relationship
  providerId: int("providerId"), // Which provider referred this trainee
  
  // Status tracking
  status: mysqlEnum("status", ["pending", "active", "suspended", "completed"]).default("pending").notNull(),
  agreedToTerms: boolean("agreedToTerms").default(false).notNull(),
  termsAgreedAt: timestamp("termsAgreedAt"),
  agreedToBaa: boolean("agreedToBaa").default(false).notNull(),
  baaAgreedAt: timestamp("baaAgreedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

/**
 * Training modules (10 total)
 */
export const modules = mysqlTable("modules", {
  id: int("id").autoincrement().primaryKey(),
  moduleNumber: int("moduleNumber").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  youtubeVideoId: varchar("youtubeVideoId", { length: 20 }), // Legacy: YouTube video ID
  videoUrl: text("videoUrl"), // New: Direct video URL (S3 or CDN)
  videoType: mysqlEnum("videoType", ["youtube", "direct"]).default("youtube"), // Video source type
  videoDurationMinutes: int("videoDurationMinutes"),
  transcriptContent: text("transcriptContent"),
  orderIndex: int("orderIndex").notNull(),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Assessment questions for each module
 */
export const assessments = mysqlTable("assessments", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  sectionId: int("sectionId"), // For multi-part modules, links to specific section
  questionNumber: int("questionNumber").notNull(),
  questionText: text("questionText").notNull(),
  questionType: mysqlEnum("questionType", ["multiple_choice", "short_answer"]).notNull(),
  correctAnswer: text("correctAnswer"), // For multiple choice: "A", "B", etc. For short answer: expected keywords
  points: int("points").default(10).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Multiple choice options for assessments
 */
export const assessmentOptions = mysqlTable("assessmentOptions", {
  id: int("id").autoincrement().primaryKey(),
  assessmentId: int("assessmentId").notNull(),
  optionLetter: varchar("optionLetter", { length: 1 }).notNull(), // A, B, C, D
  optionText: text("optionText").notNull(),
  isCorrect: boolean("isCorrect").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * User progress through modules
 */
export const userModuleProgress = mysqlTable("userModuleProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  
  status: mysqlEnum("status", ["not_started", "in_progress", "completed"]).default("not_started").notNull(),
  
  // Video tracking
  videoWatched: boolean("videoWatched").default(false).notNull(),
  videoWatchPercentage: int("videoWatchPercentage").default(0).notNull(),
  
  // Transcript tracking
  transcriptViewed: boolean("transcriptViewed").default(false).notNull(),
  
  // Assessment tracking
  assessmentCompleted: boolean("assessmentCompleted").default(false).notNull(),
  assessmentScore: int("assessmentScore"),
  assessmentAttempts: int("assessmentAttempts").default(0).notNull(),
  lastAttemptAt: timestamp("lastAttemptAt"),
  highestScore: int("highestScore"),
  
  // Time tracking
  timeSpentMinutes: int("timeSpentMinutes").default(0).notNull(),
  startedAt: timestamp("startedAt"),
  completedAt: timestamp("completedAt"),
  lastAccessedAt: timestamp("lastAccessedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Detailed video playback progress tracking
 */
export const videoProgress = mysqlTable("videoProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId").notNull(),
  
  // Playback position for resume functionality
  lastPosition: int("lastPosition").default(0).notNull(), // in seconds
  
  // Watch analytics
  watchPercentage: int("watchPercentage").default(0).notNull(), // 0-100
  totalWatchTimeSeconds: int("totalWatchTimeSeconds").default(0).notNull(),
  completionCount: int("completionCount").default(0).notNull(), // how many times watched to end
  
  // Session tracking
  lastWatchedAt: timestamp("lastWatchedAt").defaultNow().notNull(),
  firstWatchedAt: timestamp("firstWatchedAt").defaultNow().notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Individual responses to assessment questions
 */
export const userAssessmentResponses = mysqlTable("userAssessmentResponses", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  assessmentId: int("assessmentId").notNull(),
  moduleId: int("moduleId").notNull(),
  attemptNumber: int("attemptNumber").notNull(),
  selectedAnswer: text("selectedAnswer").notNull(),
  isCorrect: boolean("isCorrect").notNull(),
  pointsEarned: int("pointsEarned").notNull(),
  answeredAt: timestamp("answeredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Live instructor-led classes (after modules 3, 6, 9)
 */
export const liveClasses = mysqlTable("liveClasses", {
  id: int("id").autoincrement().primaryKey(),
  classType: mysqlEnum("classType", ["review_3", "review_6", "review_9"]).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  instructorId: int("instructorId").notNull(),
  scheduledAt: timestamp("scheduledAt").notNull(),
  durationMinutes: int("durationMinutes").default(90).notNull(),
  
  // Zoom meeting details for group webinar
  zoomMeetingId: varchar("zoomMeetingId", { length: 20 }), // Zoom meeting ID
  zoomPasscode: varchar("zoomPasscode", { length: 20 }), // Meeting passcode
  zoomJoinUrl: text("zoomJoinUrl"), // URL for trainees to join
  zoomStartUrl: text("zoomStartUrl"), // URL for instructor to start meeting
  
  maxParticipants: int("maxParticipants").default(50),
  currentParticipants: int("currentParticipants").default(0),
  status: mysqlEnum("status", ["scheduled", "live", "completed", "cancelled"]).default("scheduled").notNull(),
  
  // Recording URL for on-demand viewing after session completes
  recordingUrl: text("recordingUrl"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Live class attendance tracking
 */
export const liveClassAttendance = mysqlTable("liveClassAttendance", {
  id: int("id").autoincrement().primaryKey(),
  liveClassId: int("liveClassId").notNull(),
  userId: int("userId").notNull(),
  registrationStatus: mysqlEnum("registrationStatus", ["registered", "attended", "missed", "cancelled"]).default("registered").notNull(),
  joinedAt: timestamp("joinedAt"),
  leftAt: timestamp("leftAt"),
  attendanceDurationMinutes: int("attendanceDurationMinutes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Detailed engagement tracking for analytics
 */
export const engagementLogs = mysqlTable("engagementLogs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  moduleId: int("moduleId"),
  eventType: mysqlEnum("eventType", [
    "login", "logout", "video_play", "video_pause", "video_complete", 
    "transcript_view", "assessment_start", "assessment_submit", "page_view"
  ]).notNull(),
  eventData: json("eventData"), // Flexible field for additional context
  sessionId: varchar("sessionId", { length: 64 }),
  ipAddress: varchar("ipAddress", { length: 45 }),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Onboarding documents (Terms of Service, BAA, etc.)
 */
export const onboardingDocuments = mysqlTable("onboardingDocuments", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentType: mysqlEnum("documentType", ["terms_of_service", "baa_agreement", "treatment_assessment", "background_check"]).notNull(),
  documentContent: text("documentContent"),
  status: mysqlEnum("status", ["pending", "completed", "rejected"]).default("pending").notNull(),
  signedAt: timestamp("signedAt"),
  signatureData: text("signatureData"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Patient appointments (for certified facilitators)
 */
export const patientAppointments = mysqlTable("patientAppointments", {
  id: int("id").autoincrement().primaryKey(),
  facilitatorId: int("facilitatorId").notNull(),
  patientName: varchar("patientName", { length: 255 }),
  patientEmail: varchar("patientEmail", { length: 320 }),
  patientPhone: varchar("patientPhone", { length: 20 }),
  appointmentDate: timestamp("appointmentDate").notNull(),
  durationMinutes: int("durationMinutes").default(30).notNull(),
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Discussion forum topics
 */
export const discussionTopics = mysqlTable("discussionTopics", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: mysqlEnum("category", ["general", "module_question", "technical_support", "success_story", "best_practices"]).default("general").notNull(),
  moduleId: int("moduleId"), // Optional: link to specific module
  authorId: int("authorId").notNull(),
  isPinned: boolean("isPinned").default(false).notNull(),
  isLocked: boolean("isLocked").default(false).notNull(),
  viewCount: int("viewCount").default(0).notNull(),
  replyCount: int("replyCount").default(0).notNull(),
  lastActivityAt: timestamp("lastActivityAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Discussion forum replies (threaded)
 */
export const discussionReplies = mysqlTable("discussionReplies", {
  id: int("id").autoincrement().primaryKey(),
  topicId: int("topicId").notNull(),
  parentReplyId: int("parentReplyId"), // For nested replies
  content: text("content").notNull(),
  authorId: int("authorId").notNull(),
  likeCount: int("likeCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Discussion likes (for topics and replies)
 */
export const discussionLikes = mysqlTable("discussionLikes", {
  id: int("id").autoincrement().primaryKey(),
  topicId: int("topicId"), // Either topicId or replyId will be set
  replyId: int("replyId"),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Contact messages from patients to facilitators
 */
export const contactMessages = mysqlTable("contactMessages", {
  id: int("id").autoincrement().primaryKey(),
  facilitatorId: int("facilitatorId").notNull(),
  senderName: varchar("senderName", { length: 255 }).notNull(),
  senderEmail: varchar("senderEmail", { length: 320 }).notNull(),
  senderPhone: varchar("senderPhone", { length: 20 }),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["unread", "read", "replied"]).default("unread").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Completion certificates
 */
export const certificates = mysqlTable("certificates", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  certificateId: varchar("certificateId", { length: 50 }).notNull().unique(),
  certificateUrl: text("certificateUrl").notNull(),
  averageScore: int("averageScore").notNull(),
  completionDate: timestamp("completionDate").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * User education history
 */
export const userEducation = mysqlTable("userEducation", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  degree: varchar("degree", { length: 100 }).notNull(),
  fieldOfStudy: varchar("fieldOfStudy", { length: 200 }),
  institution: varchar("institution", { length: 200 }).notNull(),
  graduationYear: int("graduationYear"),
  isCurrentlyEnrolled: boolean("isCurrentlyEnrolled").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * User employment history
 */
export const userEmployment = mysqlTable("userEmployment", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  jobTitle: varchar("jobTitle", { length: 200 }).notNull(),
  employer: varchar("employer", { length: 200 }).notNull(),
  startDate: varchar("startDate", { length: 10 }).notNull(), // YYYY-MM format
  endDate: varchar("endDate", { length: 10 }), // YYYY-MM format
  isCurrentJob: boolean("isCurrentJob").default(false),
  responsibilities: text("responsibilities"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * System notifications
 */
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  notificationType: mysqlEnum("notificationType", [
    "module_unlock", "assessment_graded", "live_class_reminder", "certification_complete"
  ]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  readAt: timestamp("readAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

/**
 * Profile audit log for tracking all profile changes
 */
export const profileAuditLog = mysqlTable("profileAuditLog", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  changedBy: int("changedBy").notNull(), // Admin or self
  tableName: varchar("tableName", { length: 50 }).notNull(), // users, userEducation, userEmployment
  recordId: int("recordId"), // For education/employment records
  fieldName: varchar("fieldName", { length: 100 }).notNull(),
  oldValue: text("oldValue"),
  newValue: text("newValue"),
  changeType: mysqlEnum("changeType", ["create", "update", "delete"]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type ProfileAuditLog = typeof profileAuditLog.$inferSelect;
export type InsertProfileAuditLog = typeof profileAuditLog.$inferInsert;
export type InsertUser = typeof users.$inferInsert;
export type Module = typeof modules.$inferSelect;
export type InsertModule = typeof modules.$inferInsert;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;
export type AssessmentOption = typeof assessmentOptions.$inferSelect;
export type UserModuleProgress = typeof userModuleProgress.$inferSelect;
export type InsertUserModuleProgress = typeof userModuleProgress.$inferInsert;
export type UserAssessmentResponse = typeof userAssessmentResponses.$inferSelect;
export type LiveClass = typeof liveClasses.$inferSelect;
export type LiveClassAttendance = typeof liveClassAttendance.$inferSelect;
/**
 * Module sections for multi-part modules (e.g., Session 1A and 1B within Module 1)
 */
export const moduleSections = mysqlTable("moduleSections", {
  id: int("id").autoincrement().primaryKey(),
  moduleId: int("moduleId").notNull(),
  sectionNumber: int("sectionNumber").notNull(), // 1 for Part A, 2 for Part B
  title: text("title").notNull(), // "Session 1A: Introduction"
  youtubeVideoId: varchar("youtubeVideoId", { length: 20 }).notNull(),
  videoDurationMinutes: int("videoDurationMinutes"),
  transcriptContent: text("transcriptContent"),
  orderIndex: int("orderIndex").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * User progress for individual module sections
 */
export const userSectionProgress = mysqlTable("userSectionProgress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  sectionId: int("sectionId").notNull(),
  videoWatched: boolean("videoWatched").default(false).notNull(),
  transcriptViewed: boolean("transcriptViewed").default(false).notNull(),
  assessmentCompleted: boolean("assessmentCompleted").default(false).notNull(),
  assessmentScore: int("assessmentScore"),
  completedAt: timestamp("completedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Email invitations whitelist - only invited emails can access the platform
 */
export const invitations = mysqlTable("invitations", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  invitedBy: int("invitedBy").notNull(), // Admin user ID who sent invitation
  status: mysqlEnum("status", ["pending", "accepted", "revoked"]).default("pending").notNull(),
  invitedAt: timestamp("invitedAt").defaultNow().notNull(),
  acceptedAt: timestamp("acceptedAt"),
  revokedAt: timestamp("revokedAt"),
  notes: text("notes"), // Optional notes about the invitation
});

export type Invitation = typeof invitations.$inferSelect;
export type InsertInvitation = typeof invitations.$inferInsert;

export type EngagementLog = typeof engagementLogs.$inferSelect;
export type OnboardingDocument = typeof onboardingDocuments.$inferSelect;
export type PatientAppointment = typeof patientAppointments.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type InsertContactMessage = typeof contactMessages.$inferInsert;
export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = typeof certificates.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type ModuleSection = typeof moduleSections.$inferSelect;
export type UserSectionProgress = typeof userSectionProgress.$inferSelect;


/**
 * Patient records for facilitator session booking
 */
export const patients = mysqlTable("patients", {
  id: int("id").autoincrement().primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  dateOfBirth: date("dateOfBirth"),
  referralSource: varchar("referralSource", { length: 255 }),
  notes: text("notes"),
  status: mysqlEnum("status", ["active", "inactive", "completed"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Patient sessions with certified facilitators
 */
export const sessions = mysqlTable("sessions", {
  id: int("id").autoincrement().primaryKey(),
  patientId: int("patientId").notNull(),
  facilitatorId: int("facilitatorId"), // References users table where role = 'facilitator'
  sessionNumber: int("sessionNumber").notNull(), // 1-10 for the 10-session protocol
  scheduledAt: timestamp("scheduledAt"),
  completedAt: timestamp("completedAt"),
  status: mysqlEnum("status", ["pending", "scheduled", "completed", "cancelled"]).default("pending").notNull(),
  zoomLink: varchar("zoomLink", { length: 500 }),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

/**
 * Patient intake assessment responses
 */
export const patientIntakeResponses = mysqlTable("patientIntakeResponses", {
  id: int("id").autoincrement().primaryKey(),
  // Demographics (not scored)
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  age: int("age").notNull(),
  assessmentDate: date("assessmentDate").notNull(),
  gender: varchar("gender", { length: 50 }).notNull(),
  
  // Mental health history (scored - 3 points each)
  hasDepression: boolean("hasDepression").notNull(),
  hasAnxiety: boolean("hasAnxiety").notNull(),
  hasPTSD: boolean("hasPTSD").notNull(),
  takingMedication: boolean("takingMedication").notNull(),
  
  // Symptom severity (scored - 3 points each, scale 1-5)
  sadnessLevel: int("sadnessLevel").notNull(),
  anxietyLevel: int("anxietyLevel").notNull(),
  irritabilityLevel: int("irritabilityLevel").notNull(),
  fatigueLevel: int("fatigueLevel").notNull(),
  motivationLevel: int("motivationLevel").notNull(),
  
  // Music preferences (scored - 3 points each)
  enjoysMusic: boolean("enjoysMusic").notNull(),
  musicFrequency: varchar("musicFrequency", { length: 50 }).notNull(),
  musicGenres: text("musicGenres").notNull(), // Comma-separated
  hasMusicalExperience: boolean("hasMusicalExperience").notNull(),
  hasFormalTraining: boolean("hasFormalTraining").notNull(),
  trainingExperience: varchar("trainingExperience", { length: 50 }),
  musicSoothing: varchar("musicSoothing", { length: 50 }).notNull(),
  musicExpressesEmotions: varchar("musicExpressesEmotions", { length: 50 }).notNull(),
  opennessToMusicTherapy: varchar("opennessToMusicTherapy", { length: 50 }).notNull(),
  
  // Scoring
  totalScore: int("totalScore").notNull(), // Out of 75 points
  passed: boolean("passed").notNull(), // >= 60 points (80%)
  
  // Status
  status: mysqlEnum("status", ["pending", "approved", "denied"]).default("pending").notNull(),
  reviewedBy: int("reviewedBy"), // Admin user ID
  reviewedAt: timestamp("reviewedAt"),
  reviewNotes: text("reviewNotes"),
  
  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Patient = typeof patients.$inferSelect;
export type InsertPatient = typeof patients.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;
export type PatientIntakeResponse = typeof patientIntakeResponses.$inferSelect;
export type InsertPatientIntakeResponse = typeof patientIntakeResponses.$inferInsert;
