import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import UserDataFetcher from "@/src/context/userDataFetcher";
import { ThemeProvider } from "@/src/context/themeContext";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata() {
  const baseUrl = process.env.NEXTAUTH_URL || "gamehub-project-navy.vercel.app";
  return {
    title: "GameHub - Your Ultimate Game Backlog Tracker",
    description: "GameHub Backlog is a game backlog tracker designed to help you keep track of your ever-growing library of video games. Track and manage your video game backlog with GameHub.",
    keywords: ["game backlog", "video games", "game tracker", "GameHub"],
    author: "Gonçalo Sousa",
    openGraph: {
      title: "GameHub - Your Ultimate Game Backlog Tracker",
      description: "GameHub Backlog is a game backlog tracker designed to help you keep track of your ever-growing library of video games. Track and manage your video game backlog with GameHub.",
      images: [
        {
          url: `${baseUrl}/url-image.webp`,
          width: 1200,
          height: 630,
          alt: "GameHub Logo",
        },
      ],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              function getInitialColorMode() {
                const persistedColorPreference = window.localStorage.getItem('darkMode');
                const hasPersistedPreference = typeof persistedColorPreference === 'string';
                if (hasPersistedPreference) {
                  return persistedColorPreference === 'true' ? 'dark' : 'light';
                }
                const mql = window.matchMedia('(prefers-color-scheme: dark)');
                const hasMediaQueryPreference = typeof mql.matches === 'boolean';
                if (hasMediaQueryPreference) {
                  return mql.matches ? 'dark' : 'light';
                }
                return 'light';
              }
              const colorMode = getInitialColorMode();
              document.documentElement.setAttribute('data-theme', colorMode);
            })();
          `
        }} />
      </head>
      <body className={`${inter.className} bg-background text-color_text transition-colors duration-200`}>
        <ThemeProvider>
          <SessionProvider>
            <UserDataFetcher>
              {children}
            </UserDataFetcher>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

