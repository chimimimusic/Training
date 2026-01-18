import { eq, sql, and, gte, lte, isNull } from "drizzle-orm";
import { getDb } from "./db";
import { users, userModuleProgress } from "../drizzle/schema";

/**
 * Get aggregate analytics for all trainees
 */
export async function getTraineeAnalytics() {
  const db = await getDb();
  if (!db) return null;

  // Get all trainees (exclude deleted users)
  const trainees = await db.select().from(users).where(
    and(
      eq(users.role, "trainee"),
      isNull(users.deletedAt)
    )
  );

  // Get all progress records
  const allProgress = await db.select().from(userModuleProgress);

  // Calculate statistics
  const totalTrainees = trainees.length;
  const activeTrainees = trainees.filter(t => t.status === "active").length;
  
  // Calculate average completion rate
  const completionRates = trainees.map(trainee => {
    const userProgress = allProgress.filter(p => p.userId === trainee.id);
    const completedModules = userProgress.filter(p => p.status === "completed").length;
    return (completedModules / 10) * 100; // 10 total modules
  });
  
  const avgCompletionRate = completionRates.length > 0
    ? completionRates.reduce((a, b) => a + b, 0) / completionRates.length
    : 0;

  // Calculate average time to complete (for completed trainees)
  const completedTrainees = trainees.filter(t => {
    const userProgress = allProgress.filter(p => p.userId === t.id);
    const completedModules = userProgress.filter(p => p.status === "completed").length;
    return completedModules === 10;
  });

  let avgDaysToComplete = 0;
  if (completedTrainees.length > 0) {
    const completionTimes = completedTrainees.map(trainee => {
      const userProgress = allProgress.filter(p => p.userId === trainee.id);
      const startDate = new Date(trainee.createdAt);
      const completionDates = userProgress
        .filter(p => p.completedAt)
        .map(p => new Date(p.completedAt!));
      
      if (completionDates.length > 0) {
        const lastCompletionDate = new Date(Math.max(...completionDates.map(d => d.getTime())));
        const days = Math.floor((lastCompletionDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        return days;
      }
      return 0;
    });
    
    avgDaysToComplete = completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length;
  }

  // Calculate module-specific completion rates
  const moduleStats = Array.from({ length: 10 }, (_, i) => {
    const moduleId = i + 1;
    const moduleProgress = allProgress.filter(p => p.moduleId === moduleId);
    const completed = moduleProgress.filter(p => p.status === "completed").length;
    const rate = totalTrainees > 0 ? (completed / totalTrainees) * 100 : 0;
    
    return {
      moduleId,
      completionRate: Math.round(rate),
      completedCount: completed,
      totalCount: totalTrainees,
    };
  });

  return {
    totalTrainees,
    activeTrainees,
    completedTrainees: completedTrainees.length,
    avgCompletionRate: Math.round(avgCompletionRate),
    avgDaysToComplete: Math.round(avgDaysToComplete),
    moduleStats,
  };
}

/**
 * Get detailed trainee progress with profile information
 */
export async function getTraineeProgressWithProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  // Get user with profile data
  const [user] = await db.select().from(users).where(eq(users.id, userId));
  
  if (!user) return null;

  // Get all module progress
  const progress = await db.select().from(userModuleProgress).where(
    eq(userModuleProgress.userId, userId)
  );

  // Calculate completion percentage
  const completedModules = progress.filter(p => p.status === "completed").length;
  const completionPercentage = (completedModules / 10) * 100;

  // Calculate days since enrollment
  const daysSinceEnrollment = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: user.createdAt,
      profileImageUrl: user.profileImageUrl,
      phone: user.phone,
      streetAddress: user.streetAddress,
      city: user.city,
      state: user.state,
      zipCode: user.zipCode,
      age: user.age,
      gender: user.gender,
      highestEducation: user.highestEducation,
      profileCompletedAt: user.profileCompletedAt,
    },
    progress,
    stats: {
      completedModules,
      totalModules: 10,
      completionPercentage: Math.round(completionPercentage),
      daysSinceEnrollment,
      lastActivityDate: progress.length > 0
        ? new Date(Math.max(...progress.map(p => new Date(p.updatedAt).getTime())))
        : null,
    },
  };
}

