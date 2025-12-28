import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { redirect } from "next/navigation";

export const currentProfile = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const profile = await prisma.user.findUnique({
    where: {
      userId: userId,
    },
  });

  return profile;
};
