import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createMockContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "trainee",
    status: "active",
    agreedToTerms: true,
    agreedToBaa: true,
    termsAgreedAt: new Date(),
    baaAgreedAt: new Date(),
    providerId: null,
    bio: null,
    specializations: null,
    calendarLink: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user: user ? { ...defaultUser, ...user } : defaultUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("LMS Authentication & Onboarding", () => {
  it("should return current user info", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.me();

    expect(result).toBeDefined();
    expect(result?.email).toBe("test@example.com");
    expect(result?.role).toBe("trainee");
  });

  it("should update onboarding status", async () => {
    const ctx = createMockContext({ agreedToTerms: false, agreedToBaa: false });
    const caller = appRouter.createCaller(ctx);

    const result = await caller.auth.updateOnboarding({
      agreedToTerms: true,
      agreedToBaa: true,
      status: "active",
    });

    expect(result.success).toBe(true);
  });
});

describe("Module Management", () => {
  it("should list all published modules", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const modules = await caller.modules.getAll();

    expect(Array.isArray(modules)).toBe(true);
    expect(modules.length).toBeGreaterThan(0);
    expect(modules[0]).toHaveProperty("title");
    expect(modules[0]).toHaveProperty("moduleNumber");
  });

  it("should get module by ID", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const module = await caller.modules.getById({ moduleId: 1 });

    expect(module).toBeDefined();
    if (module) {
      expect(module.id).toBe(1);
      expect(module).toHaveProperty("title");
      expect(module).toHaveProperty("youtubeVideoId");
    }
  });

  it("should update module progress", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.modules.updateProgress({
      moduleId: 1,
      videoWatched: true,
      videoWatchPercentage: 100,
      status: "in_progress",
    });

    expect(result.success).toBe(true);
  });
});

describe("Assessment System", () => {
  it("should get assessments for a module", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const assessments = await caller.assessments.getByModule({ moduleId: 1 });

    expect(Array.isArray(assessments)).toBe(true);
    if (assessments.length > 0) {
      expect(assessments[0]).toHaveProperty("questionText");
      expect(assessments[0]).toHaveProperty("questionType");
      expect(assessments[0]).toHaveProperty("points");
    }
  });

  it("should submit assessment and calculate score", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    // Get assessments first to know what to submit
    const assessments = await caller.assessments.getByModule({ moduleId: 1 });
    
    if (assessments.length > 0) {
      const responses = assessments.map((q) => ({
        assessmentId: q.id,
        selectedAnswer: q.questionType === "multiple_choice" ? "A" : "Test answer",
      }));

      const result = await caller.assessments.submit({
        moduleId: 1,
        attemptNumber: 1,
        responses,
      });

      expect(result.success).toBe(true);
      expect(result).toHaveProperty("score");
      expect(result).toHaveProperty("totalPoints");
      expect(result).toHaveProperty("passed");
      expect(typeof result.score).toBe("number");
    }
  }, 10000);
});

describe("Engagement Tracking", () => {
  it("should log engagement events", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.engagement.log({
      moduleId: 1,
      eventType: "video_play",
      eventData: { timestamp: new Date().toISOString() },
    });

    expect(result.success).toBe(true);
  });

  it("should log different event types", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const eventTypes = [
      "video_play",
      "video_pause",
      "video_complete",
      "transcript_view",
      "assessment_start",
    ] as const;

    for (const eventType of eventTypes) {
      const result = await caller.engagement.log({
        moduleId: 1,
        eventType,
      });

      expect(result.success).toBe(true);
    }
  });
});

describe("Role-Based Access Control", () => {
  it("should allow admin to access admin routes", async () => {
    const ctx = createMockContext({ role: "admin" });
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.admin.stats();
    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalUsers");
  });

  it("should prevent non-admin from accessing admin routes", async () => {
    const ctx = createMockContext({ role: "trainee" });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.admin.stats()).rejects.toThrow();
  });

  it("should allow instructor to access instructor routes", async () => {
    const ctx = createMockContext({ role: "instructor" });
    const caller = appRouter.createCaller(ctx);

    const trainees = await caller.instructor.trainees();
    expect(Array.isArray(trainees)).toBe(true);
  });

  it("should prevent non-instructor from accessing instructor routes", async () => {
    const ctx = createMockContext({ role: "trainee" });
    const caller = appRouter.createCaller(ctx);

    await expect(caller.instructor.trainees()).rejects.toThrow();
  });

  it("should allow provider to access provider routes", async () => {
    const ctx = createMockContext({ role: "provider" });
    const caller = appRouter.createCaller(ctx);

    const facilitators = await caller.provider.myFacilitators();
    expect(Array.isArray(facilitators)).toBe(true);
  });
});

describe("Live Classes", () => {
  it("should list upcoming live classes", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const classes = await caller.liveClasses.upcoming();
    expect(Array.isArray(classes)).toBe(true);
  });

  it("should allow user to register for live class", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.liveClasses.register({ liveClassId: 1 });
    expect(result.success).toBe(true);
  });
});
