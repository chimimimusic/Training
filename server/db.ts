import { eq, and, desc, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users, modules, assessments, assessmentOptions,
  userModuleProgress, userAssessmentResponses, liveClasses,
  liveClassAttendance, engagementLogs, onboardingDocuments,
  contactMessages, InsertContactMessage, certificates, InsertCertificate,
  videoProgress
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getCertifiedFacilitators() {
  const db = await getDb();
  if (!db) return [];
  
  // Get users with role 'facilitator' and status 'completed' who have calendar links
  const result = await db.select().from(users)
    .where(and(
      eq(users.role, 'facilitator'),
      eq(users.status, 'completed')
    ));
  
  return result;
}

export async function createContactMessage(data: InsertContactMessage) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  
  await db.insert(contactMessages).values(data);
}

export async function updateUserOnboarding(userId: number, updates: {
  agreedToTerms?: boolean;
  agreedToBaa?: boolean;
  status?: string;
}) {
  const db = await getDb();
  if (!db) return;

  const updateData: any = {};
  if (updates.agreedToTerms !== undefined) {
    updateData.agreedToTerms = updates.agreedToTerms;
    updateData.termsAgreedAt = new Date();
  }
  if (updates.agreedToBaa !== undefined) {
    updateData.agreedToBaa = updates.agreedToBaa;
    updateData.baaAgreedAt = new Date();
  }
  if (updates.status) {
    updateData.status = updates.status;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
}

export async function updateUserProfile(userId: number, updates: {
  profileImageUrl?: string | null;
  calendarLink?: string | null;
  bio?: string | null;
  specializations?: string | null;
}) {
  const db = await getDb();  
  if (!db) return;

  const updateData: any = {};
  if (updates.profileImageUrl !== undefined) {
    updateData.profileImageUrl = updates.profileImageUrl;
  }
  if (updates.calendarLink !== undefined) {
    updateData.calendarLink = updates.calendarLink;
  }
  if (updates.bio !== undefined) {
    updateData.bio = updates.bio;
  }
  if (updates.specializations !== undefined) {
    updateData.specializations = updates.specializations;
  }

  await db.update(users).set(updateData).where(eq(users.id, userId));
}

// Module queries
export async function getAllModules() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(modules).where(eq(modules.isPublished, true)).orderBy(modules.orderIndex);
}

export async function getModuleById(moduleId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(modules).where(eq(modules.id, moduleId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Assessment queries
export async function getAssessmentsByModuleId(moduleId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(assessments).where(eq(assessments.moduleId, moduleId)).orderBy(assessments.questionNumber);
}

export async function getAssessmentOptions(assessmentId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(assessmentOptions).where(eq(assessmentOptions.assessmentId, assessmentId)).orderBy(assessmentOptions.optionLetter);
}

// User progress queries
export async function getUserModuleProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) {
    return {
      userId,
      moduleId,
      status: 'not_started' as const,
      videoWatched: false,
      videoWatchPercentage: 0,
      transcriptViewed: false,
      assessmentCompleted: false,
      assessmentScore: null,
      attemptCount: 0,
      assessmentAttempts: 0,
      highestScore: null,
      lastAttemptAt: null,
      lastActivityAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  const result = await db.select().from(userModuleProgress)
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, moduleId)
    ))
    .limit(1);
  
  // Return default progress if no record exists
  if (result.length === 0) {
    return {
      userId,
      moduleId,
      status: 'not_started' as const,
      videoWatched: false,
      videoWatchPercentage: 0,
      transcriptViewed: false,
      assessmentCompleted: false,
      assessmentScore: null,
      attemptCount: 0,
      assessmentAttempts: 0,
      highestScore: null,
      lastAttemptAt: null,
      lastActivityAt: null,
      completedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
  
  return result[0];
}

export async function getAllUserProgress(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userModuleProgress).where(eq(userModuleProgress.userId, userId));
}

export async function upsertUserModuleProgress(data: any) {
  const db = await getDb();
  if (!db) return;

  const existing = await getUserModuleProgress(data.userId, data.moduleId);
  
  if (existing) {
    await db.update(userModuleProgress)
      .set({ ...data, updatedAt: new Date() })
      .where(and(
        eq(userModuleProgress.userId, data.userId),
        eq(userModuleProgress.moduleId, data.moduleId)
      ));
  } else {
    await db.insert(userModuleProgress).values(data);
  }
}

// Assessment response queries
export async function saveAssessmentResponse(data: any) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(userAssessmentResponses).values(data);
}

