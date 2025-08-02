import { Footer } from "@/src/components/footer";
import LegalNavbar from "@/src/components/legal/legal-navbar";
import { Navbar } from "@/src/components/navbar/navbar";
import Terms from "@/src/components/legal/terms";

export const TermsPage: React.FC = () => {
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
        <main className="transition-colors duration-200 pt-16 relative min-h-screen bg-color_bg" style={mainStyle}>
            <Navbar />
            
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
            </div>

            <div className="relative z-10">
                <div className="container mx-auto px-4 lg:px-8 py-8">
                    <div className="max-w-4xl mx-auto">
                        <LegalNavbar />
                        
                        <div className="bg-color_sec rounded-xl shadow-lg border border-border_detail p-8 animate-on-load animate-slide-in-up">
                            <Terms />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}