import { drizzle } from 'drizzle-orm/mysql2';
import { modules, assessments, userModuleProgress, userAssessmentResponses } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

async function renumberModules() {
  console.log('Starting module renumbering...\n');

  // Step 1: Merge Module 2 (Session 1B) content into Module 1
  console.log('Step 1: Merging Session 1A and 1B into Module 1...');
  
  // Update Module 1 to include both sessions
  await db.update(modules)
    .set({
      title: 'Session 1: Introduction to SoundBridge Health',
      description: 'Introduction to SoundBridge Health protocol and understanding anxiety and depression',
    })
    .where(eq(modules.id, 1));
  
  console.log('✓ Module 1 updated to include both Session 1A and 1B content\n');

  // Step 2: Move all Module 2 assessments to Module 1
  console.log('Step 2: Moving Session 1B assessments to Module 1...');
  
  const module2Assessments = await db.select().from(assessments).where(eq(assessments.moduleId, 2));
  console.log(`Found ${module2Assessments.length} assessments in Module 2`);
  
  // Update assessment moduleId from 2 to 1
  await db.update(assessments)
    .set({ moduleId: 1 })
    .where(eq(assessments.moduleId, 2));
  
  console.log('✓ Assessments moved to Module 1\n');

  // Step 3: Migrate user progress from Module 2 to Module 1
  console.log('Step 3: Migrating user progress from Module 2 to Module 1...');
  
  const module2Progress = await db.select().from(userModuleProgress).where(eq(userModuleProgress.moduleId, 2));
  console.log(`Found ${module2Progress.length} user progress records for Module 2`);
  
  // For each user with Module 2 progress, merge it into Module 1
  for (const progress of module2Progress) {
    const module1Progress = await db.select()
      .from(userModuleProgress)
      .where(eq(userModuleProgress.userId, progress.userId))
      .where(eq(userModuleProgress.moduleId, 1))
      .limit(1);
    
    if (module1Progress.length > 0) {
      // User has both - keep the better score and combined status
      const combined = module1Progress[0];
      await db.update(userModuleProgress)
        .set({
          videoWatched: combined.videoWatched || progress.videoWatched,
          transcriptViewed: combined.transcriptViewed || progress.transcriptViewed,
          assessmentCompleted: combined.assessmentCompleted || progress.assessmentCompleted,
          assessmentScore: Math.max(combined.assessmentScore || 0, progress.assessmentScore || 0),
          highestScore: Math.max(combined.highestScore || 0, progress.highestScore || 0),
          assessmentAttempts: (combined.assessmentAttempts || 0) + (progress.assessmentAttempts || 0),
        })
        .where(eq(userModuleProgress.userId, progress.userId))
        .where(eq(userModuleProgress.moduleId, 1));
    } else {
      // User only has Module 2 progress - move it to Module 1
      await db.update(userModuleProgress)
        .set({ moduleId: 1 })
        .where(eq(userModuleProgress.userId, progress.userId))
        .where(eq(userModuleProgress.moduleId, 2));
    }
  }
  
  // Delete any remaining Module 2 progress records
  await db.delete(userModuleProgress).where(eq(userModuleProgress.moduleId, 2));
  
  console.log('✓ User progress migrated\n');

  // Step 4: Update assessment responses
  console.log('Step 4: Updating assessment responses...');
  await db.update(userAssessmentResponses)
    .set({ moduleId: 1 })
    .where(eq(userAssessmentResponses.moduleId, 2));
  console.log('✓ Assessment responses updated\n');

  // Step 5: Delete Module 2
  console.log('Step 5: Deleting old Module 2...');
  await db.delete(modules).where(eq(modules.id, 2));
  console.log('✓ Module 2 deleted\n');

  // Step 6: Renumber remaining modules
  console.log('Step 6: Renumbering remaining modules...');
  
  // First, set all moduleNumbers to temporary high values to avoid unique constraint conflicts
  console.log('  Setting temporary module numbers...');
  await db.update(modules).set({ moduleNumber: 103 }).where(eq(modules.id, 3));
  await db.update(modules).set({ moduleNumber: 104 }).where(eq(modules.id, 4));
  await db.update(modules).set({ moduleNumber: 105 }).where(eq(modules.id, 5));
  await db.update(modules).set({ moduleNumber: 106 }).where(eq(modules.id, 6));
  await db.update(modules).set({ moduleNumber: 107 }).where(eq(modules.id, 7));
  await db.update(modules).set({ moduleNumber: 108 }).where(eq(modules.id, 8));
  await db.update(modules).set({ moduleNumber: 109 }).where(eq(modules.id, 9));
  await db.update(modules).set({ moduleNumber: 110 }).where(eq(modules.id, 10));
  
  const renumberMap = {
    3: { newNumber: 2, title: 'Session 2: Music and the Brain' },
    4: { newNumber: 3, title: 'Session 3: The SoundBridge Health Protocol' },
    5: { newNumber: 4, title: 'Session 4: Building Therapeutic Playlists' },
    6: { newNumber: 5, title: 'Session 5: Facilitating Group Sessions' },
    7: { newNumber: 6, title: 'Session 6: Managing Patient Progress' },
    8: { newNumber: 7, title: 'Session 7: Handling Difficult Situations' },
    9: { newNumber: 8, title: 'Session 8: Documentation and Compliance' },
    10: { newNumber: 9, title: 'Session 9: Certification and Next Steps' },
  };

  // Now update to final values
  for (const oldId of [3, 4, 5, 6, 7, 8, 9, 10]) {
    const mapping = renumberMap[oldId];
    
    console.log(`  Renumbering Module ${oldId} → Module ${mapping.newNumber} (${mapping.title})`);
    
    // Update module
    await db.update(modules)
      .set({
        moduleNumber: mapping.newNumber,
        title: mapping.title
      })
      .where(eq(modules.id, oldId));
  }
  
  console.log('✓ All modules renumbered\n');

  console.log('✅ Module renumbering complete!');
  console.log('\nNew structure:');
  console.log('  Module 1: Session 1 (merged 1A + 1B)');
  console.log('  Module 2: Session 2');
  console.log('  Module 3: Session 3');
  console.log('  Module 4: Session 4');
  console.log('  Module 5: Session 5');
  console.log('  Module 6: Session 6');
  console.log('  Module 7: Session 7');
  console.log('  Module 8: Session 8');
  console.log('  Module 9: Session 9');
  
  process.exit(0);
}

renumberModules().catch((error) => {
  console.error('Error renumbering modules:', error);
  process.exit(1);
});
