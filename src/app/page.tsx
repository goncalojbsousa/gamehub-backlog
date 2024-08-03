import HomePage from "@/src/app/home";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";

export default async function Home() {

  const isAuthenticated = await checkIsAuthenticated();


  return <HomePage isAuthenticated={isAuthenticated} />;

}
