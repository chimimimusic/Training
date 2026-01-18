import { describe, it, expect } from 'vitest';
import { appRouter } from './routers';
import type { TrpcContext } from './_core/context';

type AuthenticatedUser = NonNullable<TrpcContext['user']>;

function createMockContext(user?: Partial<AuthenticatedUser>): TrpcContext {
  const defaultUser: AuthenticatedUser = {
    id: 1,
    openId: 'test-webinar-user',
    email: 'webinar@test.com',
    name: 'Test Webinar User',
    loginMethod: 'manus',
    role: 'trainee',
    status: 'active',
    agreedToTerms: true,
    agreedToBaa: true,
    termsAgreedAt: new Date(),
    baaAgreedAt: new Date(),
    providerId: null,
    phone: null,
    profileImageUrl: null,
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
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Live Class Group Webinar System', () => {
  const mockContext = createMockContext();
  const caller = appRouter.createCaller(mockContext);

  it('should list upcoming live classes with Zoom details', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    
    expect(upcomingClasses).toBeDefined();
    expect(Array.isArray(upcomingClasses)).toBe(true);
    expect(upcomingClasses.length).toBeGreaterThan(0);
    
    const firstClass = upcomingClasses[0];
    expect(firstClass).toHaveProperty('zoomMeetingId');
    expect(firstClass).toHaveProperty('zoomPasscode');
    expect(firstClass).toHaveProperty('zoomJoinUrl');
    expect(firstClass).toHaveProperty('maxParticipants');
    expect(firstClass).toHaveProperty('currentParticipants');
  });

  it('should get live class by ID with Zoom meeting details', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    const firstClassId = upcomingClasses[0].id;
    
    const liveClass = await caller.liveClasses.getById({ liveClassId: firstClassId });
    
    expect(liveClass).toBeDefined();
    expect(liveClass?.id).toBe(firstClassId);
    expect(liveClass?.zoomMeetingId).toBeTruthy();
    expect(liveClass?.zoomPasscode).toBeTruthy();
    expect(liveClass?.zoomJoinUrl).toBeTruthy();
    expect(liveClass?.maxParticipants).toBeGreaterThan(0);
  });

  it('should register user for live class session', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    const classToRegister = upcomingClasses[0];
    
    const result = await caller.liveClasses.register({ 
      liveClassId: classToRegister.id 
    });
    
    expect(result).toEqual({ success: true });
    
    // Verify registration
    const myClasses = await caller.liveClasses.myClasses();
    const registered = myClasses.find(
      (reg) => reg.liveClassAttendance.liveClassId === classToRegister.id
    );
    
    expect(registered).toBeDefined();
    expect(registered?.liveClassAttendance.registrationStatus).toBe('registered');
  });

  it('should show registered classes for user', async () => {
    const myClasses = await caller.liveClasses.myClasses();
    
    expect(myClasses).toBeDefined();
    expect(Array.isArray(myClasses)).toBe(true);
    expect(myClasses.length).toBeGreaterThan(0);
    
    const registration = myClasses[0];
    expect(registration).toHaveProperty('liveClassAttendance');
    expect(registration).toHaveProperty('liveClasses');
    expect(registration.liveClasses).toHaveProperty('zoomJoinUrl');
  });

  it('should have correct session status values', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    
    for (const liveClass of upcomingClasses) {
      expect(['scheduled', 'live', 'completed', 'cancelled']).toContain(liveClass.status);
    }
  });

  it('should have three review sessions (after modules 3, 6, 9)', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    
    const classTypes = upcomingClasses.map(c => c.classType);
    expect(classTypes).toContain('review_3');
    expect(classTypes).toContain('review_6');
    expect(classTypes).toContain('review_9');
  });

  it('should track participant count', async () => {
    const upcomingClasses = await caller.liveClasses.upcoming();
    const firstClass = upcomingClasses[0];
    
    expect(firstClass.currentParticipants).toBeGreaterThanOrEqual(0);
    expect(firstClass.maxParticipants).toBeGreaterThan(0);
    expect(firstClass.currentParticipants).toBeLessThanOrEqual(firstClass.maxParticipants);
  });
});
