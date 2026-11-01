import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
title: "Bazar Dor | আপনার নিত্যবাজার",
description:
"Explore daily market prices and product information with Bazar Dor.",
};

export default function RootLayout({
children,
}: Readonly<{
children: React.ReactNode;
}>) {
return ( <html lang="bn"> 
<body> 
    
<Navbar />
{children} 
</body>
 </html>
);
}
