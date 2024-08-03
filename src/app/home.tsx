'use client'

import { Navbar } from "@/src/components/navbar/navbar";

export default function HomePage() {

    return (
        <main>
            <Navbar />
            <div className="p-10 text-color_text">
                Hello
            </div>
        </main>
    );
}
