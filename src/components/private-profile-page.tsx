'use client'

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";

export const PrivateProfilePage = () => {
  // Background style similar to home page
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
    <div className="min-h-screen flex flex-col">
      <main className="transition-colors duration-200 pt-24 relative flex-1 bg-background" style={mainStyle}>
        <Navbar />
        
        <div className="relative z-10 flex-1">
          <div className="container mx-auto px-4 lg:px-8 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail animate-slide-in-up">
                <div className="text-6xl mb-4">🔒</div>
                <h1 className="text-2xl font-bold text-color_text mb-4">Private Profile</h1>
                <p className="text-color_text_sec">
                  This profile is private and cannot be viewed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}; 