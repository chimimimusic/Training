import { drizzle } from "drizzle-orm/mysql2";
import { eq } from "drizzle-orm";
import { modules, assessments } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

console.log("=== CHECKING ALL MODULE CONTENT ===\n");

const allModules = await db.select().from(modules);

for (const module of allModules) {
  console.log(`\n--- Module ${module.moduleNumber}: ${module.title} ---`);
  console.log(`Video ID: ${module.youtubeVideoId}`);
  console.log(`Video Status: ${module.youtubeVideoId === 'PLACEHOLDER' ? '❌ MISSING' : '✅ HAS VIDEO'}`);
  
  const transcriptLength = module.transcriptContent?.length || 0;
  const hasRealTranscript = transcriptLength > 200 && !module.transcriptContent?.includes('PLACEHOLDER');
  console.log(`Transcript: ${transcriptLength} chars - ${hasRealTranscript ? '✅ HAS TRANSCRIPT' : '❌ MISSING/PLACEHOLDER'}`);
  
  const moduleAssessments = await db.select().from(assessments).where(eq(assessments.moduleId, module.id));
  const hasPlaceholder = moduleAssessments.some(a => a.questionText.includes('PLACEHOLDER') || a.questionText.includes('placeholder'));
  console.log(`Assessments: ${moduleAssessments.length} questions - ${hasPlaceholder ? '❌ HAS PLACEHOLDERS' : '✅ COMPLETE'}`);
}

process.exit(0);
