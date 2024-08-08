import { Navbar } from "@/src/components/navbar/navbar"
import Image from "next/image";

interface UserProps {
    userImage: string;
    userName: string;
    joinDate: string;
}

export const ProfilePage: React.FC<UserProps> = ({ userImage, userName, joinDate }) => {

    return (
        <main className="transition-colors duration-200 pt-24 relative min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between p-6 bg-color_main rounded-2xl">
                <div className="flex items-center">
                    <Image
                        src={userImage}
                        alt="User profile image"
                        width={250}
                        height={250}
                        className="w-24 h-24 rounded-full"
                        draggable={false}
                    />
                    <div className="ml-6">
                        <h1 className="text-2xl text-color_text">{userName}</h1>
                        <p className="text-sm text-color_text_sec">Member since {joinDate}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
    )
}