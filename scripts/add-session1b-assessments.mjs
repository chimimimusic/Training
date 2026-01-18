import { drizzle } from 'drizzle-orm/mysql2';
import { assessments, assessmentOptions, moduleSections } from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not found');
  process.exit(1);
}

const db = drizzle(DATABASE_URL);

async function addSession1BAssessments() {
  console.log('Adding Session 1B assessment questions...\n');

  // Step 1: Get section IDs
  const sections = await db.select().from(moduleSections).where(eq(moduleSections.moduleId, 1));
  
  if (sections.length !== 2) {
    console.error('Expected 2 sections for Module 1, found:', sections.length);
    process.exit(1);
  }

  const section1A = sections.find(s => s.sectionNumber === 1);
  const section1B = sections.find(s => s.sectionNumber === 2);

  console.log(`Section 1A ID: ${section1A.id}`);
  console.log(`Section 1B ID: ${section1B.id}\n`);

  // Step 2: Link existing Module 1 assessments to Section 1A
  console.log('Linking existing Module 1 assessments to Section 1A...');
  await db.update(assessments)
    .set({ sectionId: section1A.id })
    .where(eq(assessments.moduleId, 1));
  console.log('✓ Existing assessments linked to Section 1A\n');

  // Step 3: Add Session 1B assessment questions
  console.log('Adding Session 1B assessment questions...');
  
  const session1BQuestions = [
    {
      question: "Which of the following is a primary goal of the SoundBridge Health telehealth model?",
      options: [
        "A) To replace in-person therapy entirely",
        "B) To provide accessible, evidence-based mental health support through music",
        "C) To teach patients how to play musical instruments",
        "D) To eliminate the need for medication"
      ],
      correct: "B"
    },
    {
      question: "What is the recommended approach when a patient expresses discomfort with a specific song or genre?",
      options: [
        "A) Encourage them to push through the discomfort",
        "B) Immediately switch to a different song and note their preferences",
        "C) End the session early",
        "D) Ignore their feedback and continue"
      ],
      correct: "B"
    },
    {
      question: "How should facilitators handle technical difficulties during a telehealth session?",
      options: [
        "A) Cancel the session immediately",
        "B) Blame the patient's internet connection",
        "C) Remain calm, troubleshoot basic issues, and have a backup plan",
        "D) Continue without addressing the problem"
      ],
      correct: "C"
    },
    {
      question: "What is the importance of creating a therapeutic playlist in advance?",
      options: [
        "A) It's not important; improvisation is better",
        "B) It ensures a structured, intentional session flow tailored to therapeutic goals",
        "C) It saves time during the session",
        "D) It impresses the patient"
      ],
      correct: "B"
    },
    {
      question: "Which of the following best describes \"active listening\" in a telehealth music session?",
      options: [
        "A) Playing music loudly",
        "B) Engaging with the patient's verbal and non-verbal cues while music plays",
        "C) Listening to music without interaction",
        "D) Asking the patient to describe every song"
      ],
      correct: "B"
    },
    {
      question: "What should a facilitator do if a patient becomes emotionally overwhelmed during a session?",
      options: [
        "A) Continue with the planned playlist",
        "B) Pause the music, provide support, and assess whether to continue or reschedule",
        "C) End the session without explanation",
        "D) Play more upbeat music to change their mood"
      ],
      correct: "B"
    },
    {
      question: "Why is it important to document patient responses and progress after each session?",
      options: [
        "A) It's not important",
        "B) To track therapeutic outcomes and adjust future sessions accordingly",
        "C) To meet insurance requirements only",
        "D) To share with other patients"
      ],
      correct: "B"
    },
    {
      question: "What is the role of the facilitator in a group telehealth music session?",
      options: [
        "A) To perform music for the group",
        "B) To guide the session, foster connection, and ensure everyone feels included",
        "C) To let the group run itself without intervention",
        "D) To focus only on the most vocal participants"
      ],
      correct: "B"
    },
    {
      question: "How can facilitators create a sense of safety and trust in a virtual environment?",
      options: [
        "A) By being authoritative and directive",
        "B) By establishing clear expectations, showing empathy, and maintaining consistency",
        "C) By avoiding difficult conversations",
        "D) By keeping sessions very short"
      ],
      correct: "B"
    },
    {
      question: "What should facilitators do if they notice a patient is not engaging during a session?",
      options: [
        "A) Ignore it and continue",
        "B) Gently check in with the patient and adjust the approach if needed",
        "C) Criticize their lack of participation",
        "D) End the session immediately"
      ],
      correct: "B"
    },
    {
      question: "Which of the following is an example of culturally responsive facilitation?",
      options: [
        "A) Using only Western classical music",
        "B) Incorporating diverse musical genres and respecting patients' cultural backgrounds",
        "C) Avoiding any discussion of culture",
        "D) Assuming all patients have the same musical preferences"
      ],
      correct: "B"
    },
    {
      question: "What is the primary purpose of follow-up communication after a telehealth session?",
      options: [
        "A) To sell additional services",
        "B) To reinforce therapeutic gains, provide resources, and maintain connection",
        "C) To check if the patient paid",
        "D) To gather feedback for marketing purposes"
      ],
      correct: "B"
    }
  ];

  let questionNum = 1;
  for (const q of session1BQuestions) {
    // Insert question
    const result = await db.insert(assessments).values({
      moduleId: 1,
      sectionId: section1B.id,
      questionNumber: questionNum,
      questionText: q.question,
      questionType: 'multiple_choice',
      correctAnswer: q.correct,
      points: 10,
    });

    const assessmentId = result[0].insertId;

    // Insert options
    const optionLabels = ['A', 'B', 'C', 'D'];
    for (let i = 0; i < q.options.length; i++) {
      const optionText = q.options[i].substring(3); // Remove "A) ", "B) ", etc.
      await db.insert(assessmentOptions).values({
        assessmentId: assessmentId,
        optionLetter: optionLabels[i],
        optionText: optionText,
        isCorrect: optionLabels[i] === q.correct,
      });
    }

    console.log(`✓ Added question ${questionNum}: ${q.question.substring(0, 60)}...`);
    questionNum++;
  }

  console.log(`\n✅ Successfully added ${session1BQuestions.length} Session 1B assessment questions!`);
  console.log('\nModule 1 now has:');
  console.log('  Section 1A: Original assessment questions');
  console.log('  Section 1B: 12 new assessment questions about telehealth and facilitation');
  
  process.exit(0);
}

addSession1BAssessments().catch((error) => {
  console.error('Error adding Session 1B assessments:', error);
  process.exit(1);
});
