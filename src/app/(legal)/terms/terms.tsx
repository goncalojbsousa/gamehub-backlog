import { Footer } from "@/src/components/footer";
import LegalNavbar from "@/src/components/legal/legal-navbar";
import { Navbar } from "@/src/components/navbar/navbar";
import Terms from "@/src/components/legal/terms";

export const TermsPage: React.FC = () => {

    return (
        <div className="flex flex-col min-h-screen ">
            <Navbar />
            <div className="flex flex-col mt-2 pt-24 text-color_text mx-auto max-w-4xl">

                <LegalNavbar />
                <main className="flex-grow p-4">
                    <Terms />
                </main>
            </div>
            <Footer />
        </div>
    );
}