export async function getUserAssessmentResponses(userId: number, moduleId: number, attemptNumber: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(userAssessmentResponses)
    .where(and(
      eq(userAssessmentResponses.userId, userId),
      eq(userAssessmentResponses.moduleId, moduleId),
      eq(userAssessmentResponses.attemptNumber, attemptNumber)
    ));
}

// Engagement logging
export async function logEngagement(data: any) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(engagementLogs).values(data);
}

// Live class queries
export async function getUpcomingLiveClasses() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(liveClasses)
    .where(eq(liveClasses.status, 'scheduled'))
    .orderBy(liveClasses.scheduledAt);
}

export async function getLiveClassById(classId: number) {
  const db = await getDb();
  if (!db) return undefined;
  
  const result = await db.select().from(liveClasses).where(eq(liveClasses.id, classId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function registerForLiveClass(userId: number, classId: number) {
  const db = await getDb();
  if (!db) return;
  
  await db.insert(liveClassAttendance).values({
    liveClassId: classId,
    userId: userId,
    registrationStatus: 'registered',
  });
}

export async function getUserLiveClasses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(liveClassAttendance)
    .innerJoin(liveClasses, eq(liveClassAttendance.liveClassId, liveClasses.id))
    .where(eq(liveClassAttendance.userId, userId));
}

export async function getAllLiveSessions() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(liveClasses).orderBy(desc(liveClasses.scheduledAt));
}

export async function getSessionParticipants(liveClassId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select()
    .from(liveClassAttendance)
    .innerJoin(users, eq(liveClassAttendance.userId, users.id))
    .where(eq(liveClassAttendance.liveClassId, liveClassId));
}

export async function createLiveSession(data: {
  classType: 'review_3' | 'review_6' | 'review_9';
  title: string;
  description?: string;
  instructorId: number;
  scheduledAt: Date;
  durationMinutes: number;
  zoomMeetingId: string;
  zoomPasscode?: string;
  zoomJoinUrl: string;
  zoomStartUrl?: string;
  maxParticipants: number;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const [newSession] = await db.insert(liveClasses).values({
    ...data,
    currentParticipants: 0,
    status: 'scheduled',
  });
  
  return newSession;
}

export async function updateLiveSession(liveClassId: number, data: {
  scheduledAt?: Date;
  durationMinutes?: number;
  zoomMeetingId?: string;
  zoomPasscode?: string;
  zoomJoinUrl?: string;
  zoomStartUrl?: string;
  status?: 'scheduled' | 'live' | 'completed' | 'cancelled';
  recordingUrl?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db.update(liveClasses)
    .set(data)
    .where(eq(liveClasses.id, liveClassId));
  
  return { success: true };
}

export async function updateAttendanceStatus(
  attendanceId: number,
  status: 'registered' | 'attended' | 'missed' | 'cancelled'
) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  await db.update(liveClassAttendance)
    .set({ registrationStatus: status })
    .where(eq(liveClassAttendance.id, attendanceId));
  
  return { success: true };
}

// User management queries (for admin/instructor dashboards)
export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUsersByRole(role: 'admin' | 'instructor' | 'provider' | 'trainee' | 'facilitator') {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).where(eq(users.role, role));
}

export async function getUsersByProvider(providerId: number) {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(users).where(eq(users.providerId, providerId));
}

// Analytics queries
export async function getSystemStats() {
  const db = await getDb();
  if (!db) return null;
  
  const totalUsers = await db.select({ count: sql<number>`count(*)` }).from(users);
  const activeTrainees = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(and(eq(users.role, 'trainee'), eq(users.status, 'active')));
  const completedFacilitators = await db.select({ count: sql<number>`count(*)` })
    .from(users)
    .where(and(eq(users.role, 'facilitator'), eq(users.status, 'completed')));
  
  return {
    totalUsers: totalUsers[0]?.count || 0,
    activeTrainees: activeTrainees[0]?.count || 0,
    completedFacilitators: completedFacilitators[0]?.count || 0,
  };
}

/**
 * Create a new certificate record
 */
export async function createCertificate(certificate: InsertCertificate) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create certificate: database not available");
    return null;
  }

  const result = await db.insert(certificates).values(certificate);
  return result;
}

