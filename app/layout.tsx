import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Analytics, ScrollDepthTracker } from "@/components/ui/Analytics";
import { TERRITORY, DISTRIBUTOR } from "@/lib/config";

export const metadata: Metadata = {
  metadataBase: new URL("https://ananasuperoxygen.id"),
  title: "anana Super Oksigen — Brand Owner & Master Distributor | Nano Oxy Bubble™",
  description: `Lebih dari Air, Ini Oksigen. anana Super Oksigen — air minum berkadar oksigen tinggi dengan teknologi Nano Oxy Bubble™. ${DISTRIBUTOR.entity}, ${DISTRIBUTOR.role} wilayah ${TERRITORY}. Hubungi 0811-236-726.`,
  keywords: [
    "anana super oksigen",
    "air minum beroksigen",
    "nano oxy bubble",
    "air sehat",
    "master distributor anana",
    "brand owner anana",
    "oxygenated water jakarta",
    "oxygenated water bandung",
  ],
  openGraph: {
    title: "anana Super Oksigen — Brand Owner & Master Distributor | Nano Oxy Bubble™",
    description:
      "Lebih dari Air, Ini Oksigen. Air minum berkadar oksigen tinggi dengan teknologi Nano Oxy Bubble™.",
    images: [{ url: "/assets/og-image.png", width: 1200, height: 630 }],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "anana Super Oksigen — Brand Owner & Master Distributor",
    description: "Lebih dari Air, Ini Oksigen. Nano Oxy Bubble™ Technology.",
    images: ["/assets/og-image.png"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('anana-theme');if(t)document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:px-4 focus:py-2 focus:rounded focus:bg-[#2D9CFF] focus:text-white focus:font-semibold"
        >
          Lewati ke konten utama
        </a>
        <ThemeProvider>
          {children}
          <Analytics />
          <ScrollDepthTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}
