import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bazar Dor | বাজার দর",
  description:
    "Explore daily market prices and product information with Bazar Dor.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
        <Navbar />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#173b2a",
              color: "#ffffff",
            },
          }}
        />

        {children}
      </body>
    </html>
  );
}