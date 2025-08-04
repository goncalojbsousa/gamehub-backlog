import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";
import { Logo } from "@/src/components/svg/logo";

export const AboutPage: React.FC = () => {
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
        <main className="transition-colors duration-200 pt-16 relative min-h-screen bg-background" style={mainStyle}>
            <Navbar />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
            </div>

            <div className="relative z-10">
                {/* Hero Section */}
                <div className="relative bg-gradient-to-b from-black/20 to-transparent">
                    <div className="container mx-auto px-4 lg:px-8 py-12">
                        <div className="max-w-4xl mx-auto text-center">
                            <div className="flex items-center justify-center mb-6 animate-on-load animate-slide-in-up">
                                <Logo className="fill-color_icons mr-4" width="3em" height="3em" />
                                <h1 className="text-4xl lg:text-5xl font-bold text-color_text leading-tight">
                                    About GameHub
                                </h1>
                            </div>
                            <p className="text-xl text-color_text_sec leading-relaxed max-w-3xl mx-auto animate-on-load animate-slide-in-up" style={{ animationDelay: '0.2s' }}>
                                Your ultimate gaming companion for organizing, discovering, and sharing your gaming journey
                            </p>
                        </div>
                    </div>
                </div>

                {/* Content Sections */}
                <div className="container mx-auto px-4 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto space-y-12">
                        
                        {/* Mission Section */}
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.4s' }}>
                            <h2 className="text-3xl font-bold text-color_text mb-6">🎯 Our Mission</h2>
                            <div className="space-y-4 text-color_text">
                                <p className="text-lg leading-relaxed">
                                    Welcome to GameHub Backlog! We&apos;re thrilled to have you here. At its core, GameHub Backlog is a game backlog tracker designed to help you keep track of your ever-growing library of video games.
                                </p>
                                <p className="leading-relaxed">
                                    We understand how easy it is to accumulate a list of games you plan to &quot;play someday,&quot; only to find it becoming overwhelming. GameHub simplifies the process, allowing you to organize, prioritize, and manage your games in one convenient location.
                                </p>
                            </div>
                        </div>

                        {/* Community Section */}
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.6s' }}>
                            <h2 className="text-3xl font-bold text-color_text mb-6">🤝 Community-Driven</h2>
                            <div className="space-y-4 text-color_text">
                                <p className="text-lg leading-relaxed">
                                    But GameHub Backlog is more than just a personal tracker; it&apos;s a community-driven platform built by players, for players.
                                </p>
                                <p className="leading-relaxed">
                                    Whether you&apos;re looking to discover new titles, categorize your existing collection, or share your game lists with friends, GameHub has you covered. Our goal is to bring gamers together, fostering a space where you can share your gaming experiences and discover new ones.
                                </p>
                            </div>
                        </div>

                        {/* Features Section */}
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up" style={{ animationDelay: '0.8s' }}>
                            <h2 className="text-3xl font-bold text-color_text mb-6">✨ What We Offer</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-color_text">📚 Game Management</h3>
                                    <p className="text-color_text_sec leading-relaxed">
                                        Organize your game collection with custom status tracking, progress monitoring, and personalized categories.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-color_text">🔍 Discovery</h3>
                                    <p className="text-color_text_sec leading-relaxed">
                                        Explore thousands of games with advanced search filters, trending titles, and personalized recommendations.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-color_text">👥 Community</h3>
                                    <p className="text-color_text_sec leading-relaxed">
                                        Connect with fellow gamers, share your gaming journey, and discover new titles through community features.
                                    </p>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-semibold text-color_text">📱 Cross-Platform</h3>
                                    <p className="text-color_text_sec leading-relaxed">
                                        Access your gaming library from anywhere with our responsive design that works on all devices.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Future Section */}
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up" style={{ animationDelay: '1s' }}>
                            <h2 className="text-3xl font-bold text-color_text mb-6">🚀 Looking Forward</h2>
                            <div className="space-y-4 text-color_text">
                                <p className="text-lg leading-relaxed">
                                    Join us on this journey as we continue to enhance GameHub Backlog, adding new features and improving the platform based on your feedback.
                                </p>
                                <p className="leading-relaxed">
                                    Together, let&apos;s make the world of gaming more organized and enjoyable. Happy gaming!
                                </p>
                            </div>
                        </div>

                        {/* Contact Section */}
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up" style={{ animationDelay: '1.2s' }}>
                            <h2 className="text-3xl font-bold text-color_text mb-6">💬 Get in Touch</h2>
                            <div className="text-center space-y-4">
                                <p className="text-color_text_sec leading-relaxed">
                                    Have suggestions, feedback, or just want to say hello? We&apos;d love to hear from you!
                                </p>
                                <a 
                                    href="mailto:gamehubbacklog@gmail.com" 
                                    className="inline-block bg-blue-500 dark:bg-blue-400 text-color_reverse_sec px-8 py-3 rounded-lg font-medium hover:bg-blue-600 dark:hover:bg-blue-500 transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 transform"
                                >
                                    Contact Us
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}