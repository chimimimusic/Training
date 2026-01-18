import { getDb } from "./db";
import { users, userEducation, userEmployment } from "../drizzle/schema";
import { eq } from "drizzle-orm";

/**
 * Required fields for profile completeness
 */
const REQUIRED_PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'age',
  'streetAddress',
  'city',
  'state',
  'zipCode',
  'highestEducation',
] as const;

/**
 * Calculate profile completeness percentage
 */
export async function calculateProfileCompleteness(userId: number): Promise<{
  isComplete: boolean;
  percentage: number;
  missingFields: string[];
  missingEducation: boolean;
  missingEmployment: boolean;
}> {
  const db = await getDb();
  if (!db) {
    return {
      isComplete: false,
      percentage: 0,
      missingFields: [...REQUIRED_PROFILE_FIELDS],
      missingEducation: true,
      missingEmployment: true,
    };
  }

  // Get user profile
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return {
      isComplete: false,
      percentage: 0,
      missingFields: [...REQUIRED_PROFILE_FIELDS],
      missingEducation: true,
      missingEmployment: true,
    };
  }

  // Check required fields
  const missingFields: string[] = [];
  for (const field of REQUIRED_PROFILE_FIELDS) {
    if (!user[field]) {
      missingFields.push(field);
    }
  }

  // Check education history (at least one entry required)
  const education = await db.select().from(userEducation).where(eq(userEducation.userId, userId));
  const missingEducation = education.length === 0;

  // Check employment history (at least one entry required)
  const employment = await db.select().from(userEmployment).where(eq(userEmployment.userId, userId));
  const missingEmployment = employment.length === 0;

  // Calculate percentage
  const totalRequirements = REQUIRED_PROFILE_FIELDS.length + 2; // +2 for education and employment
  const completedRequirements = 
    (REQUIRED_PROFILE_FIELDS.length - missingFields.length) +
    (missingEducation ? 0 : 1) +
    (missingEmployment ? 0 : 1);
  
  const percentage = Math.round((completedRequirements / totalRequirements) * 100);
  const isComplete = percentage === 100;

  return {
    isComplete,
    percentage,
    missingFields,
    missingEducation,
    missingEmployment,
  };
}

/**
 * Check if user can access training modules
 */
export async function canAccessTraining(userId: number): Promise<{
  canAccess: boolean;
  reason?: string;
  completeness?: Awaited<ReturnType<typeof calculateProfileCompleteness>>;
}> {
  const db = await getDb();
  if (!db) {
    return { canAccess: false, reason: 'Database unavailable' };
  }

  // Get user
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) {
    return { canAccess: false, reason: 'User not found' };
  }

  // Admins and instructors can always access
  if (user.role === 'admin' || user.role === 'instructor') {
    return { canAccess: true };
  }

  // Check profile completeness for trainees
  const completeness = await calculateProfileCompleteness(userId);
  
  if (!completeness.isComplete) {
    return {
      canAccess: false,
      reason: 'Profile must be 100% complete to access training',
      completeness,
    };
  }

  return { canAccess: true, completeness };
}

/**
 * Get human-readable field names for missing fields
 */
export function getFieldLabel(fieldName: string): string {
  const labels: Record<string, string> = {
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone Number',
    age: 'Age',
    streetAddress: 'Street Address',
    city: 'City',
    state: 'State',
    zipCode: 'ZIP Code',
    highestEducation: 'Highest Education Level',
  };
  return labels[fieldName] || fieldName;
}
