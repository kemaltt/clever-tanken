"use server";

import { prisma } from "@/lib/prisma";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export async function resendVerification(email: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (!existingUser) {
    return { success: false, error: "E-Mail nicht gefunden." };
  }

  if (existingUser.emailVerified) {
    return { success: false, error: "E-Mail bereits verifiziert." };
  }

  const verificationToken = await generateVerificationToken(email);
  await sendVerificationEmail(verificationToken.email, verificationToken.token);

  return { success: true, message: "Verification email sent!" };
}
