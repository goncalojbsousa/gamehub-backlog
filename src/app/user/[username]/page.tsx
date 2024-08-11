'use client';

import { useParams } from "next/navigation";
import { ProfilePage } from "./profile";
import { useEffect, useState } from "react";
import { Loading } from '@/src/components/loading';

interface UserData {
  id: string;
  name: string;
  image: string;
  createdAt: string;
  username: string;
}

const Profile = () => {
    const { username } = useParams();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!username) return;

            try {
                setIsLoading(true);
                const response = await fetch(`/api/user/getUserData?username=${username}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, [username]);

    if (isLoading) {
        return <Loading />;
    }

    if (!userData) {
        return <div>User not found</div>;
    }

    const joinDate = new Date(userData.createdAt).toLocaleDateString();

    return <ProfilePage userId={userData.id} userImage={userData.image} name={userData.name}  userName={userData.username} joinDate={joinDate} />;
};

export default Profile;