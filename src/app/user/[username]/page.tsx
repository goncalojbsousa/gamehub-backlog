'use server'

import { getUserData } from "@/src/lib/getUserData";
import { ProfilePage } from "./profile";
import { getGameStatusByUserId } from "@/src/lib/getGameStatusByUserId";

interface Props {
  params: { username: string };
}

export default async function Profile({ params }: Props) {
  const { username } = params;
  const userData = await getUserData(username);

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