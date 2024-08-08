'use client';

import { Footer } from "@/src/components/footer";
import { Navbar } from "@/src/components/navbar/navbar";

export const Settings = () => {
    return (
        <div>
            <Navbar />
            <div className="flex justify-center p-72 text-color_text text-3xl">
                Sorry, this feature is still under development
            </div>
            <Footer />
        </div>
    );
};

export default Settings;
