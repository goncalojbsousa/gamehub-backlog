import { redirect } from "next/navigation";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";
import { ProfilePage } from "./profile";
import { getUserImage } from "@/src/lib/auth/getUserImageServerAction";
import { getUserName } from "@/src/lib/auth/getUserNameServerAction";
import { getUserJoinDate } from "@/src/lib/getUserJoinDateServerAction";

const Profile: React.FC = async () => {

    const isAuthenticated = await checkIsAuthenticated();

    if (!isAuthenticated) {
        redirect("/auth/sign-in")
    } else {
        const userName = (await getUserName()) || "UserName";
        const userImage = (await getUserImage()) || "/placeholder-user.jpg";
        const joinDateData = await getUserJoinDate();

        const joinDate = joinDateData ? new Date(joinDateData.createdAt).toLocaleDateString() : "Unknown";
        
        return <ProfilePage userImage={userImage} userName={userName} joinDate={joinDate} />;
    }
};

export default Profile;
