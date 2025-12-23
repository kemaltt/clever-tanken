import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { SidebarProvider } from "@/contexts/SidebarContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Günstiger Tanken",
  description: "Find the cheapest gas stations near you.",
};

import { SessionProvider } from "@/components/SessionProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#F5F7F9]`} suppressHydrationWarning>
        <SessionProvider>
          <SidebarProvider>
            <FavoritesProvider>
              <Navbar />
              <Sidebar />
              <FavoritesPanel />
              <main className="relative">{children}</main>
            </FavoritesProvider>
          </SidebarProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

