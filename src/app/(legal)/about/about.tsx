import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { Logo } from "@/src/components/svg/logo";

export const AboutPage: React.FC = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col flex-grow mt-2 xl:px-24 pt-24 text-color_text">
                <main className="flex-grow p-4 pt-0">
                    <div className="flex items-center mb-4">
                        <Logo className="fill-color_icons mr-4" />
                        <h1 className="text-3xl font-bold">About Us</h1>
                    </div>
                    <div>
                        <p className="mb-4">
                            Welcome to GameHub Backlog! We&apos;re thrilled to have you here. GameHub Backlog was conceived and developed by Gonçalo Sousa as a portfolio project, showcasing a passion for both gaming and software development. This platform is the culmination of countless hours of dedication and creativity, aimed at providing gamers with a seamless experience in managing their game collections.
                        </p>
                        <p className="mb-4">
                            At its core, GameHub Backlog is a game backlog tracker designed to help you keep track of your ever-growing library of video games. We understand how easy it is to accumulate a list of games you plan to &quot;play someday,&quot; only to find it becoming overwhelming. GameHub simplifies the process, allowing you to organize, prioritize, and manage your games in one convenient location.
                        </p>
                        <p className="mb-4">
                            But GameHub Backlog is more than just a personal tracker; it&apos;s a community-driven platform built by players, for players. Whether you&apos;re looking to discover new titles, categorize your existing collection, or share your game lists with friends, GameHub has you covered. Our goal is to bring gamers together, fostering a space where you can share your gaming experiences and discover new ones.
                        </p>
                        <p className="mb-4">
                            Join us on this journey as we continue to enhance GameHub Backlog, adding new features and improving the platform based on your feedback. Together, let&apos;s make the world of gaming more organized and enjoyable. Happy gaming!
                        </p>
                    </div>
                </main>
            </div>
            <Footer />
        </div>
    );
}