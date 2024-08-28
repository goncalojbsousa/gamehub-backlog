'use server';

import { fetchGamesList } from "@/src/services/igdbServices/getGames";
import HomePage from "@/src/app/home";
import { checkIsAuthenticated } from "@/src/lib/auth/checkIsAuthenticated";

export default async function Home() {
  const [
    gamesPopularYear,
    gamesPopular,
    gamesUpcoming,
    gamesRecent,
  ] = await fetchGamesList(['popular2024', 'popular', 'upcoming', 'recent'], 48);

  const isAuthenticated = await checkIsAuthenticated();

  return <HomePage
    gamesPopularYear={gamesPopularYear}
    gamesPopular={gamesPopular}
    gamesUpcoming={gamesUpcoming}
    gamesRecent={gamesRecent}
    isAuthenticated={isAuthenticated}
  />;
}