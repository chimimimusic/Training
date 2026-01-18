import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '../drizzle/schema.ts';
import { eq } from 'drizzle-orm';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

// Module 2 (Session 1B) - 12 questions
const module2Questions = [
  {
    questionText: "According to the video, what three decisions do patients make during Session 1?",
    options: [
      "Whether to continue the program, change facilitators, or request modifications",
      "Whether to trust you through their screen, trust the process, and trust themselves to try something new",
      "Whether to invest financially, commit time, and share personal information",
      "Whether to use music, breathing, or visualization techniques",
      "Whether to practice daily, weekly, or only during sessions"
    ],
    correctAnswer: 1
  },
  {
    questionText: "What should facilitators gather from participants' intake information before Session 1?",
    options: [
      "Music preferences, previous regulation attempts, technology comfort level, and any anxiety about the process",
      "Complete medical history, diagnosis, medications, and treatment history",
      "Family history, childhood experiences, and trauma background",
      "Insurance information, payment preferences, and scheduling constraints",
      "Educational background, career history, and personal goals"
    ],
    correctAnswer: 0
  },
  {
    questionText: "What are the three essentials for creating an optimal telehealth environment?",
    options: [
      "Professional background, specific equipment, and consistent room placement",
      "Quality audio, good lighting, and privacy",
      "High-speed internet, multiple monitors, and external speakers",
      "Quiet space, comfortable seating, and room temperature control",
      "Neutral colors, minimal distractions, and professional appearance"
    ],
    correctAnswer: 1
  },
  {
    questionText: "When a participant shares \"I just want to stop feeling so anxious all the time,\" what is the recommended response approach?",
    options: [
      "Immediately offer specific techniques to address their anxiety",
      "Redirect the conversation to the protocol structure",
      "Validate their courage for sharing, acknowledging the challenge of opening up through a screen",
      "Ask follow-up questions about the history of their anxiety",
      "Reassure them that the program will definitely help"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators present the 3-step protocol to participants?",
    options: [
      "With dramatic urgency to motivate immediate engagement",
      "Using mystical language to create intrigue and curiosity",
      "With a logical, evidence-based tone grounded in neuroscience, psychology, and music therapy research",
      "In clinical, detached language to maintain professional boundaries",
      "With casual, dismissive language to reduce pressure"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What are the five elements of the pre-shot routine that facilitators co-create with participants?",
    options: [
      "Physical centering, attention focusing, breathing preparation, intention setting, and transition cue",
      "Equipment check, lighting adjustment, sound test, camera positioning, and session recording",
      "Goal review, music selection, breathing exercise, visualization, and journaling",
      "Warm-up stretches, meditation practice, affirmations, gratitude list, and reflection",
      "Check-in questions, homework review, technique practice, feedback discussion, and scheduling"
    ],
    correctAnswer: 0
  },
  {
    questionText: "What is the one thing facilitators must absolutely avoid when helping participants select music?",
    options: [
      "Discussing how different pieces might support emotional goals",
      "Considering their audio setup quality",
      "Judging their choices or imposing your own preferences",
      "Balancing personal preferences with regulation principles",
      "Discussing how they'll access music for daily practice"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators frame the first 5-minute practice experience?",
    options: [
      "As a test to evaluate their readiness for the program",
      "As an opportunity to demonstrate perfect technique",
      "As exploration and data gathering - noticing what feels natural, awkward, or surprising with \"no wrong way to do this\"",
      "As a preview of what they'll do independently at home",
      "As a comparison point for measuring future progress"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What is the recommended framing for daily homework assignments?",
    options: [
      "As mandatory requirements with consequences for non-completion",
      "As tests of their commitment to the program",
      "As exploration and data gathering: \"You're the researcher studying yourself\"",
      "As competition with other participants in the program",
      "As medical prescriptions that must be followed exactly"
    ],
    correctAnswer: 2
  },
  {
    questionText: "According to the video, how should facilitators respond when participants miss practice days or feel like they \"failed\"?",
    options: [
      "Assign makeup work to get them back on track",
      "Express concern and report it as a program issue",
      "Help them reframe - missed days are information, not problems, providing valuable data for refinement",
      "Suggest they may not be ready for the program",
      "Recommend starting over from the beginning"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should remote activities and resources be positioned for participants?",
    options: [
      "As additional homework that increases their workload",
      "As extended support and practice companions - \"use what helps, skip what doesn't\"",
      "As optional extras only for highly motivated participants",
      "As backup plans in case telehealth sessions are cancelled",
      "As assessment tools to measure their progress between sessions"
    ],
    correctAnswer: 1
  },
  {
    questionText: "What is the most important facilitator mindset for Session 1 success according to the video?",
    options: [
      "Demonstrating expertise and impressing participants with knowledge",
      "Strict adherence to the protocol without flexibility",
      "Emphasizing the challenges and limitations of virtual delivery",
      "Trust the telehealth process, trust participants' ability to engage meaningfully, and let genuine care guide every interaction",
      "Focusing on technical troubleshooting rather than relationship building"
    ],
    correctAnswer: 3
  }
];

// Module 8 (Session 8) - 12 questions
const module8Questions = [
  {
    questionText: "What transformation occurs for participants in Session 8?",
    options: [
      "From individual work to group collaboration and peer support",
      "From basic techniques to advanced neuroscience understanding",
      "From protocol followers to regulation artists - becoming playlist architects",
      "From music-based interventions to purely breathing-focused practices",
      "From weekly sessions to daily intensive practice requirements"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What type of facilitator energy does Session 8 require?",
    options: [
      "Strict and disciplinary to maintain focus on technical accuracy",
      "A different energy - moving from teacher to creative collaborator",
      "Calm and meditative to support deep introspection",
      "Analytical and scientific to explain complex musical theory",
      "Minimal involvement to allow completely independent work"
    ],
    correctAnswer: 1
  },
  {
    questionText: "When participants reflect on breathing experiences, what should facilitators listen for?",
    options: [
      "Only what worked well to build on their successes",
      "Technical accuracy in their breathing technique execution",
      "What worked AND what gaps they're discovering - casual mentions of challenges are gold",
      "Complaints about the difficulty of the breathing practices",
      "Comparisons to other participants' experiences and progress"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What is the facilitator's primary role during music selection?",
    options: [
      "To be the music expert who knows every song and genre",
      "To assign specific songs based on scientific tempo requirements",
      "To be the regulation expert who guides matching music to emotional states",
      "To critique participants' musical tastes and suggest improvements",
      "To maintain strict adherence to predetermined playlist protocols"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators approach the music selection process?",
    options: [
      "Start with desired state: \"What music makes you feel calm?\"",
      "Focus on tempo matching above all other considerations",
      "Start with current state: \"What music matches how you feel when stressed at work?\"",
      "Use only instrumental music to avoid lyrical distractions",
      "Assign music based on successful outcomes with other participants"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators respond when participants say \"I don't know much about music\"?",
    options: [
      "Suggest they research musical genres before continuing the session",
      "Assign them a standard playlist to avoid decision paralysis",
      "Redirect: \"You know what moves you. That's exactly what we need.\"",
      "Recommend they observe other participants' selections first",
      "Focus only on scientifically validated musical selections"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What is more valuable than \"perfect\" tempo matches during music selection?",
    options: [
      "Songs that are popular and widely recognized by most people",
      "Instrumental pieces without lyrical content to compete for attention",
      "Emotional resonance - when participants' faces light up mentioning a song",
      "Music from specific genres known to have therapeutic properties",
      "Songs that other participants have successfully used in their playlists"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators approach breathing technique and music pairings?",
    options: [
      "Assign techniques randomly to encourage experimental exploration",
      "Use the same breathing technique for all playlists to maintain consistency",
      "Help participants feel the logic - box breathing with structured music for focus makes sense",
      "Focus only on diaphragmatic breathing as the foundational technique",
      "Let participants choose without any guidance to promote autonomy"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators frame participants' desire to refine earlier playlists?",
    options: [
      "As failure to get it right the first time, requiring correction",
      "As sophistication and nuanced understanding of their regulation patterns",
      "As resistance to the original therapeutic recommendations",
      "As perfectionism that needs to be discouraged for progress",
      "As indication they weren't paying attention during earlier sessions"
    ],
    correctAnswer: 1
  },
  {
    questionText: "What is the difference between asking \"What did you notice?\" versus \"How did that feel?\" after practice?",
    options: [
      "There is no meaningful difference between these two questions",
      "The first is more clinical, the second is more therapeutic",
      "The first invites observation, the second invites evaluation - you want internal awareness development",
      "The first is for beginners, the second is for advanced practitioners",
      "The first focuses on problems, the second focuses on positive outcomes"
    ],
    correctAnswer: 2
  },
  {
    questionText: "How should facilitators address the \"forgetting-when-stressed paradox\"?",
    options: [
      "As a sign that participants aren't truly committed to the process",
      "As evidence that the techniques aren't effective under real stress",
      "As universal, relatable, and solvable - creating connection rather than shame",
      "As a reason to increase practice frequency and intensity requirements",
      "As indication that participants need more advanced techniques"
    ],
    correctAnswer: 2
  },
  {
    questionText: "What is the ultimate goal of Session 8 according to the facilitator guidance?",
    options: [
      "To ensure all participants have identical regulation tools and approaches",
      "To establish the facilitator as the ongoing expert for future playlist creation",
      "To give participants principles, not rules - teaching them to fish, not providing fish",
      "To prepare participants for advanced musical theory and composition training",
      "To create standardized playlists that can be replicated across different populations"
    ],
    correctAnswer: 2
  }
];

console.log('Deleting existing assessments for Module 2 (Session 1B)...');
await db.delete(schema.assessments).where(eq(schema.assessments.moduleId, 2));

console.log('Deleting existing assessments for Module 8 (Session 8)...');
await db.delete(schema.assessments).where(eq(schema.assessments.moduleId, 8));

console.log('Inserting new assessments for Module 2 (Session 1B)...');
for (let i = 0; i < module2Questions.length; i++) {
  const q = module2Questions[i];
  const [result] = await db.insert(schema.assessments).values({
    moduleId: 2,
    questionNumber: i + 1,
    questionText: q.questionText,
    questionType: 'multiple_choice',
    correctAnswer: String(q.correctAnswer),
    points: 10
  });
  
  const assessmentId = result.insertId;
  const letters = ['A', 'B', 'C', 'D', 'E'];
  
  for (let j = 0; j < q.options.length; j++) {
    await db.insert(schema.assessmentOptions).values({
      assessmentId: assessmentId,
      optionLetter: letters[j],
      optionText: q.options[j],
      isCorrect: j === q.correctAnswer
    });
  }
}

console.log('Inserting new assessments for Module 8 (Session 8)...');
for (let i = 0; i < module8Questions.length; i++) {
  const q = module8Questions[i];
  const [result] = await db.insert(schema.assessments).values({
    moduleId: 8,
    questionNumber: i + 1,
    questionText: q.questionText,
    questionType: 'multiple_choice',
    correctAnswer: String(q.correctAnswer),
    points: 10
  });
  
  const assessmentId = result.insertId;
  const letters = ['A', 'B', 'C', 'D', 'E'];
  
  for (let j = 0; j < q.options.length; j++) {
    await db.insert(schema.assessmentOptions).values({
      assessmentId: assessmentId,
      optionLetter: letters[j],
      optionText: q.options[j],
      isCorrect: j === q.correctAnswer
    });
  }
}

console.log('✅ Assessment update complete!');
console.log(`   Module 2 (Session 1B): ${module2Questions.length} questions inserted`);
console.log(`   Module 8 (Session 8): ${module8Questions.length} questions inserted`);

await connection.end();
