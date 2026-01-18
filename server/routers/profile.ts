import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { router, protectedProcedure } from "../_core/trpc";
import * as profileDb from "../profileDb";
import * as auditLog from "../auditLog";

// Admin or instructor procedure
const adminOrInstructorProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin' && ctx.user.role !== 'instructor') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin or instructor access required' });
  }
  return next({ ctx });
});

export const profileRouter = router({
  // Get own profile
  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    return await profileDb.getUserProfile(ctx.user.id);
  }),

  // Get any user's profile (admin/instructor only)
  getUserProfile: adminOrInstructorProcedure
    .input(z.object({ userId: z.number() }))
    .query(async ({ input }) => {
      return await profileDb.getUserProfile(input.userId);
    }),

  // Get all user profiles (admin/instructor only)
  getAllProfiles: adminOrInstructorProcedure.query(async () => {
    return await profileDb.getAllUserProfiles();
  }),

  // Update own profile
  updateProfile: protectedProcedure
    .input(z.object({
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
      streetAddress: z.string().optional(),
      unitNumber: z.string().optional(),
      city: z.string().optional(),
      state: z.string().length(2).optional(),
      zipCode: z.string().optional(),
      recoveryEmail: z.string().email().optional(),
      age: z.number().int().min(18).max(120).optional(),
      gender: z.string().optional(),
      highestEducation: z.enum(["phd", "masters", "lcsw", "bachelors", "associates", "some_college", "high_school", "other"]).optional(),
      profileImageUrl: z.string().url().optional(),
      bio: z.string().optional(),
      specializations: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Get old profile data for audit log
      const oldProfile = await profileDb.getUserProfile(ctx.user.id);
      
      // Update profile
      await profileDb.updateUserProfile(ctx.user.id, input);
      
      // Log changes
      if (oldProfile) {
        await auditLog.logObjectChanges({
          userId: ctx.user.id,
          changedBy: ctx.user.id,
          tableName: 'users',
          oldData: oldProfile,
          newData: { ...oldProfile, ...input },
          changeType: 'update',
        });
      }
      
      return { success: true };
    }),

  // Education management
  addEducation: protectedProcedure
    .input(z.object({
      degree: z.string(),
      fieldOfStudy: z.string().optional(),
      institution: z.string(),
      graduationYear: z.number().int().min(1950).max(2100).optional(),
      isCurrentlyEnrolled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await profileDb.addEducation({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  updateEducation: protectedProcedure
    .input(z.object({
      id: z.number(),
      degree: z.string().optional(),
      fieldOfStudy: z.string().optional(),
      institution: z.string().optional(),
      graduationYear: z.number().int().min(1950).max(2100).optional(),
      isCurrentlyEnrolled: z.boolean().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await profileDb.updateEducation(id, ctx.user.id, data);
      return { success: true };
    }),

  deleteEducation: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await profileDb.deleteEducation(input.id, ctx.user.id);
      return { success: true };
    }),

  // Employment management
  addEmployment: protectedProcedure
    .input(z.object({
      jobTitle: z.string(),
      employer: z.string(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/), // YYYY-MM format
      endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(), // YYYY-MM format
      isCurrentJob: z.boolean().optional(),
      responsibilities: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      await profileDb.addEmployment({
        userId: ctx.user.id,
        ...input,
      });
      return { success: true };
    }),

  updateEmployment: protectedProcedure
    .input(z.object({
      id: z.number(),
      jobTitle: z.string().optional(),
      employer: z.string().optional(),
      startDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      endDate: z.string().regex(/^\d{4}-\d{2}$/).optional(),
      isCurrentJob: z.boolean().optional(),
      responsibilities: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const { id, ...data } = input;
      await profileDb.updateEmployment(id, ctx.user.id, data);
      return { success: true };
    }),

  deleteEmployment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await profileDb.deleteEmployment(input.id, ctx.user.id);
      return { success: true };
    }),
});
