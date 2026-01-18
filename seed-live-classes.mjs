import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.js';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Find an admin user to be the instructor
const adminUser = await db.select().from(schema.users).where(eq(schema.users.role, 'admin')).limit(1);

if (!adminUser || adminUser.length === 0) {
  console.error('No admin user found. Please create an admin user first.');
  process.exit(1);
}

const instructorId = adminUser[0].id;

// Seed three live classes
const liveClasses = [
  {
    classType: 'review_3',
    title: 'Live Review Session 1 - Modules 1-3',
    description: 'Interactive review of Introduction, Anxiety & Depression, and Music-Based Intervention Fundamentals. Q&A with instructor.',
    instructorId,
    scheduledAt: new Date('2026-02-15T14:00:00Z'),
    durationMinutes: 90,
    zoomMeetingId: '123-456-7890',
    zoomPasscode: 'SBH2026',
    zoomJoinUrl: 'https://zoom.us/j/1234567890?pwd=example',
    zoomStartUrl: 'https://zoom.us/s/1234567890?zak=example',
    maxParticipants: 50,
    currentParticipants: 0,
    status: 'scheduled',
  },
  {
    classType: 'review_6',
    title: 'Live Review Session 2 - Modules 4-6',
    description: 'Interactive review of Session Structure, Facilitation Techniques, and Telehealth Best Practices. Q&A with instructor.',
    instructorId,
    scheduledAt: new Date('2026-03-15T14:00:00Z'),
    durationMinutes: 90,
    zoomMeetingId: '234-567-8901',
    zoomPasscode: 'SBH2026',
    zoomJoinUrl: 'https://zoom.us/j/2345678901?pwd=example',
    zoomStartUrl: 'https://zoom.us/s/2345678901?zak=example',
    maxParticipants: 50,
    currentParticipants: 0,
    status: 'scheduled',
  },
  {
    classType: 'review_9',
    title: 'Live Review Session 3 - Modules 7-9',
    description: 'Interactive review of Patient Assessment, Difficult Situations, and Clinical Documentation. Q&A with instructor.',
    instructorId,
    scheduledAt: new Date('2026-04-15T14:00:00Z'),
    durationMinutes: 90,
    zoomMeetingId: '345-678-9012',
    zoomPasscode: 'SBH2026',
    zoomJoinUrl: 'https://zoom.us/j/3456789012?pwd=example',
    zoomStartUrl: 'https://zoom.us/s/3456789012?zak=example',
    maxParticipants: 50,
    currentParticipants: 0,
    status: 'scheduled',
  },
];

console.log('Seeding live classes...');

for (const liveClass of liveClasses) {
  const existing = await db.select().from(schema.liveClasses)
    .where(eq(schema.liveClasses.classType, liveClass.classType))
    .limit(1);
  
  if (existing && existing.length > 0) {
    // Update existing
    await db.update(schema.liveClasses)
      .set(liveClass)
      .where(eq(schema.liveClasses.classType, liveClass.classType));
    console.log(`✓ Updated ${liveClass.title}`);
  } else {
    // Insert new
    await db.insert(schema.liveClasses).values(liveClass);
    console.log(`✓ Created ${liveClass.title}`);
  }
}

console.log('\n✅ Live classes seeded successfully!');
await connection.end();
