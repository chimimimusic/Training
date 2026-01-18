import { eq, and } from "drizzle-orm";
import { getDb } from "./db";
import { users, userEducation, userEmployment } from "../drizzle/schema";

/**
 * Update user profile with extended fields
 */
export async function updateUserProfile(userId: number, data: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  streetAddress?: string;
  unitNumber?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  recoveryEmail?: string;
  age?: number;
  gender?: string;
  highestEducation?: "phd" | "masters" | "lcsw" | "bachelors" | "associates" | "some_college" | "high_school" | "other";
  profileImageUrl?: string;
  bio?: string;
  specializations?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(users).set({
    ...data,
    profileCompletedAt: new Date(),
  }).where(eq(users.id, userId));
}

/**
 * Get user's complete profile including education and employment
 */
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return null;

  const education = await db.select().from(userEducation).where(eq(userEducation.userId, userId));
  const employment = await db.select().from(userEmployment).where(eq(userEmployment.userId, userId));

  return {
    ...user,
    education,
    employment,
  };
}

/**
 * Add education entry
 */
export async function addEducation(data: {
  userId: number;
  degree: string;
  fieldOfStudy?: string;
  institution: string;
  graduationYear?: number;
  isCurrentlyEnrolled?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(userEducation).values(data);
  return result;
}

/**
 * Update education entry
 */
export async function updateEducation(id: number, userId: number, data: {
  degree?: string;
  fieldOfStudy?: string;
  institution?: string;
  graduationYear?: number;
  isCurrentlyEnrolled?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userEducation).set(data).where(
    and(eq(userEducation.id, id), eq(userEducation.userId, userId))
  );
}

/**
 * Delete education entry
 */
export async function deleteEducation(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(userEducation).where(
    and(eq(userEducation.id, id), eq(userEducation.userId, userId))
  );
}

/**
 * Add employment entry
 */
export async function addEmployment(data: {
  userId: number;
  jobTitle: string;
  employer: string;
  startDate: string; // YYYY-MM format
  endDate?: string; // YYYY-MM format
  isCurrentJob?: boolean;
  responsibilities?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [result] = await db.insert(userEmployment).values(data);
  return result;
}

/**
 * Update employment entry
 */
export async function updateEmployment(id: number, userId: number, data: {
  jobTitle?: string;
  employer?: string;
  startDate?: string;
  endDate?: string;
  isCurrentJob?: boolean;
  responsibilities?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userEmployment).set(data).where(
    and(eq(userEmployment.id, id), eq(userEmployment.userId, userId))
  );
}

/**
 * Delete employment entry
 */
export async function deleteEmployment(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.delete(userEmployment).where(
    and(eq(userEmployment.id, id), eq(userEmployment.userId, userId))
  );
}

/**
 * Get all users with complete profiles (for admin/instructor view)
 */
export async function getAllUserProfiles() {
  const db = await getDb();
  if (!db) return [];

  const allUsers = await db.select().from(users);
  
  const profiles = await Promise.all(
    allUsers.map(async (user) => {
      const education = await db.select().from(userEducation).where(eq(userEducation.userId, user.id));
      const employment = await db.select().from(userEmployment).where(eq(userEmployment.userId, user.id));
      
      return {
        ...user,
        education,
        employment,
      };
    })
  );

  return profiles;
}
