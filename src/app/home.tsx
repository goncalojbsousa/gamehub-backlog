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
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-color_accent to-transparent animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%239C92AC%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]"></div>
        </div>

        <div className="relative z-10">
          {!isAuthenticated && <IntroductionSection />}
        </div>
      </div>

      {/* Content Sections with Enhanced Spacing */}
      <div className="relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-4">
          {/* Popular Games Section */}
          <div className="mb-16 animate-slide-in-up">
            <GameSection
              title="🔥 Trending Now"
              games={gamesPopular}
              coverImageUrl={getCoverImageUrl(`https://${gamesPopular[0]?.screenshots[0]?.url}`)}
            />
          </div>

          {/* Popular Games of 2024 Section */}
          <div className="mb-16 animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
            <GameSection
              title="🏆 Best of 2024"
              games={gamesPopularYear}
              coverImageUrl={getCoverImageUrl(`https://${gamesPopularYear[0]?.screenshots[0]?.url}`)}
            />
          </div>

          {/* Recent Games Section */}
          <div className="mb-16 animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
            <GameSection
              title="🆕 Recently Released"
              games={gamesRecent}
              coverImageUrl={getCoverImageUrl(`https://${gamesRecent[0]?.screenshots?.[0]?.url || ''}`)}
            />
          </div>

          {/* Upcoming Games Section */}
          <div className="mb-16 animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
            <GameSection
              title="🚀 Coming Soon"
              games={gamesUpcoming}
              coverImageUrl={getCoverImageUrl(`https://${gamesUpcoming[0]?.screenshots[0]?.url}`)}
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