import { drizzle } from 'drizzle-orm/mysql2';
import { moduleSections, assessments, modules } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

async function createModule1Sections() {
  console.log('Creating Module 1 sections (1A and 1B)...\n');

  // Step 1: Get Module 1 details
  const module1 = await db.select().from(modules).where(eq(modules.id, 1)).limit(1);
  
  if (!module1.length) {
    console.error('Module 1 not found!');
    process.exit(1);
  }

  console.log(`Found Module 1: ${module1[0].title}`);
  
  // Step 2: Create Section 1A (Introduction)
  console.log('\nCreating Section 1A...');
  
  const section1A = await db.insert(moduleSections).values({
    moduleId: 1,
    sectionNumber: 1,
    title: 'Session 1A: Introduction to SoundBridge Health',
    youtubeVideoId: module1[0].youtubeVideoId, // Use existing video ID from Module 1
    videoDurationMinutes: module1[0].videoDurationMinutes,
    transcriptContent: module1[0].transcriptContent,
    orderIndex: 1,
  });
  
  console.log('✓ Section 1A created');

  // Step 3: Create Section 1B (Understanding Anxiety and Depression)
  console.log('\nCreating Section 1B...');
  
  const section1BTranscript = `Session 1B: Understanding Anxiety and Depression

Welcome to Session 1B of the SoundBridge Health Facilitator Training. In this session, we'll explore the fundamentals of anxiety and depression, two of the most common mental health conditions that affect millions of people worldwide.

Understanding Anxiety:
Anxiety is a natural human response to stress, characterized by feelings of worry, nervousness, or fear. While occasional anxiety is normal, anxiety disorders involve excessive, persistent worry that interferes with daily activities. Common types include generalized anxiety disorder (GAD), panic disorder, social anxiety disorder, and specific phobias.

Physical symptoms of anxiety may include:
- Rapid heartbeat and palpitations
- Shortness of breath
- Sweating and trembling
- Muscle tension
- Difficulty concentrating
- Sleep disturbances

Understanding Depression:
Depression, or major depressive disorder, is a serious mood disorder that affects how a person feels, thinks, and handles daily activities. It's more than just feeling sad or going through a rough patch—it's a persistent condition that requires understanding and treatment.

Common symptoms of depression include:
- Persistent sad, anxious, or "empty" mood
- Loss of interest in activities once enjoyed
- Changes in appetite and weight
- Sleep disturbances (insomnia or oversleeping)
- Fatigue and decreased energy
- Feelings of worthlessness or guilt
- Difficulty concentrating or making decisions
- Thoughts of death or suicide

The Role of Music in Mental Health:
Research has shown that music can have profound effects on mood, stress levels, and emotional well-being. Music therapy has been used successfully to help individuals manage symptoms of anxiety and depression by:

1. Reducing stress hormones like cortisol
2. Triggering the release of dopamine and serotonin
3. Providing a safe outlet for emotional expression
4. Creating a sense of connection and community
5. Offering structure and routine through regular sessions

The SoundBridge Health Approach:
Our protocol combines evidence-based music therapy techniques with structured group facilitation. As a certified facilitator, you'll learn to:

- Create therapeutic playlists tailored to specific emotional needs
- Guide participants through music-based relaxation exercises
- Facilitate group discussions about emotional responses to music
- Monitor participant progress and adjust interventions accordingly
- Collaborate with healthcare providers to ensure comprehensive care

Cultural Sensitivity:
It's essential to recognize that experiences of anxiety and depression can vary across cultures. Different communities may have unique ways of expressing emotional distress, and music preferences can be deeply tied to cultural identity. As facilitators, we must:

- Respect diverse cultural backgrounds and musical traditions
- Avoid making assumptions about participants' experiences
- Create inclusive playlists that represent various cultures
- Be aware of stigma surrounding mental health in different communities
- Adapt our approach to meet individual and cultural needs

Ethical Considerations:
As facilitators, we must maintain clear professional boundaries:

- We are not therapists or counselors—we facilitate music-based wellness activities
- We must recognize when participants need professional mental health support
- Confidentiality is paramount in all group settings
- We should never diagnose or provide medical advice
- Collaboration with healthcare providers is essential

Next Steps:
In the following sessions, you'll learn specific techniques for using music to support individuals experiencing anxiety and depression. You'll practice creating therapeutic playlists, leading group sessions, and documenting participant progress.

Remember: Your role as a SoundBridge Health facilitator is to provide a supportive, music-enriched environment where participants can explore their emotions and develop coping strategies. You are a vital part of a comprehensive care team.

Thank you for your commitment to this important work.`;

  const section1B = await db.insert(moduleSections).values({
    moduleId: 1,
    sectionNumber: 2,
    title: 'Session 1B: Understanding Anxiety and Depression',
    youtubeVideoId: 'SWPSDYx3Xes',
    videoDurationMinutes: 45,
    transcriptContent: section1BTranscript,
    orderIndex: 2,
  });
  
  console.log('✓ Section 1B created with video ID: SWPSDYx3Xes');

  // Step 4: Update assessments to link to sections
  // Note: We'll need to add a sectionId field to assessments table
  console.log('\nNote: Assessment questions will need to be associated with sections');
  console.log('Current Module 1 assessments will be linked to Section 1A');
  console.log('Session 1B assessments (12 questions) will be added separately');

  console.log('\n✅ Module 1 sections created successfully!');
  console.log('\nModule 1 now contains:');
  console.log('  Section 1A: Introduction to SoundBridge Health');
  console.log('  Section 1B: Understanding Anxiety and Depression (Video: SWPSDYx3Xes)');
  
  process.exit(0);
}

createModule1Sections().catch((error) => {
  console.error('Error creating Module 1 sections:', error);
  process.exit(1);
});
