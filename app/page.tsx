import BankLogoScroller from '@/sections/banks/banks';
import Footer from '@/sections/footer/footer';
import Hero from '@/sections/hero/hero';
import Navbar from '@/sections/Navbar/Navbar';

export default function Home() {
  return (
    <div className="flex flex-col">
      <Navbar />
      <Hero />
      <BankLogoScroller />
      <Footer />
    </div>
  );
}
