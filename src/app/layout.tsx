import './globals.css';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Lumina - Premium Video Memories',
  description: 'A premium experience for your precious video memories',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="min-h-screen bg-white">{children}</main>
      </body>
    </html>
  );
} 