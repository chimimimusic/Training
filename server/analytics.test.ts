import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createTestContext(user: AuthenticatedUser): TrpcContext {
  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Admin Analytics System", () => {
  const mockAdmin: AuthenticatedUser = {
    id: 1,
    openId: "admin-123",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    agreedToTerms: true,
    agreedToBaa: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const mockTrainee: AuthenticatedUser = {
    id: 2,
    openId: "trainee-123",
    name: "Trainee User",
    email: "trainee@example.com",
    role: "trainee",
    agreedToTerms: true,
    agreedToBaa: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  describe("Access Control", () => {
    it("should allow admin to access trainee analytics", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const analytics = await caller.admin.traineeAnalytics();
      
      expect(analytics).toBeDefined();
      expect(analytics).toHaveProperty("totalTrainees");
      expect(analytics).toHaveProperty("avgCompletionRate");
    });

    it("should deny non-admin from accessing trainee analytics", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.traineeAnalytics()
      ).rejects.toThrow("Admin access required");
    });

    it("should allow admin to access all trainees with progress", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const trainees = await caller.admin.allTraineesWithProgress();
      
      expect(Array.isArray(trainees)).toBe(true);
    });

    it("should deny non-admin from accessing all trainees with progress", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.allTraineesWithProgress()
      ).rejects.toThrow("Admin access required");
    });
  });

  describe("Analytics Endpoints", () => {
    it("should return trainee analytics with correct structure", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const analytics = await caller.admin.traineeAnalytics();
      
      expect(analytics).toHaveProperty("totalTrainees");
      expect(analytics).toHaveProperty("activeTrainees");
      expect(analytics).toHaveProperty("completedTrainees");
      expect(analytics).toHaveProperty("avgCompletionRate");
      expect(analytics).toHaveProperty("avgDaysToComplete");
      expect(analytics).toHaveProperty("moduleStats");
      
      if (analytics) {
        expect(typeof analytics.totalTrainees).toBe("number");
        expect(typeof analytics.avgCompletionRate).toBe("number");
        expect(Array.isArray(analytics.moduleStats)).toBe(true);
      }
    });

    it("should return trainee progress with profile data", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      // Get a real trainee ID
      const trainees = await caller.admin.allTraineesWithProgress();
      
      if (trainees.length > 0) {
        const traineeId = trainees[0].id;
        const data = await caller.admin.traineeProgressWithProfile({ userId: traineeId });
        
        expect(data).toHaveProperty("user");
        expect(data).toHaveProperty("progress");
        expect(data).toHaveProperty("stats");
        expect(data.user).toHaveProperty("email");
        expect(Array.isArray(data.progress)).toBe(true);
      }
    });

    it("should return export data with correct format", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const exportData = await caller.admin.exportTraineeProgress({});
      
      expect(Array.isArray(exportData)).toBe(true);
      
      if (exportData.length > 0) {
        const firstRow = exportData[0];
        expect(firstRow).toHaveProperty("name");
        expect(firstRow).toHaveProperty("email");
        expect(firstRow).toHaveProperty("status");
        expect(firstRow).toHaveProperty("completionPercentage");
        expect(firstRow).toHaveProperty("avgAssessmentScore");
      }
    });
  });

  describe("Data Validation", () => {
    it("should handle trainee progress query with valid user ID", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const trainees = await caller.admin.allTraineesWithProgress();
      
      if (trainees.length > 0) {
        const result = await caller.admin.traineeProgressWithProfile({ 
          userId: trainees[0].id 
        });
        
        expect(result).toBeDefined();
      }
    });

    it("should handle trainee progress query with invalid user ID", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.traineeProgressWithProfile({ 
        userId: 99999 
      });
      
      expect(result).toBeNull();
    });

    it("should validate export data includes all required fields", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const exportData = await caller.admin.exportTraineeProgress({});
      
      exportData.forEach(row => {
        expect(row).toHaveProperty("name");
        expect(row).toHaveProperty("email");
        expect(row).toHaveProperty("status");
        expect(row).toHaveProperty("enrollmentDate");
        expect(row).toHaveProperty("completedModules");
        expect(row).toHaveProperty("totalModules");
        expect(row).toHaveProperty("completionPercentage");
        expect(row).toHaveProperty("avgAssessmentScore");
        expect(row).toHaveProperty("profileCompleted");
        expect(row).toHaveProperty("lastActivity");
      });
    });
  });

  describe("Endpoint Availability", () => {
    it("should have traineeAnalytics endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.traineeAnalytics).toBeDefined();
    });

    it("should have traineeProgressWithProfile endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.traineeProgressWithProfile).toBeDefined();
    });

    it("should have allTraineesWithProgress endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.allTraineesWithProgress).toBeDefined();
    });

    it("should have exportTraineeProgress endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.exportTraineeProgress).toBeDefined();
    });
  });

  describe("Input Validation", () => {
    it("should require userId for traineeProgressWithProfile", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.traineeProgressWithProfile({ userId: null as any })
      ).rejects.toThrow();
    });

    it("should accept optional userIds array for export", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.exportTraineeProgress({ userIds: [1, 2] });
      
      expect(Array.isArray(result)).toBe(true);
    });

    it("should accept empty input for export (all trainees)", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.admin.exportTraineeProgress({});
      
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
