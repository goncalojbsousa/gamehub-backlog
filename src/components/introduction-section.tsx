import Image from "next/image";
import { FaGamepad, FaChartLine, FaSearch, FaDollarSign, FaUsers } from 'react-icons/fa';
import { SignInButton } from "@/src/components/sign-in-button";
import { Logo } from "./svg/logo";

export default function IntroductionSection() {
  const features = [
    { icon: <FaGamepad />, text: "Manage your backlog of games" },
    { icon: <FaChartLine />, text: "Track your progress" },
    { icon: <FaSearch />, text: "Discover new games" },
    { icon: <FaDollarSign />, text: "Compare prices" },
    { icon: <FaUsers />, text: "Connect with other players" },
  ];

  return (
    <div className="p-8 mb-8 text-color_text">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold mb-6 text-center">Welcome to GameHub Backlog</h2>
        <p className="mb-8 text-xl text-center max-w-3xl mx-auto">
          GameHub Backlog is your ultimate companion for managing your ever-growing library of video games. Organize, track, and discover - all in one place!
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-8 md:space-y-0 md:space-x-16">
          <div className="flex justify-center md:justify-end md:w-1/2">
            <Logo
              className="fill-color_icons"
              width="12.5em"
              height="12.5em"
            />
          </div>
          <ul className="space-y-4 text-lg md:w-1/2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="text-color_accent text-xl">{feature.icon}</span>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-10 text-center">
          <SignInButton className="text-color_main bg-color_reverse_sec text-xl border border-border_detail rounded-lg py-2 px-6 transition-transform hover:scale-105" />
        </div>
      </div>
    </div>
  );
}