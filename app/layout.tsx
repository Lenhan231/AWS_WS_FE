import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import { MockAuthBanner } from '@/components/dev/MockAuthBanner';
import { SeedMockUsers } from '@/components/dev/SeedMockUsers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Vertex - Find Your Perfect Gym & Personal Trainer',
  description: 'A centralized marketplace connecting gyms and personal trainers with clients. Search by location, cost, availability, and ratings.',
  keywords: 'gym, personal trainer, fitness, workout, exercise, health',
  authors: [{ name: 'Easy Body Team' }],
  viewport: 'width=device-width, initial-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <MockAuthBanner />
        <Providers>
          {children}
          <SeedMockUsers />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

