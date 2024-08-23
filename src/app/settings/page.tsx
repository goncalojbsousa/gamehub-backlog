'use client';

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";

const SettingsPage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-grow flex justify-center items-center p-10 text-color_text text-3xl">
                Sorry, this feature is still under development
            </div>
            <Footer />
        </div>
    );
};

export default SettingsPage;
