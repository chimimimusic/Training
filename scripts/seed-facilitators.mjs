import { drizzle } from "drizzle-orm/mysql2";
import { users } from "../drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const dummyFacilitators = [
  {
    openId: `facilitator-${Date.now()}-1`,
    name: "Dr. Sarah Martinez",
    email: "sarah.martinez@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 123-4567",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    bio: "Board-certified music facilitator with 8+ years of experience working with anxiety and depression patients. Specializes in creating personalized music-based intervention plans that integrate seamlessly with traditional mental health treatment.",
    specializations: "Anxiety Disorders, Depression, PTSD, Stress Management",
    calendarLink: "https://calendly.com/sarah-martinez-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
  {
    openId: `facilitator-${Date.now()}-2`,
    name: "Michael Chen",
    email: "michael.chen@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 234-5678",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    bio: "Experienced facilitator specializing in telehealth delivery of music-based interventions. Passionate about making mental health support accessible to underserved communities through virtual sessions.",
    specializations: "Telehealth, Anxiety, Depression, Young Adults",
    calendarLink: "https://calendly.com/michael-chen-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
  {
    openId: `facilitator-${Date.now()}-3`,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 345-6789",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
    bio: "Bilingual facilitator (English/Spanish) with expertise in culturally-sensitive music-based interventions. Works extensively with diverse populations and specializes in trauma-informed care approaches.",
    specializations: "Bilingual Services, Trauma, Cultural Competency, Seniors",
    calendarLink: "https://calendly.com/emily-rodriguez-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
  {
    openId: `facilitator-${Date.now()}-4`,
    name: "James Thompson",
    email: "james.thompson@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 456-7890",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    bio: "Former clinical psychologist turned SoundBridge facilitator. Combines deep understanding of mental health conditions with evidence-based music intervention techniques to support patient recovery.",
    specializations: "Clinical Psychology Background, Depression, Anxiety, Mood Disorders",
    calendarLink: "https://calendly.com/james-thompson-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
  {
    openId: `facilitator-${Date.now()}-5`,
    name: "Dr. Aisha Patel",
    email: "aisha.patel@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 567-8901",
    profileImageUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
    bio: "Certified facilitator with background in neuroscience research. Specializes in explaining the science behind music-based interventions and helping patients understand how music affects brain chemistry and mood regulation.",
    specializations: "Neuroscience-Based Approach, Research-Informed Practice, Chronic Depression",
    calendarLink: "https://calendly.com/aisha-patel-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
  {
    openId: `facilitator-${Date.now()}-6`,
    name: "Robert Williams",
    email: "robert.williams@soundbridgehealth.com",
    loginMethod: "email",
    role: "facilitator",
    status: "completed",
    phone: "(555) 678-9012",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
    bio: "Veteran facilitator with 10+ years in mental health support. Known for compassionate, patient-centered approach and expertise in helping individuals develop long-term coping strategies through music-based interventions.",
    specializations: "Veterans, PTSD, Long-term Recovery, Group Sessions",
    calendarLink: "https://calendly.com/robert-williams-sbh",
    agreedToTerms: true,
    termsAgreedAt: new Date(),
    agreedToBaa: true,
    baaAgreedAt: new Date(),
  },
];

async function seedFacilitators() {
  console.log("🌱 Seeding dummy facilitators...");

  for (const facilitator of dummyFacilitators) {
    try {
      await db.insert(users).values(facilitator);
      console.log(`✅ Created: ${facilitator.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${facilitator.name}:`, error.message);
    }
  }

  console.log("🎉 Dummy facilitators seeded successfully!");
  process.exit(0);
}

seedFacilitators();
