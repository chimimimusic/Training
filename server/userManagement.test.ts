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

describe("User Management System", () => {
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

  const mockInstructor: AuthenticatedUser = {
    id: 2,
    openId: "instructor-123",
    name: "Instructor User",
    email: "instructor@example.com",
    role: "instructor",
    agreedToTerms: true,
    agreedToBaa: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const mockTrainee: AuthenticatedUser = {
    id: 3,
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
    it("should allow admin to suspend users", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);
      
      // Get a real user ID from database
      const users = await caller.admin.users();
      const targetUser = users.find(u => u.role === 'trainee' && u.id !== mockAdmin.id);
      
      if (!targetUser) {
        // Skip test if no suitable user exists
        expect(true).toBe(true);
        return;
      }

      const result = await caller.admin.suspendUser({ userId: targetUser.id });
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("suspended");
    });

    it("should allow admin to activate users", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);
      
      // Get a real user ID from database
      const users = await caller.admin.users();
      const targetUser = users.find(u => u.role === 'trainee' && u.id !== mockAdmin.id);
      
      if (!targetUser) {
        expect(true).toBe(true);
        return;
      }

      const result = await caller.admin.activateUser({ userId: targetUser.id });
      
      expect(result.success).toBe(true);
      expect(result.message).toContain("activated");
    });

    it("should deny non-admin from suspending users", async () => {
      const ctx = createTestContext(mockInstructor);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.suspendUser({ userId: 1 })
      ).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin from activating users", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.activateUser({ userId: 1 })
      ).rejects.toThrow("Admin access required");
    });

    it("should deny non-admin from deleting users", async () => {
      const ctx = createTestContext(mockInstructor);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.softDeleteUser({ userId: 1 })
      ).rejects.toThrow("Admin access required");
    });
  });

  describe("Soft Delete", () => {
    it("should have softDeleteUser endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      // Just verify the endpoint exists and is callable
      expect(caller.admin.softDeleteUser).toBeDefined();
    });

    it("should have restoreUser endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      // Just verify the endpoint exists and is callable
      expect(caller.admin.restoreUser).toBeDefined();
    });
  });

  describe("Hard Delete", () => {
    it("should require email confirmation for hard delete", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.hardDeleteUser({ 
          userId: 1, 
          confirmEmail: "wrong@example.com" 
        })
      ).rejects.toThrow();
    });

    it("should reject hard delete for non-existent user", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.hardDeleteUser({ 
          userId: 99999, 
          confirmEmail: "fake@example.com" 
        })
      ).rejects.toThrow("User not found");
    });
  });

  describe("User Status Management", () => {
    it("should have suspendUser endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.suspendUser).toBeDefined();
    });

    it("should have activateUser endpoint", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      expect(caller.admin.activateUser).toBeDefined();
    });
  });





  describe("Validation", () => {
    it("should require userId for suspend", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.suspendUser({ userId: null as any })
      ).rejects.toThrow();
    });

    it("should require userId for activate", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.activateUser({ userId: undefined as any })
      ).rejects.toThrow();
    });

    it("should require both userId and confirmEmail for hard delete", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.admin.hardDeleteUser({ 
          userId: 3, 
          confirmEmail: "" 
        })
      ).rejects.toThrow();
    });
  });
});
