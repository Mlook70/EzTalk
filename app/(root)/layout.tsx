import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";

import Topbar from "@/components/shared/Topbar";
import Bottombar from "@/components/shared/Bottombar";
import RightSidebar from "@/components/shared/RightSidebar";
import LeftSidebar from "@/components/shared/LeftSidebar";



export const metadata: Metadata = {
  title: "EzTalk",
  description: 'A Next.js 14 Meta EzTalk Application'
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
        <head>
          <link rel="icon" href="/assets/favicon.ico" sizes="any" />
        </head>
        <body className={inter.className}>
        <Topbar/>
          <main className="flex flex-row">
            <LeftSidebar/>
            
            <section className='main-container'>
              <div className='w-full max-w-4xl'>
                {children}
              </div>
            </section>

            <RightSidebar/>
          </main>
        <Bottombar/>
        </body>
    </html>
  </ClerkProvider>
  );
}