/**
 * Get all trainees with progress summary (for filtering/sorting)
 */
export async function getAllTraineesWithProgress() {
  const db = await getDb();
  if (!db) return [];

  // Get all trainees (exclude deleted users)
  const trainees = await db.select().from(users).where(
    and(
      eq(users.role, "trainee"),
      isNull(users.deletedAt)
    )
  );

  // Get all progress records
  const allProgress = await db.select().from(userModuleProgress);

  // Map trainees with their progress
  return trainees.map(trainee => {
    const userProgress = allProgress.filter(p => p.userId === trainee.id);
    const completedModules = userProgress.filter(p => p.status === "completed").length;
    const completionPercentage = (completedModules / 10) * 100;
    
    const lastActivity = userProgress.length > 0
      ? new Date(Math.max(...userProgress.map(p => new Date(p.updatedAt).getTime())))
      : null;

    const daysSinceEnrollment = Math.floor(
      (Date.now() - new Date(trainee.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    // Calculate average assessment score
    const assessmentScores = userProgress
      .filter(p => p.assessmentScore !== null)
      .map(p => p.assessmentScore || 0);
    const avgAssessmentScore = assessmentScores.length > 0
      ? Math.round(assessmentScores.reduce((a, b) => a + b, 0) / assessmentScores.length)
      : 0;

    return {
      id: trainee.id,
      name: trainee.name,
      email: trainee.email,
      status: trainee.status,
      createdAt: trainee.createdAt,
      profileImageUrl: trainee.profileImageUrl,
      completedModules,
      totalModules: 10,
      completionPercentage: Math.round(completionPercentage),
      lastActivity,
      daysSinceEnrollment,
      profileCompleted: !!trainee.profileCompletedAt,
      avgAssessmentScore,
    };
  });
}

/**
 * Export trainee progress data for CSV/PDF
 */
export async function getTraineeProgressExportData(userIds?: number[]) {
  const db = await getDb();
  if (!db) return [];

  // Get trainees (all or specific IDs)
  let query = db.select().from(users).where(
    and(
      eq(users.role, "trainee"),
      isNull(users.deletedAt)
    )
  );

  const trainees = await query;
  const filteredTrainees = userIds 
    ? trainees.filter(t => userIds.includes(t.id))
    : trainees;

  // Get all progress records
  const allProgress = await db.select().from(userModuleProgress);

  // Map to export format
  return filteredTrainees.map(trainee => {
    const userProgress = allProgress.filter(p => p.userId === trainee.id);
    const completedModules = userProgress.filter(p => p.status === "completed").length;
    const completionPercentage = (completedModules / 10) * 100;
    
    const assessmentScores = userProgress
      .filter(p => p.assessmentScore !== null)
      .map(p => p.assessmentScore || 0);
    
    const avgAssessmentScore = assessmentScores.length > 0
      ? assessmentScores.reduce((a, b) => a + b, 0) / assessmentScores.length
      : 0;

    return {
      name: trainee.name || "N/A",
      email: trainee.email || "N/A",
      status: trainee.status,
      enrollmentDate: new Date(trainee.createdAt).toLocaleDateString(),
      completedModules,
      totalModules: 10,
      completionPercentage: Math.round(completionPercentage),
      avgAssessmentScore: Math.round(avgAssessmentScore),
      profileCompleted: trainee.profileCompletedAt ? "Yes" : "No",
      lastActivity: userProgress.length > 0
        ? new Date(Math.max(...userProgress.map(p => new Date(p.updatedAt).getTime()))).toLocaleDateString()
        : "Never",
    };
  });
}
