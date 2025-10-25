import type { Metadata } from "next";
import React from "react";
import "./global.css";

export const metadata: Metadata = {
  title: "TEST TITLE",
  description: "TEST DESCRIPTION",
  icons: {
    icon: {
        url: "images/icon.ico",
      },
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) 
  {
      return (  
        <html lang="en" suppressHydrationWarning>
          <head></head>
          <body className="bg-gray-200">
            <React.StrictMode>
                {children}
            </React.StrictMode>
          </body>
        </html>
      );
  }