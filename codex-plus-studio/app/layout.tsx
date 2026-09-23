import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Codex+ Unified Studio',
  description: 'Premium AI-driven web app studio with Pollinations visuals, motion design, and Vercel sandbox deployment.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: 'https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=64&height=64&nologo=true',
    apple: 'https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=180&height=180&nologo=true'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050816" />
        <link rel="icon" href="https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=64&height=64&nologo=true" />
        <link rel="apple-touch-icon" href="https://image.pollinations.ai/prompt/premium_glassmorphism_app_icon?width=180&height=180&nologo=true" />
      </head>
      <body>{children}</body>
    </html>
  );
}
