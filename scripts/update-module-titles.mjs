import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { modules } from "../drizzle/schema.ts";
import { eq } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL);

const moduleData = [
  {
    number: 1,
    title: "Introduction to SoundBridge Health Protocol",
    description: "Overview of the music-based intervention protocol, evidence base, and facilitator role",
  },
  {
    number: 2,
    title: "Understanding Anxiety and Depression",
    description: "Clinical foundations of anxiety and depression disorders",
  },
  {
    number: 3,
    title: "Music-Based Intervention Fundamentals",
    description: "The science behind music's impact on mental health and emotional regulation",
  },
  {
    number: 4,
    title: "Session Structure and Flow",
    description: "Detailed walkthrough of the 10-session protocol structure",
  },
  {
    number: 5,
    title: "Facilitation Techniques",
    description: "Core skills for effective virtual facilitation and patient engagement",
  },
  {
    number: 6,
    title: "Telehealth Best Practices",
    description: "Creating optimal virtual environments and managing technical challenges",
  },
  {
    number: 7,
    title: "Patient Assessment and Progress Tracking",
    description: "Monitoring patient outcomes and adjusting interventions",
  },
  {
    number: 8,
    title: "Handling Difficult Situations",
    description: "Crisis management, boundaries, and when to escalate care",
  },
  {
    number: 9,
    title: "Clinical Documentation and Compliance",
    description: "HIPAA compliance, documentation requirements, and BAA agreements",
  },
  {
    number: 10,
    title: "Certification and Next Steps",
    description: "Final assessment, certification process, and ongoing professional development",
  },
];

console.log("🔄 Updating module titles and descriptions...\n");

for (const data of moduleData) {
  await db
    .update(modules)
    .set({
      title: data.title,
      description: data.description,
    })
    .where(eq(modules.moduleNumber, data.number));
  
  console.log(`✅ Module ${data.number}: ${data.title}`);
}

console.log("\n🎉 All module titles and descriptions updated!");
process.exit(0);
