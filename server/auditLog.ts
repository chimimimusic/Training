import { getDb } from "./db";
import { profileAuditLog } from "../drizzle/schema";
import { eq, desc } from "drizzle-orm";

/**
 * Log a profile change to the audit log
 */
export async function logProfileChange(params: {
  userId: number;
  changedBy: number;
  tableName: string;
  recordId?: number;
  fieldName: string;
  oldValue: string | null;
  newValue: string | null;
  changeType: "create" | "update" | "delete";
}) {
  const db = await getDb();
  if (!db) return;

  await db.insert(profileAuditLog).values({
    userId: params.userId,
    changedBy: params.changedBy,
    tableName: params.tableName,
    recordId: params.recordId,
    fieldName: params.fieldName,
    oldValue: params.oldValue,
    newValue: params.newValue,
    changeType: params.changeType,
  });
}

/**
 * Get audit log for a specific user
 */
export async function getUserAuditLog(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const logs = await db
    .select()
    .from(profileAuditLog)
    .where(eq(profileAuditLog.userId, userId))
    .orderBy(desc(profileAuditLog.createdAt))
    .limit(100);

  return logs;
}

/**
 * Get audit log for a specific field
 */
export async function getFieldAuditLog(userId: number, fieldName: string) {
  const db = await getDb();
  if (!db) return [];

  const logs = await db
    .select()
    .from(profileAuditLog)
    .where(eq(profileAuditLog.userId, userId))
    .orderBy(desc(profileAuditLog.createdAt));

  return logs.filter(log => log.fieldName === fieldName);
}

/**
 * Helper to compare and log changes for an object
 */
export async function logObjectChanges(params: {
  userId: number;
  changedBy: number;
  tableName: string;
  recordId?: number;
  oldData: Record<string, any>;
  newData: Record<string, any>;
  changeType: "create" | "update" | "delete";
}) {
  const { userId, changedBy, tableName, recordId, oldData, newData, changeType } = params;

  // Get all unique keys from both objects
  const allKeys = Array.from(new Set([...Object.keys(oldData), ...Object.keys(newData)]));

  // Log changes for each field that changed
  for (const key of allKeys) {
    const oldValue = oldData[key];
    const newValue = newData[key];

    // Skip if values are the same
    if (oldValue === newValue) continue;

    // Convert to string for storage
    const oldStr = oldValue != null ? String(oldValue) : null;
    const newStr = newValue != null ? String(newValue) : null;

    await logProfileChange({
      userId,
      changedBy,
      tableName,
      recordId,
      fieldName: key,
      oldValue: oldStr,
      newValue: newStr,
      changeType,
    });
  }
}
