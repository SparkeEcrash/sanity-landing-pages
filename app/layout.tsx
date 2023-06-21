import "./globals.css";
import { Noto_Serif_KR, Noto_Sans_KR } from "next/font/google";

const serif = Noto_Serif_KR({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = Noto_Sans_KR({
  weight: ["400", "700"],
  style: "normal",
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Moon Jar Ceramics",
  description: "A Gallery for Ceramic Art",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${serif.variable} ${sans.variable}`}>
        {children}
      </body>
    </html>
  );
}
