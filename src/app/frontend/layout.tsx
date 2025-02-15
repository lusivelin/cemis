import Footer from '@/components/frontend/footer';
import Header from '@/components/frontend/header';
import { Quicksand } from 'next/font/google';

const quickSand = Quicksand({
  subsets: ['latin'],
});

export default function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={`${quickSand.className} antialiased`}>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
