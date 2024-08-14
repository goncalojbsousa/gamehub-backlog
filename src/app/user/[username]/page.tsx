'use server'

import { getUserData } from "@/src/lib/getUserData";
import { ProfilePage } from "./profile";
import { getGameStatusByUserId } from "@/src/lib/getGameStatusByUserId";
import { cache } from "react";
import { Metadata } from "next";

interface Props {
  params: { username: string };
}

const getUserDataServer = cache(async (username: string) => {
  console.log("fetching user data");
  const userData = await getUserData(username);
  return userData;
});

// CHANGE TITLE IN THE BROWSER TAB
export async function generateMetadata({ params }: { params: { username: string } }): Promise<Metadata> {
  const userData = await getUserDataServer(params.username);
  return {
      title: `${userData?.name || 'Name'} | GameHub`,
  };
}

export default async function Profile({ params }: Props) {
  const { username } = params;
  const userData = await getUserDataServer(username);

  if (!userData) {
    return <div>User not found</div>;
  }

  const joinDate = new Date(userData.createdAt).toLocaleDateString();

  return (
    <ProfilePage
      userId={userData.id}
      userImage={userData.image}
      name={userData.name}
      userName={userData.username}
      joinDate={joinDate}
      getUserGames={getGameStatusByUserId}
    />
  );
}