import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

export const metadata: Metadata = {
  title: "CipherBoard - Elite Blockchain Private Messaging",
  description: "Enterprise-grade blockchain communication platform with military-level encryption protocols powered by Zama's FHEVM",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`zama-bg text-foreground antialiased`}>
        <div className="fixed inset-0 w-full h-full zama-bg z-[-20] min-w-[850px]"></div>
        <main className="flex flex-col min-w-[850px]">
          <Providers>
            <Header />
            <div className="flex-1">
              {children}
            </div>
          </Providers>
        </main>
      </body>
    </html>
  );
}
