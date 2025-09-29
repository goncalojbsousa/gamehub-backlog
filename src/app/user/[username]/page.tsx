'use server'

import { getUserData } from "@/src/lib/getUserData";
import { ProfilePage } from "@/src/app/user/[username]/profile";
import { BannedUserProfile } from "@/src/components/banned-user-profile";
import { Metadata } from "next";
import UserNotFound from "@/src/components/user-not-found";
import { checkCanViewProfile } from "@/src/lib/auth/checkCanViewProfileServerAction";
import { PrivateProfilePage } from "@/src/components/private-profile-page";
import { AdminProfileIndicator } from "@/src/components/admin-profile-indicator";

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

    // Se o utilizador está banido, mostrar o componente de perfil banido
    if (userData.isBanned) {
      return (
        <BannedUserProfile
          userImage={userData.image}
          name={userData.name}
          userName={userData.username}
          joinDate={joinDate}
        />
      );
    }

    // Check if profile is private and user cannot view it
    if (!userData.isProfilePublic) {
      const canViewProfile = await checkCanViewProfile(userData.username);
      
      if (!canViewProfile) {
        return <PrivateProfilePage />;
      }
    }

    return (
      <ProfilePage
        userId={userData.id}
        userImage={userData.image}
        name={userData.name}
        userName={userData.username}
        joinDate={joinDate}
        isBanned={userData.isBanned}
        bio={userData.bio}
        isProfilePublic={userData.isProfilePublic}
        isPrivateProfile={!userData.isProfilePublic}
      />
    );

  } catch (error) {
    console.error('Error in Profile component:', error);
    return <div>An error occurred while loading the profile. Please try again later.</div>;
  }
}