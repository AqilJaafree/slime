import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { WalletProvider } from "@/src/context/WalletContext";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SLIME",
  description: "DeFi Prediction Markets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={geist.className} suppressHydrationWarning>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}