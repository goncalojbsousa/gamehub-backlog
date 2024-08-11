import { Footer } from "@/src/components/footer";
import LegalNavbar from "@/src/components/legal/legal-navbar";
import Privacy from "@/src/components/legal/privacy";
import { Navbar } from "@/src/components/navbar/navbar";

export const PrivacyPage: React.FC = () => {

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col mt-2 xl:px-24 pt-24 text-color_text">

                <LegalNavbar />
                <main className="flex-grow p-4">
                    <Privacy />
                </main>
            </div>
            <Footer />
        </div>
    );
}