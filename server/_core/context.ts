import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";

// Mock user for public access - auth bypassed
const MOCK_USER: User = {
  id: 1,
  openId: "demo-user",
  name: "Demo Trainee",
  email: "demo@soundbridge.health",
  role: "trainee",
  status: "active",
  agreedToTerms: true,
  agreedToBaa: true,
  loginMethod: "demo",
  lastSignedIn: new Date(),
  createdAt: new Date(),
  updatedAt: new Date(),
  bio: null,
  profileImageUrl: null,
  phone: null,
  organization: null,
  jobTitle: null,
  certifications: null,
  specialties: null,
  yearsExperience: null,
  linkedinUrl: null,
  timezone: null,
  preferredContactMethod: null,
};

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  // Auth bypassed - always return mock user
  return {
    req: opts.req,
    res: opts.res,
    user: MOCK_USER,
  };
}
