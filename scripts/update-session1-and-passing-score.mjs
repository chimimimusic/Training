import { drizzle } from 'drizzle-orm/mysql2';
import { eq } from 'drizzle-orm';
import { assessments } from '../drizzle/schema.ts';
import * as dotenv from 'dotenv';

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

// Session 1 assessment questions
const session1Questions = [
  {
    question: "What is the primary purpose of Session 1 in the 10-week telehealth journey?",
    options: [
      "To complete all intake assessments and paperwork",
      "To test participants' technical equipment and internet connection",
      "To build the foundation where participants decide whether to trust you, the process, and themselves",
      "To demonstrate all 10 sessions in abbreviated format",
      "To establish billing procedures and session scheduling"
    ],
    correctAnswer: 2
  },
  {
    question: "Which element should NOT be included in your intake review essentials before Session 1?",
    options: [
      "Music preferences and meaningful songs",
      "Previous regulation attempts",
      "Technology comfort level and home environment setup",
      "Participant's complete medical history and diagnosis",
      "Any anxiety about the process"
    ],
    correctAnswer: 3
  },
  {
    question: "What is the recommended approach for helping participants create their optimal telehealth environment?",
    options: [
      "Require participants to purchase specific equipment before starting",
      "Insist all sessions take place in the same room throughout the program",
      "Guide them to create a comfortable space with quality audio, good lighting, and privacy",
      "Focus only on camera positioning and ignore audio quality",
      "Recommend they attend sessions from public spaces for accountability"
    ],
    correctAnswer: 2
  },
  {
    question: "How should you respond when a participant shares vulnerable information like \"I just want to stop feeling so anxious all the time\"?",
    options: [
      "Immediately offer solutions and reassurance to fix their problem",
      "Validate their courage: \"Thank you for sharing that with me here in your space. It takes courage to name what we're struggling with, especially in a virtual format.\"",
      "Change the subject to avoid making them more uncomfortable",
      "Ask them to save personal sharing for later sessions",
      "Recommend they speak with a medical professional instead"
    ],
    correctAnswer: 1
  },
  {
    question: "When explaining the 3-step protocol to participants, what tone should you use?",
    options: [
      "Mystical and complex to create intrigue",
      "Clinical and detached to maintain professional boundaries",
      "Logical and evidence-based, not mystical or overly complex",
      "Casual and dismissive to reduce pressure",
      "Urgent and dramatic to motivate participation"
    ],
    correctAnswer: 2
  },
  {
    question: "Which elements are included in the PRE-SHOT ROUTINE that participants co-create?",
    options: [
      "Physical centering, attention focusing, breathing preparation, intention setting, transition cue",
      "Equipment check, lighting adjustment, sound test, camera positioning, session recording",
      "Intake review, goal setting, music selection, homework assignment, session scheduling",
      "Warm-up exercises, stretching routine, meditation practice, journaling, reflection",
      "Technical troubleshooting, wifi testing, backup planning, emergency contacts, session notes"
    ],
    correctAnswer: 0
  },
  {
    question: "What should you avoid when helping participants select their first songs?",
    options: [
      "Considering their audio setup quality",
      "Balancing preferences with regulation principles",
      "Judging their choices or imposing your preferences",
      "Exploring how different pieces might support emotional goals",
      "Discussing how they'll access music for daily practice"
    ],
    correctAnswer: 2
  },
  {
    question: "During the first 5-minute virtual practice, what represents \"success\"?",
    options: [
      "Participants must demonstrate perfect technique immediately",
      "As exploration and data gathering: \"This week, you're gathering data about your own responses to the protocol in your personal space\"",
      "As tests to measure their commitment to the program",
      "As competition with other participants in the program",
      "As medical prescriptions that must be followed exactly"
    ],
    correctAnswer: 1
  },
  {
    question: "How should daily homework assignments be framed for participants?",
    options: [
      "As mandatory requirements with consequences for non-completion",
      "As exploration and data gathering: \"This week, you're gathering data about your own responses to the protocol in your personal space\"",
      "As tests to measure their commitment to the program",
      "As competition with other participants in the program",
      "As medical prescriptions that must be followed exactly"
    ],
    correctAnswer: 1
  },
  {
    question: "What should you emphasize about \"failures\" or missed practice days?",
    options: [
      "They indicate the participant isn't ready for the program",
      "They require additional homework assignments as makeup work",
      "They are information, not problems, providing valuable data for refinement",
      "They should be reported to supervisors for program modification",
      "They mean the participant needs to start over from Session 1"
    ],
    correctAnswer: 2
  },
  {
    question: "How should remote activities and resources be presented to participants?",
    options: [
      "As additional homework that increases their workload",
      "As extended support and practice companions between virtual sessions",
      "As optional activities only for highly motivated participant",
      "As backup plans in case telehealth sessions are cancelled",
      "As assessment tools to measure their progress between sessions"
    ],
    correctAnswer: 1
  },
  {
    question: "What is the facilitator's most important mindset for Session 1 success?",
    options: [
      "Focus on demonstrating your expertise and knowledge to impress participants",
      "Maintain strict adherence to the protocol without any flexibility",
      "Trust the telehealth process, participants' ability to engage meaningfully from their own spaces, and let genuine care guide every virtual interaction",
      "Emphasize the challenges and limitations of virtual delivery compared to in-person sessions",
      "Concentrate on technical troubleshooting rather than therapeutic relationship building"
    ],
    correctAnswer: 2
  }
];

async function updateSession1() {
  console.log('🔄 Updating Session 1 assessment questions...\n');

  // Delete existing assessments for Module 1
  await db.delete(assessments).where(eq(assessments.moduleId, 1));
  console.log('  ✅ Cleared existing Module 1 assessments');

  // Insert new assessments
  for (const [index, q] of session1Questions.entries()) {
    await db.insert(assessments).values({
      moduleId: 1,
      questionNumber: index + 1,
      questionText: q.question,
      questionType: 'multiple_choice',
      options: JSON.stringify(q.options),
      correctAnswer: q.correctAnswer.toString(),
      points: 10
    });
  }
  console.log(`  ✅ Inserted ${session1Questions.length} questions, ${session1Questions.length * 10} points total\n`);

  console.log('🎉 Session 1 assessment update complete!');
  console.log('   - Module 1: 12 questions, 120 points total');
  console.log('   - Passing score: 80% (96 points minimum)\n');
  
  process.exit(0);
}

updateSession1().catch((error) => {
  console.error('❌ Error updating Session 1 assessment:', error);
  process.exit(1);
});
