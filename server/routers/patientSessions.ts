import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { patients, sessions, users } from "../../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";

// Facilitator-only procedure
const facilitatorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'facilitator' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Facilitator access required' });
  }
  return next({ ctx });
});

export const patientSessionsRouter = router({
  // Create a new patient
  createPatient: facilitatorProcedure
    .input(z.object({
      firstName: z.string().min(1),
      lastName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      dateOfBirth: z.string().optional(), // YYYY-MM-DD format
      referralSource: z.string().optional(),
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [patient] = await db.insert(patients).values({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone,
        dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : undefined,
        referralSource: input.referralSource,
        notes: input.notes,
        status: "active",
      });

      return patient;
    }),

  // Get all patients for current facilitator
  getMyPatients: facilitatorProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Get all patients who have sessions with this facilitator
      const patientList = await db
        .select({
          patient: patients,
          sessionCount: sessions.id,
        })
        .from(patients)
        .leftJoin(sessions, and(
          eq(sessions.patientId, patients.id),
          eq(sessions.facilitatorId, ctx.user.id)
        ))
        .where(eq(patients.status, "active"))
        .groupBy(patients.id)
        .orderBy(desc(patients.createdAt));

      return patientList;
    }),

  // Get patient details with all sessions
  getPatientDetails: facilitatorProcedure
    .input(z.object({ patientId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [patient] = await db
        .select()
        .from(patients)
        .where(eq(patients.id, input.patientId))
        .limit(1);

      if (!patient) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Patient not found" });
      }

      const patientSessions = await db
        .select()
        .from(sessions)
        .where(and(
          eq(sessions.patientId, input.patientId),
          eq(sessions.facilitatorId, ctx.user.id)
        ))
        .orderBy(sessions.sessionNumber);

      return {
        patient,
        sessions: patientSessions,
      };
    }),

  // Create a new session for a patient
  createSession: facilitatorProcedure
    .input(z.object({
      patientId: z.number(),
      sessionNumber: z.number().min(1).max(10),
      scheduledAt: z.string().optional(), // ISO datetime string
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Use DEFAULT_ZOOM_LINK from environment
      const zoomLink = process.env.DEFAULT_ZOOM_LINK || "https://zoom.us/j/placeholder";

      const [session] = await db.insert(sessions).values({
        patientId: input.patientId,
        facilitatorId: ctx.user.id,
        sessionNumber: input.sessionNumber,
        scheduledAt: input.scheduledAt ? new Date(input.scheduledAt) : undefined,
        status: input.scheduledAt ? "scheduled" : "pending",
        zoomLink,
        notes: input.notes,
      });

      return session;
    }),

  // Update session status
  updateSessionStatus: facilitatorProcedure
    .input(z.object({
      sessionId: z.number(),
      status: z.enum(["pending", "scheduled", "completed", "cancelled"]),
      completedAt: z.string().optional(), // ISO datetime string
      notes: z.string().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      await db
        .update(sessions)
        .set({
          status: input.status,
          completedAt: input.completedAt ? new Date(input.completedAt) : undefined,
          notes: input.notes,
        })
        .where(and(
          eq(sessions.id, input.sessionId),
          eq(sessions.facilitatorId, ctx.user.id)
        ));

      const [session] = await db.select().from(sessions).where(eq(sessions.id, input.sessionId)).limit(1);

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }

      return session;
    }),

  // Get Zoom link for a session (for joining)
  getSessionZoomLink: facilitatorProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const [session] = await db
        .select()
        .from(sessions)
        .where(and(
          eq(sessions.id, input.sessionId),
          eq(sessions.facilitatorId, ctx.user.id)
        ))
        .limit(1);

      if (!session) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Session not found" });
      }

      return {
        zoomLink: session.zoomLink,
        sessionNumber: session.sessionNumber,
        status: session.status,
      };
    }),
});
