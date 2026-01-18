import { z } from "zod";
import { publicProcedure, router } from "../_core/trpc";
import { patientIntakeResponses } from "../../drizzle/schema";
import { getDb } from "../db";
import { eq } from "drizzle-orm";

export const patientIntakeRouter = router({
  /**
   * Submit patient intake assessment
   */
  submitAssessment: publicProcedure
    .input(z.object({
      firstName: z.string(),
      lastName: z.string(),
      age: z.number(),
      assessmentDate: z.string(),
      gender: z.string(),
      hasDepression: z.boolean(),
      hasAnxiety: z.boolean(),
      hasPTSD: z.boolean(),
      takingMedication: z.boolean(),
      sadnessLevel: z.number(),
      anxietyLevel: z.number(),
      irritabilityLevel: z.number(),
      fatigueLevel: z.number(),
      motivationLevel: z.number(),
      enjoysMusic: z.boolean(),
      musicFrequency: z.string(),
      musicGenres: z.string(),
      hasMusicalExperience: z.boolean(),
      hasFormalTraining: z.boolean(),
      trainingExperience: z.string().nullable(),
      musicSoothing: z.string(),
      musicExpressesEmotions: z.string(),
      opennessToMusicTherapy: z.string(),
      totalScore: z.number(),
      passed: z.boolean(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db.insert(patientIntakeResponses).values({
        firstName: input.firstName,
        lastName: input.lastName,
        age: input.age,
        assessmentDate: new Date(input.assessmentDate),
        gender: input.gender,
        hasDepression: input.hasDepression,
        hasAnxiety: input.hasAnxiety,
        hasPTSD: input.hasPTSD,
        takingMedication: input.takingMedication,
        sadnessLevel: input.sadnessLevel,
        anxietyLevel: input.anxietyLevel,
        irritabilityLevel: input.irritabilityLevel,
        fatigueLevel: input.fatigueLevel,
        motivationLevel: input.motivationLevel,
        enjoysMusic: input.enjoysMusic,
        musicFrequency: input.musicFrequency,
        musicGenres: input.musicGenres,
        hasMusicalExperience: input.hasMusicalExperience,
        hasFormalTraining: input.hasFormalTraining,
        trainingExperience: input.trainingExperience,
        musicSoothing: input.musicSoothing,
        musicExpressesEmotions: input.musicExpressesEmotions,
        opennessToMusicTherapy: input.opennessToMusicTherapy,
        totalScore: input.totalScore,
        passed: input.passed,
        status: input.passed ? "approved" : "pending",
      });

      return {
        id: result.insertId,
        passed: input.passed,
        score: input.totalScore,
      };
    }),

  /**
   * Get assessment result by ID
   */
  getAssessmentResult: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [result] = await db
        .select()
        .from(patientIntakeResponses)
        .where(eq(patientIntakeResponses.id, input.id));

      return result;
    }),
});
