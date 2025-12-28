import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

// Loading and Creating Profile
export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const profile = await prisma.user.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await prisma.user.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
      username: user.username || "",
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
