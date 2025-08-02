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

      {/* Hero Section with Dynamic Background */}
      <div className="relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5">
        </div>

        <div className="relative z-10">
          {!isAuthenticated && <IntroductionSection />}
        </div>
      </div>

      {/* Content Sections with Enhanced Spacing */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          {/* Popular Games Section */}
          <div className="mb-16 animate-on-load animate-slide-in-up">
            <GameSection
              title="🔥 Trending Now"
              games={gamesPopular}
              coverImageUrl={getCoverImageUrl(`https://${gamesPopular[0]?.screenshots[0]?.url}`)}
              isLoading={gamesPopular.length === 0}
            />
          </div>

          {/* Popular Games of 2024 Section */}
          <div className="mb-16 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <GameSection
              title="🏆 Best of 2024"
              games={gamesPopularYear}
              coverImageUrl={getCoverImageUrl(`https://${gamesPopularYear[0]?.screenshots[0]?.url}`)}
              isLoading={gamesPopularYear.length === 0}
            />
          </div>

          {/* Recent Games Section */}
          <div className="mb-16 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <GameSection
              title="🆕 Recently Released"
              games={gamesRecent}
              coverImageUrl={getCoverImageUrl(`https://${gamesRecent[0]?.screenshots?.[0]?.url || ''}`)}
              isLoading={gamesRecent.length === 0}
            />
          </div>

          {/* Upcoming Games Section */}
          <div className="mb-16 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <GameSection
              title="🚀 Coming Soon"
              games={gamesUpcoming}
              coverImageUrl={getCoverImageUrl(`https://${gamesUpcoming[0]?.screenshots[0]?.url}`)}
              isLoading={gamesUpcoming.length === 0}
            />
          </div>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </main>
  );
}