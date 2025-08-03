'use server'

import { getUserData } from "@/src/lib/getUserData";
import { ProfilePage } from "@/src/app/user/[username]/profile";
import { Metadata } from "next";
import UserNotFound from "@/src/components/user-not-found";

interface Props {
  params: Promise<{ username: string }>;
}

const getUserDataServer = (async (username: string) => {
  const userData = await getUserData(username);
  return userData;
});

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const { username } = await params;
  const userData = await getUserDataServer(username);
  return {
    title: `${userData?.name || 'Name'} | GameHub`,
  };
}

export default async function Profile({ params }: Props) {
  const { username } = await params;

  try {
    const userData = await getUserDataServer(username);

    if (!userData) {
      return <UserNotFound/>;
    }

    // Passar a data original em vez de uma string formatada
    const joinDate = userData.createdAt;

    return (
      <ProfilePage
        userId={userData.id}
        userImage={userData.image}
        name={userData.name}
        userName={userData.username}
        joinDate={joinDate}
      />
    );

  } catch (error) {
    console.error('Error in Profile component:', error);
    return <div>An error occurred while loading the profile. Please try again later.</div>;
  }
}