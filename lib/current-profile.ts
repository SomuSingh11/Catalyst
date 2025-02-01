import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

export const currentProfile = async () => {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};
