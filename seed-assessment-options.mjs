import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { assessments, assessmentOptions } from "./drizzle/schema.js";
import { eq } from "drizzle-orm";

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

// Assessment options data based on the provided content
const assessmentOptionsData = {
  // Module 1A
  1: [
    { letter: "A", text: "A structured program using music to address mental health", correct: true },
    { letter: "B", text: "A general wellness program", correct: false },
    { letter: "C", text: "A fitness training course", correct: false },
    { letter: "D", text: "A meditation technique", correct: false }
  ],
  2: [
    { letter: "A", text: "10 sessions", correct: true },
    { letter: "B", text: "5 sessions", correct: false },
    { letter: "C", text: "15 sessions", correct: false },
    { letter: "D", text: "20 sessions", correct: false }
  ],
  3: [
    { letter: "A", text: "Anxiety, depression, and stress", correct: true },
    { letter: "B", text: "Physical injuries", correct: false },
    { letter: "C", text: "Sleep disorders only", correct: false },
    { letter: "D", text: "Substance abuse only", correct: false }
  ],
  4: [
    { letter: "A", text: "To create a safe, supportive environment", correct: true },
    { letter: "B", text: "To diagnose mental health conditions", correct: false },
    { letter: "C", text: "To prescribe medication", correct: false },
    { letter: "D", text: "To provide physical therapy", correct: false }
  ],
  5: [
    { letter: "A", text: "Active listening, empathy, and non-judgment", correct: true },
    { letter: "B", text: "Medical diagnosis skills", correct: false },
    { letter: "C", text: "Music performance skills", correct: false },
    { letter: "D", text: "Counseling certification", correct: false }
  ],

  // Module 2
  6: [
    { letter: "A", text: "Reducing symptoms of anxiety and depression", correct: true },
    { letter: "B", text: "Teaching music theory", correct: false },
    { letter: "C", text: "Improving physical fitness", correct: false },
    { letter: "D", text: "Providing entertainment", correct: false }
  ],
  7: [
    { letter: "A", text: "It activates multiple brain regions simultaneously", correct: true },
    { letter: "B", text: "It only affects the auditory cortex", correct: false },
    { letter: "C", text: "It has no measurable brain effects", correct: false },
    { letter: "D", text: "It only works during sleep", correct: false }
  ],
  8: [
    { letter: "A", text: "Neuroplasticity", correct: true },
    { letter: "B", text: "Neurodegeneration", correct: false },
    { letter: "C", text: "Neurotransmission only", correct: false },
    { letter: "D", text: "Neuroinflammation", correct: false }
  ],
  9: [
    { letter: "A", text: "Dopamine and serotonin", correct: true },
    { letter: "B", text: "Adrenaline only", correct: false },
    { letter: "C", text: "Insulin and glucagon", correct: false },
    { letter: "D", text: "Testosterone and estrogen", correct: false }
  ],
  10: [
    { letter: "A", text: "Reduced cortisol levels and lower heart rate", correct: true },
    { letter: "B", text: "Increased blood pressure", correct: false },
    { letter: "C", text: "Higher stress hormone levels", correct: false },
    { letter: "D", text: "No physiological changes", correct: false }
  ],

  // Module 3
  11: [
    { letter: "A", text: "To establish trust and understand the participant's needs", correct: true },
    { letter: "B", text: "To diagnose mental health conditions", correct: false },
    { letter: "C", text: "To teach music theory", correct: false },
    { letter: "D", text: "To complete paperwork", correct: false }
  ],
  12: [
    { letter: "A", text: "Active listening and empathetic responses", correct: true },
    { letter: "B", text: "Giving advice immediately", correct: false },
    { letter: "C", text: "Focusing on your own experiences", correct: false },
    { letter: "D", text: "Interrupting to clarify", correct: false }
  ],
  13: [
    { letter: "A", text: "Creating a safe, non-judgmental space", correct: true },
    { letter: "B", text: "Providing medical treatment", correct: false },
    { letter: "C", text: "Teaching advanced music skills", correct: false },
    { letter: "D", text: "Enforcing strict rules", correct: false }
  ],
  14: [
    { letter: "A", text: "Acknowledge their feelings and provide reassurance", correct: true },
    { letter: "B", text: "Tell them to calm down", correct: false },
    { letter: "C", text: "Ignore the emotions", correct: false },
    { letter: "D", text: "End the session immediately", correct: false }
  ],
  15: [
    { letter: "A", text: "Confidentiality, informed consent, and professional boundaries", correct: true },
    { letter: "B", text: "Sharing participant information freely", correct: false },
    { letter: "C", text: "Making medical diagnoses", correct: false },
    { letter: "D", text: "Prescribing treatments", correct: false }
  ],

  // Module 4
  16: [
    { letter: "A", text: "To help participants identify and express emotions", correct: true },
    { letter: "B", text: "To teach music performance", correct: false },
    { letter: "C", text: "To provide entertainment", correct: false },
    { letter: "D", text: "To diagnose emotional disorders", correct: false }
  ],
  17: [
    { letter: "A", text: "Listening to calming music and discussing emotional responses", correct: true },
    { letter: "B", text: "Performing complex musical pieces", correct: false },
    { letter: "C", text: "Memorizing music theory", correct: false },
    { letter: "D", text: "Competing in music contests", correct: false }
  ],
  18: [
    { letter: "A", text: "It provides a non-verbal outlet for expression", correct: true },
    { letter: "B", text: "It replaces verbal communication entirely", correct: false },
    { letter: "C", text: "It has no emotional impact", correct: false },
    { letter: "D", text: "It only works for musicians", correct: false }
  ],
  19: [
    { letter: "A", text: "Anxiety, sadness, anger, and joy", correct: true },
    { letter: "B", text: "Only positive emotions", correct: false },
    { letter: "C", text: "Only negative emotions", correct: false },
    { letter: "D", text: "Physical sensations only", correct: false }
  ],
  20: [
    { letter: "A", text: "Validate their feelings and explore them through music", correct: true },
    { letter: "B", text: "Tell them to suppress emotions", correct: false },
    { letter: "C", text: "Change the topic immediately", correct: false },
    { letter: "D", text: "End the session", correct: false }
  ],

  // Module 5
  21: [
    { letter: "A", text: "To reduce stress and promote relaxation", correct: true },
    { letter: "B", text: "To increase anxiety", correct: false },
    { letter: "C", text: "To teach meditation", correct: false },
    { letter: "D", text: "To improve physical strength", correct: false }
  ],
  22: [
    { letter: "A", text: "Slow tempo, soft dynamics, and simple melodies", correct: true },
    { letter: "B", text: "Fast tempo and loud volume", correct: false },
    { letter: "C", text: "Complex harmonies only", correct: false },
    { letter: "D", text: "Random noise", correct: false }
  ],
  23: [
    { letter: "A", text: "Breathing exercises paired with calming music", correct: true },
    { letter: "B", text: "Intense physical exercise", correct: false },
    { letter: "C", text: "Competitive games", correct: false },
    { letter: "D", text: "Loud music sessions", correct: false }
  ],
  24: [
    { letter: "A", text: "It lowers cortisol and activates the parasympathetic nervous system", correct: true },
    { letter: "B", text: "It increases stress hormones", correct: false },
    { letter: "C", text: "It has no physiological effect", correct: false },
    { letter: "D", text: "It only affects hearing", correct: false }
  ],
  25: [
    { letter: "A", text: "Reduced heart rate, deeper breathing, and muscle relaxation", correct: true },
    { letter: "B", text: "Increased tension", correct: false },
    { letter: "C", text: "Higher blood pressure", correct: false },
    { letter: "D", text: "No observable changes", correct: false }
  ],

  // Module 6
  26: [
    { letter: "A", text: "To help participants recognize and challenge unhelpful thoughts", correct: true },
    { letter: "B", text: "To teach music composition", correct: false },
    { letter: "C", text: "To provide entertainment", correct: false },
    { letter: "D", text: "To diagnose cognitive disorders", correct: false }
  ],
  27: [
    { letter: "A", text: "Negative, distorted thoughts that affect mood and behavior", correct: true },
    { letter: "B", text: "Positive affirmations", correct: false },
    { letter: "C", text: "Musical preferences", correct: false },
    { letter: "D", text: "Physical sensations", correct: false }
  ],
  28: [
    { letter: "A", text: "Listening to uplifting music and identifying positive themes", correct: true },
    { letter: "B", text: "Memorizing song lyrics", correct: false },
    { letter: "C", text: "Performing in front of others", correct: false },
    { letter: "D", text: "Competing in music trivia", correct: false }
  ],
  29: [
    { letter: "A", text: "It provides a positive emotional experience that counters negativity", correct: true },
    { letter: "B", text: "It has no cognitive impact", correct: false },
    { letter: "C", text: "It only affects memory", correct: false },
    { letter: "D", text: "It worsens negative thinking", correct: false }
  ],
  30: [
    { letter: "A", text: "Ask open-ended questions and encourage reflection", correct: true },
    { letter: "B", text: "Tell them they're wrong", correct: false },
    { letter: "C", text: "Ignore their thoughts", correct: false },
    { letter: "D", text: "Change the subject", correct: false }
  ],

  // Module 7
  31: [
    { letter: "A", text: "To build confidence and a sense of accomplishment", correct: true },
    { letter: "B", text: "To create professional musicians", correct: false },
    { letter: "C", text: "To compete in music contests", correct: false },
    { letter: "D", text: "To memorize music theory", correct: false }
  ],
  32: [
    { letter: "A", text: "Simple instruments like drums, shakers, and xylophones", correct: true },
    { letter: "B", text: "Only advanced instruments", correct: false },
    { letter: "C", text: "No instruments", correct: false },
    { letter: "D", text: "Only electronic instruments", correct: false }
  ],
  33: [
    { letter: "A", text: "It releases dopamine and creates a sense of achievement", correct: true },
    { letter: "B", text: "It has no psychological effect", correct: false },
    { letter: "C", text: "It increases anxiety", correct: false },
    { letter: "D", text: "It only affects hearing", correct: false }
  ],
  34: [
    { letter: "A", text: "Encourage experimentation and celebrate small successes", correct: true },
    { letter: "B", text: "Criticize mistakes", correct: false },
    { letter: "C", text: "Focus only on perfection", correct: false },
    { letter: "D", text: "Avoid giving feedback", correct: false }
  ],
  35: [
    { letter: "A", text: "Provide gentle guidance and reassurance", correct: true },
    { letter: "B", text: "Force them to participate", correct: false },
    { letter: "C", text: "Ignore their hesitation", correct: false },
    { letter: "D", text: "End the session", correct: false }
  ],

  // Module 9
  36: [
    { letter: "A", text: "To reinforce skills and prepare for independent practice", correct: true },
    { letter: "B", text: "To introduce new concepts", correct: false },
    { letter: "C", text: "To diagnose conditions", correct: false },
    { letter: "D", text: "To provide entertainment", correct: false }
  ],
  37: [
    { letter: "A", text: "Reviewing progress, celebrating achievements, and setting goals", correct: true },
    { letter: "B", text: "Starting new topics", correct: false },
    { letter: "C", text: "Ending abruptly", correct: false },
    { letter: "D", text: "Focusing only on challenges", correct: false }
  ],
  38: [
    { letter: "A", text: "Creating personalized playlists and practice routines", correct: true },
    { letter: "B", text: "Telling them to figure it out alone", correct: false },
    { letter: "C", text: "Providing no follow-up", correct: false },
    { letter: "D", text: "Ending all contact", correct: false }
  ],
  39: [
    { letter: "A", text: "Acknowledge their concerns and offer continued support", correct: true },
    { letter: "B", text: "Tell them they're ready", correct: false },
    { letter: "C", text: "Ignore their feelings", correct: false },
    { letter: "D", text: "End the program immediately", correct: false }
  ],
  40: [
    { letter: "A", text: "Providing resources, check-ins, and encouragement", correct: true },
    { letter: "B", text: "No follow-up needed", correct: false },
    { letter: "C", text: "Only medical referrals", correct: false },
    { letter: "D", text: "Ending all communication", correct: false }
  ],
};

console.log("Starting assessment options seeding...");

// Get all assessments
const allAssessments = await db.select().from(assessments);
console.log(`Found ${allAssessments.length} assessment questions`);

let addedCount = 0;

for (const assessment of allAssessments) {
  const options = assessmentOptionsData[assessment.questionNumber];
  
  if (!options) {
    console.log(`No options defined for question ${assessment.questionNumber}`);
    continue;
  }

  // Check if options already exist
  const existing = await db
    .select()
    .from(assessmentOptions)
    .where(eq(assessmentOptions.assessmentId, assessment.id));

  if (existing.length > 0) {
    console.log(`Options already exist for question ${assessment.questionNumber}, skipping...`);
    continue;
  }

  // Insert options
  for (const option of options) {
    await db.insert(assessmentOptions).values({
      assessmentId: assessment.id,
      optionLetter: option.letter,
      optionText: option.text,
      isCorrect: option.correct,
    });
    addedCount++;
  }

  console.log(`Added ${options.length} options for question ${assessment.questionNumber}`);
}

console.log(`\nSeeding complete! Added ${addedCount} assessment options.`);

await connection.end();
