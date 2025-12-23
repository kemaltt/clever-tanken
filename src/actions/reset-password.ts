"use server";

import { prisma } from "@/lib/prisma";
import { generatePasswordResetToken } from "@/lib/tokens";
import { sendPasswordResetEmail } from "@/lib/mail";

export async function resetPassword(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return { success: false, error: "E-Mail nicht gefunden." };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

  return { success: true, message: "Reset email sent!" };
}
