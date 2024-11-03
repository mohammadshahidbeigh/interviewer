import type {Metadata} from "next";
import {Inter} from "next/font/google";
import Image from "next/image";
import "./globals.css";
import {InterviewProvider} from "@/context/InterviewContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Interviewer- AI Technical Interview",
  description: "AI-powered technical interview practice for Machine Learning",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <InterviewProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
            <header className="bg-black/50 border-b border-gray-700">
              <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4 bg-transparent flex items-center justify-start gap-2">
                <Image
                  src="/favicon.ico"
                  alt="Interviewer Logo"
                  width={32}
                  height={32}
                />
                <h1 className="text-2xl font-bold text-white">Interviewer</h1>
              </div>
            </header>
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {children}
            </main>
          </div>
        </InterviewProvider>
      </body>
    </html>
  );
}
