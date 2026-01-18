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

describe("Profile Management System", () => {
  // Mock users
  const mockTrainee: AuthenticatedUser = {
    id: 1,
    openId: "trainee-123",
    name: "John Doe",
    email: "john@example.com",
    role: "trainee",
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
    name: "Jane Smith",
    email: "jane@example.com",
    role: "instructor",
    agreedToTerms: true,
    agreedToBaa: true,
    status: "active",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const mockAdmin: AuthenticatedUser = {
    id: 3,
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

  describe("Profile Retrieval", () => {
    it("should allow user to get their own profile", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.profile.getMyProfile();
      
      expect(profile).toBeDefined();
      expect(profile?.id).toBe(mockTrainee.id);
    });

    it("should return profile with education and employment arrays", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.profile.getMyProfile();
      
      expect(profile).toHaveProperty("education");
      expect(profile).toHaveProperty("employment");
      expect(Array.isArray(profile?.education)).toBe(true);
      expect(Array.isArray(profile?.employment)).toBe(true);
    });

    it("should allow instructor to view user profiles", async () => {
      const ctx = createTestContext(mockInstructor);
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.profile.getUserProfile({ userId: mockTrainee.id });
      
      expect(profile).toBeDefined();
    });

    it("should allow admin to view user profiles", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.profile.getUserProfile({ userId: mockTrainee.id });
      
      expect(profile).toBeDefined();
    });

    it("should deny trainee from viewing other user profiles", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.getUserProfile({ userId: 999 })
      ).rejects.toThrow("Admin or instructor access required");
    });

    it("should allow instructor to get all profiles", async () => {
      const ctx = createTestContext(mockInstructor);
      const caller = appRouter.createCaller(ctx);

      const profiles = await caller.profile.getAllProfiles();
      
      expect(Array.isArray(profiles)).toBe(true);
    });

    it("should deny trainee from getting all profiles", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.getAllProfiles()
      ).rejects.toThrow("Admin or instructor access required");
    });
  });

  describe("Profile Updates", () => {
    it("should update personal information", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateProfile({
        firstName: "John",
        lastName: "Doe",
        phone: "(555) 123-4567",
        age: 35,
        gender: "Male",
      });

      expect(result.success).toBe(true);
    });

    it("should update address information", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateProfile({
        streetAddress: "123 Main Street",
        unitNumber: "Apt 4B",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
      });

      expect(result.success).toBe(true);
    });

    it("should update education level", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateProfile({
        highestEducation: "masters",
      });

      expect(result.success).toBe(true);
    });

    it("should validate state code length", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.updateProfile({
          state: "CAL", // Invalid: too long
        })
      ).rejects.toThrow();
    });

    it("should validate age range", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.updateProfile({
          age: 15, // Invalid: too young
        })
      ).rejects.toThrow();
    });

    it("should validate recovery email format", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.updateProfile({
          recoveryEmail: "invalid-email", // Invalid format
        })
      ).rejects.toThrow();
    });
  });

  describe("Education Management", () => {
    it("should add education entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEducation({
        degree: "Bachelor of Science",
        institution: "University of California",
        fieldOfStudy: "Psychology",
        graduationYear: 2015,
      });

      expect(result.success).toBe(true);
    });

    it("should add education with current enrollment", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEducation({
        degree: "Master of Social Work",
        institution: "UCLA",
        isCurrentlyEnrolled: true,
      });

      expect(result.success).toBe(true);
    });

    it("should validate graduation year range", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.addEducation({
          degree: "PhD",
          institution: "MIT",
          graduationYear: 1900, // Too old
        })
      ).rejects.toThrow();
    });

    it("should update education entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateEducation({
        id: 1,
        graduationYear: 2016,
      });

      expect(result.success).toBe(true);
    });

    it("should delete education entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.deleteEducation({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe("Employment Management", () => {
    it("should add employment entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEmployment({
        jobTitle: "Clinical Social Worker",
        employer: "ABC Healthcare",
        startDate: "2020-01",
        endDate: "2023-12",
        responsibilities: "Provided counseling services to patients",
      });

      expect(result.success).toBe(true);
    });

    it("should add current employment", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEmployment({
        jobTitle: "Senior Therapist",
        employer: "XYZ Mental Health",
        startDate: "2024-01",
        isCurrentJob: true,
      });

      expect(result.success).toBe(true);
    });

    it("should validate date format", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.addEmployment({
          jobTitle: "Counselor",
          employer: "Test Org",
          startDate: "2020/01/01", // Invalid format
        })
      ).rejects.toThrow();
    });

    it("should update employment entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.updateEmployment({
        id: 1,
        endDate: "2024-01",
        isCurrentJob: false,
      });

      expect(result.success).toBe(true);
    });

    it("should delete employment entry", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.deleteEmployment({ id: 1 });

      expect(result.success).toBe(true);
    });
  });

  describe("Role-Based Access Control", () => {
    it("should allow admin to view all profiles", async () => {
      const ctx = createTestContext(mockAdmin);
      const caller = appRouter.createCaller(ctx);

      const profiles = await caller.profile.getAllProfiles();
      
      expect(Array.isArray(profiles)).toBe(true);
    });

    it("should allow instructor to view trainee profiles", async () => {
      const ctx = createTestContext(mockInstructor);
      const caller = appRouter.createCaller(ctx);

      const profile = await caller.profile.getUserProfile({ userId: mockTrainee.id });
      
      expect(profile).toBeDefined();
    });

    it("should prevent trainee from viewing instructor profiles", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.getUserProfile({ userId: mockInstructor.id })
      ).rejects.toThrow("Admin or instructor access required");
    });

    it("should allow users to only modify their own education", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      // This should succeed (own profile)
      const result = await caller.profile.addEducation({
        degree: "Test Degree",
        institution: "Test University",
      });

      expect(result.success).toBe(true);
    });

    it("should allow users to only modify their own employment", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      // This should succeed (own profile)
      const result = await caller.profile.addEmployment({
        jobTitle: "Test Job",
        employer: "Test Employer",
        startDate: "2020-01",
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Data Validation", () => {
    it("should accept valid education data", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEducation({
        degree: "Test Degree",
        institution: "Test University",
      });

      expect(result.success).toBe(true);
    });

    it("should accept valid employment data", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      const result = await caller.profile.addEmployment({
        jobTitle: "Test Job",
        employer: "Test Employer",
        startDate: "2020-01",
      });

      expect(result.success).toBe(true);
    });

    it("should validate education enum values", async () => {
      const ctx = createTestContext(mockTrainee);
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.profile.updateProfile({
          highestEducation: "invalid" as any,
        })
      ).rejects.toThrow();
    });
  });
});
