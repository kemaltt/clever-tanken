"use server";

import { prisma } from "@/lib/prisma";

export async function checkEmailVerification(email: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { emailVerified: true, password: true }
    });
    
    if (!user) {
      return { verified: null, hasPassword: false };
    }
    
    return { 
      verified: !!user.emailVerified, 
      hasPassword: !!user.password 
    };
  } catch (error) {
    console.error("Error checking verification:", error);
    return { verified: null, hasPassword: false };
  }
}
