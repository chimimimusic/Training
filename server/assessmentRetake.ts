import { getDb } from "./db";
import { userModuleProgress, userAssessmentResponses } from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

const RETAKE_WAIT_HOURS = 24;

/**
 * Check if user can retake an assessment
 * Returns eligibility status and time remaining if blocked
 */
export async function checkRetakeEligibility(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, moduleId)
    ))
    .limit(1);

  if (!progress.length) {
    return {
      canRetake: true,
      reason: "first_attempt",
      hoursRemaining: 0
    };
  }

  const userProgress = progress[0];

  // If never attempted, can take
  if (!userProgress.lastAttemptAt) {
    return {
      canRetake: true,
      reason: "first_attempt",
      hoursRemaining: 0
    };
  }

  // Check if 24 hours have passed
  const lastAttempt = new Date(userProgress.lastAttemptAt);
  const now = new Date();
  const hoursSinceLastAttempt = (now.getTime() - lastAttempt.getTime()) / (1000 * 60 * 60);

  if (hoursSinceLastAttempt < RETAKE_WAIT_HOURS) {
    return {
      canRetake: false,
      reason: "waiting_period",
      hoursRemaining: Math.ceil(RETAKE_WAIT_HOURS - hoursSinceLastAttempt),
      lastAttemptAt: userProgress.lastAttemptAt
    };
  }

  return {
    canRetake: true,
    reason: "retake_allowed",
    hoursRemaining: 0
  };
}

/**
 * Get attempt history for a user's module assessment
 */
export async function getAttemptHistory(userId: number, moduleId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, moduleId)
    ))
    .limit(1);

  if (!progress.length) {
    return {
      attempts: 0,
      highestScore: null,
      lastScore: null,
      lastAttemptAt: null
    };
  }

  const userProgress = progress[0];

  return {
    attempts: userProgress.assessmentAttempts || 0,
    highestScore: userProgress.highestScore || null,
    lastScore: userProgress.assessmentScore || null,
    lastAttemptAt: userProgress.lastAttemptAt || null
  };
}

/**
 * Update progress after assessment completion
 */
export async function recordAssessmentAttempt(
  userId: number,
  moduleId: number,
  score: number
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, moduleId)
    ))
    .limit(1);
  
  if (!progress.length) {
    // Create new progress record
    await db.insert(userModuleProgress).values({
      userId,
      moduleId,
      assessmentCompleted: true,
      assessmentScore: score,
      assessmentAttempts: 1,
      lastAttemptAt: new Date(),
      highestScore: score
    });
    return;
  }

  const userProgress = progress[0];
  const newAttempts = (userProgress.assessmentAttempts || 0) + 1;
  const newHighestScore = Math.max(userProgress.highestScore || 0, score);

  await db
    .update(userModuleProgress)
    .set({
      assessmentCompleted: true,
      assessmentScore: score,
      assessmentAttempts: newAttempts,
      lastAttemptAt: new Date(),
      highestScore: newHighestScore
    })
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, moduleId)
    ));
}
