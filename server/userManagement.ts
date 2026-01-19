import { eq, isNull } from "drizzle-orm";
import { getDb } from "./db";
import { 
  users, 
  userModuleProgress, 
  userAssessmentResponses, 
  userEducation, 
  userEmployment,
  liveClassAttendance,
  discussionTopics,
  discussionReplies,
  discussionLikes,
  contactMessages,
  certificates
} from "../drizzle/schema";

/**
 * Suspend a user (change status to suspended)
 */
export async function suspendUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    status: "suspended",
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Activate a user (change status to active)
 */
export async function activateUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    status: "active",
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Soft delete a user (mark as deleted, hide from lists)
 */
export async function softDeleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    deletedAt: new Date(),
    status: "suspended", // Also suspend to prevent login
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Restore a soft-deleted user
 */
export async function restoreUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    deletedAt: null,
    status: "active",
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Hard delete a user and all related data (PERMANENT - cannot be undone)
 */
export async function hardDeleteUser(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Delete in order to respect foreign key constraints
  // Delete user's education records
  await db.delete(userEducation).where(eq(userEducation.userId, userId));
  
  // Delete user's employment records
  await db.delete(userEmployment).where(eq(userEmployment.userId, userId));
  
  // Delete user's assessment responses
  await db.delete(userAssessmentResponses).where(eq(userAssessmentResponses.userId, userId));
  
  // Delete user's module progress
  await db.delete(userModuleProgress).where(eq(userModuleProgress.userId, userId));
  
  // Delete user's live class attendance
  await db.delete(liveClassAttendance).where(eq(liveClassAttendance.userId, userId));
  
  // Delete user's discussion likes
  await db.delete(discussionLikes).where(eq(discussionLikes.userId, userId));
  
  // Delete user's discussion replies
  await db.delete(discussionReplies).where(eq(discussionReplies.authorId, userId));
  
  // Delete user's discussion topics
  await db.delete(discussionTopics).where(eq(discussionTopics.authorId, userId));
  
  // Delete contact messages sent by user
  await db.delete(contactMessages).where(eq(contactMessages.senderEmail, 
    (await db.select().from(users).where(eq(users.id, userId)).limit(1))[0]?.email || ""
  ));
  
  // Delete user's certificates
  await db.delete(certificates).where(eq(certificates.userId, userId));
  
  // Finally, delete the user record
  await db.delete(users).where(eq(users.id, userId));
}

/**
 * Get all users excluding soft-deleted ones
 */
export async function getAllActiveUsers() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users).where(isNull(users.deletedAt));
}

/**
 * Get all users including soft-deleted ones (for admin view)
 */
export async function getAllUsersIncludingDeleted() {
  const db = await getDb();
  if (!db) return [];

  return await db.select().from(users);
}

/**
 * Check if user can be deleted (prevent deleting last admin)
 */
export async function canDeleteUser(userId: number): Promise<{ canDelete: boolean; reason?: string }> {
  const db = await getDb();
  if (!db) return { canDelete: false, reason: "Database not available" };

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  
  if (!user) {
    return { canDelete: false, reason: "User not found" };
  }

  // If user is an admin, check if they're the last admin
  if (user.role === "admin") {
    const adminCount = await db.select().from(users).where(eq(users.role, "admin"));
    
    if (adminCount.length <= 1) {
      return { canDelete: false, reason: "Cannot delete the last admin user" };
    }
  }

  return { canDelete: true };
}

/**
 * Change user role (for promoting trainees to facilitators, etc.)
 */
export async function changeUserRole(userId: number, newRole: "admin" | "instructor" | "provider" | "trainee" | "facilitator") {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    role: newRole,
    updatedAt: new Date(),
  }).where(eq(users.id, userId));
}
