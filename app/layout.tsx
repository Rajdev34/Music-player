import { Lexend } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata = {
  title: 'Spotify Clone - Powered by Cosmic',
  description: 'Music player with artists, albums, and tracks',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} font-lexend antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
