import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Aira Wedding - Pernikahan Impian Anda",
  description: "Platform lengkap untuk merencanakan pernikahan yang sempurna. Kelola undangan, tamu, dan semua detail pernikahan Anda dengan mudah.",
  keywords: ["wedding", "pernikahan", "undangan", "wedding planner", "aira wedding"],
  authors: [{ name: "Aira Wedding Team" }],
  openGraph: {
    title: "Aira Wedding - Pernikahan Impian Anda",
    description: "Platform lengkap untuk merencanakan pernikahan yang sempurna",
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
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        <AuthProvider>
          {/* Background Pattern */}
          <div className="fixed inset-0 -z-10">
            <div className="absolute inset-0 bg-linear-to-br from-rose-50 via-white to-pink-50" />
            <div className="absolute inset-0 opacity-40" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.3'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }} />
          </div>
          
          {/* Main Content */}
          <main className="relative min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
