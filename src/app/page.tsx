'use server';

import { fetchGamesList } from "@/src/services/igdbServices/getGames";
import HomePage from "@/src/app/home";

export default async function Home() {
  const [
    gamesPopularYear,
    gamesPopular,
    gamesUpcoming,
    gamesRecent,
  ] = await fetchGamesList(['popular2024', 'popular', 'upcoming', 'recent'], 48);

  return <HomePage 
    gamesPopularYear={gamesPopularYear}
    gamesPopular={gamesPopular}
    gamesUpcoming={gamesUpcoming}
    gamesRecent={gamesRecent}
  />;
}