import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { BottomTabBar } from "@/components/layout/BottomTabBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VedaAI Assessment Creator",
  description: "AI-powered assessment creator for educators",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="app-layout">
          <Sidebar />
          <div className="app-main">
            <TopBar />
            <main className="app-content">{children}</main>
          </div>
        </div>
        <BottomTabBar />
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#FFFFFF',
              color: '#1A1A1A',
              border: '1px solid #E8E8EC',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
              borderRadius: '8px'
            }
          }}
        />
      </body>
    </html>
  );
}
