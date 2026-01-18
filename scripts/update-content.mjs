import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { modules } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";
import { readFileSync } from "fs";

const db = drizzle(process.env.DATABASE_URL);

// YouTube video IDs extracted from URLs
const videoIds = {
  1: "iwPnLcsSkqc",  // Video 1
  2: "SWPSDYx3Xes",  // Video 1B
  3: "fEEbuk-KnhM",  // Video 2
  4: "fpLFg6j5neo",  // Video 3
  5: "rv9mKx2QCdE",  // Video 4
  6: "-4AdTnf2FBY",  // Video 5
  7: "_oWrYJt-zQ8",  // Video 6
  8: "mdOXrGSbNkc",  // Video 7
  9: "ciFoGuKcQQU",  // Video 8
  10: "_4d05Mp6_ZE", // Video 9
};

// Transcript file mapping
const transcriptFiles = {
  1: "/home/ubuntu/upload/SB_Training_Session_One_Transcript.txt",
  2: "/home/ubuntu/upload/SB_Session1B_Transcript.txt",
  3: "/home/ubuntu/upload/SB_Session2_Transcript(1).txt",
  4: "/home/ubuntu/upload/SB_Session3_Transcript.txt",
  5: "/home/ubuntu/upload/Session4FacilitatorTrainingScript.txt",
  6: "/home/ubuntu/upload/SB_Session5_Transcript.txt",
  7: "/home/ubuntu/upload/SB_Session6_Transcript.txt",
  8: "/home/ubuntu/upload/SB_Session7_Transcript.txt",
  9: "/home/ubuntu/upload/SB_Session9_Transcript.txt",
  10: null, // No transcript yet
};

console.log("🔄 Updating modules with YouTube video IDs and transcripts...\n");

for (let moduleNum = 1; moduleNum <= 10; moduleNum++) {
  const videoId = videoIds[moduleNum];
  const transcriptFile = transcriptFiles[moduleNum];
  
  let transcript = null;
  
  if (transcriptFile) {
    try {
      transcript = readFileSync(transcriptFile, "utf-8").trim();
      if (transcript.length === 0) {
        console.log(`⚠️  Module ${moduleNum}: Transcript file is empty`);
        transcript = `Transcript for Module ${moduleNum} will be added soon.`;
      } else {
        console.log(`✅ Module ${moduleNum}: Loaded transcript (${transcript.length} characters)`);
      }
    } catch (error) {
      console.log(`⚠️  Module ${moduleNum}: Could not read transcript file - ${error.message}`);
      transcript = `Transcript for Module ${moduleNum} will be added soon.`;
    }
  } else {
    transcript = `Transcript for Module ${moduleNum} will be added soon.`;
    console.log(`ℹ️  Module ${moduleNum}: No transcript file specified`);
  }
  
  // Update the module
  await db
    .update(modules)
    .set({
      youtubeVideoId: videoId || null,
      transcript: transcript,
    })
    .where(eq(modules.moduleNumber, moduleNum));
  
  console.log(`📝 Module ${moduleNum}: Updated with video ID "${videoId || 'TBD'}"\n`);
}

console.log("🎉 All modules updated successfully!");
process.exit(0);
