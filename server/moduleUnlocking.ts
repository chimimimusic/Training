import { getDb } from "./db";
import { userModuleProgress, modules } from "../drizzle/schema";
import { eq, and, lt } from "drizzle-orm";

const PASSING_SCORE_PERCENTAGE = 80;

/**
 * Check if a module is unlocked for a user
 * Module 1 is always unlocked
 * Other modules require 80% score on previous module
 */
export async function isModuleUnlocked(userId: number, moduleId: number): Promise<{
  unlocked: boolean;
  reason: string;
  requiredScore?: number;
  currentScore?: number;
  previousModuleId?: number;
}> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Module 1 is always unlocked
  if (moduleId === 1) {
    return {
      unlocked: true,
      reason: "first_module"
    };
  }

  // Get previous module (moduleId - 1)
  const previousModuleId = moduleId - 1;
  
  // Check if previous module exists
  const previousModule = await db
    .select()
    .from(modules)
    .where(eq(modules.id, previousModuleId))
    .limit(1);

  if (!previousModule.length) {
    // If previous module doesn't exist, unlock current module
    return {
      unlocked: true,
      reason: "no_previous_module"
    };
  }

  // Get user's progress on previous module
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(and(
      eq(userModuleProgress.userId, userId),
      eq(userModuleProgress.moduleId, previousModuleId)
    ))
    .limit(1);

  if (!progress.length || !progress[0].assessmentCompleted) {
    return {
      unlocked: false,
      reason: "previous_module_incomplete",
      previousModuleId,
      requiredScore: PASSING_SCORE_PERCENTAGE
    };
  }

  const userProgress = progress[0];
  const score = userProgress.highestScore || userProgress.assessmentScore || 0;

  // Check if score meets 80% requirement
  // Assuming assessments are out of 100 points
  if (score < PASSING_SCORE_PERCENTAGE) {
    return {
      unlocked: false,
      reason: "score_too_low",
      previousModuleId,
      requiredScore: PASSING_SCORE_PERCENTAGE,
      currentScore: score
    };
  }

  return {
    unlocked: true,
    reason: "requirements_met",
    previousModuleId,
    currentScore: score
  };
}

/**
 * Get all modules with their unlock status for a user
 */
export async function getUserModuleUnlockStatus(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const allModules = await db
    .select()
    .from(modules)
    .orderBy(modules.id);

  const modulesWithStatus = await Promise.all(
    allModules.map(async (module) => {
      const unlockStatus = await isModuleUnlocked(userId, module.id);
      return {
        ...module,
        ...unlockStatus
      };
    })
  );

  return modulesWithStatus;
}

/**
 * Get next unlocked module for a user
 */
export async function getNextUnlockedModule(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const allModules = await db
    .select()
    .from(modules)
    .orderBy(modules.id);

  for (const module of allModules) {
    const unlockStatus = await isModuleUnlocked(userId, module.id);
    
    // Check if module is unlocked but not completed
    const progress = await db
      .select()
      .from(userModuleProgress)
      .where(and(
        eq(userModuleProgress.userId, userId),
        eq(userModuleProgress.moduleId, module.id)
      ))
      .limit(1);

    const isCompleted = progress.length > 0 && progress[0].status === 'completed';

    if (unlockStatus.unlocked && !isCompleted) {
      return {
        ...module,
        ...unlockStatus
      };
    }
  }

  return null; // All modules completed
}
