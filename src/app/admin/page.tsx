import { getUserRole } from "@/src/lib/auth/getUserRoleServerAction";
import { redirect } from "next/navigation";
import { AdminPage } from "@/src/app/admin/admin";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";

const Admin: React.FC = async () => {
  const role = await getUserRole();
  const isAuthenticated = await checkIsAuthenticated();

  if (!isAuthenticated) {
    redirect("/auth/sign-in");
  } else if (role === "ADMIN") {
    return <AdminPage />;
  } else {
    redirect("/dashboard");
  }
};

export default Admin;