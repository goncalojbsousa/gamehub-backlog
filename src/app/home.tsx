'use client'

import { Navbar } from "@/src/components/navbar/navbar";
import { getCoverImageUrl } from "@/src/utils/utils";
import { Footer } from "@/src/components/footer";
import GameSection from "@/src/components/game-section";
import IntroductionSection from "../components/introduction-section";

interface HomePageProps {
  gamesPopularYear: Game[];
  gamesPopular: Game[];
  gamesUpcoming: Game[];
  gamesRecent: Game[];
  isAuthenticated: boolean;
}

export default function HomePage({
  gamesPopularYear,
  gamesPopular,
  gamesUpcoming,
  gamesRecent,
  isAuthenticated
}: HomePageProps) {

  const mainStyle = {
    backgroundImage: `
        linear-gradient(to bottom, var(--gradient-start), var(--background)),
        url(/login-bg.webp)
    `,
    backgroundSize: '100% 1200px',
    backgroundPosition: 'center top',
    backgroundRepeat: 'no-repeat',
    backgroundColor: 'var(--background)',
  };

  return (
    <main className="transition-colors duration-200 pt-24 relative min-h-screen bg-color_bg" style={mainStyle}>
      <Navbar />

      <div className="p-4 pt-0 text-color_text xl:px-24">
        {!isAuthenticated && <IntroductionSection />}
        <GameSection
          title="Popular Games"
          games={gamesPopular}
          coverImageUrl={getCoverImageUrl(`https://${gamesPopular[0]?.screenshots[0]?.url}`)}
        />
        <GameSection
          className="pt-6"
          title="Popular Games of 2024"
          games={gamesPopularYear}
          coverImageUrl={getCoverImageUrl(`https://${gamesPopularYear[0]?.screenshots[0]?.url}`)}
        />
        {<GameSection
          className="pt-6"
          title="Recent Games"
          games={gamesRecent}
          coverImageUrl={getCoverImageUrl(`https://${gamesRecent[0]?.screenshots?.[0]?.url || ''}`)}
        />}
        <GameSection
          className="pt-6"
          title="Upcoming Games"
          games={gamesUpcoming}
          coverImageUrl={getCoverImageUrl(`https://${gamesUpcoming[0]?.screenshots[0]?.url}`)}
        />
      </div>

      <div className="mt-8">
        <Footer />
      </div>
    </main>
  );
}