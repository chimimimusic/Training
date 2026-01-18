import { getDb } from "./db";
import { assessments, userAssessmentResponses, assessmentOptions, modules } from "../drizzle/schema";
import { eq, and, sql, desc } from "drizzle-orm";

/**
 * Get question-level analytics for all modules or specific module
 */
export async function getQuestionAnalytics(moduleId?: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Build query for all responses
  let query = db
    .select({
      assessmentId: userAssessmentResponses.assessmentId,
      questionText: assessments.questionText,
      moduleId: assessments.moduleId,
      totalAttempts: sql<number>`COUNT(*)`,
      correctAttempts: sql<number>`SUM(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 1 ELSE 0 END)`,
      percentCorrect: sql<number>`ROUND(SUM(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)`,
    })
    .from(userAssessmentResponses)
    .innerJoin(assessments, eq(userAssessmentResponses.assessmentId, assessments.id))
    .groupBy(userAssessmentResponses.assessmentId, assessments.questionText, assessments.moduleId);

  if (moduleId) {
    query = query.where(eq(assessments.moduleId, moduleId)) as any;
  }

  const results = await query;

  // Get wrong answer distribution for each question
  const analyticsWithWrongAnswers = await Promise.all(
    results.map(async (result) => {
      const wrongAnswers = await getWrongAnswerDistribution(result.assessmentId);
      return {
        ...result,
        wrongAnswers
      };
    })
  );

  return analyticsWithWrongAnswers;
}

/**
 * Get distribution of wrong answers for a specific question
 */
async function getWrongAnswerDistribution(assessmentId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const wrongAnswers = await db
    .select({
      selectedAnswer: userAssessmentResponses.selectedAnswer,
      count: sql<number>`COUNT(*)`,
    })
    .from(userAssessmentResponses)
    .where(and(
      eq(userAssessmentResponses.assessmentId, assessmentId),
      eq(userAssessmentResponses.isCorrect, false)
    ))
    .groupBy(userAssessmentResponses.selectedAnswer)
    .orderBy(desc(sql`COUNT(*)`));

  // Get option text for each wrong answer
  const wrongAnswersWithText = await Promise.all(
    wrongAnswers.map(async (wa) => {
      const option = await db
        .select()
        .from(assessmentOptions)
        .where(and(
          eq(assessmentOptions.assessmentId, assessmentId),
          eq(assessmentOptions.optionLetter, wa.selectedAnswer)
        ))
        .limit(1);

      return {
        letter: wa.selectedAnswer,
        text: option[0]?.optionText || wa.selectedAnswer,
        count: wa.count
      };
    })
  );

  return wrongAnswersWithText;
}

/**
 * Get module-level analytics summary
 */
export async function getModuleAnalyticsSummary() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const moduleStats = await db
    .select({
      moduleId: assessments.moduleId,
      moduleTitle: modules.title,
      totalQuestions: sql<number>`COUNT(DISTINCT ${assessments.id})`,
      avgPercentCorrect: sql<number>`ROUND(AVG(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 100.0 ELSE 0.0 END), 2)`,
      totalAttempts: sql<number>`COUNT(${userAssessmentResponses.id})`,
      questionsBelow50: sql<number>`SUM(CASE WHEN (
        SELECT SUM(CASE WHEN ur2.isCorrect THEN 1 ELSE 0 END) * 100.0 / COUNT(*)
        FROM userAssessmentResponses ur2
        WHERE ur2.assessmentId = ${assessments.id}
      ) < 50 THEN 1 ELSE 0 END)`
    })
    .from(assessments)
    .leftJoin(userAssessmentResponses, eq(assessments.id, userAssessmentResponses.assessmentId))
    .leftJoin(modules, eq(assessments.moduleId, modules.id))
    .groupBy(assessments.moduleId, modules.title)
    .orderBy(assessments.moduleId);

  return moduleStats;
}

/**
 * Get average time per question (if we track timing in the future)
 */
export async function getAverageTimePerQuestion(moduleId: number) {
  // Placeholder for future implementation when we add timing tracking
  return {
    moduleId,
    avgTimeSeconds: null,
    message: "Time tracking not yet implemented"
  };
}

/**
 * Get questions with low success rates (< 50%)
 */
export async function getLowPerformanceQuestions() {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const lowPerformanceQuestions = await db
    .select({
      assessmentId: userAssessmentResponses.assessmentId,
      questionText: assessments.questionText,
      moduleId: assessments.moduleId,
      moduleTitle: modules.title,
      percentCorrect: sql<number>`ROUND(SUM(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)`,
      totalAttempts: sql<number>`COUNT(*)`
    })
    .from(userAssessmentResponses)
    .innerJoin(assessments, eq(userAssessmentResponses.assessmentId, assessments.id))
    .innerJoin(modules, eq(assessments.moduleId, modules.id))
    .groupBy(userAssessmentResponses.assessmentId, assessments.questionText, assessments.moduleId, modules.title)
    .having(sql`ROUND(SUM(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) < 50`)
    .orderBy(sql`ROUND(SUM(CASE WHEN ${userAssessmentResponses.isCorrect} THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2)`);

  return lowPerformanceQuestions;
}
