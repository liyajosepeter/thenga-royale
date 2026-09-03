import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'THENGA ROYALE 👑 | The 2026 Coconut Beauty Pageant',
  description: 'The world’s premier international arboreal beauty pageant. Celebrating supreme coconut tree hairstyles with high-fashion computer vision adjudication.',
  keywords: ['Mr തെങ്ങ് 2026', 'Thenga Royale', 'Coconut Beauty Pageant', 'Botanical Hairstyle Awards', 'Kerala Palms', 'OpenCV Pageant'],
  openGraph: {
    title: 'THENGA ROYALE 👑 | The 2026 Coconut Beauty Pageant',
    description: 'Miss Universe meets luxury tropical resort... for coconut trees. Discover the crowning of Mr. തെങ്ങ് 2026.',
    type: 'website',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="flex flex-col min-h-screen text-ivory-100 selection:bg-emerald-500/30 selection:text-mint-200 antialiased relative">
        
        {/* Subtle Ambient Tropical Silk Lighting */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-emerald-700/15 via-emerald-800/10 to-transparent rounded-full blur-3xl -mr-48 -mt-48 animate-pulse-subtle" />
          <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-emerald-900/20 via-gold-500/5 to-transparent rounded-full blur-3xl -ml-40" />
          <div className="absolute bottom-0 right-1/4 w-[700px] h-[400px] bg-gradient-to-t from-emerald-800/10 to-transparent rounded-full blur-3xl" />
        </div>

        {/* Global Floating Glass Navigation */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
          {children}
        </main>

        {/* High-Fashion Magazine Editorial Footer */}
        <Footer />
      </body>
    </html>
  );
}
