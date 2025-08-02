import Image from "next/image";
import { FaGamepad, FaChartLine, FaSearch, FaDollarSign, FaUsers, FaRocket, FaStar } from 'react-icons/fa';
import { SignInButton } from "@/src/components/sign-in-button";
import { Logo } from "./svg/logo";

export default function IntroductionSection() {
  const features = [
    { 
      icon: <FaGamepad className="text-2xl" />, 
      title: "Manage Your Backlog",
      text: "Organize your ever-growing collection of games with ease",
      color: "bg-blue-500"
    },
    { 
      icon: <FaChartLine className="text-2xl" />, 
      title: "Track Progress",
      text: "Monitor your gaming journey and completion status",
      color: "bg-green-500"
    },
    { 
      icon: <FaSearch className="text-2xl" />, 
      title: "Discover Games",
      text: "Find your next favorite game from our extensive database",
      color: "bg-orange-500"
    },
    { 
      icon: <FaDollarSign className="text-2xl" />, 
      title: "Compare Prices",
      text: "Get the best deals and track price history",
      color: "bg-yellow-500"
    },
    { 
      icon: <FaUsers className="text-2xl" />, 
      title: "Connect with Players",
      text: "Share your gaming experiences with the community",
      color: "bg-purple-500"
    },
    { 
      icon: <FaStar className="text-2xl" />, 
      title: "Game Reviews",
      text: "Read and write reviews to help other gamers decide",
      color: "bg-indigo-500"
    },
  ];

  return (
    <div className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-8">
            <Logo
              className="fill-color_icons"
              width="8em"
              height="8em"
            />
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 text-color_text">
            GameHub Backlog
          </h1>
          
          <p className="text-xl lg:text-2xl text-color_text_sec mb-8 max-w-4xl mx-auto leading-relaxed">
            Your ultimate companion for managing your gaming library. Organize, track, and discover - all in one place!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignInButton className="px-8 py-4 bg-color_reverse_sec text-color_main text-lg font-semibold rounded-xl hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-0" />
            <div className="flex items-center gap-2 text-color_text_sec">
              <FaRocket className="text-color_accent" />
              <span className="text-sm">Join thousands of gamers</span>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="group bg-color_sec rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-border_detail"
            >
              <div className={`w-16 h-16 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                <div className="text-white">
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-color_text mb-3">
                {feature.title}
              </h3>
              
              <p className="text-color_text_sec leading-relaxed">
                {feature.text}
              </p>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="bg-color_sec rounded-xl p-8 shadow-lg border border-border_detail">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-color_reverse_sec">300K+</div>
              <div className="text-color_text_sec">Games in Database</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-color_reverse_sec">24/7</div>
              <div className="text-color_text_sec">Price Monitoring</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-color_reverse_sec">Free</div>
              <div className="text-color_text_sec">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}