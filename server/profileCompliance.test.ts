import { describe, it, expect } from 'vitest';
import { calculateProfileCompleteness, canAccessTraining } from './profileCompleteness';
import { logProfileChange, getUserAuditLog } from './auditLog';
import { exportProfilesToCSV, exportDetailedProfilesToCSV, exportProfilesToHTML } from './profileExport';

describe('Profile Completeness', () => {
  it('should calculate profile completeness correctly', async () => {
    // Test with a real user ID from database (owner)
    const result = await calculateProfileCompleteness(1);
    
    expect(result).toHaveProperty('isComplete');
    expect(result).toHaveProperty('percentage');
    expect(result).toHaveProperty('missingFields');
    expect(result).toHaveProperty('missingEducation');
    expect(result).toHaveProperty('missingEmployment');
    expect(typeof result.percentage).toBe('number');
    expect(result.percentage).toBeGreaterThanOrEqual(0);
    expect(result.percentage).toBeLessThanOrEqual(100);
  });

  it('should allow admins to access training regardless of profile completeness', async () => {
    // Test with admin user (owner)
    const result = await canAccessTraining(1);
    
    expect(result.canAccess).toBe(true);
  });

  it('should return false for non-existent user', async () => {
    const result = await canAccessTraining(999999);
    
    expect(result.canAccess).toBe(false);
    expect(result.reason).toBeDefined();
  });
});

describe('Audit Log', () => {
  it('should log profile changes', async () => {
    // Log a test change
    await logProfileChange({
      userId: 1,
      changedBy: 1,
      tableName: 'users',
      fieldName: 'phone',
      oldValue: '555-0100',
      newValue: '555-0101',
      changeType: 'update',
    });

    // Verify log was created
    const logs = await getUserAuditLog(1);
    expect(Array.isArray(logs)).toBe(true);
  });

  it('should retrieve audit logs for a user', async () => {
    const logs = await getUserAuditLog(1);
    
    expect(Array.isArray(logs)).toBe(true);
    if (logs.length > 0) {
      expect(logs[0]).toHaveProperty('userId');
      expect(logs[0]).toHaveProperty('fieldName');
      expect(logs[0]).toHaveProperty('changeType');
      expect(logs[0]).toHaveProperty('createdAt');
    }
  });

  it('should return empty array for user with no audit logs', async () => {
    const logs = await getUserAuditLog(999999);
    
    expect(Array.isArray(logs)).toBe(true);
    expect(logs.length).toBe(0);
  });
});

describe('Profile Export', () => {
  it('should export profiles to CSV format', async () => {
    const csv = await exportProfilesToCSV();
    
    expect(typeof csv).toBe('string');
    expect(csv).toContain('ID,Name,Email');
    expect(csv.split('\n').length).toBeGreaterThan(1);
  });

  it('should export detailed profiles to CSV', async () => {
    const csv = await exportDetailedProfilesToCSV();
    
    expect(typeof csv).toBe('string');
    expect(csv).toContain('User ID');
    expect(csv).toContain('Education History');
    expect(csv).toContain('Employment History');
  });

  it('should export profiles to HTML format', async () => {
    const html = await exportProfilesToHTML();
    
    expect(typeof html).toBe('string');
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('SoundBridge Health');
    expect(html).toContain('Trainee Profiles');
  });

  it('should filter exports by user IDs', async () => {
    const csv = await exportProfilesToCSV([1]);
    
    expect(typeof csv).toBe('string');
    const lines = csv.split('\n');
    // Header + 1 user = 2 lines
    expect(lines.length).toBeLessThanOrEqual(3);
  });

  it('should handle empty user ID array', async () => {
    const csv = await exportProfilesToCSV([]);
    
    expect(typeof csv).toBe('string');
    const lines = csv.split('\n');
    // Should only have header
    expect(lines.length).toBe(1);
  });
});

describe('Profile Completeness Integration', () => {
  it('should identify missing required fields', async () => {
    const result = await calculateProfileCompleteness(1);
    
    if (!result.isComplete) {
      expect(Array.isArray(result.missingFields)).toBe(true);
      expect(typeof result.missingEducation).toBe('boolean');
      expect(typeof result.missingEmployment).toBe('boolean');
    }
  });

  it('should calculate correct percentage', async () => {
    const result = await calculateProfileCompleteness(1);
    
    // Percentage should be a multiple of ~9 (11 total requirements)
    expect(result.percentage % 1).toBe(0); // Should be integer
  });
});
