import { redirect } from "next/navigation";
import { DashboardPage } from "@/src/app/dashboard/dashboard";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";
import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";

const Dashboard: React.FC = async () => {
    const role = await getUserRole();
    const isAuthenticated = await checkIsAuthenticated();

    if (!isAuthenticated) {
        redirect("/auth/sign-in");
    } else if (role === "ADMIN") {
        return <DashboardPage />;
    } else {
        redirect("/");
    }
};

export default Dashboard;