import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { FavoritesPanel } from "@/components/FavoritesPanel";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SessionProvider } from "@/components/SessionProvider";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Günstiger Tanken",
  description: "Find the cheapest gas stations near you.",
};

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  const {locale} = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#F5F7F9]`} suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

