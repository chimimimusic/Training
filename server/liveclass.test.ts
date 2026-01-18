import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';
import * as db from './db';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createMockContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: 'test-user',
    email: 'test@example.com',
    name: 'Test User',
    loginMethod: 'manus',
    role: 'trainee',
    status: 'active',
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
  };
}

describe('Live Class Integration', () => {
  let testUserId: number;
  let adminUserId: number;

  beforeAll(async () => {
    // Get or create test users
    const users = await db.getAllUsers();
    const testUser = users.find(u => u.role === 'trainee');
    const adminUser = users.find(u => u.role === 'admin');
    
    if (!testUser || !adminUser) {
      throw new Error('Test users not found. Please ensure database is seeded.');
    }
    
    testUserId = testUser.id;
    adminUserId = adminUser.id;
  });

  it('should fetch upcoming live classes', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    const liveClasses = await caller.liveClasses.upcoming();
    
    expect(liveClasses).toBeDefined();
    expect(Array.isArray(liveClasses)).toBe(true);
    expect(liveClasses.length).toBeGreaterThanOrEqual(3); // Should have 3 review sessions
    
    // Check that all three review sessions exist
    const classTypes = liveClasses.map(lc => lc.classType);
    expect(classTypes).toContain('review_3');
    expect(classTypes).toContain('review_6');
    expect(classTypes).toContain('review_9');
  });

  it('should have Zoom meeting details for all live classes', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    const liveClasses = await caller.liveClasses.upcoming();
    
    for (const liveClass of liveClasses) {
      expect(liveClass.zoomMeetingId).toBeDefined();
      expect(liveClass.zoomJoinUrl).toBeDefined();
    }
  });

  it('should register user for live class', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    
    // Get first live class
    const liveClasses = await caller.liveClasses.upcoming();
    expect(liveClasses.length).toBeGreaterThan(0);
    
    const firstClass = liveClasses[0];
    
    // Register for the class
    const result = await caller.liveClasses.register({ liveClassId: firstClass.id });
    expect(result.success).toBe(true);
  });

  it('should fetch user registered live classes', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    
    const myClasses = await caller.liveClasses.myClasses();
    
    expect(myClasses).toBeDefined();
    expect(Array.isArray(myClasses)).toBe(true);
    // Should have at least one class from previous registration
    expect(myClasses.length).toBeGreaterThanOrEqual(1);
  });

  it('should show correct live class after module 3 completion', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    
    const liveClasses = await caller.liveClasses.upcoming();
    const review3Class = liveClasses.find(lc => lc.classType === 'review_3');
    
    expect(review3Class).toBeDefined();
    expect(review3Class?.title).toContain('Modules 1-3');
    expect(review3Class?.durationMinutes).toBe(90);
  });

  it('should show correct live class after module 6 completion', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    
    const liveClasses = await caller.liveClasses.upcoming();
    const review6Class = liveClasses.find(lc => lc.classType === 'review_6');
    
    expect(review6Class).toBeDefined();
    expect(review6Class?.title).toContain('Modules 4-6');
    expect(review6Class?.durationMinutes).toBe(90);
  });

  it('should show correct live class after module 9 completion', async () => {
    const caller = appRouter.createCaller(createMockContext({ id: testUserId, role: 'trainee' }));
    
    const liveClasses = await caller.liveClasses.upcoming();
    const review9Class = liveClasses.find(lc => lc.classType === 'review_9');
    
    expect(review9Class).toBeDefined();
    expect(review9Class?.title).toContain('Modules 7-9');
    expect(review9Class?.durationMinutes).toBe(90);
  });
});
