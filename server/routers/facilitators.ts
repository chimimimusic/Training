import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db";

export const facilitatorsRouter = router({
  list: publicProcedure.query(async () => {
    // Get all users with role 'facilitator' and status 'completed'
    const facilitators = await db.getCertifiedFacilitators();
    return facilitators;
  }),
  
  sendContactMessage: publicProcedure
    .input(z.object({
      facilitatorId: z.number(),
      senderName: z.string(),
      senderEmail: z.string().email(),
      senderPhone: z.string().optional(),
      message: z.string(),
    }))
    .mutation(async ({ input }) => {
      // Get facilitator details
      const facilitator = await db.getUserById(input.facilitatorId);
      
      if (!facilitator) {
        throw new Error("Facilitator not found");
      }
      
      // Store contact message in database
      await db.createContactMessage({
        facilitatorId: input.facilitatorId,
        senderName: input.senderName,
        senderEmail: input.senderEmail,
        senderPhone: input.senderPhone || null,
        message: input.message,
      });
      
      // TODO: Send email notification to facilitator
      // This would require email service integration
      
      return { success: true };
    }),
});
