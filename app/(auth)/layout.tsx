import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import {Inter} from "next/font/google";
import "../globals.css";

export const metadata: Metadata = {
    title: 'EzTalk',
    description: "Discover EzTalk, the premier social media platform dedicated to students and academic enthusiasts seeking to broaden their horizons. Whether you're looking to connect with peers, share insights, find work placements, or simply explore academic opportunities, EzTalk is your go-to community. Join us now to engage with skilled individuals, exchange knowledge, and unlock new pathways in your academic and professional journey. With EzTalk, fostering meaningful connections and advancing your career has never been easier. Dive into a world of collaboration and inspiration – where students and academically inclined individuals come together to create, share, and grow",
};

const inter = Inter({subsets: ["latin"]}); 

export default function RootLayout({ 
    children 
}: {
    children: React.ReactNode
}){
    return (
        <ClerkProvider>
            <html lang="en">
            <head>
                <link rel="icon" href="/assets/favicon.ico" sizes="any" />
            </head>
                <body className={`${inter.className} 
                                flex justify-center items-center h-screen
                                bg-[url('/assets/EzTalkBg.png')] bg-cover bg-center
                                `}>
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
};