import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {InterviewProvider} from "@/context/InterviewContext";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "ML Technical Interview",
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
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  ML Technical Interview
                </h1>
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
