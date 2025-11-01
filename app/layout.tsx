import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ReactQueryProvider } from "@/components/providers/react-query-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const plusJakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Aira Back Office - Dashboard Management",
  description: "Sistem manajemen back office untuk Aira Wedding. Kelola pengguna, laporan, dan pengaturan sistem dengan mudah.",
  keywords: ["back office", "dashboard", "management", "admin", "aira"],
  authors: [{ name: "Aira Development Team" }],
  openGraph: {
    title: "Aira Back Office - Dashboard Management",
    description: "Sistem manajemen back office untuk Aira Wedding",
    type: "website",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <AuthProvider>
              {children}
            </AuthProvider>
          </ReactQueryProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
