import { drizzle } from "drizzle-orm/mysql2";
import { modules, assessments, assessmentOptions } from "../drizzle/schema.js";
import * as dotenv from "dotenv";

dotenv.config();

const db = drizzle(process.env.DATABASE_URL);

const modulesData = [
  {
    moduleNumber: 1,
    title: "Introduction to SoundBridge Health Protocol",
    description: "Overview of the music-based intervention protocol, evidence base, and facilitator role",
    youtubeVideoId: "dQw4w9WgXcQ", // Placeholder - user will provide actual IDs
    videoDurationMinutes: 15,
    transcriptContent: "This is a placeholder transcript for Module 1. The actual transcript will be provided by the user.",
    orderIndex: 1,
  },
  {
    moduleNumber: 2,
    title: "Understanding Anxiety and Depression",
    description: "Clinical foundations of anxiety and depression disorders",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 20,
    transcriptContent: "This is a placeholder transcript for Module 2.",
    orderIndex: 2,
  },
  {
    moduleNumber: 3,
    title: "Music-Based Intervention Fundamentals",
    description: "Core principles of music-based intervention and therapeutic mechanisms",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 25,
    transcriptContent: "This is a placeholder transcript for Module 3.",
    orderIndex: 3,
  },
  {
    moduleNumber: 4,
    title: "Session Structure and Planning",
    description: "How to structure effective 45-minute telehealth sessions",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 18,
    transcriptContent: "This is a placeholder transcript for Module 4.",
    orderIndex: 4,
  },
  {
    moduleNumber: 5,
    title: "Building Therapeutic Rapport",
    description: "Establishing trust and connection in virtual settings",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 22,
    transcriptContent: "This is a placeholder transcript for Module 5.",
    orderIndex: 5,
  },
  {
    moduleNumber: 6,
    title: "Assessment and Progress Tracking",
    description: "Using PHQ-9 and GAD-7 assessments effectively",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 20,
    transcriptContent: "This is a placeholder transcript for Module 6.",
    orderIndex: 6,
  },
  {
    moduleNumber: 7,
    title: "Crisis Management and Safety",
    description: "Recognizing and responding to crisis situations",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 30,
    transcriptContent: "This is a placeholder transcript for Module 7.",
    orderIndex: 7,
  },
  {
    moduleNumber: 8,
    title: "Cultural Competency in Music-Based Intervention",
    description: "Adapting interventions for diverse populations",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 18,
    transcriptContent: "This is a placeholder transcript for Module 8.",
    orderIndex: 8,
  },
  {
    moduleNumber: 9,
    title: "Ethics and Professional Boundaries",
    description: "Ethical considerations and maintaining professional standards",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 25,
    transcriptContent: "This is a placeholder transcript for Module 9.",
    orderIndex: 9,
  },
  {
    moduleNumber: 10,
    title: "Certification and Next Steps",
    description: "Final requirements and launching your practice",
    youtubeVideoId: "dQw4w9WgXcQ",
    videoDurationMinutes: 15,
    transcriptContent: "This is a placeholder transcript for Module 10.",
    orderIndex: 10,
  },
];

// Sample assessment questions for each module
const assessmentsData = [
  // Module 1 assessments
  {
    moduleId: 1,
    questionNumber: 1,
    questionText: "What is the primary goal of the SoundBridge Health protocol?",
    questionType: "multiple_choice",
    correctAnswer: "B",
    points: 10,
  },
  {
    moduleId: 1,
    questionNumber: 2,
    questionText: "How many weeks does the standard SoundBridge protocol last?",
    questionType: "multiple_choice",
    correctAnswer: "C",
    points: 10,
  },
  {
    moduleId: 1,
    questionNumber: 3,
    questionText: "Describe the role of a facilitator in the SoundBridge Health program.",
    questionType: "short_answer",
    correctAnswer: "guide, support, music-based intervention, sessions",
    points: 15,
  },
  
  // Module 2 assessments
  {
    moduleId: 2,
    questionNumber: 1,
    questionText: "Which assessment tool is used to measure depression symptoms?",
    questionType: "multiple_choice",
    correctAnswer: "A",
    points: 10,
  },
  {
    moduleId: 2,
    questionNumber: 2,
    questionText: "What is the difference between anxiety and depression?",
    questionType: "short_answer",
    correctAnswer: "worry, fear, sadness, hopelessness, symptoms",
    points: 15,
  },
];

const assessmentOptionsData = [
  // Module 1, Question 1 options
  { assessmentId: 1, optionLetter: "A", optionText: "To replace traditional therapy", isCorrect: false },
  { assessmentId: 1, optionLetter: "B", optionText: "To reduce anxiety and depression through music-based intervention", isCorrect: true },
  { assessmentId: 1, optionLetter: "C", optionText: "To teach music skills", isCorrect: false },
  { assessmentId: 1, optionLetter: "D", optionText: "To provide entertainment", isCorrect: false },
  
  // Module 1, Question 2 options
  { assessmentId: 2, optionLetter: "A", optionText: "4 weeks", isCorrect: false },
  { assessmentId: 2, optionLetter: "B", optionText: "8 weeks", isCorrect: false },
  { assessmentId: 2, optionLetter: "C", optionText: "10 weeks", isCorrect: true },
  { assessmentId: 2, optionLetter: "D", optionText: "12 weeks", isCorrect: false },
  
  // Module 2, Question 1 options
  { assessmentId: 4, optionLetter: "A", optionText: "PHQ-9", isCorrect: true },
  { assessmentId: 4, optionLetter: "B", optionText: "GAD-7", isCorrect: false },
  { assessmentId: 4, optionLetter: "C", optionText: "MMPI", isCorrect: false },
  { assessmentId: 4, optionLetter: "D", optionText: "Beck Depression Inventory", isCorrect: false },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    // Insert modules
    console.log("📚 Inserting modules...");
    await db.insert(modules).values(modulesData);
    console.log("✅ Modules inserted");

    // Insert assessments
    console.log("📝 Inserting assessments...");
    await db.insert(assessments).values(assessmentsData);
    console.log("✅ Assessments inserted");

    // Insert assessment options
    console.log("🔤 Inserting assessment options...");
    await db.insert(assessmentOptions).values(assessmentOptionsData);
    console.log("✅ Assessment options inserted");

    console.log("🎉 Database seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
