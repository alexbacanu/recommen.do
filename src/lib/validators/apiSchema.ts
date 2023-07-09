import { z } from "zod";

// api/resend
export const EmailValidator = z.object({
  name: z.string().min(1).max(128),
  email: z.string().email(),
  subject: z.string().min(1).max(128),
  message: z.string().min(1).max(10000),
  terms: z.boolean().default(false),
});
