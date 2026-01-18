import { router, protectedProcedure } from "../_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { storagePut } from "../storage";
import * as db from "../db";

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const adminVideoRouter = router({
  /**
   * Upload video file to S3 and return URL
   * Client should send base64-encoded video data
   */
  uploadVideo: adminProcedure
    .input(
      z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        contentType: z.string(),
        moduleId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        // Decode base64 to buffer
        const buffer = Buffer.from(input.fileData, "base64");

        // Generate unique file key
        const timestamp = Date.now();
        const sanitizedName = input.fileName.replace(/[^a-zA-Z0-9.-]/g, "_");
        const fileKey = `training-videos/${timestamp}-${sanitizedName}`;

        // Upload to S3
        const { url } = await storagePut(fileKey, buffer, input.contentType);

        return {
          success: true,
          videoUrl: url,
          fileKey,
        };
      } catch (error) {
        console.error("Video upload error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload video",
        });
      }
    }),

  /**
   * Update module to use direct video URL instead of YouTube
   */
  updateModuleVideo: adminProcedure
    .input(
      z.object({
        moduleId: z.number(),
        videoUrl: z.string(),
        videoType: z.enum(["youtube", "direct"]),
        videoDurationMinutes: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await db.updateModuleVideo(
          input.moduleId,
          input.videoUrl,
          input.videoType,
          input.videoDurationMinutes
        );

        return { success: true };
      } catch (error) {
        console.error("Module video update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update module video",
        });
      }
    }),

  /**
   * Update live class recording URL
   */
  updateLiveClassRecording: adminProcedure
    .input(
      z.object({
        liveClassId: z.number(),
        recordingUrl: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await db.updateLiveClassRecording(input.liveClassId, input.recordingUrl);

        return { success: true };
      } catch (error) {
        console.error("Live class recording update error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update recording URL",
        });
      }
    }),

  /**
   * Get all modules for admin management
   */
  getAllModules: adminProcedure.query(async () => {
    try {
      const allModules = await db.getAllModulesForAdmin();
      return allModules;
    } catch (error) {
      console.error("Get modules error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch modules",
      });
    }
  }),

  /**
   * Get all live classes for admin management
   */
  getAllLiveClasses: adminProcedure.query(async () => {
    try {
      const allClasses = await db.getAllLiveClasses();
      return allClasses;
    } catch (error) {
      console.error("Get live classes error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch live classes",
      });
    }
  }),
});
