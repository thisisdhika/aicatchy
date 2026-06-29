import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

export const metadata = {
  title: 'AICatchy',
  description: 'Mobile-first AI fashion decision app for Indonesian Gen Z/young Millennials',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={inter.className}>
      <body className="bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}