import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import * as db from './db';
import * as discussion from './discussion';
import * as analytics from './analytics';
import * as userManagement from './userManagement';
import * as analyticsDb from './analytics-db';
import * as profileDb from './profileDb';
import * as profileCompleteness from './profileCompleteness';
import * as auditLog from './auditLog';
import * as profileExport from './profileExport';
import * as assessmentRetake from './assessmentRetake';
import * as assessmentAnalytics from './assessmentAnalytics';
import * as moduleUnlocking from './moduleUnlocking';
import * as moduleSections from './moduleSections';
import { sendAssessmentPassEmail, sendAssessmentFailEmail, sendModuleCompletionEmail, sendCertificateReadyEmail } from "./email-notifications";
import { generateCertificate, calculateCertificateEligibility } from "./certificate-generator";
import { nanoid } from "nanoid";
import { facilitatorsRouter } from "./routers/facilitators";
import { profileRouter } from "./routers/profile";
import { adminVideoRouter } from "./routers/adminVideo";
import { patientSessionsRouter } from "./routers/patientSessions";
import { patientIntakeRouter } from "./routers/patientIntake";
import { patientIntakeResponses, users } from "../drizzle/schema";
import { getDb } from "./db";
import { eq, desc } from "drizzle-orm";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// Instructor-only procedure
const instructorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'instructor' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Instructor access required' });
  }
  return next({ ctx });
});

