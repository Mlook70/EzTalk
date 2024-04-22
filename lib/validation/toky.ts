import * as z from "zod";

export const TokyValidation = z.object({
  toky: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  toky: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});