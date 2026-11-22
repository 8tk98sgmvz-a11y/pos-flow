import type { Metadata } from "next";
import { JetBrains_Mono, Outfit } from "next/font/google";
import "./globals.css";
import GuardarServidor from "@/components/GuardarServidor";
import { RouteBoundary } from "@/components/route-boundary";
import { StoreProvider } from "@/lib/store";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "POS Flow",
  description:
    "Punto de venta profesional con antifraude, catálogo, inteligencia comercial y garantías digitales.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`dark bg-[#000000] ${outfit.variable} ${jetbrains.variable}`}>
      <body className="font-sans bg-background text-foreground min-h-screen">
        <StoreProvider>
          <GuardarServidor />
          <RouteBoundary>{children}</RouteBoundary>
        </StoreProvider>
      </body>
    </html>
  );
}