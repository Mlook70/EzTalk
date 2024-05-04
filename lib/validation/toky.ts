import * as z from "zod";

const containsBadWordAI = async (text: string) => {
  const badWords = ["badword1", "badword2", "badword3", "fuck", "fucking", "bad word 1", "bad word 2"]; // Add additional bad words here
  const lowerCaseText = text.toLowerCase();
  return badWords.some(word => lowerCaseText.includes(word));
};

export const TokyValidation = z.object({
  toky: z.string()
  .nonempty()
  .min(3, { message: "Minimum 3 characters." })
  .refine(async (text) => {
    const containsBadWord = await containsBadWordAI(text);
    return !containsBadWord;
  }, { message: "Contains bad words." }),
accountId: z.string(),
image:z.string().url().nonempty(),

});

export const CommentValidation = z.object({
  toky: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});

export const LikeValidation = z.object({
  tokyId: z.string().nonempty(),
  userId: z.string().nonempty(),
}); 