/**
 * Get certificate by user ID
 */
export async function getCertificateByUserId(userId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificate: database not available");
    return null;
  }

  const result = await db.select()
    .from(certificates)
    .where(eq(certificates.userId, userId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get certificate by certificate ID
 */
export async function getCertificateByCertificateId(certificateId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get certificate: database not available");
    return null;
  }

  const result = await db.select()
    .from(certificates)
    .where(eq(certificates.certificateId, certificateId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get assessment history for a user and module
 */
export async function getAssessmentHistory(userId: number, moduleId: number) {
  const progress = await getUserModuleProgress(userId, moduleId);
  
  if (!progress || !progress.assessmentScore) {
    return {
      attempts: 0,
      bestScore: null,
      bestPercentage: null,
      passed: false,
      lastAttemptDate: null
    };
  }

  // Calculate percentage from score (assuming score is already a percentage or we need to fetch total points separately)
  const percentage = progress.assessmentScore ? Math.round(progress.assessmentScore) : null;

  return {
    attempts: progress.assessmentAttempts || 0,
    bestScore: progress.assessmentScore,
    bestPercentage: percentage,
    passed: progress.assessmentCompleted || false,
    lastAttemptDate: progress.updatedAt
  };
}

/**
 * Video progress tracking functions
 */

export async function upsertVideoProgress(userId: number, data: {
  moduleId: number;
  lastPosition: number;
  watchPercentage: number;
  totalWatchTimeSeconds: number;
}) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert video progress: database not available");
    return null;
  }

  
  // Check if record exists
  const existing = await db.select()
    .from(videoProgress)
    .where(and(
      eq(videoProgress.userId, userId),
      eq(videoProgress.moduleId, data.moduleId)
    ))
    .limit(1);

  const now = new Date();
  
  if (existing.length > 0) {
    // Update existing record
    const currentRecord = existing[0];
    await db.update(videoProgress)
      .set({
        lastPosition: data.lastPosition,
        watchPercentage: data.watchPercentage,
        totalWatchTimeSeconds: data.totalWatchTimeSeconds,
        completionCount: data.watchPercentage >= 95 ? (currentRecord.completionCount || 0) + 1 : currentRecord.completionCount,
        lastWatchedAt: now,
        updatedAt: now,
      })
      .where(and(
        eq(videoProgress.userId, userId),
        eq(videoProgress.moduleId, data.moduleId)
      ));
  } else {
    // Insert new record
    await db.insert(videoProgress).values({
      userId,
      moduleId: data.moduleId,
      lastPosition: data.lastPosition,
      watchPercentage: data.watchPercentage,
      totalWatchTimeSeconds: data.totalWatchTimeSeconds,
      completionCount: data.watchPercentage >= 95 ? 1 : 0,
      firstWatchedAt: now,
      lastWatchedAt: now,
    });
  }

  return { success: true };
}

export async function getVideoProgress(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get video progress: database not available");
    return null;
  }

  
  const result = await db.select()
    .from(videoProgress)
    .where(and(
      eq(videoProgress.userId, userId),
      eq(videoProgress.moduleId, moduleId)
    ))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Check if a module's prerequisite is met
 * Module N requires Module N-1 to be completed (video watched + assessment passed with 80%+)
 */
export async function checkModulePrerequisite(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot check prerequisite: database not available");
    return { isUnlocked: true, reason: "Database unavailable" };
  }

  // Module 1 is always unlocked
  if (moduleId === 1) {
    return { isUnlocked: true, reason: "First module" };
  }

  // Check if previous module (moduleId - 1) is completed
  const previousModuleId = moduleId - 1;
  const progress = await getUserModuleProgress(userId, previousModuleId);

  if (!progress) {
    return { 
      isUnlocked: false, 
      reason: `You must complete Module ${previousModuleId} first`,
      requiredModule: previousModuleId
    };
  }

  // Check if video was watched
  if (!progress.videoWatched) {
    return { 
      isUnlocked: false, 
      reason: `You must watch the video in Module ${previousModuleId}`,
      requiredModule: previousModuleId
    };
  }

  // Check if assessment was passed (80% or higher)
  if (!progress.assessmentCompleted || !progress.assessmentScore || progress.assessmentScore < 80) {
    return { 
      isUnlocked: false, 
      reason: `You must pass the assessment in Module ${previousModuleId} with 80% or higher`,
      requiredModule: previousModuleId
    };
  }

  return { isUnlocked: true, reason: "Prerequisites met" };
}

/**
 * Get all video progress for admin analytics
 */
export async function getAllVideoProgress() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get all video progress: database not available");
    return [];
  }

  
  const results = await db.select({
    userId: videoProgress.userId,
    moduleId: videoProgress.moduleId,
    lastPosition: videoProgress.lastPosition,
    watchPercentage: videoProgress.watchPercentage,
    totalWatchTimeSeconds: videoProgress.totalWatchTimeSeconds,
    completionCount: videoProgress.completionCount,
    lastWatchedAt: videoProgress.lastWatchedAt,
    firstWatchedAt: videoProgress.firstWatchedAt,
    userName: users.name,
    userEmail: users.email,
    moduleTitle: modules.title,
  })
  .from(videoProgress)
  .leftJoin(users, eq(videoProgress.userId, users.id))
  .leftJoin(modules, eq(videoProgress.moduleId, modules.id))
  .orderBy(videoProgress.lastWatchedAt);

  return results;
}


