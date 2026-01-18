import { getDb } from "./db";
import { moduleSections, userSectionProgress, assessments, assessmentOptions } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Get all sections for a module
 */
export async function getModuleSections(moduleId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const sections = await db
    .select()
    .from(moduleSections)
    .where(eq(moduleSections.moduleId, moduleId))
    .orderBy(moduleSections.orderIndex);
  
  return sections;
}

/**
 * Get a specific section by ID
 */
export async function getSectionById(sectionId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const section = await db
    .select()
    .from(moduleSections)
    .where(eq(moduleSections.id, sectionId))
    .limit(1);
  
  return section[0] || null;
}

/**
 * Get user's progress for a specific section
 */
export async function getUserSectionProgress(userId: number, sectionId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const progress = await db
    .select()
    .from(userSectionProgress)
    .where(
      and(
        eq(userSectionProgress.userId, userId),
        eq(userSectionProgress.sectionId, sectionId)
      )
    )
    .limit(1);
  
  return progress[0] || null;
}

/**
 * Get all user's section progress for a module
 */
export async function getUserModuleSectionProgress(userId: number, moduleId: number) {
  const db = await getDb();
  
  // Get all sections for the module
  const sections = await getModuleSections(moduleId);
  
  // Get progress for each section
  const progressData = await Promise.all(
    sections.map(async (section: any) => {
      const progress = await getUserSectionProgress(userId, section.id);
      return {
        section,
        progress: progress || {
          videoWatched: false,
          transcriptViewed: false,
          assessmentCompleted: false,
          assessmentScore: null,
        },
      };
    })
  );
  
  return progressData;
}

/**
 * Update user's section progress
 */
export async function updateSectionProgress(
  userId: number,
  sectionId: number,
  updates: {
    videoWatched?: boolean;
    transcriptViewed?: boolean;
    assessmentCompleted?: boolean;
    assessmentScore?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  // Check if progress record exists
  const existing = await getUserSectionProgress(userId, sectionId);
  
  if (existing) {
    // Update existing record
    await db
      .update(userSectionProgress)
      .set({
        ...updates,
        updatedAt: new Date(),
        completedAt:
          updates.videoWatched &&
          updates.transcriptViewed &&
          updates.assessmentCompleted
            ? new Date()
            : existing.completedAt,
      })
      .where(eq(userSectionProgress.id, existing.id));
  } else {
    // Create new record
    await db.insert(userSectionProgress).values({
      userId,
      sectionId,
      videoWatched: updates.videoWatched || false,
      transcriptViewed: updates.transcriptViewed || false,
      assessmentCompleted: updates.assessmentCompleted || false,
      assessmentScore: updates.assessmentScore || null,
      completedAt:
        updates.videoWatched &&
        updates.transcriptViewed &&
        updates.assessmentCompleted
          ? new Date()
          : null,
    });
  }
  
  return await getUserSectionProgress(userId, sectionId);
}

/**
 * Get assessment questions for a section
 */
export async function getSectionAssessments(sectionId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  
  const questions = await db
    .select()
    .from(assessments)
    .where(eq(assessments.sectionId, sectionId))
    .orderBy(assessments.questionNumber);
  
  // Get options for each question
  const questionsWithOptions = await Promise.all(
    questions.map(async (question: any) => {
      const options = await db
        .select()
        .from(assessmentOptions)
        .where(eq(assessmentOptions.assessmentId, question.id));
      
      return {
        ...question,
        options,
      };
    })
  );
  
  return questionsWithOptions;
}

/**
 * Check if all sections in a module are completed
 */
export async function isModuleFullyCompleted(userId: number, moduleId: number): Promise<boolean> {
  
  // Get all sections for the module
  const sections = await getModuleSections(moduleId);
  
  if (sections.length === 0) {
    return false;
  }
  
  // Check if all sections are completed
  for (const section of sections) {
    const progress = await getUserSectionProgress(userId, section.id);
    
    if (
      !progress ||
      !progress.videoWatched ||
      !progress.transcriptViewed ||
      !progress.assessmentCompleted
    ) {
      return false;
    }
  }
  
  return true;
}
