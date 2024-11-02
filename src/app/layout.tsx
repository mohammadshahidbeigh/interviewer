import type {Metadata} from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Interviewer App",
  description: "An AI-powered interviewing application",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <header className="p-4 border-b">
          <nav className="max-w-7xl mx-auto">
            <h1 className="text-xl font-bold">Interviewer</h1>
          </nav>
        </header>
        <main className="max-w-7xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