// ============================================
// Invitation Management Functions
// ============================================

export async function getInvitationByEmail(email: string) {
  const db = await getDb();
  if (!db) return null;
  
  const { invitations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  const results = await db.select().from(invitations).where(eq(invitations.email, email)).limit(1);
  return results[0] || null;
}

export async function acceptInvitation(email: string) {
  const db = await getDb();
  if (!db) return;
  
  const { invitations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  await db.update(invitations)
    .set({ 
      status: "accepted",
      acceptedAt: new Date()
    })
    .where(eq(invitations.email, email));
}

export async function createInvitation(email: string, invitedBy: number, notes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { invitations } = await import("../drizzle/schema");
  
  await db.insert(invitations).values({
    email,
    invitedBy,
    notes: notes || null,
    status: "pending"
  });
}

export async function revokeInvitation(email: string) {
  const db = await getDb();
  if (!db) return;
  
  const { invitations } = await import("../drizzle/schema");
  const { eq } = await import("drizzle-orm");
  
  await db.update(invitations)
    .set({ 
      status: "revoked",
      revokedAt: new Date()
    })
    .where(eq(invitations.email, email));
}

export async function getAllInvitations() {
  const db = await getDb();
  if (!db) return [];
  
  const { invitations } = await import("../drizzle/schema");
  
  return await db.select().from(invitations);
}

// ==================== VIDEO MANAGEMENT ====================

export async function updateModuleVideo(
  moduleId: number,
  videoUrl: string,
  videoType: "youtube" | "direct",
  videoDurationMinutes?: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { eq } = await import("drizzle-orm");
  
  await db.update(modules)
    .set({
      videoUrl,
      videoType,
      videoDurationMinutes: videoDurationMinutes || null,
      updatedAt: new Date(),
    })
    .where(eq(modules.id, moduleId));
}

export async function updateLiveClassRecording(
  liveClassId: number,
  recordingUrl: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const { eq } = await import("drizzle-orm");
  
  await db.update(liveClasses)
    .set({
      recordingUrl,
      updatedAt: new Date(),
    })
    .where(eq(liveClasses.id, liveClassId));
}

export async function getAllModulesForAdmin() {
  const db = await getDb();
  if (!db) return [];
  
  const { asc } = await import("drizzle-orm");
  
  return await db.select().from(modules).orderBy(asc(modules.orderIndex));
}

export async function getAllLiveClasses() {
  const db = await getDb();
  if (!db) return [];
  
  return await db.select().from(liveClasses);
}