// Provider-only procedure
const providerProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'provider' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Provider access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  profile: profileRouter,
  adminVideo: adminVideoRouter,
  patientIntake: patientIntakeRouter,
  
  auditLog: router({
    getUserLog: protectedProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input, ctx }) => {
        // Users can view their own log, admins can view any log
        if (ctx.user.id !== input.userId && ctx.user.role !== 'admin') {
          throw new TRPCError({ code: 'FORBIDDEN', message: 'Cannot view audit log' });
        }
        return await auditLog.getUserAuditLog(input.userId);
      }),
  }),
  
  profileCompleteness: router({
    check: protectedProcedure.query(async ({ ctx }) => {
      return await profileCompleteness.canAccessTraining(ctx.user.id);
    }),
    
    getCompleteness: protectedProcedure.query(async ({ ctx }) => {
      return await profileCompleteness.calculateProfileCompleteness(ctx.user.id);
    }),
  }),
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateOnboarding: protectedProcedure
      .input(z.object({
        agreedToTerms: z.boolean().optional(),
        agreedToBaa: z.boolean().optional(),
        status: z.enum(['pending', 'active', 'suspended', 'completed']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserOnboarding(ctx.user.id, input);
        return { success: true };
      }),
    updateProfile: protectedProcedure
      .input(z.object({
        profileImageUrl: z.string().url().optional().nullable(),
        calendarLink: z.string().url().optional().nullable(),
        bio: z.string().optional().nullable(),
        specializations: z.string().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserProfile(ctx.user.id, input);
        return { success: true };
      }),
  }),

  modules: router({
    getAll: protectedProcedure.query(async () => {
      return await db.getAllModules();
    }),
    
    getUnlockStatus: protectedProcedure
      .query(async ({ ctx }) => {
        return await moduleUnlocking.getUserModuleUnlockStatus(ctx.user.id);
      }),
    
    checkUnlock: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await moduleUnlocking.isModuleUnlocked(ctx.user.id, input.moduleId);
      }),
    
    // Section endpoints
    getSections: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return await moduleSections.getModuleSections(input.moduleId);
      }),
    
    getSectionProgress: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await moduleSections.getUserModuleSectionProgress(ctx.user.id, input.moduleId);
      }),
    
    updateSectionProgress: protectedProcedure
      .input(z.object({
        sectionId: z.number(),
        videoWatched: z.boolean().optional(),
        transcriptViewed: z.boolean().optional(),
        assessmentCompleted: z.boolean().optional(),
        assessmentScore: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { sectionId, ...updates } = input;
        return await moduleSections.updateSectionProgress(ctx.user.id, sectionId, updates);
      }),
    getById: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        return await db.getModuleById(input.moduleId);
      }),
    getProgress: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getUserModuleProgress(ctx.user.id, input.moduleId);
      }),
    getAllProgress: protectedProcedure.query(async ({ ctx }) => {
      return await db.getAllUserProgress(ctx.user.id);
    }),
    updateProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        videoWatched: z.boolean().optional(),
        videoWatchPercentage: z.number().optional(),
        transcriptViewed: z.boolean().optional(),
        assessmentCompleted: z.boolean().optional(),
        assessmentScore: z.number().optional(),
        status: z.enum(['not_started', 'in_progress', 'completed']).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { moduleId, ...updates } = input;
        
        const existing = await db.getUserModuleProgress(ctx.user.id, moduleId);
        
        const data: any = {
          userId: ctx.user.id,
          moduleId,
          ...updates,
          lastAccessedAt: new Date(),
        };

        if (!existing) {
          data.startedAt = new Date();
          if (!data.status) {
            data.status = 'in_progress';
          }
        }

        await db.upsertUserModuleProgress(data);
        return { success: true };
      }),
    
    // Video progress tracking
    saveVideoProgress: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        lastPosition: z.number(),
        watchPercentage: z.number(),
        totalWatchTimeSeconds: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.upsertVideoProgress(ctx.user.id, input);
      }),
    
    getVideoProgress: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.getVideoProgress(ctx.user.id, input.moduleId);
      }),
    
    checkPrerequisite: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await db.checkModulePrerequisite(ctx.user.id, input.moduleId);
      }),
  }),

  assessments: router({
    getBySection: protectedProcedure
      .input(z.object({ sectionId: z.number() }))
      .query(async ({ input }) => {
        return await moduleSections.getSectionAssessments(input.sectionId);
      }),
    getByModule: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ input }) => {
        const questions = await db.getAssessmentsByModuleId(input.moduleId);
        
        const questionsWithOptions = await Promise.all(
          questions.map(async (q) => {
            const options = await db.getAssessmentOptions(q.id);
            return { ...q, options };
          })
        );
        
        return questionsWithOptions;
      }),
    getHistory: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        const history = await db.getAssessmentHistory(ctx.user.id, input.moduleId);
        return history;
      }),
    
    checkRetakeEligibility: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await assessmentRetake.checkRetakeEligibility(ctx.user.id, input.moduleId);
      }),
    
    getAttemptHistory: protectedProcedure
      .input(z.object({ moduleId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await assessmentRetake.getAttemptHistory(ctx.user.id, input.moduleId);
      }),

    submit: protectedProcedure
      .input(z.object({
        moduleId: z.number(),
        attemptNumber: z.number(),
        responses: z.array(z.object({
          assessmentId: z.number(),
          selectedAnswer: z.string(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        let totalScore = 0;
        let totalPoints = 0;
        const detailedResults: any[] = [];

        const { assessments: assessmentsTable } = await import('../drizzle/schema');
        const { eq: eqOp } = await import('drizzle-orm');
        const dbInstance = await db.getDb();
        
        for (const response of input.responses) {
          const assessment = dbInstance ? await dbInstance.select()
            .from(assessmentsTable)
            .where(eqOp(assessmentsTable.id, response.assessmentId))
            .limit(1) : [];
          
          if (!assessment || assessment.length === 0) continue;
          
          const question = assessment[0];
          totalPoints += question.points;
          
          let isCorrect = false;
          if (question.questionType === 'multiple_choice') {
            isCorrect = response.selectedAnswer === question.correctAnswer;
          } else {
            // Simple keyword matching for short answer
            const keywords = question.correctAnswer?.toLowerCase().split(',').map(k => k.trim()) || [];
            const answer = response.selectedAnswer.toLowerCase();
            isCorrect = keywords.some(keyword => answer.includes(keyword));
          }
          
          const pointsEarned = isCorrect ? question.points : 0;
          totalScore += pointsEarned;

          // Get options for this question
          const options = await db.getAssessmentOptions(response.assessmentId);
          
          detailedResults.push({
            questionId: response.assessmentId,
            questionText: question.questionText,
            selectedAnswer: response.selectedAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            pointsEarned,
            totalPoints: question.points,
            options,
          });

          await db.saveAssessmentResponse({
            userId: ctx.user.id,
            assessmentId: response.assessmentId,
            moduleId: input.moduleId,
            attemptNumber: input.attemptNumber,
            selectedAnswer: response.selectedAnswer,
            isCorrect,
            pointsEarned,
          });
        }

        // Update module progress with retake tracking
        await assessmentRetake.recordAssessmentAttempt(ctx.user.id, input.moduleId, totalScore);
        
        const passed = totalScore >= totalPoints * 0.8;
        
        await db.upsertUserModuleProgress({
          userId: ctx.user.id,
          moduleId: input.moduleId,
          assessmentCompleted: true,
          assessmentScore: totalScore,
          status: passed ? 'completed' : 'in_progress',
          completedAt: passed ? new Date() : undefined,
        });

        // Get module details for email
        const module = await db.getModuleById(input.moduleId);
        const moduleTitle = module?.title || `Module ${input.moduleId}`;
        
        // Send email notification
        if (ctx.user.email) {
          if (passed) {
            // Send pass email and module completion email
            await sendAssessmentPassEmail(
              ctx.user.name || 'Trainee',
              ctx.user.email,
              moduleTitle,
              input.moduleId,
              totalScore,
              totalPoints
            );
            await sendModuleCompletionEmail(
              ctx.user.name || 'Trainee',
              ctx.user.email,
              moduleTitle,
              input.moduleId
            );
          } else {
            // Send fail email with attempts remaining
            const attemptHistory = await assessmentRetake.getAttemptHistory(ctx.user.id, input.moduleId);
            const maxAttempts = 3;
            const attemptsRemaining = Math.max(0, maxAttempts - attemptHistory.attempts);
            await sendAssessmentFailEmail(
              ctx.user.name || 'Trainee',
              ctx.user.email,
              moduleTitle,
              input.moduleId,
              totalScore,
              totalPoints,
              attemptsRemaining
            );
          }
        }

        return { 
          success: true, 
          score: totalScore, 
          totalPoints,
          passed,
          detailedResults,
        };
      }),
  }),

  engagement: router({
    log: protectedProcedure
      .input(z.object({
        moduleId: z.number().optional(),
        eventType: z.enum([
          'login', 'logout', 'video_play', 'video_pause', 'video_complete',
          'transcript_view', 'assessment_start', 'assessment_submit', 'page_view'
        ]),
        eventData: z.any().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.logEngagement({
          userId: ctx.user.id,
          ...input,
        });
        return { success: true };
      }),
  }),

  liveClasses: router({
    upcoming: protectedProcedure.query(async () => {
      return await db.getUpcomingLiveClasses();
    }),
    getById: protectedProcedure
      .input(z.object({ liveClassId: z.number() }))
      .query(async ({ input }) => {
        return await db.getLiveClassById(input.liveClassId);
      }),
    register: protectedProcedure
      .input(z.object({ liveClassId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.registerForLiveClass(ctx.user.id, input.liveClassId);
        
        // Send registration confirmation email
        const session = await db.getLiveClassById(input.liveClassId);
        if (session) {
          const { sendRegistrationConfirmation } = await import('./liveClassNotifications');
          await sendRegistrationConfirmation({
            sessionTitle: session.title,
            sessionDate: new Date(session.scheduledAt),
            sessionDuration: session.durationMinutes,
            zoomMeetingId: session.zoomMeetingId || '',
            zoomPasscode: session.zoomPasscode || undefined,
            zoomJoinUrl: session.zoomJoinUrl || '',
            traineeEmail: ctx.user.email || '',
            traineeName: ctx.user.name || 'Trainee',
          });
        }
        
        return { success: true };
      }),
    myClasses: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserLiveClasses(ctx.user.id);
    }),
  }),

  admin: router({
    getAllVideoProgress: adminProcedure
      .query(async () => {
        return await db.getAllVideoProgress();
      }),
    
    // Invitation management
    getAllInvitations: adminProcedure
      .query(async () => {
        return await db.getAllInvitations();
      }),
    
    createInvitation: adminProcedure
      .input(z.object({
        email: z.string().email(),
        notes: z.string().optional()
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createInvitation(input.email, ctx.user.id, input.notes);
        return { success: true };
      }),
    
    revokeInvitation: adminProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        await db.revokeInvitation(input.email);
        return { success: true };
      }),
    
    assessmentAnalytics: router({
      getQuestionAnalytics: protectedProcedure
        .input(z.object({ moduleId: z.number().optional() }))
        .use(async ({ ctx, next }) => {
          if (ctx.user.role !== 'admin' && ctx.user.role !== 'instructor') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or instructor access required' });
          }
          return next({ ctx });
        })
        .query(async ({ input }) => {
          return await assessmentAnalytics.getQuestionAnalytics(input.moduleId);
        }),
      
      getModuleSummary: protectedProcedure
        .use(async ({ ctx, next }) => {
          if (ctx.user.role !== 'admin' && ctx.user.role !== 'instructor') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or instructor access required' });
          }
          return next({ ctx });
        })
        .query(async () => {
          return await assessmentAnalytics.getModuleAnalyticsSummary();
        }),
      
      getLowPerformanceQuestions: protectedProcedure
        .use(async ({ ctx, next }) => {
          if (ctx.user.role !== 'admin' && ctx.user.role !== 'instructor') {
            throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or instructor access required' });
          }
          return next({ ctx });
        })
        .query(async () => {
          return await assessmentAnalytics.getLowPerformanceQuestions();
        }),
    }),

    stats: adminProcedure.query(async () => {
      return await db.getSystemStats();
    }),
    users: adminProcedure.query(async () => {
      return await db.getAllUsers();
    }),
    usersByRole: adminProcedure
      .input(z.object({ 
        role: z.enum(['admin', 'instructor', 'provider', 'trainee', 'facilitator']) 
      }))
      .query(async ({ input }) => {
        return await db.getUsersByRole(input.role);
      }),
    
    // User management actions
    suspendUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await userManagement.suspendUser(input.userId);
        return { success: true, message: 'User suspended successfully' };
      }),
    
    activateUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await userManagement.activateUser(input.userId);
        return { success: true, message: 'User activated successfully' };
      }),
    
    softDeleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        const canDelete = await userManagement.canDeleteUser(input.userId);
        if (!canDelete.canDelete) {
          throw new TRPCError({ code: 'FORBIDDEN', message: canDelete.reason || 'Cannot delete user' });
        }
        await userManagement.softDeleteUser(input.userId);
        return { success: true, message: 'User deleted successfully (can be restored)' };
      }),
    
    restoreUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await userManagement.restoreUser(input.userId);
        return { success: true, message: 'User restored successfully' };
      }),
    
    hardDeleteUser: adminProcedure
      .input(z.object({ userId: z.number(), confirmEmail: z.string() }))
      .mutation(async ({ input }) => {
        const canDelete = await userManagement.canDeleteUser(input.userId);
        if (!canDelete.canDelete) {
          throw new TRPCError({ code: 'FORBIDDEN', message: canDelete.reason || 'Cannot delete user' });
        }
        
        // Get user email to verify confirmation
        const users = await db.getAllUsers();
        const user = users.find(u => u.id === input.userId);
        if (!user) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        
        if (user.email !== input.confirmEmail) {
          throw new TRPCError({ code: 'BAD_REQUEST', message: 'Email confirmation does not match' });
        }
        
        await userManagement.hardDeleteUser(input.userId);
        return { success: true, message: 'User permanently deleted' };
      }),
    
    // Analytics endpoints
    traineeAnalytics: adminProcedure.query(async () => {
      return await analyticsDb.getTraineeAnalytics();
    }),
    
    traineeProgressWithProfile: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await analyticsDb.getTraineeProgressWithProfile(input.userId);
      }),
    
    allTraineesWithProgress: adminProcedure.query(async () => {
      return await analyticsDb.getAllTraineesWithProgress();
    }),
    
    getTraineeProfile: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        const profile = await profileDb.getUserProfile(input.userId);
        
        if (!profile) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'User not found' });
        }
        
        return {
          user: profile,
          education: profile.education,
          employment: profile.employment,
        };
      }),
    
    exportTraineeProgress: adminProcedure
      .input(z.object({ userIds: z.array(z.number()).optional() }))
      .query(async ({ input }) => {
        return await analyticsDb.getTraineeProgressExportData(input.userIds);
      }),
    
    exportProfilesCSV: adminProcedure
      .input(z.object({ userIds: z.array(z.number()).optional() }))
      .query(async ({ input }) => {
        return await profileExport.exportProfilesToCSV(input.userIds);
      }),
    
    exportDetailedProfilesCSV: adminProcedure
      .input(z.object({ userIds: z.array(z.number()).optional() }))
      .query(async ({ input }) => {
        return await profileExport.exportDetailedProfilesToCSV(input.userIds);
      }),
    
    exportProfilesHTML: adminProcedure
      .input(z.object({ userIds: z.array(z.number()).optional() }))
      .query(async ({ input }) => {
        return await profileExport.exportProfilesToHTML(input.userIds);
      }),

    // Patient intake assessment management
    getPendingAssessments: adminProcedure.query(async () => {
      const dbInstance = await getDb();
      if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
      const assessments = await dbInstance
        .select()
        .from(patientIntakeResponses)
        .orderBy(desc(patientIntakeResponses.createdAt));
      return assessments;
    }),

    approvePatientAssessment: adminProcedure
      .input(z.object({ assessmentId: z.number(), reviewNotes: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const dbInstance = await getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        // Get assessment
        const assessment = await dbInstance
          .select()
          .from(patientIntakeResponses)
          .where(eq(patientIntakeResponses.id, input.assessmentId))
          .limit(1)
          .then(rows => rows[0]);

        if (!assessment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
        }

        if (assessment.status !== "pending") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Assessment already processed" });
        }

        // Create patient user account
        const email = `${assessment.firstName.toLowerCase()}.${assessment.lastName.toLowerCase()}@patient.soundbridge.temp`;
        const tempPassword = Math.random().toString(36).slice(-8);
        const openId = `patient_${nanoid()}`; // Generate unique openId for patient

        await dbInstance.insert(users).values({
          openId,
          name: `${assessment.firstName} ${assessment.lastName}`,
          role: "patient",
        });

        // Update assessment status
        await dbInstance
          .update(patientIntakeResponses)
          .set({ 
            status: "approved",
            reviewNotes: input.reviewNotes,
            reviewedAt: new Date(),
            reviewedBy: ctx.user.id,
          })
          .where(eq(patientIntakeResponses.id, input.assessmentId));

        // TODO: Send email notification to patient with login credentials
        // await notifyOwner({
        //   title: "Patient Approved",
        //   content: `${assessment.firstName} ${assessment.lastName} has been approved. Email: ${email}, Temp Password: ${tempPassword}`
        // });

        return { success: true, email, tempPassword };
      }),

    denyPatientAssessment: adminProcedure
      .input(z.object({ assessmentId: z.number(), reviewNotes: z.string().optional() }))
      .mutation(async ({ input, ctx }) => {
        const dbInstance = await getDb();
        if (!dbInstance) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });
        
        // Get assessment
        const assessment = await dbInstance
          .select()
          .from(patientIntakeResponses)
          .where(eq(patientIntakeResponses.id, input.assessmentId))
          .limit(1)
          .then(rows => rows[0]);

        if (!assessment) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Assessment not found" });
        }

        if (assessment.status !== "pending") {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Assessment already processed" });
        }

        // Update assessment status
        await dbInstance
          .update(patientIntakeResponses)
          .set({ 
            status: "denied",
            reviewNotes: input.reviewNotes,
            reviewedAt: new Date(),
            reviewedBy: ctx.user.id,
          })
          .where(eq(patientIntakeResponses.id, input.assessmentId));

        // TODO: Send email notification to patient about denial and self-pay option
        // await notifyOwner({
        //   title: "Patient Denied",
        //   content: `${assessment.firstName} ${assessment.lastName} assessment was denied. They should contact provider for self-pay options.`
        // });

        return { success: true };
      }),
  }),

  instructor: router({
    trainees: instructorProcedure.query(async () => {
      return await db.getUsersByRole('trainee');
    }),
    traineeProgress: instructorProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await db.getAllUserProgress(input.userId);
      }),
    liveSessions: instructorProcedure.query(async () => {
      return await db.getAllLiveSessions();
    }),
    sessionParticipants: instructorProcedure
      .input(z.object({ liveClassId: z.number() }))
      .query(async ({ input }) => {
        return await db.getSessionParticipants(input.liveClassId);
      }),
    createLiveSession: instructorProcedure
      .input(z.object({
        classType: z.enum(['review_3', 'review_6', 'review_9']),
        title: z.string(),
        description: z.string().optional(),
        scheduledAt: z.date(),
        durationMinutes: z.number(),
        zoomMeetingId: z.string(),
        zoomPasscode: z.string().optional(),
        zoomJoinUrl: z.string(),
        zoomStartUrl: z.string().optional(),
        maxParticipants: z.number(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await db.createLiveSession({
          ...input,
          instructorId: ctx.user.id,
        });
      }),
    updateLiveSession: instructorProcedure
      .input(z.object({
        liveClassId: z.number(),
        scheduledAt: z.date().optional(),
        durationMinutes: z.number().optional(),
        zoomMeetingId: z.string().optional(),
        zoomPasscode: z.string().optional(),
        zoomJoinUrl: z.string().optional(),
        zoomStartUrl: z.string().optional(),
        status: z.enum(['scheduled', 'live', 'completed', 'cancelled']).optional(),
        recordingUrl: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        return await db.updateLiveSession(input.liveClassId, input);
      }),
    markAttendance: instructorProcedure
      .input(z.object({
        attendanceId: z.number(),
        status: z.enum(['registered', 'attended', 'missed', 'cancelled']),
      }))
      .mutation(async ({ input }) => {
        return await db.updateAttendanceStatus(input.attendanceId, input.status);
      }),
  }),

  provider: router({
    myFacilitators: providerProcedure.query(async ({ ctx }) => {
      return await db.getUsersByProvider(ctx.user.id);
    }),
  }),

  facilitators: facilitatorsRouter,
  patientSessions: patientSessionsRouter,

  // Discussion forum
  // Analytics
  analytics: router({
    myMetrics: protectedProcedure.query(async ({ ctx }) => {
      return await analytics.calculateProgressMetrics(ctx.user.id);
    }),
    moduleBreakdown: protectedProcedure.query(async ({ ctx }) => {
      return await analytics.getModuleBreakdown(ctx.user.id);
    }),
  }),

  discussion: router({
    topics: publicProcedure
      .input(z.object({
        category: z.string().optional(),
        moduleId: z.number().optional(),
        search: z.string().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await discussion.getAllTopics(input);
      }),
    topicById: publicProcedure
      .input(z.object({ topicId: z.number() }))
      .query(async ({ input }) => {
        const topic = await discussion.getTopicById(input.topicId);
        if (topic) {
          await discussion.incrementTopicViews(input.topicId);
        }
        return topic;
      }),
    createTopic: protectedProcedure
      .input(z.object({
        title: z.string().min(5).max(255),
        content: z.string().min(10),
        category: z.enum(['general', 'module_question', 'technical_support', 'success_story', 'best_practices']),
        moduleId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await discussion.createTopic({
          ...input,
          authorId: ctx.user.id,
        });
      }),
    updateTopic: instructorProcedure
      .input(z.object({
        topicId: z.number(),
        isPinned: z.boolean().optional(),
        isLocked: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        return await discussion.updateTopic(input.topicId, {
          isPinned: input.isPinned,
          isLocked: input.isLocked,
        });
      }),
    deleteTopic: instructorProcedure
      .input(z.object({ topicId: z.number() }))
      .mutation(async ({ input }) => {
        return await discussion.deleteTopic(input.topicId);
      }),
    replies: publicProcedure
      .input(z.object({ topicId: z.number() }))
      .query(async ({ input }) => {
        return await discussion.getTopicReplies(input.topicId);
      }),
    createReply: protectedProcedure
      .input(z.object({
        topicId: z.number(),
        parentReplyId: z.number().optional(),
        content: z.string().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        return await discussion.createReply({
          ...input,
          authorId: ctx.user.id,
        });
      }),
    deleteReply: protectedProcedure
      .input(z.object({ replyId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        // TODO: Add authorization check (only author or instructor can delete)
        return await discussion.deleteReply(input.replyId);
      }),
    toggleLike: protectedProcedure
      .input(z.object({
        topicId: z.number().optional(),
        replyId: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return await discussion.toggleLike({
          userId: ctx.user.id,
          topicId: input.topicId,
          replyId: input.replyId,
        });
      }),
    userLikes: protectedProcedure
      .input(z.object({ topicId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await discussion.getUserLikes(ctx.user.id, input.topicId);
      }),
  }),

  certificates: router({
    // Get user's certificate if it exists
    getMyCertificate: protectedProcedure.query(async ({ ctx }) => {
      return await db.getCertificateByUserId(ctx.user.id);
    }),
    
    // Check if user is eligible for certificate
    checkEligibility: protectedProcedure.query(async ({ ctx }) => {
      const allProgress = await db.getAllUserProgress(ctx.user.id);
      return calculateCertificateEligibility(allProgress);
    }),
    
    // Generate certificate (only if eligible)
    generate: protectedProcedure.mutation(async ({ ctx }) => {
      // Check if certificate already exists
      const existing = await db.getCertificateByUserId(ctx.user.id);
      if (existing) {
        return { success: true, certificate: existing };
      }
      
      // Check eligibility
      const allProgress = await db.getAllUserProgress(ctx.user.id);
      const eligibility = calculateCertificateEligibility(allProgress);
      
      if (!eligibility.eligible) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `You must complete all ${eligibility.completedModules}/10 modules to receive a certificate.`
        });
      }
      
      // Generate certificate
      const certificateId = nanoid(16);
      const { url: certificateUrl } = await generateCertificate({
        traineeName: ctx.user.name || 'Trainee',
        completionDate: new Date(),
        averageScore: eligibility.averageScore,
        certificateId
      });
      
      // Save to database
      await db.createCertificate({
        userId: ctx.user.id,
        certificateId,
        certificateUrl,
        averageScore: eligibility.averageScore,
        completionDate: new Date()
      });
      
      // Send email notification
      if (ctx.user.email) {
        await sendCertificateReadyEmail(
          ctx.user.name || 'Trainee',
          ctx.user.email,
          certificateUrl,
          eligibility.averageScore,
          new Date()
        );
      }
      
      const certificate = await db.getCertificateByUserId(ctx.user.id);
      return { success: true, certificate };
    }),
  }),
});

export type AppRouter = typeof appRouter;
