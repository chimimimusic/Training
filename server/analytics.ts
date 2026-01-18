import { eq, and, gte, sql, desc } from 'drizzle-orm';
import { getDb } from './db';
import { 
  userModuleProgress, 
  userAssessmentResponses, 
  engagementLogs, 
  liveClassAttendance,
  modules 
} from '../drizzle/schema';

export async function getUserAnalytics(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  // Get all module progress
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(eq(userModuleProgress.userId, userId))
    .orderBy(userModuleProgress.completedAt);
  
  // Get all assessment responses
  const assessments = await db
    .select({
      response: userAssessmentResponses,
      moduleId: modules.id,
      moduleTitle: modules.title,
    })
    .from(userAssessmentResponses)
    .leftJoin(modules, eq(userAssessmentResponses.moduleId, modules.id))
    .where(eq(userAssessmentResponses.userId, userId))
    .orderBy(userAssessmentResponses.answeredAt);
  
  // Get engagement logs (video watch time)
  const engagement = await db
    .select()
    .from(engagementLogs)
    .where(eq(engagementLogs.userId, userId))
    .orderBy(engagementLogs.createdAt);
  
  // Get live class attendance
  const attendance = await db
    .select()
    .from(liveClassAttendance)
    .where(eq(liveClassAttendance.userId, userId));
  
  return {
    progress,
    assessments,
    engagement,
    attendance,
  };
}

export async function calculateProgressMetrics(userId: number) {
  const data = await getUserAnalytics(userId);
  
  // Modules completed over time
  const completedModules = data.progress
    .filter(p => p.status === 'completed' && p.completedAt)
    .map(p => ({
      moduleId: p.moduleId,
      completedAt: p.completedAt!,
    }))
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
  
  // Assessment scores trend (group by module, get best score)
  const assessmentsByModule = new Map<number, any[]>();
  data.assessments.forEach(a => {
    if (!assessmentsByModule.has(a.moduleId!)) {
      assessmentsByModule.set(a.moduleId!, []);
    }
    assessmentsByModule.get(a.moduleId!)!.push(a);
  });
  
  const assessmentScores = Array.from(assessmentsByModule.entries())
    .map(([moduleId, responses]) => {
      const totalQuestions = responses.length;
      const correctAnswers = responses.filter(r => r.response.isCorrect).length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const lastAttempt = responses[responses.length - 1];
      
      return {
        moduleId,
        moduleTitle: lastAttempt.moduleTitle,
        score,
        completedAt: lastAttempt.response.answeredAt,
      };
    })
    .sort((a, b) => new Date(a.completedAt).getTime() - new Date(b.completedAt).getTime());
  
  // Video completion rates by module
  const videoCompletion = data.progress.map(p => ({
    moduleId: p.moduleId,
    videoWatched: p.videoWatched,
    videoWatchPercentage: p.videoWatchPercentage || 0,
  }));
  
  // Live session attendance
  const liveSessionAttendance = data.attendance.map(a => ({
    liveClassId: a.liveClassId,
    attended: a.registrationStatus === 'attended',
    joinedAt: a.joinedAt,
  }));
  
  // Time spent per module (from progress table)
  const timeByModule: Record<number, number> = {};
  data.progress.forEach(p => {
    if (p.moduleId) {
      timeByModule[p.moduleId] = p.timeSpentMinutes;
    }
  });
  
  const timeSpent = Object.entries(timeByModule).map(([moduleId, minutes]) => ({
    moduleId: parseInt(moduleId),
    timeSpentMinutes: minutes,
  }));
  
  // Overall stats
  const totalModules = 10;
  const completedCount = completedModules.length;
  const averageScore = assessmentScores.length > 0
    ? assessmentScores.reduce((sum, a) => sum + a.score, 0) / assessmentScores.length
    : 0;
  const totalTimeMinutes = Object.values(timeByModule).reduce((sum, minutes) => sum + minutes, 0);
  const liveSessionsAttended = data.attendance.filter(a => a.registrationStatus === 'attended').length;
  
  // Study streak (consecutive days with activity)
  const activityDates = [
    ...data.engagement.map(e => e.createdAt),
    ...data.progress.filter(p => p.completedAt).map(p => p.completedAt!),
  ]
    .map(date => new Date(date).toDateString())
    .filter((v, i, a) => a.indexOf(v) === i)
    .sort();
  
  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;
  
  for (let i = 1; i < activityDates.length; i++) {
    const prevDate = new Date(activityDates[i - 1]);
    const currDate = new Date(activityDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      tempStreak++;
    } else {
      maxStreak = Math.max(maxStreak, tempStreak);
      tempStreak = 1;
    }
  }
  maxStreak = Math.max(maxStreak, tempStreak);
  
  // Check if last activity was yesterday or today
  if (activityDates.length > 0) {
    const lastActivity = new Date(activityDates[activityDates.length - 1]);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) {
      currentStreak = maxStreak;
    }
  }
  
  return {
    overall: {
      completedModules: completedCount,
      totalModules,
      progressPercentage: Math.round((completedCount / totalModules) * 100),
      averageScore: Math.round(averageScore),
      totalTimeMinutes: Math.round(totalTimeMinutes),
      liveSessionsAttended,
      currentStreak,
      maxStreak,
    },
    completedModules,
    assessmentScores,
    videoCompletion,
    liveSessionAttendance,
    timeSpent,
  };
}

export async function getModuleBreakdown(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database connection failed');
  
  const allModules = await db.select().from(modules).orderBy(modules.id);
  const progress = await db
    .select()
    .from(userModuleProgress)
    .where(eq(userModuleProgress.userId, userId));
  
  const assessments = await db
    .select()
    .from(userAssessmentResponses)
    .where(eq(userAssessmentResponses.userId, userId));
  
  const engagement = await db
    .select()
    .from(engagementLogs)
    .where(eq(engagementLogs.userId, userId));
  
  return allModules.map(module => {
    const moduleProgress = progress.find(p => p.moduleId === module.id);
    const moduleAssessments = assessments.filter(a => a.moduleId === module.id);
    const totalQuestions = moduleAssessments.length;
    const correctAnswers = moduleAssessments.filter(a => a.isCorrect).length;
    const assessmentScore = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : null;
    const assessmentPassed = assessmentScore !== null && assessmentScore >= 80;
    
    return {
      moduleId: module.id,
      moduleTitle: module.title,
      status: moduleProgress?.status || 'not_started',
      videoWatched: moduleProgress?.videoWatched || false,
      videoWatchPercentage: moduleProgress?.videoWatchPercentage || 0,
      assessmentPassed,
      assessmentScore,
      timeSpentMinutes: moduleProgress?.timeSpentMinutes || 0,
      completedAt: moduleProgress?.completedAt || null,
    };
  });
}
