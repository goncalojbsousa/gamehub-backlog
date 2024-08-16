'use server'

import { getUserData } from "@/src/lib/getUserData";
import { ProfilePage } from "@/src/app/user/[username]/profile";
import { getAllGameStatusByUserId } from "@/src/lib/getAllGameStatusByUserId";
import { cache } from "react";
import { Metadata } from "next";

interface Props {
  params: { username: string };
}

const getUserDataServer = cache(async (username: string) => {
  const userData = await getUserData(username);
  return userData;
});

const getAllUserGamesServer = cache(async (userId: string) => {
  const allGames = await getAllGameStatusByUserId(userId);
  return allGames;
});

export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const userData = await getUserDataServer(params.username);
  return {
    title: `${userData?.name || 'Name'} | GameHub`,
  };
}

export default async function Profile({ params }: Props) {
  const { username } = params;

  try {
    const userData = await getUserDataServer(username);

    if (!userData) {
      return <div>User not found</div>;
    }

    const allUserGames = await getAllUserGamesServer(userData.id);

    const joinDate = new Date(userData.createdAt).toLocaleDateString();

    return (
      <ProfilePage
        userId={userData.id}
        userImage={userData.image}
        name={userData.name}
        userName={userData.username}
        joinDate={joinDate}
        allUserGames={allUserGames}
      />
    );
  } catch (error) {
    console.error('Error in Profile component:', error);
    return <div>An error occurred while loading the profile. Please try again later.</div>;
  }
}